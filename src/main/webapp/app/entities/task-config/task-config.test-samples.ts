import { ITaskConfig, NewTaskConfig } from './task-config.model';

export const sampleWithRequiredData: ITaskConfig = {
  id: 'e6261dac-662c-457f-9b50-717a5734ac2e',
  type: 'WASH_DISHES',
};

export const sampleWithPartialData: ITaskConfig = {
  id: '498449a5-73a4-494e-bda2-e689be0c742d',
  type: 'VACUUM_CLEAN',
};

export const sampleWithFullData: ITaskConfig = {
  id: '2bab68b9-4d10-4e13-abb7-e9d89e87cd7a',
  type: 'WASH_DISHES',
};

export const sampleWithNewData: NewTaskConfig = {
  type: 'VACUUM_CLEAN',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
