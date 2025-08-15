import { StatusContainer } from "./components/StatusContainer/StatusContainer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Status } from "./models/Status";
import useBoardsStore from "./store/boards";
function App() {
  const boards = useBoardsStore((state) => state.boards);
  const moveTaskFromBoard = useBoardsStore((state) => state.moveTaskFromBoard);
  const updateFullBoard = useBoardsStore((state) => state.updateFullBoard);
  return (
    <main className="h-screen w-screen flex flex-row gap-x-10">
      <DndProvider backend={HTML5Backend}>
        <StatusContainer
          tasks={boards[Status.todo]}
          ownStatus={Status.todo}
          updateOwnTasks={(task, oldStatusAndId) => {
            moveTaskFromBoard(task, oldStatusAndId);
          }}
          updateOrdering={(tasks) => {
            updateFullBoard(tasks, Status.todo);
          }}
        />
        <StatusContainer
          tasks={boards[Status.inProgress]}
          ownStatus={Status.inProgress}
          updateOwnTasks={(task, oldStatusAndId) => {
            moveTaskFromBoard(task, oldStatusAndId);
          }}
          updateOrdering={(tasks) => {
            updateFullBoard(tasks, Status.inProgress);
          }}
        />
      </DndProvider>
    </main>
  );
}

export default App;
