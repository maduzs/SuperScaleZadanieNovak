import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITaskMeta, NewTaskMeta } from '../task-meta.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITaskMeta for edit and NewTaskMetaFormGroupInput for create.
 */
type TaskMetaFormGroupInput = ITaskMeta | PartialWithRequiredKeyOf<NewTaskMeta>;

type TaskMetaFormDefaults = Pick<NewTaskMeta, 'id'>;

type TaskMetaFormGroupContent = {
  id: FormControl<ITaskMeta['id'] | NewTaskMeta['id']>;
  name: FormControl<ITaskMeta['name']>;
  type: FormControl<ITaskMeta['type']>;
  taskConfig: FormControl<ITaskMeta['taskConfig']>;
};

export type TaskMetaFormGroup = FormGroup<TaskMetaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TaskMetaFormService {
  createTaskMetaFormGroup(taskMeta: TaskMetaFormGroupInput = { id: null }): TaskMetaFormGroup {
    const taskMetaRawValue = {
      ...this.getFormDefaults(),
      ...taskMeta,
    };
    return new FormGroup<TaskMetaFormGroupContent>({
      id: new FormControl(
        { value: taskMetaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(taskMetaRawValue.name),
      type: new FormControl(taskMetaRawValue.type),
      taskConfig: new FormControl(taskMetaRawValue.taskConfig),
    });
  }

  getTaskMeta(form: TaskMetaFormGroup): ITaskMeta | NewTaskMeta {
    return form.getRawValue() as ITaskMeta | NewTaskMeta;
  }

  resetForm(form: TaskMetaFormGroup, taskMeta: TaskMetaFormGroupInput): void {
    const taskMetaRawValue = { ...this.getFormDefaults(), ...taskMeta };
    form.reset(
      {
        ...taskMetaRawValue,
        id: { value: taskMetaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TaskMetaFormDefaults {
    return {
      id: null,
    };
  }
}
