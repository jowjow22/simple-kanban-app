import { useState } from "react";
import type { Task } from "../../models/Task";
import type { Status } from "../../models/Status";
import { Input } from "../Input/Input";
import { Modal } from "../Modal/Modal";

interface TaskCreationFormProps {
  onCreate: (task: Omit<Task, "id">, status: Status) => void;
  onClose: () => void;
  status: Status;
  open: boolean;
}

export const TaskCreationForm = ({
  onCreate,
  status,
  onClose,
  open,
}: TaskCreationFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");

  const handleSubmit = () => {
    if (!title) {
      setTitleError("Title is required");
      return;
    }
    setTitleError("");
    onCreate({ title, description, status }, status);
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      onConfirm={handleSubmit}
      confirmButtonText="Create Task"
      cancelButtonText="Cancel"
      title="Create New Task"
    >
      <form className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Title"
          onBlur={(e) => {
            setTitleError(e.target.value ? "" : "Title is required");
            setTitle(e.target.value);
          }}
          error={titleError}
        />
        <Input.Large
          placeholder="Description"
          onBlur={(e) => setDescription(e.target.value)}
        />
      </form>
    </Modal>
  );
};
