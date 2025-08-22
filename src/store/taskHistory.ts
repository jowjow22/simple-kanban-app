import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TaskHistory, TaskChange } from "../models/TaskHistory";
import type { Status } from "../models/Status";
import { v4 as uuidv4 } from 'uuid';
interface TaskHistoryState {
  histories: Record<string, TaskHistory>;
  addChange: (taskId: string, change: Omit<TaskChange, 'id' | 'timestamp'>) => void;
  getTaskHistory: (taskId: string) => TaskChange[];
  clearTaskHistory: (taskId: string) => void;
  removeTaskHistory: (taskId: string) => void;
}

const MAX_HISTORY_LENGTH = 5;

const useTaskHistoryStore = create<TaskHistoryState>()(
  persist(
    (set, get) => ({
      histories: {},
      
      addChange: (taskId: string, change: Omit<TaskChange, 'id' | 'timestamp'>) => {
        set((state) => {
          const existingHistory = state.histories[taskId];
          const newChange: TaskChange = {
            ...change,
            id: uuidv4(),
            timestamp: Date.now(),
          };

          const changes = existingHistory 
            ? [newChange, ...existingHistory.changes].slice(0, MAX_HISTORY_LENGTH)
            : [newChange];

          return {
            histories: {
              ...state.histories,
              [taskId]: {
                taskId,
                changes,
              },
            },
          };
        });
      },

      getTaskHistory: (taskId: string) => {
        const history = get().histories[taskId];
        return history ? history.changes : [];
      },

      clearTaskHistory: (taskId: string) => {
        set((state) => ({
          histories: {
            ...state.histories,
            [taskId]: {
              taskId,
              changes: [],
            },
          },
        }));
      },

      removeTaskHistory: (taskId: string) => {
        set((state) => {
          const { [taskId]: _removed, ...rest } = state.histories;
          return { histories: rest };
        });
      },
    }),
    {
      name: "task-history-store",
    }
  )
);

export const createChangeDescription = {
  created: () => "Task created",
  titleUpdated: (oldTitle: string, newTitle: string) => 
    `Title changed from "${oldTitle}" to "${newTitle}"`,
  descriptionUpdated: (oldDesc: string, newDesc: string) => {
    if (oldDesc) {
      return `Description changed from "${oldDesc}" to "${newDesc}"`;
    }
    return `Description set to "${newDesc}"`;
  },
  statusMoved: (oldStatus: Status, newStatus: Status) => 
    `Moved from ${oldStatus} to ${newStatus}`,
  deleted: () => "Task deleted",
};

export default useTaskHistoryStore;
