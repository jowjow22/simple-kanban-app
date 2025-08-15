import { Task as TaskComponent } from "../Task/Task";
import { useCallback, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../models/ItemTypes";
import type { Task } from "../../models/Task";
import type { Status } from "../../models/Status";

interface IStatusContainerProps {
  tasks: Task[];
  updateOwnTasks: (
    item: Task,
    oldStatusAndId: { id: number; status: Status }
  ) => void;
  ownStatus: Status;
  updateOrdering: (tasks: Task[]) => void;
}

export const StatusContainer = ({
  tasks,
  updateOwnTasks,
  ownStatus,
  updateOrdering,
}: IStatusContainerProps) => {
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

  return (
    <div
      className="w-92 h-full bg-teal-200"
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
