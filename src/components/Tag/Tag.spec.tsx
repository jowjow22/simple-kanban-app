import { render, screen } from "@testing-library/react";
import { Tag } from "./Tag";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { Status } from "../../models/Status";

describe("Tag Component", () => {
  describe("Rendering", () => {
    it("should render tag with children", () => {
      render(<Tag status={Status.todo}>5</Tag>);
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should render text children", () => {
      render(<Tag status={Status.todo}>Task Count</Tag>);
      expect(screen.getByText("Task Count")).toBeInTheDocument();
    });

    it("should render number children", () => {
      render(<Tag status={Status.todo}>{42}</Tag>);
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("should render JSX children", () => {
      render(
        <Tag status={Status.todo}>
          <span data-testid="icon">🏷️</span>
          <span>Label</span>
        </Tag>
      );
      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByText("Label")).toBeInTheDocument();
    });
  });

  describe("Base Styling", () => {
    it("should apply base tag classes", () => {
      render(<Tag status={Status.todo}>Test</Tag>);
      const tag = screen.getByText("Test");
      expect(tag).toHaveClass(
        "text-sm",
        "font-medium",
        "px-2.5",
        "py-0.5",
        "rounded"
      );
    });

    it("should be a div element", () => {
      render(<Tag status={Status.todo}>Test</Tag>);
      const tag = screen.getByText("Test");
      expect(tag.tagName).toBe("DIV");
    });
  });

  describe("Status Color Variants", () => {
    it("should apply todo status colors", () => {
      render(<Tag status={Status.todo}>Todo Tag</Tag>);
      const tag = screen.getByText("Todo Tag");
      expect(tag).toHaveClass("bg-cyan-500", "text-white");
    });

    it("should apply in progress status colors", () => {
      render(<Tag status={Status.inProgress}>In Progress Tag</Tag>);
      const tag = screen.getByText("In Progress Tag");
      expect(tag).toHaveClass("bg-amber-500", "text-white");
    });

    it("should apply done status colors", () => {
      render(<Tag status={Status.done}>Done Tag</Tag>);
      const tag = screen.getByText("Done Tag");
      expect(tag).toHaveClass("bg-emerald-500", "text-white");
    });
  });

  describe("Status Variants Consistency", () => {
    it("should maintain consistent styling across all statuses", () => {
      const { rerender } = render(<Tag status={Status.todo}>Test</Tag>);
      let tag = screen.getByText("Test");
      expect(tag).toHaveClass(
        "text-sm",
        "font-medium",
        "px-2.5",
        "py-0.5",
        "rounded"
      );

      rerender(<Tag status={Status.inProgress}>Test</Tag>);
      tag = screen.getByText("Test");
      expect(tag).toHaveClass(
        "text-sm",
        "font-medium",
        "px-2.5",
        "py-0.5",
        "rounded"
      );

      rerender(<Tag status={Status.done}>Test</Tag>);
      tag = screen.getByText("Test");
      expect(tag).toHaveClass(
        "text-sm",
        "font-medium",
        "px-2.5",
        "py-0.5",
        "rounded"
      );
    });

    it("should have white text for all status variants", () => {
      const { rerender } = render(<Tag status={Status.todo}>Test</Tag>);
      let tag = screen.getByText("Test");
      expect(tag).toHaveClass("text-white");

      rerender(<Tag status={Status.inProgress}>Test</Tag>);
      tag = screen.getByText("Test");
      expect(tag).toHaveClass("text-white");

      rerender(<Tag status={Status.done}>Test</Tag>);
      tag = screen.getByText("Test");
      expect(tag).toHaveClass("text-white");
    });
  });

  describe("Different Content Types", () => {
    it("should handle zero as children", () => {
      render(<Tag status={Status.todo}>{0}</Tag>);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should handle empty string as children", () => {
      const { container } = render(<Tag status={Status.todo}>{""}</Tag>);
      const tag = container.firstChild as HTMLElement;
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveClass(
        "text-sm",
        "font-medium",
        "px-2.5",
        "py-0.5",
        "rounded",
        "bg-cyan-500",
        "text-white"
      );
    });

    it("should handle boolean children", () => {
      render(<Tag status={Status.todo}>{true}</Tag>);
      const tag = document.querySelector(".bg-cyan-500");
      expect(tag).toBeInTheDocument();
    });

    it("should handle null children", () => {
      render(<Tag status={Status.todo}>{null}</Tag>);
      const tag = document.querySelector(".bg-cyan-500");
      expect(tag).toBeInTheDocument();
    });

    it("should handle undefined children", () => {
      render(<Tag status={Status.todo}>{undefined}</Tag>);
      const tag = document.querySelector(".bg-cyan-500");
      expect(tag).toBeInTheDocument();
    });
  });

  describe("Multiple Tags", () => {
    it("should render multiple tags with different statuses", () => {
      render(
        <div>
          <Tag status={Status.todo}>Todo: 3</Tag>
          <Tag status={Status.inProgress}>Progress: 2</Tag>
          <Tag status={Status.done}>Done: 5</Tag>
        </div>
      );

      expect(screen.getByText("Todo: 3")).toHaveClass("bg-cyan-500");
      expect(screen.getByText("Progress: 2")).toHaveClass("bg-amber-500");
      expect(screen.getByText("Done: 5")).toHaveClass("bg-emerald-500");
    });

    it("should render multiple tags with same status", () => {
      render(
        <div>
          <Tag status={Status.todo}>Tag 1</Tag>
          <Tag status={Status.todo}>Tag 2</Tag>
        </div>
      );

      const tags = screen.getAllByText(/Tag [12]/);
      expect(tags).toHaveLength(2);
      tags.forEach((tag) => {
        expect(tag).toHaveClass("bg-cyan-500", "text-white");
      });
    });
  });

  describe("Content Positioning", () => {
    it("should center content properly", () => {
      render(<Tag status={Status.todo}>Centered</Tag>);
      const tag = screen.getByText("Centered");
      expect(tag).toHaveClass("px-2.5", "py-0.5");
    });

    it("should handle long content", () => {
      const longText = "This is a very long tag content that might wrap";
      render(<Tag status={Status.todo}>{longText}</Tag>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });

  describe("Visual Hierarchy", () => {
    it("should have proper font weight for emphasis", () => {
      render(<Tag status={Status.todo}>Important</Tag>);
      const tag = screen.getByText("Important");
      expect(tag).toHaveClass("font-medium");
    });

    it("should have appropriate text size", () => {
      render(<Tag status={Status.todo}>Small Text</Tag>);
      const tag = screen.getByText("Small Text");
      expect(tag).toHaveClass("text-sm");
    });

    it("should have rounded corners for modern appearance", () => {
      render(<Tag status={Status.todo}>Rounded</Tag>);
      const tag = screen.getByText("Rounded");
      expect(tag).toHaveClass("rounded");
    });
  });

  describe("Accessibility", () => {
    it("should be readable with high contrast colors", () => {
      render(<Tag status={Status.todo}>Accessible</Tag>);
      const tag = screen.getByText("Accessible");
      expect(tag).toHaveClass("text-white");
    });

    it("should maintain semantic meaning with colors", () => {
      render(
        <div>
          <Tag status={Status.todo}>To Do</Tag>
          <Tag status={Status.inProgress}>In Progress</Tag>
          <Tag status={Status.done}>Completed</Tag>
        </div>
      );

      expect(screen.getByText("To Do")).toHaveClass("bg-cyan-500");
      expect(screen.getByText("In Progress")).toHaveClass("bg-amber-500");
      expect(screen.getByText("Completed")).toHaveClass("bg-emerald-500");
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long text content", () => {
      const veryLongText = "A".repeat(100);
      render(<Tag status={Status.todo}>{veryLongText}</Tag>);
      expect(screen.getByText(veryLongText)).toBeInTheDocument();
    });

    it("should handle special characters", () => {
      const specialText = "🎉 Special! @#$%^&*()";
      render(<Tag status={Status.todo}>{specialText}</Tag>);
      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it("should handle whitespace-only content", () => {
      const { container } = render(<Tag status={Status.todo}> </Tag>);
      const tag = container.firstChild as HTMLElement;
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveClass(
        "text-sm",
        "font-medium",
        "px-2.5",
        "py-0.5",
        "rounded",
        "bg-cyan-500",
        "text-white"
      );
    });
  });

  describe("Component Props", () => {
    it("should require status prop", () => {
      render(<Tag status={Status.todo}>Required Status</Tag>);
      expect(screen.getByText("Required Status")).toBeInTheDocument();
    });

    it("should require children prop", () => {
      render(<Tag status={Status.todo}>Required Children</Tag>);
      expect(screen.getByText("Required Children")).toBeInTheDocument();
    });
  });
});
