import { cn } from "@/lib/utils";
import "./StatCard.css";

const StatCard = ({ title, value, subtitle, icon: Icon, iconColor, trend }) => {
  return (
    <div className="stat-card animate-fade-in group hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-lg transition-colors",
            iconColor || "bg-primary/10"
          )}
        >
          <Icon className={cn("w-6 h-6", iconColor ? "" : "text-primary")} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs">
          <span
            className={cn(
              "font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}
          >
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
