import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-task-item-create',
  templateUrl: './task-item-create.component.html',
})
export class TaskItemCreateComponent {
  editText = '';
  @Output() create = new EventEmitter<string>();

  submit() {
    const value = this.editText.trim();
    if (value) {
      this.create.emit(value);
    }
    this.editText = '';
  }

  cancel() {
    this.editText = '';
  }
}
