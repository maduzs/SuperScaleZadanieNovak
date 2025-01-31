import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../task-config.test-samples';

import { TaskConfigFormService } from './task-config-form.service';

describe('TaskConfig Form Service', () => {
  let service: TaskConfigFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskConfigFormService);
  });

  describe('Service methods', () => {
    describe('createTaskConfigFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTaskConfigFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
          }),
        );
      });

      it('passing ITaskConfig should create a new form with FormGroup', () => {
        const formGroup = service.createTaskConfigFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
          }),
        );
      });
    });

    describe('getTaskConfig', () => {
      it('should return NewTaskConfig for default TaskConfig initial value', () => {
        const formGroup = service.createTaskConfigFormGroup(sampleWithNewData);

        const taskConfig = service.getTaskConfig(formGroup) as any;

        expect(taskConfig).toMatchObject(sampleWithNewData);
      });

      it('should return NewTaskConfig for empty TaskConfig initial value', () => {
        const formGroup = service.createTaskConfigFormGroup();

        const taskConfig = service.getTaskConfig(formGroup) as any;

        expect(taskConfig).toMatchObject({});
      });

      it('should return ITaskConfig', () => {
        const formGroup = service.createTaskConfigFormGroup(sampleWithRequiredData);

        const taskConfig = service.getTaskConfig(formGroup) as any;

        expect(taskConfig).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITaskConfig should not enable id FormControl', () => {
        const formGroup = service.createTaskConfigFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTaskConfig should disable id FormControl', () => {
        const formGroup = service.createTaskConfigFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
