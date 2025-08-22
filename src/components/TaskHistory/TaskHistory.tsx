import React from "react";
import useTaskHistoryStore from "../../store/taskHistory";
import type { TaskChange } from "../../models/TaskHistory";
import { Modal } from "../Modal/Modal";

interface TaskHistoryProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInHours * 60);
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

const getChangeTypeColor = (type: string): string => {
  switch (type) {
    case "created":
      return "text-green-600 bg-green-100";
    case "updated":
      return "text-blue-600 bg-blue-100";
    case "moved":
      return "text-purple-600 bg-purple-100";
    case "deleted":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const TaskHistory: React.FC<TaskHistoryProps> = ({
  taskId,
  isOpen,
  onClose,
}) => {
  const clearTaskHistory = useTaskHistoryStore(
    (state) => state.clearTaskHistory
  );

  const taskHistory = useTaskHistoryStore((state) => state.histories[taskId]);
  const changes = taskHistory?.changes || [];

  const handleClear = () => {
    clearTaskHistory(taskId);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      onConfirm={handleClear}
      title="Task History"
      confirmButtonText="Clear"
      cancelButtonText="Close"
    >
      <div className="bg-white rounded-lg w-full overflow-hidden">
        <div className="p-4 max-h-80 overflow-y-auto">
          {changes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No history available
            </p>
          ) : (
            <div className="space-y-3">
              {changes.map((change: TaskChange) => (
                <div
                  key={change.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeTypeColor(
                      change.type
                    )}`}
                  >
                    {change.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 break-words">
                      {change.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(change.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
