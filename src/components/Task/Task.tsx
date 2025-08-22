import { useDraggable, useDroppable } from "@dnd-kit/core";
import { cva } from "class-variance-authority";
import { EditableText } from "../EditableText/EditableText";
import type { Task as TaskType } from "../../models/Task";
import useBoardsStore from "../../store/boards";
import { Button } from "../Button/Button";
import { TrashIcon, ClockIcon } from "@heroicons/react/16/solid";
import { TaskHistory } from "../TaskHistory/TaskHistory";
import { useState } from "react";
interface ITaskProps {
  task: TaskType;
  isDragOverlay?: boolean;
  reOrder: (dragIndex: number, hoverIndex: number) => void;
}

const taskStyles = cva(
  "w-full h-fit border border-gray-300 p-2 bg-white shadow-sm transition-opacity rounded-lg",
  {
    variants: {
      isDragging: {
        true: "opacity-50",
        false: "opacity-100",
      },
    },
  }
);

export const Task = ({ task, isDragOverlay = false }: ITaskProps) => {
  const { id, title, description, status } = task;
  const updateTask = useBoardsStore((state) => state.updateTask);
  const removeTask = useBoardsStore((state) => state.removeTask);
  const [showHistory, setShowHistory] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: `task-${id}`,
    data: {
      type: "task",
      id,
      title,
      description,
      status,
    },
    disabled: isDragOverlay,
  });

  const { setNodeRef: setDropRef } = useDroppable({
    id: `task-drop-${id}`,
    data: {
      type: "task",
      id,
      status,
    },
    disabled: isDragOverlay,
  });

  const setNodeRef = (node: HTMLElement | null) => {
    if (!isDragOverlay) {
      setDragRef(node);
      setDropRef(node);
    }
  };

  return (
    <article
      className={taskStyles({
        isDragging: isDragging && !isDragOverlay,
      })}
      style={{
        pointerEvents: isDragging && !isDragOverlay ? "none" : "auto",
      }}
      ref={setNodeRef}
      {...(isDragOverlay ? {} : attributes)}
      {...(isDragOverlay ? {} : listeners)}
    >
      <header className="mb-2 flex flex-row gap-x-3 justify-between">
        <div className="flex flex-row gap-x-2 items-center">
          <img
            src="https://avatar.iran.liara.run/public"
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <EditableText
            initialText={title}
            textStyle="text-lg font-semibold"
            save={(text) => updateTask(id, { ...task, title: text })}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="icon"
            onClick={() => setShowHistory(true)}
            title="View task history"
          >
            <ClockIcon className="h-4 w-4" />
          </Button>
          <Button variant="danger" onClick={() => removeTask(id, status)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <hr className="my-5 border-gray-300 " />
      <EditableText
        initialText={description}
        save={(text) => updateTask(id, { ...task, description: text })}
        textArea
      />

      <TaskHistory
        taskId={id}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </article>
  );
};
