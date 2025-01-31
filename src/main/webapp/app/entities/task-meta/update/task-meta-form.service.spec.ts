import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../task-meta.test-samples';

import { TaskMetaFormService } from './task-meta-form.service';

describe('TaskMeta Form Service', () => {
  let service: TaskMetaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskMetaFormService);
  });

  describe('Service methods', () => {
    describe('createTaskMetaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTaskMetaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            type: expect.any(Object),
            taskConfig: expect.any(Object),
          }),
        );
      });

      it('passing ITaskMeta should create a new form with FormGroup', () => {
        const formGroup = service.createTaskMetaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            type: expect.any(Object),
            taskConfig: expect.any(Object),
          }),
        );
      });
    });

    describe('getTaskMeta', () => {
      it('should return NewTaskMeta for default TaskMeta initial value', () => {
        const formGroup = service.createTaskMetaFormGroup(sampleWithNewData);

        const taskMeta = service.getTaskMeta(formGroup) as any;

        expect(taskMeta).toMatchObject(sampleWithNewData);
      });

      it('should return NewTaskMeta for empty TaskMeta initial value', () => {
        const formGroup = service.createTaskMetaFormGroup();

        const taskMeta = service.getTaskMeta(formGroup) as any;

        expect(taskMeta).toMatchObject({});
      });

      it('should return ITaskMeta', () => {
        const formGroup = service.createTaskMetaFormGroup(sampleWithRequiredData);

        const taskMeta = service.getTaskMeta(formGroup) as any;

        expect(taskMeta).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITaskMeta should not enable id FormControl', () => {
        const formGroup = service.createTaskMetaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTaskMeta should disable id FormControl', () => {
        const formGroup = service.createTaskMetaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
