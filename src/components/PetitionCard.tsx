import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Clock } from "lucide-react";

interface PetitionCardProps {
  title: string;
  description: string;
  category: string;
  location: string;
  supporters: number;
  timeLeft: string;
  status?: "pending" | "approved" | "rejected";
}

const PetitionCard = ({
  title,
  description,
  category,
  location,
  supporters,
  timeLeft,
  status
}: PetitionCardProps) => {
  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      Environment: "bg-success/10 text-success hover:bg-success/20",
      Infrastructure: "bg-warning/10 text-warning hover:bg-warning/20",
      Education: "bg-info/10 text-info hover:bg-info/20",
      "Public Safety": "bg-destructive/10 text-destructive hover:bg-destructive/20",
      Transportation: "bg-primary/10 text-primary hover:bg-primary/20",
      Healthcare: "bg-accent/10 text-accent hover:bg-accent/20",
      Housing: "bg-secondary hover:bg-secondary/80",
    };
    return colors[cat] || "bg-secondary";
  };

  const getStatusBadge = () => {
    if (!status) return null;
    const statusConfig = {
      pending: { label: "Pending Review", className: "bg-warning/10 text-warning" },
      approved: { label: "Approved", className: "bg-success/10 text-success" },
      rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="stat-card hover:shadow-lg group">
      <div className="flex items-start justify-between mb-3">
        <Badge className={getCategoryColor(category)}>
          {category}
        </Badge>
        {getStatusBadge()}
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {title}
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
          <span>{supporters} supporters</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{timeLeft}</span>
        </div>
      </div>
      
      <Button className="w-full" variant={status ? "outline" : "default"}>
        {status ? "View Details" : "Support Petition"}
      </Button>
    </div>
  );
};

export default PetitionCard;
