import { StatusContainer } from "./components/StatusContainer/StatusContainer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <main className="h-screen w-screen">
      <DndProvider backend={HTML5Backend}>
        <StatusContainer />
      </DndProvider>
    </main>
  );
}

export default App;
