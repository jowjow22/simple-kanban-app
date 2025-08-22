import { render, screen } from "@testing-library/react";
import { DndContext } from "@dnd-kit/core";
import { TasksList } from "./TasksList";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { Status } from "../../../models/Status";
import type { Task as TaskType } from "../../../models/Task";

const mockUpdateTask = vi.fn();
const mockRemoveTask = vi.fn();

vi.mock("../../../store/boards", () => ({
  default: vi.fn((selector) => {
    const store = {
      updateTask: mockUpdateTask,
      removeTask: mockRemoveTask,
      boards: {},
      addTask: vi.fn(),
      moveTaskFromBoard: vi.fn(),
      updateFullBoard: vi.fn(),
    };
    return selector ? selector(store) : store;
  }),
}));

vi.mock("../../Task/Task", () => ({
  Task: ({ task, isDragOverlay, reOrder: _reOrder }: {
    task: TaskType;
    isDragOverlay: boolean;
    reOrder: () => void;
  }) => (
    <div 
      data-testid="task-component"
      data-task-id={task.id}
      data-drag-overlay={isDragOverlay}
    >
      <div data-testid="task-title">{task.title}</div>
      <div data-testid="task-description">{task.description}</div>
      <div data-testid="task-status">{task.status}</div>
    </div>
  ),
}));

interface ITasksListProps {
  tasks: TaskType[];
}

const renderTasksListWithDnd = (props: ITasksListProps) => {
  return render(
    <DndContext>
      <TasksList {...props} />
    </DndContext>
  );
};

describe("TasksList Component", () => {
  const mockTasks: TaskType[] = [
    {
      id: "1",
      title: "First Task",
      description: "First task description",
      status: Status.todo,
    },
    {
      id: "2",
      title: "Second Task",
      description: "Second task description",
      status: Status.inProgress,
    },
    {
      id: "3",
      title: "Third Task",
      description: "Third task description",
      status: Status.done,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render all tasks", () => {
      renderTasksListWithDnd({ tasks: mockTasks });
      
      const taskComponents = screen.getAllByTestId("task-component");
      expect(taskComponents).toHaveLength(3);
    });

    it("should render tasks with correct data", () => {
      renderTasksListWithDnd({ tasks: mockTasks });
      
      expect(screen.getByText("First Task")).toBeInTheDocument();
      expect(screen.getByText("Second Task")).toBeInTheDocument();
      expect(screen.getByText("Third Task")).toBeInTheDocument();
      
      expect(screen.getByText("First task description")).toBeInTheDocument();
      expect(screen.getByText("Second task description")).toBeInTheDocument();
      expect(screen.getByText("Third task description")).toBeInTheDocument();
    });

    it("should render tasks with correct IDs", () => {
      renderTasksListWithDnd({ tasks: mockTasks });
      
      const taskComponents = screen.getAllByTestId("task-component");
      expect(taskComponents[0]).toHaveAttribute("data-task-id", "1");
      expect(taskComponents[1]).toHaveAttribute("data-task-id", "2");
      expect(taskComponents[2]).toHaveAttribute("data-task-id", "3");
    });

    it("should render tasks with isDragOverlay set to false", () => {
      renderTasksListWithDnd({ tasks: mockTasks });
      
      const taskComponents = screen.getAllByTestId("task-component");
      taskComponents.forEach(component => {
        expect(component).toHaveAttribute("data-drag-overlay", "false");
      });
    });

    it("should render empty list when no tasks provided", () => {
      renderTasksListWithDnd({ tasks: [] });
      
      const taskComponents = screen.queryAllByTestId("task-component");
      expect(taskComponents).toHaveLength(0);
    });
  });

  describe("Task Props", () => {
    it("should pass correct props to Task components", () => {
      renderTasksListWithDnd({ tasks: [mockTasks[0]] });
      
      const taskComponent = screen.getByTestId("task-component");
      expect(taskComponent).toHaveAttribute("data-task-id", "1");
      expect(taskComponent).toHaveAttribute("data-drag-overlay", "false");
    });

    it("should provide reOrder function to each task", () => {
      renderTasksListWithDnd({ tasks: mockTasks });
      
      const taskComponents = screen.getAllByTestId("task-component");
      expect(taskComponents).toHaveLength(3);
    });
  });

  describe("Memoization", () => {
    it("should render consistently with same props", () => {
      const { rerender } = renderTasksListWithDnd({ tasks: mockTasks });
      
      const initialTaskComponents = screen.getAllByTestId("task-component");
      expect(initialTaskComponents).toHaveLength(3);
      
      rerender(
        <DndContext>
          <TasksList tasks={mockTasks} />
        </DndContext>
      );
      
      const rerenderedTaskComponents = screen.getAllByTestId("task-component");
      expect(rerenderedTaskComponents).toHaveLength(3);
    });
  });

  describe("Different Task Statuses", () => {
    it("should render tasks with different statuses", () => {
      renderTasksListWithDnd({ tasks: mockTasks });
      
      expect(screen.getByText(Status.todo)).toBeInTheDocument();
      expect(screen.getByText(Status.inProgress)).toBeInTheDocument();
      expect(screen.getByText(Status.done)).toBeInTheDocument();
    });

    it("should handle tasks with same status", () => {
      const sameStatusTasks = [
        {
          id: "1",
          title: "Todo Task 1",
          description: "Description 1",
          status: Status.todo,
        },
        {
          id: "2",
          title: "Todo Task 2",
          description: "Description 2",
          status: Status.todo,
        },
      ];
      
      renderTasksListWithDnd({ tasks: sameStatusTasks });
      
      const taskComponents = screen.getAllByTestId("task-component");
      expect(taskComponents).toHaveLength(2);
      
      const statusElements = screen.getAllByText(Status.todo);
      expect(statusElements).toHaveLength(2);
    });
  });

  describe("Key Prop", () => {
    it("should use task ID as key for each task", () => {
      renderTasksListWithDnd({ tasks: mockTasks });
      
      const taskComponents = screen.getAllByTestId("task-component");
      expect(taskComponents[0]).toHaveAttribute("data-task-id", "1");
      expect(taskComponents[1]).toHaveAttribute("data-task-id", "2");
      expect(taskComponents[2]).toHaveAttribute("data-task-id", "3");
    });
  });

  describe("Single Task", () => {
    it("should render single task correctly", () => {
      const singleTask = [mockTasks[0]];
      renderTasksListWithDnd({ tasks: singleTask });
      
      const taskComponents = screen.getAllByTestId("task-component");
      expect(taskComponents).toHaveLength(1);
      expect(screen.getByText("First Task")).toBeInTheDocument();
    });
  });

  describe("Large Number of Tasks", () => {
    it("should handle large number of tasks", () => {
      const manyTasks = Array.from({ length: 10 }, (_, index) => ({
        id: `task-${index}`,
        title: `Task ${index}`,
        description: `Description ${index}`,
        status: Status.todo,
      }));
      
      renderTasksListWithDnd({ tasks: manyTasks });
      
      const taskComponents = screen.getAllByTestId("task-component");
      expect(taskComponents).toHaveLength(10);
      
      expect(screen.getByText("Task 0")).toBeInTheDocument();
      expect(screen.getByText("Task 9")).toBeInTheDocument();
    });
  });
});
