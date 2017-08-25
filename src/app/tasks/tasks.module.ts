import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdButtonModule, MdCheckboxModule, MdIconModule, MdInputModule, MdListModule } from '@angular/material';

import { TaskItemCreateComponent } from './task-item-create.component';
import { TaskItemComponent } from './task-item.component';
import { TaskListComponent } from './task-list.component';
import { TaskService } from './task.service';

@NgModule({
  declarations: [
    TaskItemCreateComponent,
    TaskItemComponent,
    TaskListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
  ],
  exports: [
    TaskListComponent,
  ],
  providers: [
    TaskService,
  ],
})
export class TasksModule {}
