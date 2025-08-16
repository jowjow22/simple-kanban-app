import { render, screen } from "@testing-library/react";
import { DndContext } from "@dnd-kit/core";
import { StatusBoard } from "./StatusContainer";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { Status } from "../../models/Status";
import type { Task } from "../../models/Task";

const mockTasks: Task[] = [
  { id: 1, title: "Task 1", status: Status.todo },
  { id: 2, title: "Task 2", status: Status.todo },
];

describe("StatusBoard Component", () => {
  const defaultProps = {
    tasks: mockTasks,
    ownStatus: Status.todo,
  };

  it("should render status board with title", () => {
    render(
      <DndContext>
        <StatusBoard {...defaultProps} />
      </DndContext>
    );

    expect(screen.getByText("TODO")).toBeInTheDocument();
  });

  it("should render all tasks", () => {
    render(
      <DndContext>
        <StatusBoard {...defaultProps} />
      </DndContext>
    );

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("should be droppable", () => {
    render(
      <DndContext>
        <StatusBoard {...defaultProps} />
      </DndContext>
    );

    const statusContainer = screen.getByText("TODO").closest("div");
    expect(statusContainer).toBeDefined();
  });
});
