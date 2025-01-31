import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { TaskConfigService } from '../service/task-config.service';
import { ITaskConfig } from '../task-config.model';
import { TaskConfigFormService } from './task-config-form.service';

import { TaskConfigUpdateComponent } from './task-config-update.component';

describe('TaskConfig Management Update Component', () => {
  let comp: TaskConfigUpdateComponent;
  let fixture: ComponentFixture<TaskConfigUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let taskConfigFormService: TaskConfigFormService;
  let taskConfigService: TaskConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskConfigUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TaskConfigUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TaskConfigUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    taskConfigFormService = TestBed.inject(TaskConfigFormService);
    taskConfigService = TestBed.inject(TaskConfigService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const taskConfig: ITaskConfig = { id: '9a4eec8b-874c-4eaf-b676-38262fa92c4a' };

      activatedRoute.data = of({ taskConfig });
      comp.ngOnInit();

      expect(comp.taskConfig).toEqual(taskConfig);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITaskConfig>>();
      const taskConfig = { id: 'b1b9c7bd-c8cf-4371-9dc1-8a53a2e1c92a' };
      jest.spyOn(taskConfigFormService, 'getTaskConfig').mockReturnValue(taskConfig);
      jest.spyOn(taskConfigService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ taskConfig });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: taskConfig }));
      saveSubject.complete();

      // THEN
      expect(taskConfigFormService.getTaskConfig).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(taskConfigService.update).toHaveBeenCalledWith(expect.objectContaining(taskConfig));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITaskConfig>>();
      const taskConfig = { id: 'b1b9c7bd-c8cf-4371-9dc1-8a53a2e1c92a' };
      jest.spyOn(taskConfigFormService, 'getTaskConfig').mockReturnValue({ id: null });
      jest.spyOn(taskConfigService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ taskConfig: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: taskConfig }));
      saveSubject.complete();

      // THEN
      expect(taskConfigFormService.getTaskConfig).toHaveBeenCalled();
      expect(taskConfigService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITaskConfig>>();
      const taskConfig = { id: 'b1b9c7bd-c8cf-4371-9dc1-8a53a2e1c92a' };
      jest.spyOn(taskConfigService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ taskConfig });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(taskConfigService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
