import { ITaskMeta, NewTaskMeta } from './task-meta.model';

export const sampleWithRequiredData: ITaskMeta = {
  id: 17804,
};

export const sampleWithPartialData: ITaskMeta = {
  id: 31571,
};

export const sampleWithFullData: ITaskMeta = {
  id: 18399,
  name: 'yahoo',
  type: 'DATE',
};

export const sampleWithNewData: NewTaskMeta = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
