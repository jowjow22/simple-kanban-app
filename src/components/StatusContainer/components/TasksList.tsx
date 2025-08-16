import { memo } from "react";
import { Task } from "../../Task/Task";
import type { Task as TaskType } from "../../../models/Task";

interface ITasksListProps {
  tasks: TaskType[];
}

const TasksList = memo(({ tasks }: ITasksListProps) => {
  return (
    <>
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          isDragOverlay={false}
          reOrder={() => {}}
        />
      ))}
    </>
  );
});

export { TasksList };
