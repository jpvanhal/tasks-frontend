import { Component, OnInit } from '@angular/core';
import { Record, TransformBuilder } from '@orbit/data';
import Store from '@orbit/store';
import { Observable } from 'rxjs/Observable';

import { LiveQueryService } from '../core';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Record[]>;

  constructor(private liveQuery: LiveQueryService, private store: Store) { }

  ngOnInit() {
    this.tasks$ = this.liveQuery.query(q => q.findRecords('task').sort('-createdAt'), {
      label: 'Find all tasks',
    });
  }

  create(title: string) {
    const task = {
      id: this.store.schema.generateId('task'),
      type: 'task',
      attributes: {
        title,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      },
    };
    this.store.update((t: TransformBuilder) => [t.addRecord(task)]);
  }

  toggle(task: Record) {
    this.store.update((t: TransformBuilder) => [t.replaceAttribute(task, 'isCompleted', !task.attributes.isCompleted)]);
  }

  destroy(task: Record) {
    this.store.update((t: TransformBuilder) => [t.removeRecord(task)]);
  }

  update(task: Record, newTitle: string) {
    this.store.update((t: TransformBuilder) => [t.replaceAttribute(task, 'title', newTitle)]);
  }

  identify(index: number, task: Record) {
    return task.id;
  }
}
