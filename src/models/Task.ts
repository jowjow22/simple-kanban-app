import type { Status } from "./Status";

interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
}

export type { Task };
