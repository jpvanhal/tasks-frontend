import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdButtonModule, MdCheckboxModule, MdIconModule, MdInputModule, MdListModule } from '@angular/material';

import { TaskItemCreateComponent } from './task-item-create.component';
import { TaskItemComponent } from './task-item.component';
import { TaskListComponent } from './task-list.component';

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
  ]
})
export class TasksModule {}
