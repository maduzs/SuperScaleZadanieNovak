import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ITaskConfig } from 'app/entities/task-config/task-config.model';
import { TaskConfigService } from 'app/entities/task-config/service/task-config.service';
import { TaskMetaService } from '../service/task-meta.service';
import { ITaskMeta } from '../task-meta.model';
import { TaskMetaFormService } from './task-meta-form.service';

import { TaskMetaUpdateComponent } from './task-meta-update.component';

describe('TaskMeta Management Update Component', () => {
  let comp: TaskMetaUpdateComponent;
  let fixture: ComponentFixture<TaskMetaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let taskMetaFormService: TaskMetaFormService;
  let taskMetaService: TaskMetaService;
  let taskConfigService: TaskConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskMetaUpdateComponent],
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
      .overrideTemplate(TaskMetaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TaskMetaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    taskMetaFormService = TestBed.inject(TaskMetaFormService);
    taskMetaService = TestBed.inject(TaskMetaService);
    taskConfigService = TestBed.inject(TaskConfigService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TaskConfig query and add missing value', () => {
      const taskMeta: ITaskMeta = { id: 5170 };
      const taskConfig: ITaskConfig = { id: 'b1b9c7bd-c8cf-4371-9dc1-8a53a2e1c92a' };
      taskMeta.taskConfig = taskConfig;

      const taskConfigCollection: ITaskConfig[] = [{ id: 'b1b9c7bd-c8cf-4371-9dc1-8a53a2e1c92a' }];
      jest.spyOn(taskConfigService, 'query').mockReturnValue(of(new HttpResponse({ body: taskConfigCollection })));
      const additionalTaskConfigs = [taskConfig];
      const expectedCollection: ITaskConfig[] = [...additionalTaskConfigs, ...taskConfigCollection];
      jest.spyOn(taskConfigService, 'addTaskConfigToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ taskMeta });
      comp.ngOnInit();

      expect(taskConfigService.query).toHaveBeenCalled();
      expect(taskConfigService.addTaskConfigToCollectionIfMissing).toHaveBeenCalledWith(
        taskConfigCollection,
        ...additionalTaskConfigs.map(expect.objectContaining),
      );
      expect(comp.taskConfigsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const taskMeta: ITaskMeta = { id: 5170 };
      const taskConfig: ITaskConfig = { id: 'b1b9c7bd-c8cf-4371-9dc1-8a53a2e1c92a' };
      taskMeta.taskConfig = taskConfig;

      activatedRoute.data = of({ taskMeta });
      comp.ngOnInit();

      expect(comp.taskConfigsSharedCollection).toContainEqual(taskConfig);
      expect(comp.taskMeta).toEqual(taskMeta);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITaskMeta>>();
      const taskMeta = { id: 30055 };
      jest.spyOn(taskMetaFormService, 'getTaskMeta').mockReturnValue(taskMeta);
      jest.spyOn(taskMetaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ taskMeta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: taskMeta }));
      saveSubject.complete();

      // THEN
      expect(taskMetaFormService.getTaskMeta).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(taskMetaService.update).toHaveBeenCalledWith(expect.objectContaining(taskMeta));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITaskMeta>>();
      const taskMeta = { id: 30055 };
      jest.spyOn(taskMetaFormService, 'getTaskMeta').mockReturnValue({ id: null });
      jest.spyOn(taskMetaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ taskMeta: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: taskMeta }));
      saveSubject.complete();

      // THEN
      expect(taskMetaFormService.getTaskMeta).toHaveBeenCalled();
      expect(taskMetaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITaskMeta>>();
      const taskMeta = { id: 30055 };
      jest.spyOn(taskMetaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ taskMeta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(taskMetaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTaskConfig', () => {
      it('Should forward to taskConfigService', () => {
        const entity = { id: 'b1b9c7bd-c8cf-4371-9dc1-8a53a2e1c92a' };
        const entity2 = { id: '9a4eec8b-874c-4eaf-b676-38262fa92c4a' };
        jest.spyOn(taskConfigService, 'compareTaskConfig');
        comp.compareTaskConfig(entity, entity2);
        expect(taskConfigService.compareTaskConfig).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
