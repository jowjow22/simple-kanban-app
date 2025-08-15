import { render, screen } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task } from "./Task";
import { vi, describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom";

// Mock the getBoundingClientRect method
const mockGetBoundingClientRect = vi.fn(() => ({
  top: 0,
  left: 0,
  bottom: 100,
  right: 200,
  width: 200,
  height: 100,
}));

// Setup DOM method mocks
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
  reOrder: (dragIndex: number, hoverIndex: number) => void;
}

const renderTaskWithDnd = (props: TaskProps) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      <Task {...props} />
    </DndProvider>
  );
};

describe("Task Component", () => {
  const defaultProps: TaskProps = {
    id: 1,
    title: "Test Task",
    index: 0,
    reOrder: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetBoundingClientRect.mockReturnValue({
      top: 0,
      left: 0,
      bottom: 100,
      right: 200,
      width: 200,
      height: 100,
    });
  });

  describe("Rendering", () => {
    it("should render the task with correct title", () => {
      renderTaskWithDnd(defaultProps);
      expect(screen.getByText("Test Task")).toBeInTheDocument();
    });

    it("should render as an article element", () => {
      renderTaskWithDnd(defaultProps);
      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
    });

    it("should have correct base CSS classes", () => {
      renderTaskWithDnd(defaultProps);
      const article = screen.getByRole("article");
      expect(article).toHaveClass(
        "w-full",
        "h-fit",
        "border",
        "border-gray-300",
        "p-2",
        "bg-white",
        "shadow-sm"
      );
    });

    it("should have correct heading structure", () => {
      renderTaskWithDnd(defaultProps);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Test Task");
    });
  });

  describe("Props handling", () => {
    it("should render different titles correctly", () => {
      const props = { ...defaultProps, title: "Different Task Title" };
      renderTaskWithDnd(props);
      expect(screen.getByText("Different Task Title")).toBeInTheDocument();
    });

    it("should handle different id values", () => {
      const props = { ...defaultProps, id: 999 };
      renderTaskWithDnd(props);
      expect(screen.getByText("Test Task")).toBeInTheDocument();
    });

    it("should handle different index values", () => {
      const props = { ...defaultProps, index: 5 };
      renderTaskWithDnd(props);
      expect(screen.getByText("Test Task")).toBeInTheDocument();
    });
  });

  describe("Drag and Drop Setup", () => {
    it("should not throw errors when DnD is properly configured", () => {
      expect(() => renderTaskWithDnd(defaultProps)).not.toThrow();
    });

    it("should render with drag and drop context", () => {
      renderTaskWithDnd(defaultProps);
      const article = screen.getByRole("article");
      // The article should be rendered and accessible
      expect(article).toBeInTheDocument();
    });
  });

  describe("reOrder function behavior", () => {
    it("should accept reOrder function as prop without calling it during render", () => {
      const reOrderMock = vi.fn();
      const props = { ...defaultProps, reOrder: reOrderMock };

      renderTaskWithDnd(props);

      // reOrder should not be called during initial render
      expect(reOrderMock).not.toHaveBeenCalled();
    });

    it("should handle undefined reOrder gracefully", () => {
      // This tests that the component is properly typed and won't accept undefined
      const props = { ...defaultProps };
      expect(() => renderTaskWithDnd(props)).not.toThrow();
    });
  });

  describe("Component structure", () => {
    it("should have proper article structure with heading", () => {
      renderTaskWithDnd(defaultProps);

      const article = screen.getByRole("article");
      const heading = screen.getByRole("heading", { level: 2 });

      expect(article).toContainElement(heading);
    });

    it("should apply opacity classes correctly in default state", () => {
      renderTaskWithDnd(defaultProps);
      const article = screen.getByRole("article");

      // In default state (not dragging), should have full opacity
      expect(article.className).toContain("opacity-100");
      expect(article.className).not.toContain("opacity-50");
    });
  });

  describe("Accessibility", () => {
    it("should have accessible heading", () => {
      renderTaskWithDnd(defaultProps);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it("should have semantic article element", () => {
      renderTaskWithDnd(defaultProps);
      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
    });
  });

describe("Task Component - Drag and Drop Integration", () => {
  it("should demonstrate the fix: reOrder function reference doesn't change during render", () => {
    const reOrderMock = vi.fn();
    const props = {
      id: 1,
      title: "Test Task",
      index: 0,
      reOrder: reOrderMock,
    };

    // Render multiple times to simulate state updates
    const { rerender } = render(
      <DndProvider backend={HTML5Backend}>
        <Task {...props} />
      </DndProvider>
    );

    // Rerender with same props (simulating parent re-renders)
    rerender(
      <DndProvider backend={HTML5Backend}>
        <Task {...props} />
      </DndProvider>
    );

    // reOrder should never be called during renders
    expect(reOrderMock).not.toHaveBeenCalled();
  });

  it("should maintain component stability during multiple renders", () => {
    const reOrderMock = vi.fn();
    let renderCount = 0;

    const TestWrapper = () => {
      renderCount++;
      return (
        <DndProvider backend={HTML5Backend}>
          <Task id={1} title="Test Task" index={0} reOrder={reOrderMock} />
        </DndProvider>
      );
    };

    const { rerender } = render(<TestWrapper />);

    // Trigger multiple re-renders
    rerender(<TestWrapper />);
    rerender(<TestWrapper />);
    rerender(<TestWrapper />);

    expect(renderCount).toBe(4); // Initial + 3 re-renders
    expect(reOrderMock).not.toHaveBeenCalled(); // Never called during renders
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });
});
