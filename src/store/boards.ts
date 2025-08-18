import { create } from "zustand";
import type { Task } from "../models/Task";
import { Status } from "../models/Status";
import { persist } from "zustand/middleware";
interface BoardsMap {
  [Status.todo]: Task[];
  [Status.inProgress]: Task[];
  [Status.done]: Task[];
}

interface BoardsState {
  boards: BoardsMap;
  addTask: (task: Task, status: Status) => void;
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
      addTask: (task: Task, status: Status) =>
        set((state) => {
          const board = state.boards[status] || [];
          return { boards: { ...state.boards, [status]: [...board, task] } };
        }),
      updateFullBoard: (tasks: Task[], status: Status) =>
        set((state) => {
          return {
            boards: { ...state.boards, [status]: tasks },
          };
        }),
      moveTaskFromBoard: (
        task: Task,
        oldStatusAndId: { status: Status; id: string }
      ) =>
        set((state) => {
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
