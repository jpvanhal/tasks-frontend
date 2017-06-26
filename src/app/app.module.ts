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
import { KeyMap, Schema } from '@orbit/data';
import Store from '@orbit/store';

import { AppComponent } from './app.component';
import { LiveQueryService } from './live-query.service';
import { schemaFactory } from './schema.provider';
import { storeFactory } from './store.provider';
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
    FormsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdToolbarModule,
  ],
  providers: [
    KeyMap,
    {
      provide: Schema,
      useFactory: schemaFactory,
    },
    LiveQueryService,
    {
      provide: Store,
      deps: [ KeyMap, Schema ],
      useFactory: storeFactory,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
