import { useDroppable } from "@dnd-kit/core";
import type { Task } from "../../models/Task";
import { Status } from "../../models/Status";
import { TasksList } from "./components/TasksList";
import { cva } from "class-variance-authority";
import { Tag } from "../Tag/Tag";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import useBoardsStore from "../../store/boards";
import { TaskCreationForm } from "../TaskCreationForm/TaskCreationForm";
import { useState } from "react";

interface IStatusBoardProps {
  tasks: Task[];
  ownStatus: Status;
}

const headerVariants = cva(
  "px-4 py-3 rounded-lg flex flex-row justify-between items-center",
  {
    variants: {
      status: {
        [Status.todo]: "bg-cyan-100 text-cyan-800",
        [Status.inProgress]: "bg-amber-100 text-amber-800",
        [Status.done]: "bg-emerald-100 text-emerald-800",
      },
    },
  }
);

const footerVariants = cva(
  "px-4 py-3 rounded-b-lg flex flex-row justify-center items-center w-full cursor-pointer transition-colors duration-200",
  {
    variants: {
      status: {
        [Status.todo]:
          "bg-cyan-100 text-cyan-800 hover:bg-cyan-200 active:bg-cyan-300",
        [Status.inProgress]:
          "bg-amber-100 text-amber-800 hover:bg-amber-200 active:bg-amber-300",
        [Status.done]:
          "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 active:bg-emerald-300",
      },
    },
  }
);

const ringClasses = {
  [Status.todo]: "ring-cyan-500",
  [Status.inProgress]: "ring-amber-500",
  [Status.done]: "ring-emerald-500",
};

export const StatusBoard = ({ tasks, ownStatus }: IStatusBoardProps) => {
  const [open, setOpen] = useState(false);

  const addTask = useBoardsStore((state) => state.addTask);
  const { setNodeRef, isOver } = useDroppable({
    id: `status-${ownStatus}`,
    data: {
      type: "status",
      status: ownStatus,
    },
  });

  const headerClass = headerVariants({ status: ownStatus });
  const footerClass = footerVariants({ status: ownStatus });

  return (
    <div
      className={`w-92 h-fit rounded-lg transition-all duration-200 ${
        isOver ? "ring-2 " + ringClasses[ownStatus] : ""
      }`}
      ref={setNodeRef}
    >
      <header className={headerClass}>
        <h2 className="text-md font-semibold">{ownStatus.toUpperCase()}</h2>
        <Tag status={ownStatus}>{tasks.length}</Tag>
      </header>
      <div className="p-4 space-y-2 min-h-30">
        <TasksList tasks={tasks} />
      </div>
      <button className={footerClass} onClick={() => setOpen(true)}>
        <PlusCircleIcon className="w-6 h-6" />
      </button>
      <TaskCreationForm
        status={ownStatus}
        onCreate={addTask}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};
