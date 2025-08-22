import { render, screen, fireEvent } from "@testing-library/react";
import { DndContext } from "@dnd-kit/core";
import { StatusBoard } from "./StatusContainer";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { Status } from "../../models/Status";
import type { Task } from "../../models/Task";

const mockAddTask = vi.fn();

vi.mock("../../store/boards", () => ({
  default: vi.fn((selector) => {
    const store = {
      addTask: mockAddTask,
      updateTask: vi.fn(),
      removeTask: vi.fn(),
      boards: {},
      moveTaskFromBoard: vi.fn(),
      updateFullBoard: vi.fn(),
    };
    return selector ? selector(store) : store;
  }),
}));

vi.mock("./components/TasksList", () => ({
  TasksList: ({ tasks }: { tasks: Task[] }) => (
    <div data-testid="tasks-list">
      {tasks.map((task) => (
        <div key={task.id} data-testid="task-item">
          {task.title}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../Tag/Tag", () => ({
  Tag: ({ children, status }: { children: React.ReactNode; status: Status }) => (
    <div data-testid="tag" data-status={status}>
      {children}
    </div>
  ),
}));

vi.mock("../TaskCreationForm/TaskCreationForm", () => ({
  TaskCreationForm: ({ 
    status, 
    onCreate, 
    open, 
    onClose 
  }: {
    status: Status;
    onCreate: (task: Omit<Task, "id">, status: Status) => void;
    open: boolean;
    onClose: () => void;
  }) => (
    open ? (
      <div data-testid="task-creation-form" data-status={status}>
        <button onClick={onClose} data-testid="close-form">Close</button>
        <button 
          onClick={() => onCreate({ title: "New Task", description: "Description", status }, status)}
          data-testid="create-task"
        >
          Create Task
        </button>
      </div>
    ) : null
  ),
}));

vi.mock("@heroicons/react/16/solid", () => ({
  PlusCircleIcon: () => <div data-testid="plus-icon">+</div>,
}));

const mockTasks: Task[] = [
  { 
    id: "1", 
    title: "Task 1", 
    description: "Description 1",
    status: Status.todo 
  },
  { 
    id: "2", 
    title: "Task 2", 
    description: "Description 2", 
    status: Status.todo 
  },
];

interface IStatusBoardProps {
  tasks: Task[];
  ownStatus: Status;
}

const renderStatusBoardWithDnd = (props: IStatusBoardProps) => {
  return render(
    <DndContext>
      <StatusBoard {...props} />
    </DndContext>
  );
};

describe("StatusBoard Component", () => {
  const defaultProps: IStatusBoardProps = {
    tasks: mockTasks,
    ownStatus: Status.todo,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render status board with title", () => {
      renderStatusBoardWithDnd(defaultProps);
      expect(screen.getByText("TODO")).toBeInTheDocument();
    });

    it("should render task count in tag", () => {
      renderStatusBoardWithDnd(defaultProps);
      const tag = screen.getByTestId("tag");
      expect(tag).toHaveTextContent("2");
      expect(tag).toHaveAttribute("data-status", Status.todo);
    });

    it("should render TasksList component", () => {
      renderStatusBoardWithDnd(defaultProps);
      expect(screen.getByTestId("tasks-list")).toBeInTheDocument();
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });

    it("should render plus icon button", () => {
      renderStatusBoardWithDnd(defaultProps);
      expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
    });

    it("should apply correct styling for different statuses", () => {
      const inProgressProps = {
        tasks: [],
        ownStatus: Status.inProgress,
      };
      renderStatusBoardWithDnd(inProgressProps);
      expect(screen.getByText("IN PROGRESS")).toBeInTheDocument();
    });

    it("should render with empty tasks array", () => {
      const emptyProps = {
        tasks: [],
        ownStatus: Status.done,
      };
      renderStatusBoardWithDnd(emptyProps);
      expect(screen.getByText("DONE")).toBeInTheDocument();
      const tag = screen.getByTestId("tag");
      expect(tag).toHaveTextContent("0");
    });
  });

  describe("Drag and Drop", () => {
    it("should be droppable", () => {
      renderStatusBoardWithDnd(defaultProps);
      const statusContainer = screen.getByText("TODO").closest("div");
      expect(statusContainer).toBeInTheDocument();
    });

    it("should have correct droppable id", () => {
      renderStatusBoardWithDnd(defaultProps);
      const container = screen.getByText("TODO").closest("div");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Task Creation", () => {
    it("should open task creation form when plus button is clicked", () => {
      renderStatusBoardWithDnd(defaultProps);
      const plusButton = screen.getByTestId("plus-icon").closest("button");
      
      expect(screen.queryByTestId("task-creation-form")).not.toBeInTheDocument();
      
      if (plusButton) {
        fireEvent.click(plusButton);
        expect(screen.getByTestId("task-creation-form")).toBeInTheDocument();
      }
    });

    it("should close task creation form when close button is clicked", () => {
      renderStatusBoardWithDnd(defaultProps);
      const plusButton = screen.getByTestId("plus-icon").closest("button");
      
      if (plusButton) {
        fireEvent.click(plusButton);
        expect(screen.getByTestId("task-creation-form")).toBeInTheDocument();
        
        const closeButton = screen.getByTestId("close-form");
        fireEvent.click(closeButton);
        expect(screen.queryByTestId("task-creation-form")).not.toBeInTheDocument();
      }
    });

    it("should call addTask when creating a new task", () => {
      renderStatusBoardWithDnd(defaultProps);
      const plusButton = screen.getByTestId("plus-icon").closest("button");
      
      if (plusButton) {
        fireEvent.click(plusButton);
        const createButton = screen.getByTestId("create-task");
        fireEvent.click(createButton);
        
        expect(mockAddTask).toHaveBeenCalledWith(
          { title: "New Task", description: "Description", status: Status.todo },
          Status.todo
        );
      }
    });
  });

  describe("Component Structure", () => {
    it("should have proper header structure", () => {
      renderStatusBoardWithDnd(defaultProps);
      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("should have main container with proper classes", () => {
      renderStatusBoardWithDnd(defaultProps);
      const container = screen.getByText("TODO").closest("div");
      expect(container).toHaveClass("w-92", "h-fit", "rounded-lg");
    });

    it("should have tasks container", () => {
      const { container } = renderStatusBoardWithDnd(defaultProps);
      const tasksContainer = container.querySelector(".p-4.space-y-2.min-h-30");
      expect(tasksContainer).toBeInTheDocument();
    });
  });

  describe("Status Variants", () => {
    it("should render TODO status correctly", () => {
      const todoProps = { tasks: [], ownStatus: Status.todo };
      renderStatusBoardWithDnd(todoProps);
      expect(screen.getByText("TODO")).toBeInTheDocument();
    });

    it("should render IN PROGRESS status correctly", () => {
      const inProgressProps = { tasks: [], ownStatus: Status.inProgress };
      renderStatusBoardWithDnd(inProgressProps);
      expect(screen.getByText("IN PROGRESS")).toBeInTheDocument();
    });

    it("should render DONE status correctly", () => {
      const doneProps = { tasks: [], ownStatus: Status.done };
      renderStatusBoardWithDnd(doneProps);
      expect(screen.getByText("DONE")).toBeInTheDocument();
    });
  });
});
