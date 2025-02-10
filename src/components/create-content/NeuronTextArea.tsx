
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface NeuronTextAreaProps {
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
    <Textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "min-h-[200px] w-full p-4 text-sm font-mono",
        className
      )}
      {...props}
    />
  );
}
