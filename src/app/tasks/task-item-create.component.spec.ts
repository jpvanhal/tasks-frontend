import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItemCreateComponent } from './task-item-create.component';

describe('TaskItemCreateComponent', () => {
  let component: TaskItemCreateComponent;
  let fixture: ComponentFixture<TaskItemCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskItemCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskItemCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
