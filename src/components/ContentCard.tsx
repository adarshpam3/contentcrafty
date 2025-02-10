
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  title: string;
  description: string;
  badge: string;
  features: Array<{ label: string; value: string }>;
  buttonText: string;
  recommended?: boolean;
  onClick?: () => void;
}

export function ContentCard({
  title,
  description,
  badge,
  features,
  buttonText,
  recommended = false,
  onClick,
}: ContentCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all hover:shadow-lg",
        recommended && "border-purple-500 shadow-purple-100"
      )}
    >
      {recommended && (
        <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-sm">
          Recommended
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          <Badge variant="secondary">{badge}</Badge>
        </div>
        <div className="mt-6 space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-500">{feature.label}</span>
              <span className="font-medium">{feature.value}</span>
            </div>
          ))}
        </div>
        <Button
          className="w-full mt-6"
          variant={recommended ? "default" : "outline"}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );
}
