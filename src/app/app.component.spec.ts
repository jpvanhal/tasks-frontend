import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdToolbarModule } from '@angular/material';

import { AppComponent } from './app.component';

let fixture: ComponentFixture<AppComponent>;

@Component({
  selector: 'app-task-list',
  template: '',
})
export class TaskListStubComponent {}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          MdToolbarModule,
        ],
        declarations: [
          AppComponent,
          TaskListStubComponent,
        ],
      })
      .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  }));

  it('should create the app', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a md-toolbar tag', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('md-toolbar').textContent).toContain('Tasks');
  }));

  it('should render task list', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('md-toolbar').textContent).toContain('Tasks');
  }));
});
