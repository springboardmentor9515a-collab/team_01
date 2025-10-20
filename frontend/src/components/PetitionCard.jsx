import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import "./PetitionCard.css";
import { MapPin, Users, Clock } from "lucide-react";

const PetitionCard = ({
  title,
  description,
  category,
  location,
  supporters,
  timeLeft,
  status,
}) => {
  const getCategoryColor = (cat) => {
    const colors = {
      // Add your category colors here if needed
    };
    return colors[cat] || "bg-secondary";
  };

  const getStatusBadge = () => {
    if (!status) return null;
    const statusConfig = {
      pending: {
        label: "Pending Review",
        className: "bg-warning/10 text-warning",
      },
      approved: { label: "Approved", className: "bg-success/10 text-success" },
      rejected: {
        label: "Rejected",
        className: "bg-destructive/10 text-destructive",
      },
    };

    const config = statusConfig[status];
    // If backend sends an unknown status, fall back to a neutral badge
    if (!config) {
      const label =
        typeof status === "string" ? status.replace(/[-_]/g, " ") : "Status";
      return <Badge className="bg-gray-100 text-gray-700">{label}</Badge>;
    }

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="stat-card hover:shadow-lg group">
      <div className="flex items-start justify-between mb-3">
        <Badge className={getCategoryColor(category || "General")}>
          {category || "General"}
        </Badge>
        {getStatusBadge()}
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {title || "Untitled Petition"}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {description}
      </p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>{supporters ?? 0} supporters</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{timeLeft ?? "-"}</span>
        </div>
      </div>

      <Button className="w-full" variant={status ? "outline" : "default"}>
        {status ? "View Details" : "Support Petition"}
      </Button>
    </div>
  );
};

export default PetitionCard;
