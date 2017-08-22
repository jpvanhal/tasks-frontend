import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdListModule } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { TaskListComponent } from './task-list.component';
import { Task } from './task.interface';
import { TaskService } from './task.service';

@Component({
  selector: 'app-task-item',
  template: '{{ task.attributes.title }}',
})
class TaskItemStubComponent {
  @Input() task: Task;
}

@Component({
  selector: 'app-task-item-create',
  template: '',
})
class TaskItemCreateStubComponent {}


class TaskServiceStub {
  findAll(): Observable<Task[]> {
    const tasks: Task[] = [
      {
        type: 'task',
        id: '2',
        attributes: {
          title: 'Buy groceries',
          isCompleted: false,
          createdAt: '2017-02-01T00:00:00.000Z',
        },
      },
      {
        type: 'task',
        id: '1',
        attributes: {
          title: 'Plan trip to Lisbon',
          isCompleted: true,
          createdAt: '2017-01-01T00:00:00.000Z',
        },
      },
    ];
    return Observable.of(tasks);
  }
}

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MdListModule,
      ],
      declarations: [
        TaskItemCreateStubComponent,
        TaskItemStubComponent,
        TaskListComponent,
      ],
      providers: [
        { provide: TaskService, useClass: TaskServiceStub },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should render two tasks', () => {
    const elements = fixture.debugElement.queryAll(By.css('app-task-item'));
    expect(elements.length).toBe(2);
    expect(elements[0].nativeElement.textContent).toBe('Buy groceries');
    expect(elements[1].nativeElement.textContent).toBe('Plan trip to Lisbon');
  });
});
