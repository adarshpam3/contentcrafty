import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ContentCardProps {
  title: string;
  description: string;
  badge?: string;
  features: {
    label: string;
    value: string;
  }[];
  buttonText: string;
  onClick: () => void;
  recommended?: boolean;
}

export function ContentCard({
  title,
  description,
  badge,
  features,
  buttonText,
  onClick,
  recommended,
}: ContentCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
      recommended && "border-primary border-2"
    )}>
      {recommended && (
        <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-bl-lg text-sm">
          Recommended
        </div>
      )}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          {badge && (
            <Badge variant="secondary" className="mb-2">
              {badge}
            </Badge>
          )}
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>

        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-500">{feature.label}</span>
              <span className="font-medium">{feature.value}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={onClick}
          className="w-full"
          variant={recommended ? "default" : "outline"}
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );
}