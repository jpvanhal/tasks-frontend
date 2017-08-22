import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Task } from './task.interface';
import { TaskService } from './task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.tasks$ = this.taskService.findAll();
  }

  create(title: string) {
    this.taskService.create(title);
  }

  toggle(task: Task) {
    this.taskService.toggle(task);
  }

  destroy(task: Task) {
    this.taskService.destroy(task);
  }

  update(task: Task, newTitle: string) {
    this.taskService.update(task, newTitle);
  }

  identify(_index: number, task: Task) {
    return task.id;
  }
}
