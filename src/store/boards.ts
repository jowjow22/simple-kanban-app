import { create } from "zustand";
import type { Task } from "../models/Task";
import { Status } from "../models/Status";

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
    oldStatusAndId: { status: Status; id: number }
  ) => void;
  updateFullBoard: (tasks: Task[], status: Status) => void;
}

const useStore = create<BoardsState>((set) => ({
  boards: {
    [Status.todo]: [
      {
        id: 1,
        title: "Task 1",
        status: Status.todo,
      },
      {
        id: 2,
        title: "Task 2",
        status: Status.todo,
      },
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
    set((state) => ({
      boards: { ...state.boards, [status]: tasks },
    })),
  moveTaskFromBoard: (
    task: Task,
    oldStatusAndId: { status: Status; id: number }
  ) =>
    set((state) => ({
      boards: {
        ...state.boards,
        [task.status]: [...state.boards[task.status], task],
        [oldStatusAndId.status]: state.boards[oldStatusAndId.status].filter(
          (t) => t.id !== oldStatusAndId.id
        ),
      },
    })),
}));

export default useStore;
