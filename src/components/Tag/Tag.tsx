import { cva } from "class-variance-authority";
import { Status } from "../../models/Status";

const tagVariants = cva("text-sm font-medium px-2.5 py-0.5 rounded", {
  variants: {
    color: {
      [Status.todo]: "bg-cyan-500 text-white",
      [Status.inProgress]: "bg-amber-500 text-white",
      [Status.done]: "bg-emerald-500 text-white",
    },
  },
});

export const Tag = ({
  status,
  children,
}: {
  status: Status;
  children: React.ReactNode;
}) => {
  return <div className={tagVariants({ color: status })}>{children}</div>;
};
