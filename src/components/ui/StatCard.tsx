interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}

const colorMap = {
  blue: "bg-blue-500/20 text-blue-400",
  green: "bg-green-500/20 text-green-400",
  yellow: "bg-yellow-500/20 text-yellow-400",
  red: "bg-red-500/20 text-red-400",
  purple: "bg-purple-500/20 text-purple-400",
};

export default function StatCard({
  title,
  value,
  unit,
  change,
  changeType = "neutral",
  icon,
  color = "blue",
}: StatCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
        {change && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              changeType === "up"
                ? "bg-green-500/20 text-green-400"
                : changeType === "down"
                ? "bg-red-500/20 text-red-400"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            {changeType === "up" ? "↑" : changeType === "down" ? "↓" : "→"} {change}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        {unit && <span className="text-gray-400 text-sm">{unit}</span>}
      </div>
      <p className="text-gray-400 text-sm mt-1">{title}</p>
    </div>
  );
}
