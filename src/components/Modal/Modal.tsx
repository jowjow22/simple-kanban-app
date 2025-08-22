import { XMarkIcon } from "@heroicons/react/16/solid";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button/Button";

export const Modal = ({
  open,
  children,
  title,
  onClose,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
}: {
  open: boolean;
  children: React.ReactNode;
  title?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmButtonText: string;
  cancelButtonText: string;
}) => {
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;

      document.body.style.overflow = "hidden";

      const preventTouchMove = (e: TouchEvent) => {
        e.preventDefault();
      };

      document.addEventListener("touchmove", preventTouchMove, {
        passive: false,
      });

      return () => {
        document.body.style.overflow = originalOverflow;
        document.removeEventListener("touchmove", preventTouchMove);
      };
    }
  }, [open]);

  return (
    open &&
    createPortal(
      <dialog
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        className="fixed top-0 h-screen w-screen bg-slate-800/50 backdrop-blur-xs flex items-center justify-center z-50 overflow-hidden p-4"
      >
        <article className="w-full max-w-lg max-h-full bg-white p-4 rounded shadow flex flex-col gap-4 mx-auto">
          <header className="flex flex-row items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button onClick={onClose} variant="outline">
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </header>
          <div className="flex-1 overflow-y-auto min-h-0">{children}</div>
          <footer className="flex flex-row gap-x-4 justify-end flex-shrink-0">
            <Button onClick={onClose} variant="danger">
              {cancelButtonText}
            </Button>
            <Button onClick={onConfirm}>{confirmButtonText}</Button>
          </footer>
        </article>
      </dialog>,
      document.body
    )
  );
};
