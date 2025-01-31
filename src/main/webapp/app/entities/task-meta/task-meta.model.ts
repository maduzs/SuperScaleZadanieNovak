import { ITaskConfig } from 'app/entities/task-config/task-config.model';
import { TaskFieldType } from 'app/entities/enumerations/task-field-type.model';

export interface ITaskMeta {
  id: number;
  name?: string | null;
  type?: keyof typeof TaskFieldType | null;
  taskConfig?: Pick<ITaskConfig, 'id'> | null;
}

export type NewTaskMeta = Omit<ITaskMeta, 'id'> & { id: null };
