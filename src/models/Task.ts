import type { Status } from "./Status";

interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
}

export type { Task };
