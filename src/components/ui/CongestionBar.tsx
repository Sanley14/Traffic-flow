import { getCongestionBarColor } from "@/lib/utils";

interface CongestionBarProps {
  level: number;
  showLabel?: boolean;
  height?: "sm" | "md" | "lg";
}

export default function CongestionBar({
  level,
  showLabel = true,
  height = "md",
}: CongestionBarProps) {
  const heightClass = height === "sm" ? "h-1.5" : height === "lg" ? "h-3" : "h-2";

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Congestion</span>
          <span className={`font-medium ${
            level < 30 ? "text-green-400" : level < 60 ? "text-yellow-400" : level < 80 ? "text-orange-400" : "text-red-400"
          }`}>
            {level}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-700 rounded-full ${heightClass}`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-500 ${getCongestionBarColor(level)}`}
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}
