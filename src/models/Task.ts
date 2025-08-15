import type { Status } from "./Status";

interface Task {
  id: number;
  title: string;
  index: number;
  status: Status;
}

export type { Task };
