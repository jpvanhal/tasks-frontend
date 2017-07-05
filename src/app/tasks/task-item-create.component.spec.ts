import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MdInputModule, MdListModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TaskItemCreateComponent } from './task-item-create.component';

describe('TaskItemCreateComponent', () => {
  let component: TaskItemCreateComponent;
  let fixture: ComponentFixture<TaskItemCreateComponent>;
  let onCreate: jasmine.Spy;
  let input;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MdInputModule,
        MdListModule,
        NoopAnimationsModule,
      ],
      declarations: [ TaskItemCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    onCreate = jasmine.createSpy('onCreate');
    fixture = TestBed.createComponent(TaskItemCreateComponent);
    component = fixture.componentInstance;
    component.create.subscribe(onCreate);
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css('input'));
  });

  describe('when the input has text', () => {
    beforeEach(async(() => {
      input.nativeElement.value = '  Buy food ';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }));

    describe('when pressing Enter key', () => {
      beforeEach(async(() => {
        input = fixture.debugElement.query(By.css('input'));
        input.triggerEventHandler('keyup.enter');
        fixture.detectChanges();
      }));

      it('should emit "create" event', () => {
        expect(onCreate).toHaveBeenCalledWith('Buy food');
      });

      it('should clear the input', () => {
        expect(input.nativeElement.value).toBe('');
      });
    });

    describe('when pressing Escape key', () => {
      beforeEach(async(() => {
        input = fixture.debugElement.query(By.css('input'));
        input.triggerEventHandler('keyup.escape');
        fixture.detectChanges();
      }));

      it('should not emit "create" event', () => {
        expect(onCreate).not.toHaveBeenCalled();
      });

      it('should clear the input', () => {
        expect(input.nativeElement.value).toBe('');
      });
    });
  });

  describe('when the input does not have text', () => {
    describe('when pressing Enter key', () => {
      beforeEach(async(() => {
        input = fixture.debugElement.query(By.css('input'));
        input.triggerEventHandler('keyup.enter');
        fixture.detectChanges();
      }));

      it('should not emit "create" event', () => {
        expect(onCreate).not.toHaveBeenCalled();
      });
    });
  });
});
