import { TaskType } from 'app/entities/enumerations/task-type.model';

export interface ITaskDto {
  _id: string;
  name?: string | null;
  type?: string;
  fields?: any;
}

export interface ITask {
  id: string;
  name?: string | null;
  type?: keyof typeof TaskType | null;
  fields?: any;
}

export type NewTask = Omit<ITask, 'id'> & { id: null };
