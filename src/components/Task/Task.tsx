import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { XYCoord } from "dnd-core";
import type { Status } from "../../models/Status";
import { cva } from "class-variance-authority";

interface ITaskProps {
  id: number;
  title: string;
  index: number;
  status: Status;
  isDropPreview?: boolean;
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

interface ITaskDragItem extends Omit<ITaskProps, "reOrder"> {
  originalIndex?: number;
}

export const Task = ({
  title,
  index,
  id,
  reOrder,
  status,
  isDropPreview,
}: ITaskProps) => {
  const taskRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag<
    ITaskDragItem,
    void,
    { isDragging: boolean }
  >({
    type: "task",
    item: { id: id, index: index, title: title, status: status },
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
      className={taskStyles({ isDragging: isDragging || isDropPreview })}
      ref={taskRef}
    >
      <h2>{title}</h2>
    </article>
  );
};
