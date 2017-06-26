import { Component, OnInit } from '@angular/core';
import { Record, TransformBuilder } from '@orbit/data';
import Store from '@orbit/store';
import { Observable } from 'rxjs/Observable';

import { LiveQueryService, StoreService } from '../orbit';

@Component({
  selector: 'task-list',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Record[]>;

  constructor(private liveQuery: LiveQueryService, private storeService: StoreService) { }

  ngOnInit() {
    this.tasks$ = this.liveQuery.query(q => q.findRecords('task').sort('-created'), {
      label: 'Find all tasks',
    });
  }

  create(title: string) {
    const task = {
      id: this.storeService.schema.generateId('task'),
      type: 'task',
      attributes: {
        title,
        completed: false,
        created: new Date().toISOString(),
      },
    };
    this.storeService.update((t: TransformBuilder) => [t.addRecord(task)]);
  }

  toggle(task: Record) {
    this.storeService.update((t: TransformBuilder) => [t.replaceAttribute(task, 'completed', !task.attributes.completed)]);
  }

  destroy(task: Record) {
    this.storeService.update((t: TransformBuilder) => [t.removeRecord(task)]);
  }

  save(task: Record, newTitle: string) {
    this.storeService.update((t: TransformBuilder) => [t.replaceAttribute(task, 'title', newTitle)]);
  }

  identify(index: number, task: Record) {
    return task.id;
  }
}
