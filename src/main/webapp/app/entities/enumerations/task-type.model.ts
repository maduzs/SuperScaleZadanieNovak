export function mapToTaskType(value: string | undefined): keyof typeof TaskType | undefined {
  if (!value) {
    return undefined;
  }

  // Validate if the value exists in the enum
  if (Object.values(TaskType).includes(value as TaskType)) {
    return Object.keys(TaskType).find(key => TaskType[key as keyof typeof TaskType] === (value as TaskType)) as keyof typeof TaskType;
  }

  return undefined; // Handle invalid values
}

// Extend this enum to support more types
export enum TaskType {
  WASH_DISHES = 'wash-dishes',

  VACUUM_CLEAN = 'vacuum-clean',
}
