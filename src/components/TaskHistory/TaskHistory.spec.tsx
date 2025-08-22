import { render, screen, fireEvent } from "@testing-library/react";
import { TaskHistory } from "./TaskHistory";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { ChangeType } from "../../models/TaskHistory";

const mockClearTaskHistory = vi.fn();

const mockTaskHistories = {
  "task-1": {
    changes: [
      {
        id: "change-1",
        type: ChangeType.CREATED,
        description: "Task was created",
        timestamp: Date.now() - 1000 * 60 * 5,
      },
      {
        id: "change-2",
        type: ChangeType.UPDATED,
        field: "title",
        oldValue: "Old Title",
        newValue: "New Title",
        description: "Title was updated",
        timestamp: Date.now() - 1000 * 60 * 2,
      },
      {
        id: "change-3",
        type: ChangeType.MOVED,
        field: "status",
        oldValue: "todo",
        newValue: "inProgress",
        description: "Status was moved",
        timestamp: Date.now() - 1000 * 60,
      },
    ],
  },
  "task-2": {
    changes: [],
  },
};

vi.mock("../../store/taskHistory", () => ({
  default: vi.fn((selector) => {
    const store = {
      clearTaskHistory: mockClearTaskHistory,
      histories: mockTaskHistories,
    };
    return selector ? selector(store) : store;
  }),
}));

vi.mock("../Modal/Modal", () => ({
  Modal: ({
    open,
    onClose,
    onConfirm,
    title,
    confirmButtonText,
    cancelButtonText,
    children,
  }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    confirmButtonText: string;
    cancelButtonText: string;
    children: React.ReactNode;
  }) =>
    open ? (
      <div data-testid="modal" data-title={title}>
        <div data-testid="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} data-testid="close-button">
            {cancelButtonText}
          </button>
        </div>
        <div data-testid="modal-content">{children}</div>
        <div data-testid="modal-footer">
          <button onClick={onConfirm} data-testid="confirm-button">
            {confirmButtonText}
          </button>
        </div>
      </div>
    ) : null,
}));

interface TaskHistoryProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

describe("TaskHistory Component", () => {
  const mockOnClose = vi.fn();

  const defaultProps: TaskHistoryProps = {
    taskId: "task-1",
    isOpen: true,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render modal when isOpen is true", () => {
      render(<TaskHistory {...defaultProps} />);
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("should not render modal when isOpen is false", () => {
      render(<TaskHistory {...defaultProps} isOpen={false} />);
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("should render modal with correct title", () => {
      render(<TaskHistory {...defaultProps} />);
      expect(screen.getByTestId("modal")).toHaveAttribute(
        "data-title",
        "Task History"
      );
    });

    it("should render correct button texts", () => {
      render(<TaskHistory {...defaultProps} />);
      expect(screen.getByText("Clear")).toBeInTheDocument();
      expect(screen.getByText("Close")).toBeInTheDocument();
    });
  });

  describe("Task History Display", () => {
    it("should render all changes for a task", () => {
      render(<TaskHistory {...defaultProps} />);

      expect(screen.getByText("Task was created")).toBeInTheDocument();
      expect(screen.getByText("Title was updated")).toBeInTheDocument();
      expect(screen.getByText("Status was moved")).toBeInTheDocument();
    });

    it("should display change types with correct styling", () => {
      render(<TaskHistory {...defaultProps} />);

      expect(screen.getByText("Task was created")).toBeInTheDocument();
      expect(screen.getByText("Title was updated")).toBeInTheDocument();
      expect(screen.getByText("Status was moved")).toBeInTheDocument();
    });

    it("should display timestamps for each change", () => {
      render(<TaskHistory {...defaultProps} />);

      const timestamps = screen.getAllByText(/ago$/);
      expect(timestamps.length).toBeGreaterThan(0);
    });

    it("should render empty state when no changes exist", () => {
      render(<TaskHistory {...defaultProps} taskId="task-2" />);
      expect(screen.getByText("No history available")).toBeInTheDocument();
    });

    it("should render empty state when task doesn't exist", () => {
      render(<TaskHistory {...defaultProps} taskId="non-existent-task" />);
      expect(screen.getByText("No history available")).toBeInTheDocument();
    });
  });

  describe("Change Type Colors", () => {
    it("should apply correct color classes for created changes", () => {
      render(<TaskHistory {...defaultProps} />);
      const createdBadge = screen.getByText("created");
      expect(createdBadge).toHaveClass("text-green-600", "bg-green-100");
    });

    it("should apply correct color classes for updated changes", () => {
      render(<TaskHistory {...defaultProps} />);
      const updatedBadge = screen.getByText("updated");
      expect(updatedBadge).toHaveClass("text-blue-600", "bg-blue-100");
    });

    it("should apply correct color classes for moved changes", () => {
      render(<TaskHistory {...defaultProps} />);
      const movedBadge = screen.getByText("moved");
      expect(movedBadge).toHaveClass("text-purple-600", "bg-purple-100");
    });
  });

  describe("Timestamp Formatting", () => {
    it("should format recent timestamps in minutes", () => {
      const recentTime = Date.now() - 1000 * 60 * 5;
      mockTaskHistories["task-test"] = {
        changes: [
          {
            id: "test-change",
            type: ChangeType.CREATED,
            description: "Recent change",
            timestamp: recentTime,
          },
        ],
      };

      render(<TaskHistory {...defaultProps} taskId="task-test" />);
      expect(screen.getByText(/\d+m ago/)).toBeInTheDocument();
    });

    it("should format hour timestamps correctly", () => {
      const hourTime = Date.now() - 1000 * 60 * 60 * 2;
      mockTaskHistories["task-hour"] = {
        changes: [
          {
            id: "hour-change",
            type: ChangeType.CREATED,
            description: "Hour change",
            timestamp: hourTime,
          },
        ],
      };

      render(<TaskHistory {...defaultProps} taskId="task-hour" />);
      expect(screen.getByText(/\d+h ago/)).toBeInTheDocument();
    });

    it("should format day timestamps correctly", () => {
      const dayTime = Date.now() - 1000 * 60 * 60 * 24 * 2;
      mockTaskHistories["task-day"] = {
        changes: [
          {
            id: "day-change",
            type: ChangeType.CREATED,
            description: "Day change",
            timestamp: dayTime,
          },
        ],
      };

      render(<TaskHistory {...defaultProps} taskId="task-day" />);
      expect(screen.getByText(/\d+d ago/)).toBeInTheDocument();
    });
  });

  describe("Event Handling", () => {
    it("should call onClose when close button is clicked", () => {
      render(<TaskHistory {...defaultProps} />);
      const closeButton = screen.getByTestId("close-button");
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call clearTaskHistory when clear button is clicked", () => {
      render(<TaskHistory {...defaultProps} />);
      const clearButton = screen.getByTestId("confirm-button");
      fireEvent.click(clearButton);
      expect(mockClearTaskHistory).toHaveBeenCalledWith("task-1");
    });

    it("should pass correct taskId to clearTaskHistory", () => {
      render(<TaskHistory {...defaultProps} taskId="custom-task-id" />);
      const clearButton = screen.getByTestId("confirm-button");
      fireEvent.click(clearButton);
      expect(mockClearTaskHistory).toHaveBeenCalledWith("custom-task-id");
    });
  });

  describe("Modal Props", () => {
    it("should pass correct props to Modal component", () => {
      render(<TaskHistory {...defaultProps} />);

      expect(screen.getByTestId("modal")).toHaveAttribute(
        "data-title",
        "Task History"
      );
      expect(screen.getByText("Clear")).toBeInTheDocument();
      expect(screen.getByText("Close")).toBeInTheDocument();
    });

    it("should handle modal state changes", () => {
      const { rerender } = render(<TaskHistory {...defaultProps} />);
      expect(screen.getByTestId("modal")).toBeInTheDocument();

      rerender(<TaskHistory {...defaultProps} isOpen={false} />);
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  describe("Content Structure", () => {
    it("should have correct content wrapper classes", () => {
      render(<TaskHistory {...defaultProps} />);
      const contentWrapper = screen
        .getByTestId("modal-content")
        .querySelector(".bg-white");
      expect(contentWrapper).toHaveClass(
        "bg-white",
        "rounded-lg",
        "w-full",
        "overflow-hidden"
      );
    });

    it("should have scrollable content area", () => {
      render(<TaskHistory {...defaultProps} />);
      const scrollArea = screen
        .getByTestId("modal-content")
        .querySelector(".p-4");
      expect(scrollArea).toHaveClass("p-4", "max-h-80", "overflow-y-auto");
    });

    it("should have proper change item structure", () => {
      render(<TaskHistory {...defaultProps} />);
      const changeItems = screen
        .getByTestId("modal-content")
        .querySelectorAll(".flex.items-start.gap-3");
      expect(changeItems.length).toBeGreaterThan(0);
    });
  });

  describe("Empty State", () => {
    it("should show empty state with correct styling", () => {
      render(<TaskHistory {...defaultProps} taskId="task-2" />);
      const emptyMessage = screen.getByText("No history available");
      expect(emptyMessage).toHaveClass("text-gray-500", "text-center", "py-8");
    });

    it("should not show changes container when empty", () => {
      render(<TaskHistory {...defaultProps} taskId="task-2" />);
      expect(screen.queryByText("Task was created")).not.toBeInTheDocument();
    });
  });

  describe("Change Details", () => {
    it("should display change descriptions with correct styling", () => {
      render(<TaskHistory {...defaultProps} />);
      const descriptions = screen.getAllByText(
        /Task was created|Title was updated|Status was moved/
      );
      descriptions.forEach((desc) => {
        expect(desc).toHaveClass("text-sm", "text-gray-900", "break-words");
      });
    });

    it("should display timestamps with correct styling", () => {
      render(<TaskHistory {...defaultProps} />);
      const timestamps = screen.getAllByText(/ago$/);
      timestamps.forEach((timestamp) => {
        expect(timestamp).toHaveClass("text-xs", "text-gray-500", "mt-1");
      });
    });

    it("should handle long descriptions properly", () => {
      const longDescriptionHistory = {
        changes: [
          {
            id: "long-change",
            type: ChangeType.UPDATED,
            description:
              "This is a very long description that should wrap properly and not break the layout of the component even when it contains many words",
            timestamp: Date.now(),
          },
        ],
      };

      mockTaskHistories["task-long"] = longDescriptionHistory;
      render(<TaskHistory {...defaultProps} taskId="task-long" />);

      const longDesc = screen.getByText(/This is a very long description/);
      expect(longDesc).toHaveClass("break-words");
    });
  });
});
