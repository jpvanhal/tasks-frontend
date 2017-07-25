import { Injectable } from '@angular/core';
import { TransformBuilder } from '@orbit/data';
import Store from '@orbit/store';
import { Observable } from 'rxjs/Observable';

import { LiveQueryService } from '../core';
import { Task } from './task.interface';

@Injectable()
export class TaskService {
  constructor(private liveQuery: LiveQueryService, private store: Store) { }

  findAll(): Observable<Task[]> {
    return this.liveQuery.query(q => q.findRecords('task').sort('-createdAt'), {
      label: 'Find all tasks',
    });
  }

  create(title: string): Promise<void> {
    const task: Task = {
      id: undefined,
      type: 'task',
      attributes: {
        title,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      },
    };
    return this.store.update((t: TransformBuilder) => [t.addRecord(task)], {
      label: 'Create task',
    });
  }

  toggle(task: Task): Promise<void> {
    return this.store.update((t: TransformBuilder) => [t.replaceAttribute(task, 'isCompleted', !task.attributes.isCompleted)], {
      label: 'Toggle task',
    });
  }

  destroy(task: Task): Promise<void> {
    return this.store.update((t: TransformBuilder) => [t.removeRecord(task)], {
      label: 'Destroy task',
    });
  }

  update(task: Task, newTitle: string): Promise<void> {
    return this.store.update((t: TransformBuilder) => [t.replaceAttribute(task, 'title', newTitle)], {
      label: 'Update task',
    });
  }
}
