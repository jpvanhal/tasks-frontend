import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    MdButtonModule,
    MdCheckboxModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdToolbarModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { TaskItemCreateComponent } from './task-item-create/task-item-create.component';
import { TaskItemComponent } from './task-item/task-item.component';
import { TaskListComponent } from './task-list/task-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskItemComponent,
    TaskListComponent,
    TaskItemCreateComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    FormsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
