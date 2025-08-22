import { StatusBoard } from "./components/StatusContainer/StatusContainer";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Task as TaskComponent } from "./components/Task/Task";
import { Status } from "./models/Status";
import useBoardsStore from "./store/boards";
import { useMemo, useState } from "react";
import type { Task } from "./models/Task";

function App() {
  const boards = useBoardsStore((state) => state.boards);
  const moveTaskFromBoard = useBoardsStore((state) => state.moveTaskFromBoard);
  const updateFullBoard = useBoardsStore((state) => state.updateFullBoard);

  console.log("Boards:", boards);

  const boardsList = useMemo(() => Object.keys(boards) as Status[], [boards]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeTaskData = active.data.current as Task;
    setActiveTask(activeTaskData);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTaskData = active.data.current as Task;
    const overData = over.data.current;

    if (
      overData?.type === "status" &&
      overData.status !== activeTaskData.status
    ) {
      const oldStatusAndId = {
        id: activeTaskData.id,
        status: activeTaskData.status,
      };
      moveTaskFromBoard(
        { ...activeTaskData, status: overData.status },
        oldStatusAndId
      );
    }

    if (
      overData?.type === "task" &&
      overData.status !== activeTaskData.status
    ) {
      const oldStatusAndId = {
        id: activeTaskData.id,
        status: activeTaskData.status,
      };
      moveTaskFromBoard(
        { ...activeTaskData, status: overData.status },
        oldStatusAndId
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTaskData = active.data.current as Task;
    const overData = over.data.current;

    if (
      overData?.type === "task" &&
      activeTaskData.status === overData.status
    ) {
      const activeIndex = boards[activeTaskData.status].findIndex(
        (task: Task) => task.id === activeTaskData.id
      );
      const overIndex = boards[activeTaskData.status].findIndex(
        (task: Task) => task.id === overData.id
      );

      if (activeIndex !== overIndex) {
        const tasks = [...boards[activeTaskData.status]];
        const [removed] = tasks.splice(activeIndex, 1);
        tasks.splice(overIndex, 0, removed);
        updateFullBoard(tasks, activeTaskData.status);
      }
    }

    if (
      overData?.type === "status" &&
      overData.status !== activeTaskData.status
    ) {
      const oldStatusAndId = {
        id: activeTaskData.id,
        status: activeTaskData.status,
      };
      moveTaskFromBoard(
        { ...activeTaskData, status: overData.status },
        oldStatusAndId
      );
    }

    if (
      overData?.type === "task" &&
      overData.status !== activeTaskData.status
    ) {
      const oldStatusAndId = {
        id: activeTaskData.id,
        status: activeTaskData.status,
      };
      moveTaskFromBoard(
        { ...activeTaskData, status: overData.status },
        oldStatusAndId
      );
    }
  };

  return (
    <main className="h-screen w-screen flex flex-col items-start md:p-24">
      <h1 className="text-3xl font-bold mb-6">Kanban Board</h1>
      <div className="flex md:flex-row justify-center items-start gap-4 w-full max-w-6xl p-4">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {boardsList.map((status) => (
            <StatusBoard
              key={status}
              tasks={boards[status]}
              ownStatus={status}
            />
          ))}
          <DragOverlay>
            {activeTask ? (
              <TaskComponent
                task={activeTask}
                reOrder={() => {}}
                isDragOverlay={true}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}

export default App;
