
import { cn } from "@/lib/utils";

interface NeuronTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}

export function NeuronTextArea({
  value,
  onChange,
  placeholder,
  className,
  ...props
}: NeuronTextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
