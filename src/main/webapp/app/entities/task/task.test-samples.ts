import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: '48d52277-8822-451c-b2af-8ac2d6db7e44',
  name: 'supposing',
  type: 'WASH_DISHES',
};

export const sampleWithPartialData: ITask = {
  id: '0ab751c0-19b7-4abc-82ac-f393813e2327',
  name: 'making round',
  type: 'WASH_DISHES',
};

export const sampleWithFullData: ITask = {
  id: '680ee62d-cbd3-4f39-ad5a-8e3732304692',
  name: 'condense familiar barring',
  type: 'VACUUM_CLEAN',
};

export const sampleWithNewData: NewTask = {
  name: 'expostulate',
  type: 'WASH_DISHES',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
