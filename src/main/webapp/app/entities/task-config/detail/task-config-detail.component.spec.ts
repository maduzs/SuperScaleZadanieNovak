import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { TaskConfigDetailComponent } from './task-config-detail.component';

describe('TaskConfig Management Detail Component', () => {
  let comp: TaskConfigDetailComponent;
  let fixture: ComponentFixture<TaskConfigDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskConfigDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./task-config-detail.component').then(m => m.TaskConfigDetailComponent),
              resolve: { taskConfig: () => of({ id: 'b1b9c7bd-c8cf-4371-9dc1-8a53a2e1c92a' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TaskConfigDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskConfigDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load taskConfig on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TaskConfigDetailComponent);

      // THEN
      expect(instance.taskConfig()).toEqual(expect.objectContaining({ id: 'b1b9c7bd-c8cf-4371-9dc1-8a53a2e1c92a' }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
