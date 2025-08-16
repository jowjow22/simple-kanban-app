import { useEffect, useRef, useState } from "react";

interface IEditableTextProps {
  initialText: string;
  save: (text: string) => void;
}

export const EditableText = ({ initialText, save }: IEditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (inputRef.current?.value) {
      save(inputRef.current.value);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input type="text" ref={inputRef} onBlur={handleSave} />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div
          onClick={() => {
            setIsEditing(true);
          }}
          aria-hidden="true"
        >
          {initialText}
        </div>
      )}
    </div>
  );
};
