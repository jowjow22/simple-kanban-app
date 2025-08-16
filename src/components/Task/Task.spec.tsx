import { render, screen } from "@testing-library/react";
import { DndContext } from "@dnd-kit/core";
import { Task } from "./Task";
import { vi, describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { Status } from "../../models/Status";

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

interface TaskProps {
  id: number;
  title: string;
  index: number;
  status: Status;
  reOrder: (dragIndex: number, hoverIndex: number) => void;
}

const renderTaskWithDnd = (props: TaskProps) => {
  return render(
    <DndContext>
      <Task {...props} />
    </DndContext>
  );
};

describe("Task Component", () => {
  const defaultProps: TaskProps = {
    id: 1,
    title: "Test Task",
    index: 0,
    status: Status.todo,
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

    it("should render with provided props", () => {
      const customProps = {
        ...defaultProps,
        id: 2,
        title: "Custom Task",
        index: 1,
      };
      renderTaskWithDnd(customProps);
      expect(screen.getByText("Custom Task")).toBeInTheDocument();
    });
  });

  describe("Drag and Drop", () => {
    it("should be draggable", () => {
      renderTaskWithDnd(defaultProps);
      const taskElement = screen.getByText("Test Task").closest("article");
      expect(taskElement).toHaveAttribute("data-dnd-id");
    });

    it("should have draggable attributes", () => {
      renderTaskWithDnd(defaultProps);
      const taskElement = screen.getByText("Test Task").closest("article");
      expect(taskElement).toHaveAttribute("aria-describedby");
    });
  });
});
