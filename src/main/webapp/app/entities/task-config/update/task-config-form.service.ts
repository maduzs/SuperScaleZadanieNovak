import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITaskConfig, NewTaskConfig } from '../task-config.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITaskConfig for edit and NewTaskConfigFormGroupInput for create.
 */
type TaskConfigFormGroupInput = ITaskConfig | PartialWithRequiredKeyOf<NewTaskConfig>;

type TaskConfigFormDefaults = Pick<NewTaskConfig, 'id'>;

type TaskConfigFormGroupContent = {
  id: FormControl<ITaskConfig['id'] | NewTaskConfig['id']>;
  type: FormControl<ITaskConfig['type']>;
};

export type TaskConfigFormGroup = FormGroup<TaskConfigFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TaskConfigFormService {
  createTaskConfigFormGroup(taskConfig: TaskConfigFormGroupInput = { id: null }): TaskConfigFormGroup {
    const taskConfigRawValue = {
      ...this.getFormDefaults(),
      ...taskConfig,
    };
    return new FormGroup<TaskConfigFormGroupContent>({
      id: new FormControl(
        { value: taskConfigRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      type: new FormControl(taskConfigRawValue.type, {
        validators: [Validators.required],
      }),
    });
  }

  getTaskConfig(form: TaskConfigFormGroup): ITaskConfig | NewTaskConfig {
    return form.getRawValue() as ITaskConfig | NewTaskConfig;
  }

  resetForm(form: TaskConfigFormGroup, taskConfig: TaskConfigFormGroupInput): void {
    const taskConfigRawValue = { ...this.getFormDefaults(), ...taskConfig };
    form.reset(
      {
        ...taskConfigRawValue,
        id: { value: taskConfigRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TaskConfigFormDefaults {
    return {
      id: null,
    };
  }
}
