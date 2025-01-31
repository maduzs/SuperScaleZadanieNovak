import { TaskType } from 'app/entities/enumerations/task-type.model';

export interface ITaskConfig {
  id: string;
  type?: keyof typeof TaskType | null;
}

export type NewTaskConfig = Omit<ITaskConfig, 'id'> & { id: null };
