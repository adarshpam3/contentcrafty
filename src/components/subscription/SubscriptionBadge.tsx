
import { Check, AlertTriangle } from "lucide-react";

interface SubscriptionBadgeProps {
  status: string;
}

export function SubscriptionBadge({ status }: SubscriptionBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "trialing":
        return "bg-blue-100 text-blue-800";
      case "canceled":
      case "incomplete_expired":
        return "bg-gray-100 text-gray-800";
      case "past_due":
      case "unpaid":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "trialing":
        return <Check className="w-4 h-4" />;
      case "past_due":
      case "unpaid":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
