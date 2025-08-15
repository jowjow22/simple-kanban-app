import { StatusBoard } from "./components/StatusContainer/StatusContainer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Status } from "./models/Status";
import useBoardsStore from "./store/boards";
import { useMemo } from "react";

function App() {
  const boards = useBoardsStore((state) => state.boards);
  const moveTaskFromBoard = useBoardsStore((state) => state.moveTaskFromBoard);
  const updateFullBoard = useBoardsStore((state) => state.updateFullBoard);

  const boardsList = useMemo(() => Object.keys(boards) as Status[], [boards]);

  return (
    <main className="h-screen w-screen flex flex-row gap-x-10">
      <DndProvider backend={HTML5Backend}>
        {boardsList.map((status) => (
          <StatusBoard
            key={status}
            tasks={boards[status]}
            ownStatus={status}
            updateOwnTasks={(task, oldStatusAndId) => {
              moveTaskFromBoard(task, oldStatusAndId);
            }}
            updateOrdering={(tasks) => {
              updateFullBoard(tasks, status);
            }}
          />
        ))}
      </DndProvider>
    </main>
  );
}

export default App;
