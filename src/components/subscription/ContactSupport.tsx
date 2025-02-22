
import { Users } from "lucide-react";

export function ContactSupport() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 px-4 py-3 bg-[#e6f4ea] rounded-lg">
        <Users className="h-5 w-5 text-[#06962c]" />
        <p className="text-[#06962c]">
          Need help choosing the right plan? <a href="#" className="underline font-medium">Contact our sales team</a>
        </p>
      </div>
    </div>
  );
}
