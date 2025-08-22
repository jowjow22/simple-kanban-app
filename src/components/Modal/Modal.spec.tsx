import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Modal } from "./Modal";
import "@testing-library/jest-dom";

vi.mock("@heroicons/react/16/solid", () => ({
  XMarkIcon: () => <div data-testid="x-mark-icon">✗</div>,
}));

vi.mock("../Button/Button", () => ({
  Button: ({
    children,
    onClick,
    variant,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
  }) => (
    <button
      onClick={onClick}
      data-testid="button"
      data-variant={variant || null}
    >
      {children}
    </button>
  ),
}));

describe("Modal Component", () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    title: "Test Modal",
    children: <div data-testid="modal-content">Modal Content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render modal when open is true", () => {
    render(<Modal {...defaultProps} />);
    const modalContent = screen.getByTestId("modal-content");
    expect(modalContent).toBeInTheDocument();
  });

  it("should not render modal when open is false", () => {
    render(<Modal {...defaultProps} open={false} />);
    const modalContent = screen.queryByTestId("modal-content");
    expect(modalContent).not.toBeInTheDocument();
  });

  it("should display provided title", () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
  });

  it("should call onConfirm when confirm button is clicked", () => {
    render(<Modal {...defaultProps} />);
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when cancel button is clicked", () => {
    render(<Modal {...defaultProps} />);
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should set body overflow to hidden when modal is open", () => {
    const originalOverflow = document.body.style.overflow;
    render(<Modal {...defaultProps} />);
    expect(document.body.style.overflow).toBe("hidden");
    document.body.style.overflow = originalOverflow;
  });

  it("should render all components together", () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-content")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByTestId("x-mark-icon")).toBeInTheDocument();
  });
});
