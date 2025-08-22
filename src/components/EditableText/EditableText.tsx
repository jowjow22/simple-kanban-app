import { CheckIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useEffect, useRef, useState } from "react";

interface IEditableTextProps {
  initialText: string;
  textStyle?: string;
  save: (text: string) => void;
  textArea?: boolean;
}

const editableContainerStyles = (textArea: boolean) =>
  textArea ? "flex flex-col items-end" : "flex flex-row items-center";

export const EditableText = ({
  initialText,
  save,
  textStyle,
  textArea = false,
}: IEditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      if (textArea) {
        textAreaRef.current?.focus();
      } else {
        inputRef.current?.focus();
      }
    }
  }, [isEditing, textArea]);

  const handleSave = () => {
    setIsEditing(false);
    const currentValue = textArea
      ? textAreaRef.current?.value
      : inputRef.current?.value;
    if (currentValue) {
      save(currentValue);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div className={editableContainerStyles(textArea)}>
          {textArea ? (
            <textarea
              ref={textAreaRef}
              onBlur={handleSave}
              defaultValue={initialText}
              className="border border-gray-300 p-2 rounded-sm mb-2 w-full"
            />
          ) : (
            <input
              type="text"
              ref={inputRef}
              onBlur={handleSave}
              defaultValue={initialText}
              className="border border-gray-300 pl-2 rounded-sm mr-2 w-1/2"
            />
          )}
          <div className="flex gap-2">
            <button
              className="bg-emerald-100 p-1 rounded-sm hover:bg-emerald-200 transition-colors duration-200"
              onClick={handleSave}
            >
              <CheckIcon className="w-5 h-5" />
            </button>
            <button
              className="bg-red-100 p-1 rounded-sm hover:bg-red-200 transition-colors duration-200"
              onClick={handleCancel}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            setIsEditing(true);
          }}
          aria-hidden="true"
          className={textStyle}
        >
          {initialText}
        </div>
      )}
    </div>
  );
};
