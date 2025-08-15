import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { XYCoord } from "dnd-core";

interface ITaskProps {
  id: number;
  title: string;
  index: number;
  reOrder: (dragIndex: number, hoverIndex: number) => void;
}

interface ITaskDragItem extends Omit<ITaskProps, "reOrder"> {
  originalIndex?: number;
}

export const Task = ({ title, index, id, reOrder }: ITaskProps) => {
  const taskRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag<
    ITaskDragItem,
    void,
    { isDragging: boolean }
  >({
    type: "task",
    item: { id: id, index: index, title: title },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<ITaskDragItem, void, { isOver: boolean }>({
    accept: "task",
    hover: (item, monitor) => {
      if (!taskRef.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoveringBoundingRect = taskRef.current.getBoundingClientRect();

      const verticalCenter =
        (hoveringBoundingRect.bottom + hoveringBoundingRect.top) / 2;

      const mousePosition = monitor.getClientOffset() as XYCoord;

      const mouseY = mousePosition.y - hoveringBoundingRect.top;

      if (dragIndex < hoverIndex && mouseY < verticalCenter) return;
      if (dragIndex > hoverIndex && mouseY > verticalCenter) return;

      item.originalIndex ??= item.index;

      item.index = hoverIndex;
    },
    drop: (item) => {
      const originalIndex = item.originalIndex ?? item.index;
      const finalIndex = index;

      if (originalIndex !== finalIndex) {
        reOrder(originalIndex, finalIndex);
      }

      delete item.originalIndex;
    },
  });

  drag(drop(taskRef));

  return (
    <article
      className={`w-full h-fit border border-gray-300 p-2 bg-white shadow-sm ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      ref={taskRef}
    >
      <h2>{title}</h2>
    </article>
  );
};
