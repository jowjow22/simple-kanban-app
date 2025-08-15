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

  const [_, drop] = useDrop(
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
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
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
    <div className="w-92 h-full bg-teal-200 grid place-items-center" ref={drop}>
      {renderTasks()}
    </div>
  );
};
