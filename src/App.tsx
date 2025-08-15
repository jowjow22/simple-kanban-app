import { StatusContainer } from "./components/StatusContainer/StatusContainer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState } from "react";
import type { Task } from "./models/Task";
import { Status } from "./models/Status";
function App() {
  const [tasksByStatus, setTasksByStatus] = useState<{ [key: string]: Task[] }>(
    {
      [Status.todo]: [
        {
          id: 1,
          title: "Task 1",
          index: 0,
          status: Status.todo,
        },
        {
          id: 2,
          title: "Task 2",
          index: 1,
          status: Status.todo,
        },
        {
          id: 3,
          title: "Task 3",
          index: 2,
          status: Status.todo,
        },
      ],
      [Status.inProgress]: [],
      [Status.done]: [],
    }
  );
  return (
    <main className="h-screen w-screen flex flex-row gap-x-10">
      <DndProvider backend={HTML5Backend}>
        <StatusContainer
          tasks={tasksByStatus.todo}
          ownStatus={Status.todo}
          updateOwnTasks={(task, oldStatusAndId) => {
            setTasksByStatus((prev) => ({
              ...prev,
              ["todo"]: [...prev["todo"], task],
              [oldStatusAndId.status]: prev[oldStatusAndId.status].filter(
                (t) => t.id !== oldStatusAndId.id
              ),
            }));
          }}
          updateOrdering={(tasks) => {
            console.log("Updating todo tasks order", tasks);
            setTasksByStatus((prev) => ({
              ...prev,
              [Status.todo]: tasks,
            }));
          }}
        />
        <StatusContainer
          tasks={tasksByStatus.inProgress}
          ownStatus={Status.inProgress}
          updateOwnTasks={(task, oldStatusAndId) => {
            console.log("Updating tasks in progress", task, oldStatusAndId);
            setTasksByStatus((prev) => ({
              ...prev,
              ["inProgress"]: [...prev["inProgress"], task],
              [oldStatusAndId.status]: prev[oldStatusAndId.status].filter(
                (t) => t.id !== oldStatusAndId.id
              ),
            }));
          }}
          updateOrdering={(tasks) => {
            console.log("Updating tasks in progress order", tasks);
            setTasksByStatus((prev) => ({
              ...prev,
              [Status.inProgress]: tasks,
            }));
          }}
        />
      </DndProvider>
    </main>
  );
}

export default App;
