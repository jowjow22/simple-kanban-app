import { useDraggable, useDroppable } from "@dnd-kit/core";
import { cva } from "class-variance-authority";
import { EditableText } from "../EditableText/EditableText";
import type { Task as TaskType } from "../../models/Task";
import useBoardsStore from "../../store/boards";
interface ITaskProps {
  task: TaskType;
  isDragOverlay?: boolean;
  reOrder: (dragIndex: number, hoverIndex: number) => void;
}

const taskStyles = cva(
  "w-full h-fit border border-gray-300 p-2 bg-white shadow-sm",
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
      ref={setNodeRef}
      {...(isDragOverlay ? {} : attributes)}
      {...(isDragOverlay ? {} : listeners)}
    >
      <EditableText
        initialText={title}
        save={(text) => updateTask(id, { ...task, title: text })}
      />
      <EditableText
        initialText={description}
        save={(text) => updateTask(id, { ...task, description: text })}
      />
    </article>
  );
};
