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
import { Record } from '@orbit/data';
import { clone } from '@orbit/utils';

@Component({
  selector: 'task-item',
  templateUrl: './task-item.component.html',
})
export class TaskItemComponent implements OnChanges {
  editText: string;
  @Input() task: Record;
  @Output() destroy = new EventEmitter();
  @Output() toggle = new EventEmitter();
  @Output() save = new EventEmitter<string>();
  @HostBinding('class.task-item--state-editing') editing = false;
  @ViewChild(MdInputDirective) input: MdInputDirective;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.task) {
      this.task = clone(changes.task.currentValue);
    }
  }

  @HostBinding('class.task-item--state-completed')
  get completed() {
    return this.task.attributes.completed;
  }

  edit() {
    this.editText = this.task.attributes.title;
    this.editing = true;
    setTimeout(() => this.input.focus(), 0);
  }

  submit() {
    const value = this.editText.trim();
    if (value) {
      this.save.emit(value);
    }
    this.editing = false;
  }

  cancel() {
    this.editText = this.task.attributes.title;
    this.editing = false;
  }
}
