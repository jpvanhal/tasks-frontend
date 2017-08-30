import { async, fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import Coordinator from '@orbit/coordinator';
import { Bucket } from '@orbit/core';
import { NetworkError, Record, Schema, Transform } from '@orbit/data';
import LocalStorageSource from '@orbit/local-storage';
import Store from '@orbit/store';

import { BACKUP_SOURCE, REMOTE_SOURCE } from './data-sources';
import { BackupSource } from './data-sources/backup';
import { RemoteSource } from './data-sources/remote';
import { OrbitModule } from './orbit.module';
import { FakeBucket, MockFetch } from './test-support';
import { BUCKET, COORDINATOR, SCHEMA, STORE } from './tokens';

function createBackupSource(schema: Schema) {
  return new LocalStorageSource({
    name: 'backup',
    namespace: 'tasks',
    schema,
  });
}

function createBucket(): Bucket {
  return new FakeBucket();
}

describe('Orbit Integration', () => {
  let coordinator: Coordinator;
  let mockFetch: MockFetch;
  let backup: BackupSource;
  let remote: RemoteSource;
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OrbitModule],
      providers: [
        { provide: BUCKET, useFactory: createBucket },
        { provide: BACKUP_SOURCE, useFactory: createBackupSource, deps: [ SCHEMA ] },
      ],
    });
    coordinator = TestBed.get(COORDINATOR);

    backup = TestBed.get(BACKUP_SOURCE)
    remote = TestBed.get(REMOTE_SOURCE);
    store = TestBed.get(STORE);
    mockFetch = new MockFetch();
  }));

  afterEach(async(() => {
    backup.reset();
  }));

  afterEach(() => {
    mockFetch.verify();
  });

  it('#update - add a record successfully', fakeAsync(() => {
    const task: Record = {
      type: 'task',
      id: 'task-1',
      attributes: {
        title: 'Buy food',
        isCompleted: false,
        createdAt: '2017-08-14T07:13:16.824Z',
      },
    };

    // request queue is empty initially
    expect(remote.requestQueue.length).toBe(0);

    store.update((t) => [t.addRecord(task)]);
    flushMicrotasks();

    // request is queued for remote source
    expect(remote.requestQueue.length).toBe(1);

    // task exists in store
    expect(store.cache.records('task').get(task.id)).toEqual(task);

    // task exists in backup
    let backupTransforms: Transform[];
    backup.pull((q) => q.findRecord(task)).then((transforms) => backupTransforms = transforms);
    flushMicrotasks();
    expect(backupTransforms).toBeDefined();
    expect(backupTransforms.length).toBe(1);
    expect(backupTransforms[0].operations.length).toBe(1);
    expect(backupTransforms[0].operations[0]).toEqual({
      op: 'addRecord',
      record: task,
    });

    // a POST /api/tasks request was made
    mockFetch
      .expectOne({ method: 'POST', url: '/api/tasks'})
      .flush({ data: task }, 201);
    flushMicrotasks();

    // request has been processed by remote source
    expect(remote.requestQueue.length).toBe(0);
  }));

  it('#update - add a record - retries network error', fakeAsync(() => {
    const task: Record = {
      type: 'task',
      id: 'task-1',
      attributes: {
        title: 'Buy food',
        isCompleted: false,
        createdAt: '2017-08-14T07:13:16.824Z',
      },
    };

    // request queue is empty initially
    expect(remote.requestQueue.length).toBe(0);

    store.update((t) => [t.addRecord(task)]);
    flushMicrotasks();

    // request is queued for remote source
    expect(remote.requestQueue.length).toBe(1);

    // task exists in store
    expect(store.cache.records('task').get(task.id)).toEqual(task);

    // a POST /api/tasks request was made, but encounters network error
    mockFetch
      .expectOne({ method: 'POST', url: '/api/tasks'})
      .error(new NetworkError(':('));
    flushMicrotasks();

    // request is retried and network goes back up
    tick(5000);
    mockFetch
      .expectOne({ method: 'POST', url: '/api/tasks'})
      .flush({ data: task }, 201);
    flushMicrotasks();

    // request has been processed by remote source
    expect(remote.requestQueue.length).toBe(0);
  }));

  it('#update - add a record - retries server error', fakeAsync(() => {
    const task: Record = {
      type: 'task',
      id: 'task-1',
      attributes: {
        title: 'Buy food',
        isCompleted: false,
        createdAt: '2017-08-14T07:13:16.824Z',
      },
    };

    // request queue is empty initially
    expect(remote.requestQueue.length).toBe(0);

    store.update((t) => [t.addRecord(task)]);
    flushMicrotasks();

    // request is queued for remote source
    expect(remote.requestQueue.length).toBe(1);

    // task exists in store
    expect(store.cache.records('task').get(task.id)).toEqual(task);

    // a POST /api/tasks request was made, but encounters a server error
    mockFetch
      .expectOne({ method: 'POST', url: '/api/tasks'})
      .flush(null, 503);
    flushMicrotasks();

    // request is retried and server is available again
    tick(5000);
    mockFetch
      .expectOne({ method: 'POST', url: '/api/tasks'})
      .flush({ data: task }, 201);
    flushMicrotasks();

    // request has been processed by remote source
    expect(remote.requestQueue.length).toBe(0);
  }));

  it('#update - add a record - rolls back a client error', fakeAsync(() => {
    const task: Record = {
      type: 'task',
      id: 'task-1',
      attributes: {
        title: '',
        isCompleted: false,
        createdAt: '2017-08-14T07:13:16.824Z',
      },
    };

    // request queue is empty initially
    expect(remote.requestQueue.length).toBe(0);

    store.update((t) => [t.addRecord(task)]);
    flushMicrotasks();

    // request is queued for remote source
    expect(remote.requestQueue.length).toBe(1);

    // task exists in store
    expect(store.cache.records('task').get(task.id)).toEqual(task);

    // a POST /api/tasks request was made, but client error is encountered
    mockFetch
      .expectOne({ method: 'POST', url: '/api/tasks'})
      .flush({
        errors: [
          {
            status: '422',
            source: {
              pointer: '/data/attributes/title'
            },
            title: 'Validation error',
            detail: 'Shorter than minimum length 1.',
          },
        ],
      }, 422);
    flushMicrotasks();

    // task has been removed from the store
    expect(store.cache.records('task').get(task.id)).toBeUndefined();

    // request has been processed by remote source
    expect(remote.requestQueue.length).toBe(0);
  }));

  it('#update - update a record successfully', fakeAsync(() => {
    const task: Record = {
      type: 'task',
      id: 'task-1',
      attributes: {
        title: 'Buy food',
        isCompleted: false,
        createdAt: '2017-08-14T07:13:16.824Z',
      },
    };

    store.cache.patch({ op: 'addRecord', record: task });

    // request queue is empty initially
    expect(remote.requestQueue.length).toBe(0);

    store.update((t) => [t.replaceAttribute(task, 'isCompleted', true)]);
    flushMicrotasks();

    // request is queued for remote source
    expect(remote.requestQueue.length).toBe(1);

    // task is updated to store
    expect(store.cache.records('task').get(task.id).attributes.isCompleted).toBe(true);

    // task is updated to backup
    let backupTransforms: Transform[];
    backup.pull((q) => q.findRecord(task)).then((transforms) => backupTransforms = transforms);
    flushMicrotasks();
    expect(backupTransforms).toBeDefined();
    expect(backupTransforms.length).toBe(1);
    expect(backupTransforms[0].operations.length).toBe(1);
    expect(backupTransforms[0].operations[0]).toEqual({
      op: 'addRecord',
      record: jasmine.objectContaining({
        attributes: jasmine.objectContaining({
          isCompleted: true,
        }),
      }),
    });

    // a PATCH /api/tasks/:id request was made
    mockFetch
      .expectOne({ method: 'PATCH', url: '/api/tasks/task-1'})
      .flush(null, 204);
    flushMicrotasks();

    // request has been processed by remote source
    expect(remote.requestQueue.length).toBe(0);
  }));

  it('#update - update a record - record not found', fakeAsync(() => {
    const task: Record = {
      type: 'task',
      id: 'task-1',
      attributes: {
        title: 'Buy food',
        isCompleted: false,
        createdAt: '2017-08-14T07:13:16.824Z',
      },
    };

    store.cache.patch({ op: 'addRecord', record: task });

    // request queue is empty initially
    expect(remote.requestQueue.length).toBe(0);

    store.update((t) => [t.replaceAttribute(task, 'isCompleted', true)]);
    flushMicrotasks();

    // request is queued for remote source
    expect(remote.requestQueue.length).toBe(1);

    // a PATCH /api/tasks/:id request was made
    mockFetch
      .expectOne({ method: 'PATCH', url: '/api/tasks/task-1'})
      .flush({
        errors: [
          {
            status: 404,
            source: {},
            title: 'Object not found',
            detail: ''
          }
        ],
      }, 404);
    flushMicrotasks();

    // another request is queued for remote source
    expect(remote.requestQueue.length).toBe(1);

    // a DELETE /api/tasks/:id request was made
    mockFetch
    .expectOne({ method: 'DELETE', url: '/api/tasks/task-1'})
    .flush({
      errors: [
        {
          status: 404,
          source: {},
          title: 'Object not found',
          detail: ''
        }
      ],
    }, 404);
    flushMicrotasks();

    // request has been processed by remote source
    expect(remote.requestQueue.length).toBe(0);

    // task has been removed from the store
    expect(store.cache.records('task').get(task.id)).toBeUndefined();

    // task has been removed from the backup
    let backupTransforms: Transform[];
    backup.pull((q) => q.findRecord(task)).then((transforms) => backupTransforms = transforms);
    flushMicrotasks();
    expect(backupTransforms).toBeDefined();
    expect(backupTransforms.length).toBe(1);
    expect(backupTransforms[0].operations).toEqual([]);
  }));

  it('#update - remove a record successfully', fakeAsync(() => {
    const task: Record = {
      type: 'task',
      id: 'task-1',
      attributes: {
        title: 'Buy food',
        isCompleted: false,
        createdAt: '2017-08-14T07:13:16.824Z',
      },
    };

    store.cache.patch({ op: 'addRecord', record: task });

    // request queue is empty initially
    expect(remote.requestQueue.length).toBe(0);

    store.update((t) => [t.removeRecord(task)]);
    flushMicrotasks();

    // request is queued for remote source
    expect(remote.requestQueue.length).toBe(1);

    // task is removed from store
    expect(store.cache.records('task').get(task.id)).toBeUndefined();

    // task has been removed from the backup
    let backupTransforms: Transform[];
    backup.pull((q) => q.findRecord(task)).then((transforms) => backupTransforms = transforms);
    flushMicrotasks();
    expect(backupTransforms).toBeDefined();
    expect(backupTransforms.length).toBe(1);
    expect(backupTransforms[0].operations).toEqual([]);

    // a DELETE /api/tasks/:id request was made
    mockFetch
      .expectOne({ method: 'DELETE', url: '/api/tasks/task-1'})
      .flush(null, 204);
    flushMicrotasks();

    // request has been processed by remote source
    expect(remote.requestQueue.length).toBe(0);
  }));

  it('#update - remove a record - record not found', fakeAsync(() => {
    const task: Record = {
      type: 'task',
      id: 'task-1',
      attributes: {
        title: 'Buy food',
        isCompleted: false,
        createdAt: '2017-08-14T07:13:16.824Z',
      },
    };

    store.cache.patch({ op: 'addRecord', record: task });

    // request queue is empty initially
    expect(remote.requestQueue.length).toBe(0);

    store.update((t) => [t.removeRecord(task)]);
    flushMicrotasks();

    // request is queued for remote source
    expect(remote.requestQueue.length).toBe(1);

    // a DELETE /api/tasks/:id request was made
    mockFetch
      .expectOne({ method: 'DELETE', url: '/api/tasks/task-1'})
      .flush({
        errors: [
          {
            status: 404,
            source: {},
            title: 'Object not found',
            detail: ''
          }
        ],
      }, 404);
    flushMicrotasks();

    // request has been processed by remote source
    expect(remote.requestQueue.length).toBe(0);

    // task is removed from store
    expect(store.cache.records('task').get(task.id)).toBeUndefined();

    // task has been removed from the backup
    let backupTransforms: Transform[];
    backup.pull((q) => q.findRecord(task)).then((transforms) => backupTransforms = transforms);
    flushMicrotasks();
    expect(backupTransforms).toBeDefined();
    expect(backupTransforms.length).toBe(1);
    expect(backupTransforms[0].operations).toEqual([]);
  }));

  it('#query - find all - success', fakeAsync(() => {
    const task1: Record = {
      type: 'task',
      id: 'task-1',
      attributes: {
        title: 'Buy food',
        isCompleted: false,
        createdAt: '2017-08-14T07:13:16.824Z',
      },
    };
    const task2: Record = {
      type: 'task',
      id: 'task-2',
      attributes: {
        title: 'Plan trip to Lisbon',
        isCompleted: true,
        createdAt: '2017-08-22T08:49:37.235Z',
      },
    };

    store.cache.patch({ op: 'addRecord', record: task1 });
    backup.push((t) => [t.addRecord(task1)]);
    flushMicrotasks();

    // request queue is empty initially
    expect(remote.requestQueue.length).toBe(0);

    let tasks: Record[];
    store.query((q) => q.findRecords('task')).then((r) => {
      tasks = r
    });
    flushMicrotasks();

    // the query returns optimistically only the local tasks
    expect(tasks).toEqual([task1]);

    // request is queued for remote source
    expect(remote.requestQueue.length).toBe(1);

    // a GET /api/tasks request was made
    mockFetch
      .expectOne({ method: 'GET', url: '/api/tasks'})
      .flush({
        data: [
          task2,
        ],
      }, 200);
    flushMicrotasks();

    // another request is queued
    expect(remote.requestQueue.length).toBe(1);

    // both remote and local tasks exist in store
    expect(store.cache.records('task').get(task1.id)).toEqual(task1);
    expect(store.cache.records('task').get(task2.id)).toEqual(task2);

    // both remote and local tasks exist in backup
    let backupTransforms: Transform[];
    backup.pull((q) => q.findRecords('task')).then((transforms) => backupTransforms = transforms);
    flushMicrotasks();
    expect(backupTransforms).toBeDefined();
    expect(backupTransforms.length).toBe(1);
    expect(backupTransforms[0].operations.length).toBe(2);

    // a GET /api/tasks/task-1 request was made for the task found in local, but not remote
    mockFetch
      .expectOne({ method: 'GET', url: '/api/tasks/task-1'})
      .flush({
        errors: [
          {
            status: 404,
            source: {},
            title: 'Object not found',
            detail: ''
          }
        ],
      }, 404);
    flushMicrotasks();

    // yet another request is queued
    expect(remote.requestQueue.length).toBe(1);

    // a DELETE /api/tasks/task-1 request was made
    mockFetch
      .expectOne({ method: 'DELETE', url: '/api/tasks/task-1'})
      .flush({
        errors: [
          {
            status: 404,
            source: {},
            title: 'Object not found',
            detail: ''
          }
        ],
      }, 404);
    flushMicrotasks();

    expect(store.cache.records('task').get(task1.id)).toBeUndefined();
    expect(store.cache.records('task').get(task2.id)).toEqual(task2);

    // request queue is empty
    expect(remote.requestQueue.length).toBe(0);
  }));

  it('#query - find all - encounters network error', fakeAsync(() => {
    const task: Record = {
      type: 'task',
      id: 'task-1',
      attributes: {
        title: 'Buy food',
        isCompleted: false,
        createdAt: '2017-08-14T07:13:16.824Z',
      },
    };

    store.cache.patch({ op: 'addRecord', record: task });
    backup.push((t) => [t.addRecord(task)]);
    flushMicrotasks();

    // request queue is empty initially
    expect(remote.requestQueue.length).toBe(0);

    let tasks: Record[];
    store.query((q) => q.findRecords('task')).then((r) => {
      tasks = r
    });
    flushMicrotasks();

    // the query returns optimistically only the local tasks
    expect(tasks).toEqual([task]);

    // request is queued for remote source
    expect(remote.requestQueue.length).toBe(1);

    // a GET /api/tasks request was made, but encounters a network error
    mockFetch
      .expectOne({ method: 'GET', url: '/api/tasks'})
      .error(new NetworkError(':('));
    flushMicrotasks();

    // request has been processed by remote source
    expect(remote.requestQueue.length).toBe(0);

    // task exist in store
    expect(store.cache.records('task').get(task.id)).toEqual(task);

    // task exist in backup
    let backupTransforms: Transform[];
    backup.pull((q) => q.findRecords('task')).then((transforms) => backupTransforms = transforms);
    flushMicrotasks();
    expect(backupTransforms).toBeDefined();
    expect(backupTransforms.length).toBe(1);
    expect(backupTransforms[0].operations.length).toBe(1);
  }));

  it('#query - find one - found in local and remote', fakeAsync(() => {
    const task: Record = {
      type: 'task',
      id: 'task-1',
      attributes: {
        title: 'Buy food',
        isCompleted: false,
        createdAt: '2017-08-14T07:13:16.824Z',
      },
    };

    store.cache.patch({ op: 'addRecord', record: task });
    backup.push((t) => [t.addRecord(task)]);
    flushMicrotasks();

    // request queue is empty initially
    expect(remote.requestQueue.length).toBe(0);

    let foundTask: Record[];
    store.query((q) => q.findRecord(task)).then((r) => {
      foundTask = r
    });
    flushMicrotasks();

    // the query returns optimistically the local task
    expect(foundTask).toEqual(task);

    // request is queued for remote source
    expect(remote.requestQueue.length).toBe(1);

    // a GET /api/tasks/:id request was made, but encounters a network error
    mockFetch
      .expectOne({ method: 'GET', url: '/api/tasks/task-1'})
      .flush({ data: task }, 200);
    flushMicrotasks();

    // request has been processed by remote source
    expect(remote.requestQueue.length).toBe(0);

    // task exist in store
    expect(store.cache.records('task').get(task.id)).toEqual(task);

    // task exist in backup
    let backupTransforms: Transform[];
    backup.pull((q) => q.findRecords('task')).then((transforms) => backupTransforms = transforms);
    flushMicrotasks();
    expect(backupTransforms).toBeDefined();
    expect(backupTransforms.length).toBe(1);
    expect(backupTransforms[0].operations.length).toBe(1);
  }));

  it('#query - find one - found in local, but not remote', fakeAsync(() => {
    const task: Record = {
      type: 'task',
      id: 'task-1',
      attributes: {
        title: 'Buy food',
        isCompleted: false,
        createdAt: '2017-08-14T07:13:16.824Z',
      },
    };

    store.cache.patch({ op: 'addRecord', record: task });
    backup.push((t) => [t.addRecord(task)]);
    flushMicrotasks();

    // request queue is empty initially
    expect(remote.requestQueue.length).toBe(0);

    let foundTask: Record;
    store.query((q) => q.findRecord(task)).then((r) => {
      foundTask = r
    });
    flushMicrotasks();

    // the query returns optimistically the local task
    expect(foundTask).toEqual(task);

    // request is queued for remote source
    expect(remote.requestQueue.length).toBe(1);

    // a GET /api/tasks/:id request was made, but is not found
    mockFetch
      .expectOne({ method: 'GET', url: '/api/tasks/task-1'})
      .flush({
        errors: [
          {
            status: 404,
            source: {},
            title: 'Object not found',
            detail: ''
          }
        ],
      }, 404);
    flushMicrotasks();

    // another request is queued
    expect(remote.requestQueue.length).toBe(1);

    // task does not exist in store
    expect(store.cache.records('task').get(task.id)).toBeUndefined();

    // task does not exist in backup
    let backupTransforms: Transform[];
    backup.pull((q) => q.findRecords('task')).then((transforms) => backupTransforms = transforms);
    flushMicrotasks();
    expect(backupTransforms).toBeDefined();
    expect(backupTransforms.length).toBe(1);
    expect(backupTransforms[0].operations.length).toBe(0);

    // a DELETE /api/tasks/:id request was made
    mockFetch
      .expectOne({ method: 'DELETE', url: '/api/tasks/task-1'})
      .flush({
        errors: [
          {
            status: 404,
            source: {},
            title: 'Object not found',
            detail: ''
          }
        ],
      }, 404);
    flushMicrotasks();

    // request queue is empty
    expect(remote.requestQueue.length).toBe(0);
  }));
});
