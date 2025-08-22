import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";

describe("Button Component", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render button with children", () => {
      render(<Button>Click me</Button>);
      expect(
        screen.getByRole("button", { name: "Click me" })
      ).toBeInTheDocument();
    });

    it("should render button with default props", () => {
      render(<Button>Default Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded", "p-2", "text-sm");
    });

    it("should have type button by default", () => {
      render(<Button>Type Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });
  });

  describe("Size Variants", () => {
    it("should apply small size classes", () => {
      render(<Button size="small">Small Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-xs", "p-1");
    });

    it("should apply medium size classes (default)", () => {
      render(<Button size="medium">Medium Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-sm", "p-2");
    });

    it("should apply large size classes", () => {
      render(<Button size="large">Large Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-lg", "p-3");
    });

    it("should default to medium size when no size provided", () => {
      render(<Button>No Size Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-sm", "p-2");
    });
  });

  describe("Variant Styles", () => {
    it("should apply solid variant classes (default)", () => {
      render(<Button variant="solid">Solid Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "bg-cyan-500",
        "text-white",
        "hover:bg-cyan-600",
        "active:bg-cyan-700"
      );
    });

    it("should apply danger variant classes", () => {
      render(<Button variant="danger">Danger Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "bg-red-500",
        "text-white",
        "hover:bg-red-600",
        "active:bg-red-700"
      );
    });

    it("should apply outline variant classes", () => {
      render(<Button variant="outline">Outline Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border", "border-cyan-500", "text-blue-500");
    });

    it("should apply icon variant classes", () => {
      render(<Button variant="icon">Icon Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-transparent", "p-0", "text-black");
    });

    it("should default to solid variant when no variant provided", () => {
      render(<Button>No Variant Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "bg-cyan-500",
        "text-white",
        "hover:bg-cyan-600",
        "active:bg-cyan-700"
      );
    });
  });

  describe("Disabled State", () => {
    it("should apply disabled classes when disabled", () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("opacity-50", "cursor-not-allowed");
      expect(button).toBeDisabled();
    });

    it("should not apply disabled classes when not disabled", () => {
      render(<Button disabled={false}>Enabled Button</Button>);
      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("opacity-50", "cursor-not-allowed");
      expect(button).not.toBeDisabled();
    });

    it("should not call onClick when disabled", () => {
      render(
        <Button disabled onClick={mockOnClick}>
          Disabled Click
        </Button>
      );
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe("Event Handling", () => {
    it("should call onClick when clicked", () => {
      render(<Button onClick={mockOnClick}>Clickable Button</Button>);
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should pass event to onClick handler", () => {
      render(<Button onClick={mockOnClick}>Event Button</Button>);
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe("HTML Attributes", () => {
    it("should pass through HTML button attributes", () => {
      render(
        <Button
          id="test-button"
          className="custom-class"
          title="Test Title"
          aria-label="Test Label"
        >
          Attributes Button
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("id", "test-button");
      expect(button).toHaveAttribute("title", "Test Title");
      expect(button).toHaveAttribute("aria-label", "Test Label");
      expect(button).toHaveClass("custom-class");
    });

    it("should allow type override", () => {
      render(<Button type="submit">Submit Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should handle form attribute", () => {
      render(<Button form="test-form">Form Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("form", "test-form");
    });
  });

  describe("Combined Props", () => {
    it("should combine size and variant classes correctly", () => {
      render(
        <Button size="large" variant="danger">
          Large Danger Button
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Large Danger Button");
    });

    it("should combine all props correctly", () => {
      render(
        <Button
          size="small"
          variant="outline"
          disabled
          onClick={mockOnClick}
          className="extra-class"
        >
          Combined Props Button
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("extra-class");
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent("Combined Props Button");
    });
  });

  describe("Accessibility", () => {
    it("should be focusable when not disabled", () => {
      render(<Button>Focusable Button</Button>);
      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });

    it("should support keyboard navigation", () => {
      render(<Button onClick={mockOnClick}>Keyboard Button</Button>);
      const button = screen.getByRole("button");
      button.focus();
      fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
      fireEvent.keyUp(button, { key: "Enter", code: "Enter" });
    });
  });

  describe("Children Content", () => {
    it("should render text children", () => {
      render(<Button>Text Content</Button>);
      expect(screen.getByText("Text Content")).toBeInTheDocument();
    });

    it("should render JSX children", () => {
      render(
        <Button>
          <span data-testid="icon">🚀</span>
          <span>Rocket Button</span>
        </Button>
      );
      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByText("Rocket Button")).toBeInTheDocument();
    });

    it("should render no children", () => {
      render(<Button />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });
  });

  describe("Class Composition", () => {
    it("should maintain base classes with custom classes", () => {
      render(<Button className="my-custom-class">Custom Class Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("my-custom-class");
      expect(button).toHaveTextContent("Custom Class Button");
    });

    it("should handle undefined className", () => {
      render(<Button className={undefined}>Undefined Class Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Undefined Class Button");
    });
  });
});
