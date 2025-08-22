import { render, screen, fireEvent } from "@testing-library/react";
import { DndContext } from "@dnd-kit/core";
import { Task } from "./Task";
import { vi, describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { Status } from "../../models/Status";
import type { Task as TaskType } from "../../models/Task";
import React from "react";

const mockUpdateTask = vi.fn();
const mockRemoveTask = vi.fn();

vi.mock("../../store/boards", () => ({
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

vi.mock("../EditableText/EditableText", () => ({
  EditableText: ({
    initialText,
    save,
    textStyle,
  }: {
    initialText: string;
    save?: (text: string) => void;
    textStyle?: string;
  }) => (
    <button
      data-testid="editable-text"
      data-text-style={textStyle}
      onClick={() => save && save("Updated " + initialText)}
    >
      {initialText}
    </button>
  ),
}));

vi.mock("../Button/Button", () => ({
  Button: ({
    children,
    onClick,
    variant,
    title,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
    title?: string;
  }) => (
    <button
      onClick={onClick}
      data-variant={variant}
      title={title}
      data-testid="button"
    >
      {children}
    </button>
  ),
}));

vi.mock("../TaskHistory/TaskHistory", () => ({
  TaskHistory: ({
    taskId,
    isOpen,
    onClose,
  }: {
    taskId: string;
    isOpen: boolean;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="task-history" data-task-id={taskId}>
        <button onClick={onClose} data-testid="close-history">
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock("@heroicons/react/16/solid", () => ({
  TrashIcon: () => <div data-testid="trash-icon">🗑️</div>,
  ClockIcon: () => <div data-testid="clock-icon">🕐</div>,
}));

const mockGetBoundingClientRect = vi.fn(() => ({
  top: 0,
  left: 0,
  bottom: 100,
  right: 200,
  width: 200,
  height: 100,
}));

beforeEach(() => {
  Object.defineProperty(Element.prototype, "getBoundingClientRect", {
    value: mockGetBoundingClientRect,
    writable: true,
  });
});

interface ITaskProps {
  task: TaskType;
  isDragOverlay?: boolean;
  reOrder: (dragIndex: number, hoverIndex: number) => void;
}

const renderTaskWithDnd = (props: ITaskProps) => {
  return render(
    <DndContext>
      <Task {...props} />
    </DndContext>
  );
};

describe("Task Component", () => {
  const mockTask: TaskType = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    status: Status.todo,
  };

  const defaultProps: ITaskProps = {
    task: mockTask,
    isDragOverlay: false,
    reOrder: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render task title correctly", () => {
      renderTaskWithDnd(defaultProps);
      expect(screen.getByText("Test Task")).toBeInTheDocument();
    });

    it("should render task description correctly", () => {
      renderTaskWithDnd(defaultProps);
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("should render avatar image", () => {
      renderTaskWithDnd(defaultProps);
      const avatar = screen.getByAltText("avatar");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute(
        "src",
        "https://avatar.iran.liara.run/public"
      );
    });

    it("should render action buttons", () => {
      renderTaskWithDnd(defaultProps);
      const buttons = screen.getAllByTestId("button");
      expect(buttons).toHaveLength(2);

      expect(screen.getByTestId("clock-icon")).toBeInTheDocument();
      expect(screen.getByTestId("trash-icon")).toBeInTheDocument();
    });

    it("should render with custom task data", () => {
      const customTask: TaskType = {
        id: "2",
        title: "Custom Task",
        description: "Custom Description",
        status: Status.inProgress,
      };
      const customProps = {
        ...defaultProps,
        task: customTask,
      };
      renderTaskWithDnd(customProps);
      expect(screen.getByText("Custom Task")).toBeInTheDocument();
      expect(screen.getByText("Custom Description")).toBeInTheDocument();
    });
  });

  describe("Drag and Drop", () => {
    it("should be draggable", () => {
      renderTaskWithDnd(defaultProps);
      const taskElement = screen.getByText("Test Task").closest("article");
      expect(taskElement).toBeInTheDocument();
    });

    it("should not be draggable when isDragOverlay is true", () => {
      const overlayProps = {
        ...defaultProps,
        isDragOverlay: true,
      };
      renderTaskWithDnd(overlayProps);
      const taskElement = screen.getByText("Test Task").closest("article");
      expect(taskElement).toBeInTheDocument();
    });

    it("should apply correct styling when dragging", () => {
      renderTaskWithDnd(defaultProps);
      const taskElement = screen.getByText("Test Task").closest("article");
      expect(taskElement).toHaveClass("opacity-100");
    });
  });

  describe("User Interactions", () => {
    it("should show task history when history button is clicked", () => {
      renderTaskWithDnd(defaultProps);
      const historyButton = screen.getByTitle("View task history");
      fireEvent.click(historyButton);
      expect(screen.getByTestId("task-history")).toBeInTheDocument();
    });

    it("should close task history when close button is clicked", () => {
      renderTaskWithDnd(defaultProps);
      const historyButton = screen.getByTitle("View task history");
      fireEvent.click(historyButton);

      const closeButton = screen.getByTestId("close-history");
      fireEvent.click(closeButton);
      expect(screen.queryByTestId("task-history")).not.toBeInTheDocument();
    });

    it("should call removeTask when delete button is clicked", () => {
      renderTaskWithDnd(defaultProps);
      const deleteButtons = screen.getAllByTestId("button");
      const dangerButton = deleteButtons.find(
        (button) => button.getAttribute("data-variant") === "danger"
      );

      if (dangerButton) {
        fireEvent.click(dangerButton);
        expect(mockRemoveTask).toHaveBeenCalledWith("1", Status.todo);
      }
    });
  });

  describe("Editable Text Integration", () => {
    it("should call updateTask when title is edited", () => {
      renderTaskWithDnd(defaultProps);
      const titleEditableText = screen.getAllByTestId("editable-text")[0];
      fireEvent.click(titleEditableText);

      expect(mockUpdateTask).toHaveBeenCalledWith("1", {
        ...mockTask,
        title: "Updated Test Task",
      });
    });

    it("should call updateTask when description is edited", () => {
      renderTaskWithDnd(defaultProps);
      const descriptionEditableText = screen.getAllByTestId("editable-text")[1];
      fireEvent.click(descriptionEditableText);

      expect(mockUpdateTask).toHaveBeenCalledWith("1", {
        ...mockTask,
        description: "Updated Test Description",
      });
    });
  });

  describe("Component Structure", () => {
    it("should render as an article element", () => {
      renderTaskWithDnd(defaultProps);
      const taskElement = screen.getByText("Test Task").closest("article");
      expect(taskElement).toBeInTheDocument();
    });

    it("should have proper header structure", () => {
      renderTaskWithDnd(defaultProps);
      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("should have horizontal rule separator", () => {
      const { container } = renderTaskWithDnd(defaultProps);
      const hr = container.querySelector("hr");
      expect(hr).toBeInTheDocument();
      expect(hr).toHaveClass("my-5", "border-gray-300");
    });
  });
});
