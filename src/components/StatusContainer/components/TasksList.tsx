import { memo } from "react";
import { Task } from "../../Task/Task";
import type { Task as TaskType } from "../../../models/Task";

interface ITasksListProps {
  tasks: TaskType[];
  reOrderTasks: (dragIndex: number, hoverIndex: number) => void;
}

const TasksList = memo(({ tasks, reOrderTasks }: ITasksListProps) => {
  return (
    <>
      {tasks.map((task, index: number) => (
        <Task
          key={task.id}
          id={task.id}
          title={task.title}
          index={index}
          status={task.status}
          reOrder={reOrderTasks}
        />
      ))}
    </>
  );
});

export { TasksList };
