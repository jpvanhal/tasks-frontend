import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MdCheckboxModule, MdIconModule, MdInputModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Record } from '@orbit/data';

import { TaskItemComponent } from './task-item.component';

@Component({
  template: `<app-task-item [task]="task" (toggle)="toggle()" (destroy)="destroy()" (update)="update($event)"></app-task-item>`
})
class TestHostComponent {
  task: Record;
  toggle = jasmine.createSpy('toggle');
  destroy = jasmine.createSpy('destroy');
  update = jasmine.createSpy('update');
}

describe('TaskItemComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MdCheckboxModule,
        MdIconModule,
        MdInputModule,
        NoopAnimationsModule,
      ],
      declarations: [
        TaskItemComponent,
        TestHostComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.task = {
      type: 'task',
      id: '123',
      attributes: {
        title: 'Buy groceries',
        isCompleted: false,
      },
    };
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have the checkbox unchecked', () => {
    const checkbox = fixture.debugElement.query(By.css('.task-item__checkbox'));
    expect(checkbox.nativeElement.checked).toBeFalsy();
  });

  it('should have the title set', () => {
    const title = fixture.debugElement.query(By.css('.task-item__title'));
    expect(title.nativeElement.textContent).toBe('Buy groceries');
  });

  it('should not have the "editing" state', () => {
    const taskItem = fixture.debugElement.query(By.css('app-task-item'));
    expect(taskItem.classes['task-item--state-editing']).toBeFalsy();
  });

  it('should not have the "completed" state', () => {
    const taskItem = fixture.debugElement.query(By.css('app-task-item'));
    expect(taskItem.classes['task-item--state-completed']).toBeFalsy();
  });

  describe('when clicking the title', () => {
    beforeEach(async(() => {
      const title = fixture.debugElement.query(By.css('.task-item__title'));
      title.nativeElement.click();
      fixture.detectChanges();
    }));

    it('should have the "editing" state', () => {
      const taskItem = fixture.debugElement.query(By.css('app-task-item'));
      expect(taskItem.classes['task-item--state-editing']).toBeTruthy();
    });

    it('should have the title set in the input', () => {
      const input = fixture.debugElement.query(By.css('.task-item__input input'));
      expect(input.nativeElement.value).toBe('Buy groceries');
    });

    it('should have the input focused', () => {
      const input = fixture.debugElement.query(By.css('.task-item__input input'));
      expect(input.nativeElement).toBe(document.activeElement);
    });

    describe('after changing the title in the input', () => {
      let input;

      beforeEach(async(() => {
        input = fixture.debugElement.query(By.css('.task-item__input input'));
        input.nativeElement.value = 'Buy food';
        input.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
      }));

      describe('when pressing Enter key', () => {
        beforeEach(async(() => {
          input.triggerEventHandler('keyup.enter', {});
          fixture.detectChanges();
        }));

        it('should emit the "update" event', () => {
          expect(component.update).toHaveBeenCalledWith('Buy food');
        });

        it('should not have the "editing" state', () => {
          const taskItem = fixture.debugElement.query(By.css('app-task-item'));
          expect(taskItem.classes['task-item--state-editing']).toBeFalsy();
        });
      });

      describe('when pressing Esc key', () => {
        beforeEach(async(() => {
          input.triggerEventHandler('keyup.escape', {});
          fixture.detectChanges();
        }));

        it('should not emit the "update" event', () => {
          expect(component.update).not.toHaveBeenCalled();
        });

        it('should not have the "editing" state', () => {
          const taskItem = fixture.debugElement.query(By.css('app-task-item'));
          expect(taskItem.classes['task-item--state-editing']).toBeFalsy();
        });
      });

      describe('when the input loses focus', () => {
        beforeEach(async(() => {
          input.triggerEventHandler('blur', {});
          fixture.detectChanges();
        }));

        it('should emit the "update" event', () => {
          expect(component.update).toHaveBeenCalledWith('Buy food');
        });

        it('should not have the "editing" state', () => {
          const taskItem = fixture.debugElement.query(By.css('app-task-item'));
          expect(taskItem.classes['task-item--state-editing']).toBeFalsy();
        });
      });
    });
  });

  describe('when toggling the checkbox', () => {
    beforeEach(async(() => {
      const checkbox = fixture.debugElement.query(By.css('.task-item__checkbox'));
      checkbox.triggerEventHandler('change', new Event('change'));
      fixture.detectChanges();
    }));

    it('should emit a toggle event', () => {
      expect(component.toggle).toHaveBeenCalled();
    });
  });

  describe('when clicking the delete button', () => {
    beforeEach(async(() => {
      const destroyButton = fixture.debugElement.query(By.css('.task-item__destroy'));
      destroyButton.nativeElement.click();
      fixture.detectChanges();
    }));

    it('should emit a destroy event', () => {
      expect(component.destroy).toHaveBeenCalled();
    })
  });
});
