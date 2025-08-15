import { Task as TaskComponent } from "../Task/Task";
import { useCallback, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../models/ItemTypes";
import type { Task } from "../../models/Task";
import { Status } from "../../models/Status";
import { cva } from "class-variance-authority";

interface IStatusBoardProps {
  tasks: Task[];
  updateOwnTasks: (
    item: Task,
    oldStatusAndId: { id: number; status: Status }
  ) => void;
  ownStatus: Status;
  updateOrdering: (tasks: Task[]) => void;
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

export const StatusBoard = ({
  tasks,
  updateOwnTasks,
  ownStatus,
  updateOrdering,
}: IStatusBoardProps) => {
  const [ownTasks, setOwnTasks] = useState(tasks);

  useEffect(() => {
    setOwnTasks(tasks);
  }, [tasks]);

  const [{ isActive, previewItem }, drop] = useDrop(
    () => ({
      accept: ItemTypes.task,
      drop: (item: Task) => {
        const oldStatusAndId = {
          id: item.id,
          status: item.status,
        };
        if (ownStatus === oldStatusAndId.status) return;
        updateOwnTasks({ ...item, status: ownStatus }, oldStatusAndId);
      },
      collect: (monitor) => ({
        isActive:
          monitor.isOver() &&
          monitor.canDrop() &&
          monitor.isOver({ shallow: true }),
        previewItem: monitor.getItem(),
      }),
    }),
    [updateOwnTasks]
  );

  const reOrderTasks = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const auxTasks = [...ownTasks];
      const [removed] = auxTasks.splice(dragIndex, 1);
      auxTasks.splice(hoverIndex, 0, removed);
      setOwnTasks(auxTasks);
      updateOrdering(auxTasks);
    },
    [ownTasks, updateOrdering]
  );

  const renderTasks = useCallback(() => {
    return ownTasks.map((task, index: number) => (
      <TaskComponent
        key={task.id}
        id={task.id}
        title={task.title}
        index={index}
        status={task.status}
        reOrder={reOrderTasks}
      />
    ));
  }, [reOrderTasks, ownTasks]);

  const boardClass = boardVariants({ status: ownStatus });

  return (
    <div
      className={boardClass}
      ref={drop as unknown as React.Ref<HTMLDivElement>}
    >
      {renderTasks()}

      {isActive && (
        <TaskComponent
          key={previewItem.id}
          id={previewItem.id}
          title={previewItem.title}
          index={-1}
          status={ownStatus}
          reOrder={reOrderTasks}
          isDropPreview={isActive}
        />
      )}
    </div>
  );
};
