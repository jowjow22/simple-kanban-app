import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EditableText } from "./EditableText";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";

vi.mock("@heroicons/react/16/solid", () => ({
  CheckIcon: () => <div data-testid="check-icon">✓</div>,
  XMarkIcon: () => <div data-testid="x-mark-icon">✗</div>,
}));

interface IEditableTextProps {
  initialText: string;
  textStyle?: string;
  save: (text: string) => void;
  textArea?: boolean;
}

describe("EditableText Component", () => {
  const mockSave = vi.fn();

  const defaultProps: IEditableTextProps = {
    initialText: "Test Text",
    save: mockSave,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render initial text in display mode", () => {
      render(<EditableText {...defaultProps} />);
      expect(screen.getByText("Test Text")).toBeInTheDocument();
    });

    it("should render as input when clicked", () => {
      render(<EditableText {...defaultProps} />);
      fireEvent.click(screen.getByText("Test Text"));
      expect(screen.getByDisplayValue("Test Text")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Text").tagName).toBe("INPUT");
    });

    it("should render as textarea when textArea prop is true", () => {
      render(<EditableText {...defaultProps} textArea />);
      fireEvent.click(screen.getByText("Test Text"));
      expect(screen.getByDisplayValue("Test Text")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Text").tagName).toBe("TEXTAREA");
    });
  });

  describe("Edit Mode", () => {
    it("should enter edit mode when text is clicked", () => {
      render(<EditableText {...defaultProps} />);
      fireEvent.click(screen.getByText("Test Text"));
      expect(screen.getByDisplayValue("Test Text")).toBeInTheDocument();
      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
      expect(screen.getByTestId("x-mark-icon")).toBeInTheDocument();
    });

    it("should focus input when entering edit mode", async () => {
      render(<EditableText {...defaultProps} />);
      fireEvent.click(screen.getByText("Test Text"));

      const input = screen.getByDisplayValue("Test Text");
      await waitFor(() => {
        expect(input).toHaveFocus();
      });
    });

    it("should apply correct main container styles for input mode", () => {
      render(<EditableText {...defaultProps} />);
      fireEvent.click(screen.getByText("Test Text"));

      // The main container (parent of input and button container)
      const input = screen.getByDisplayValue("Test Text");
      const mainContainer = input.parentElement;
      expect(mainContainer).toHaveClass("flex", "flex-row", "items-center");
    });

    it("should apply correct main container styles for textarea mode", () => {
      render(<EditableText {...defaultProps} textArea />);
      fireEvent.click(screen.getByText("Test Text"));

      // The main container (parent of textarea and button container)
      const textarea = screen.getByDisplayValue("Test Text");
      const mainContainer = textarea.parentElement;
      expect(mainContainer).toHaveClass("flex", "flex-col", "items-end");
    });
  });

  describe("Save Functionality", () => {
    it("should save changes when check button is clicked", () => {
      render(<EditableText {...defaultProps} />);
      fireEvent.click(screen.getByText("Test Text"));

      const input = screen.getByDisplayValue("Test Text");
      fireEvent.change(input, { target: { value: "Updated Text" } });

      const checkButton = screen.getByTestId("check-icon").closest("button");
      if (checkButton) {
        fireEvent.click(checkButton);
        expect(mockSave).toHaveBeenCalledWith("Updated Text");
      }
    });

    it("should save changes when input loses focus", () => {
      render(<EditableText {...defaultProps} />);
      fireEvent.click(screen.getByText("Test Text"));

      const input = screen.getByDisplayValue("Test Text");
      fireEvent.change(input, { target: { value: "Blurred Text" } });
      fireEvent.blur(input);

      expect(mockSave).toHaveBeenCalledWith("Blurred Text");
    });

    it("should not save when value is empty", () => {
      render(<EditableText {...defaultProps} />);
      fireEvent.click(screen.getByText("Test Text"));

      const input = screen.getByDisplayValue("Test Text");
      fireEvent.change(input, { target: { value: "" } });

      const checkButton = screen.getByTestId("check-icon").closest("button");
      if (checkButton) {
        fireEvent.click(checkButton);
        expect(mockSave).not.toHaveBeenCalled();
      }
    });
  });

  describe("Cancel Functionality", () => {
    it("should cancel changes when X button is clicked", () => {
      render(<EditableText {...defaultProps} />);
      fireEvent.click(screen.getByText("Test Text"));

      const input = screen.getByDisplayValue("Test Text");
      fireEvent.change(input, { target: { value: "Cancelled Text" } });

      const cancelButton = screen.getByTestId("x-mark-icon").closest("button");
      if (cancelButton) {
        fireEvent.click(cancelButton);
        expect(mockSave).not.toHaveBeenCalled();
        expect(screen.getByText("Test Text")).toBeInTheDocument();
      }
    });

    it("should exit edit mode when cancelled", () => {
      render(<EditableText {...defaultProps} />);
      fireEvent.click(screen.getByText("Test Text"));

      const cancelButton = screen.getByTestId("x-mark-icon").closest("button");
      if (cancelButton) {
        fireEvent.click(cancelButton);
        expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
        expect(screen.queryByTestId("x-mark-icon")).not.toBeInTheDocument();
      }
    });
  });
});
