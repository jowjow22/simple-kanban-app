// For type safety when importing Task and Status
import type { Task } from './Task';
import type { Status } from './Status';

export enum ChangeType {
  CREATED = 'created',
  UPDATED = 'updated',
  MOVED = 'moved',
  DELETED = 'deleted',
}

export interface TaskChange {
  id: string; // unique change ID
  timestamp: number;
  type: ChangeType;
  field?: keyof Task; // which field changed (for updates)
  oldValue?: string | Status;
  newValue?: string | Status;
  description: string; // human-readable description
}

export interface TaskHistory {
  taskId: string;
  changes: TaskChange[]; // last 5 changes, newest first
}
