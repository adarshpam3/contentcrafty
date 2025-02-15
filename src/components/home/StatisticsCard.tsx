
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface StatisticsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  buttonText: string;
  onClick: () => void;
}

export function StatisticsCard({ title, value, icon: Icon, buttonText, onClick }: StatisticsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600">{title}</p>
          <p className="text-3xl font-semibold">{value}</p>
        </div>
        <div className="p-3 bg-gray-100 rounded-full">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
      </div>
      <Button 
        variant="ghost" 
        className="w-full mt-4 bg-[#8A898C] text-white hover:bg-[#666568] transition-colors duration-200"
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </Card>
  );
}
