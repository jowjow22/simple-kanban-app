import { Task } from "../Task/Task";
import { useCallback, useState } from "react";
export const StatusContainer = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Task 1",
    },
    {
      id: 2,
      title: "Task 2",
    },
    {
      id: 3,
      title: "Task 3",
    },
    {
      id: 4,
      title: "Task 4",
    },
  ]);

  const reOrderTasks = useCallback(
    (dragIndex, hoverIndex) => {
      const auxTasks = [...tasks];
      const [removed] = auxTasks.splice(dragIndex, 1);
      auxTasks.splice(hoverIndex, 0, removed);
      setTasks(auxTasks);
      console.log("Reordered tasks:", auxTasks);
    },
    [tasks]
  );

  const renderTasks = useCallback(() => {
    return tasks.map((task, index) => (
      <Task
        key={task.id}
        id={task.id}
        title={task.title}
        index={index}
        reOrder={reOrderTasks}
      />
    ));
  }, [reOrderTasks, tasks]);

  return (
    <div className="w-92 h-full bg-teal-200 grid place-items-center">
      {renderTasks()}
    </div>
  );
};
