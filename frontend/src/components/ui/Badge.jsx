import { cn } from "../../utils/cn";

const colorMap = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
  low: "bg-gray-100 text-gray-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
  Admin: "bg-purple-100 text-purple-700",
  Member: "bg-gray-100 text-gray-600",
};

export default function Badge({ label, className }) {
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", colorMap[label] || "bg-gray-100 text-gray-600", className)}>
      {label}
    </span>
  );
}