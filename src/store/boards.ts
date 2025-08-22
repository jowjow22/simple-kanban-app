import { create } from "zustand";
import type { Task } from "../models/Task";
import { Status } from "../models/Status";
import { persist } from "zustand/middleware";
import useTaskHistoryStore, { createChangeDescription } from "./taskHistory";
import { ChangeType } from "../models/TaskHistory";
import { v4 as uuidv4 } from 'uuid';
interface BoardsMap {
  [Status.todo]: Task[];
  [Status.inProgress]: Task[];
  [Status.done]: Task[];
}

interface BoardsState {
  boards: BoardsMap;
  addTask: (task: Omit<Task, "id">, status: Status) => void;
  removeTask: (taskId: string, status: Status) => void;
  moveTaskFromBoard: (
    task: Task,
    oldStatusAndId: { status: Status; id: string }
  ) => void;
  updateFullBoard: (tasks: Task[], status: Status) => void;
  updateTask: (taskId: string, newData: Task) => void;
}

const useStore = create<BoardsState>()(
  persist(
    (set) => ({
      boards: {
        [Status.todo]: [
        ],
        [Status.inProgress]: [],
        [Status.done]: [],
      },
      addTask: (task: Omit<Task, "id">, status: Status) =>
        set((state) => {
          const newTask = { id: uuidv4(), ...task };
          const board = state.boards[status] || [];
          
          // Track task creation in history
          const historyStore = useTaskHistoryStore.getState();
          historyStore.addChange(newTask.id, {
            type: ChangeType.CREATED,
            description: createChangeDescription.created(),
          });
          
          return { boards: { ...state.boards, [status]: [...board, newTask] } };
        }),
      updateFullBoard: (tasks: Task[], status: Status) =>
        set((state) => {
          return {
            boards: { ...state.boards, [status]: tasks },
          };
        }),
      removeTask: (taskId: string, status: Status) =>
        set((state) => {
          // Track task deletion in history
          const historyStore = useTaskHistoryStore.getState();
          historyStore.addChange(taskId, {
            type: ChangeType.DELETED,
            description: createChangeDescription.deleted(),
          });
          
          return {
            boards: {
              ...state.boards,
              [status]: state.boards[status].filter((task) => task.id !== taskId),
            },
          };
        }),
      moveTaskFromBoard: (
        task: Task,
        oldStatusAndId: { status: Status; id: string }
      ) =>
        set((state) => {
          // Track status change in history
          const historyStore = useTaskHistoryStore.getState();
          historyStore.addChange(task.id, {
            type: ChangeType.MOVED,
            field: 'status',
            oldValue: oldStatusAndId.status,
            newValue: task.status,
            description: createChangeDescription.statusMoved(oldStatusAndId.status, task.status),
          });
          
          return {
            boards: {
              ...state.boards,
              [task.status]: [...state.boards[task.status], task],
              [oldStatusAndId.status]: state.boards[
                oldStatusAndId.status
              ].filter((t) => t.id !== oldStatusAndId.id),
            },
          };
        }),
      updateTask: (taskId: string, newData: Task) =>
        set((state) => {
          const taskIndex = state.boards[newData.status].findIndex(
            (task) => task.id === taskId
          );
          if (taskIndex !== -1) {
            const oldTask = state.boards[newData.status][taskIndex];
            const historyStore = useTaskHistoryStore.getState();
            
            // Track field changes
            if (oldTask.title !== newData.title) {
              historyStore.addChange(taskId, {
                type: ChangeType.UPDATED,
                field: 'title',
                oldValue: oldTask.title,
                newValue: newData.title,
                description: createChangeDescription.titleUpdated(oldTask.title, newData.title),
              });
            }
            
            if (oldTask.description !== newData.description) {
              historyStore.addChange(taskId, {
                type: ChangeType.UPDATED,
                field: 'description',
                oldValue: oldTask.description,
                newValue: newData.description,
                description: createChangeDescription.descriptionUpdated(oldTask.description, newData.description),
              });
            }
            
            const updatedTasks = [...state.boards[newData.status]];
            updatedTasks[taskIndex] = newData;
            return {
              boards: {
                ...state.boards,
                [newData.status]: updatedTasks,
              },
            };
          }
          return state;
        }),
    }),
    {
      name: "kanban-app",
    }
  )
);

export default useStore;
