import { useDroppable } from "@dnd-kit/core";
import type { Task } from "../../models/Task";
import { Status } from "../../models/Status";
import { TasksList } from "./components/TasksList";
import { cva } from "class-variance-authority";

interface IStatusBoardProps {
  tasks: Task[];
  ownStatus: Status;
}

const boardVariants = cva("w-92 h-full", {
  variants: {
    status: {
      [Status.todo]: "bg-blue-100",
      [Status.inProgress]: "bg-yellow-100",
      [Status.done]: "bg-green-100",
    },
  },
});

export const StatusBoard = ({ tasks, ownStatus }: IStatusBoardProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `status-${ownStatus}`,
    data: {
      type: "status",
      status: ownStatus,
    },
  });

  const boardClass = boardVariants({ status: ownStatus });

  return (
    <div
      className={`${boardClass} ${isOver ? "ring-2 ring-blue-500" : ""}`}
      ref={setNodeRef}
    >
      <h2 className="text-lg font-semibold p-4 text-center border-b">
        {ownStatus.toUpperCase()}
      </h2>
      <div className="p-4 space-y-2">
        <TasksList tasks={tasks} />
      </div>
    </div>
  );
};
