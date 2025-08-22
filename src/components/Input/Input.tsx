interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

interface LargeInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const inputVariants = {
  error: "border-red-500 text-red-500",
  default: "border-gray-300 text-gray-900",
};

export const Input = (props: InputProps) => {
  return (
    <>
      <input
        type="text"
        className={`border rounded p-2 ${
          props.error ? inputVariants.error : inputVariants.default
        }`}
        {...props}
      />
      {props.error && <p className="text-red-500 text-sm">{props.error}</p>}
    </>
  );
};

const Large = (props: LargeInputProps) => {
  return (
    <>
      <textarea
        className={`border rounded p-2 resize-none ${
          props.error ? inputVariants.error : inputVariants.default
        }`}
        {...props}
      />
      {props.error && <p className="text-red-500 text-sm">{props.error}</p>}
    </>
  );
};

Input.Large = Large;
