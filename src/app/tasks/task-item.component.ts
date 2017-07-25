import {
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { MdInputDirective } from '@angular/material';
import { clone } from '@orbit/utils';

import { Task } from './task.interface';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
})
export class TaskItemComponent implements OnChanges {
  editText: string;
  @Input() task: Task;
  @Output() destroy = new EventEmitter();
  @Output() toggle = new EventEmitter();
  @Output() update = new EventEmitter<string>();
  @HostBinding('class.task-item--state-editing') editing = false;
  @ViewChild(MdInputDirective) input: MdInputDirective;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.task) {
      this.task = clone(changes.task.currentValue);
      this.editing = false;
    }
  }

  @HostBinding('class.task-item--state-completed')
  get completed() {
    return this.task.attributes.isCompleted;
  }

  edit() {
    this.editText = this.task.attributes.title;
    this.editing = true;
    setTimeout(() => this.input.focus(), 0);
  }

  submit() {
    if (this.editing) {
      const value = this.editText.trim();
      if (value) {
        this.task.attributes.title = value;
        this.update.emit(this.task.attributes.title);
      }
      this.editing = false;
    }
  }

  cancel() {
    this.editing = false;
  }
}
