import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import PetitionCard from "@/components/PetitionCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Users, 
  AlertCircle,
  Calendar,
  Building2
} from "lucide-react";

const OfficialDashboard = () => {
  const pendingPetitions = [
    {
      title: "Install Solar Panels on Public Buildings",
      description: "Reduce carbon footprint by installing solar panels on all municipal buildings to promote renewable energy.",
      category: "Environment",
      location: "Downtown",
      supporters: 1247,
      timeLeft: "12 days left",
      status: "pending" as const
    },
    {
      title: "Extend Library Hours on Weekends",
      description: "Increase access to educational resources by extending public library hours on Saturday and Sunday.",
      category: "Education",
      location: "City Center",
      supporters: 634,
      timeLeft: "15 days left",
      status: "pending" as const
    },
    {
      title: "Add More Street Lighting in Parks",
      description: "Improve safety in public parks by installing additional lighting fixtures along walking paths.",
      category: "Public Safety",
      location: "Balboa Park",
      supporters: 1089,
      timeLeft: "5 days left",
      status: "pending" as const
    }
  ];

  const recentActions = [
    {
      title: "Community Garden Initiative Approved",
      time: "2 hours ago",
      type: "approved" as const
    },
    {
      title: "Traffic Light Installation Rejected",
      time: "5 hours ago",
      type: "rejected" as const
    },
    {
      title: "Affordable Housing Project Under Review",
      time: "1 day ago",
      type: "pending" as const
    }
  ];

  const departmentMetrics = [
    { name: "Public Works", pending: 8, approved: 12, avgTime: "3.2 days" },
    { name: "Education", pending: 5, approved: 8, avgTime: "2.8 days" },
    { name: "Public Safety", pending: 12, approved: 15, avgTime: "4.1 days" },
    { name: "Transportation", pending: 6, approved: 10, avgTime: "3.5 days" }
  ];

  return (
    <Layout userType="official">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Official Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage petitions, review community requests, and track civic engagement.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Pending Review"
            value="23"
            subtitle="petitions awaiting review"
            icon={Clock}
            iconColor="bg-warning/10"
            trend={{ value: "5 new", isPositive: false }}
          />
          <StatCard
            title="Approved This Month"
            value="45"
            subtitle="petitions approved"
            icon={CheckCircle2}
            iconColor="bg-success/10"
            trend={{ value: "12%", isPositive: true }}
          />
          <StatCard
            title="Active Citizens"
            value="8,547"
            subtitle="engaged community members"
            icon={Users}
            iconColor="bg-info/10"
            trend={{ value: "8%", isPositive: true }}
          />
          <StatCard
            title="Avg Response Time"
            value="3.2"
            subtitle="days to review"
            icon={TrendingUp}
            iconColor="bg-primary/10"
            trend={{ value: "0.5 days", isPositive: true }}
          />
        </div>

        {/* Priority Alerts */}
        <div className="stat-card mb-8 bg-gradient-to-r from-warning/5 to-warning/10 border-warning/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <AlertCircle className="w-6 h-6 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Priority Items Require Attention</h3>
              <p className="text-sm text-muted-foreground mb-3">
                3 high-priority petitions are nearing their review deadline
              </p>
              <Button variant="outline" size="sm">
                Review Priority Items
              </Button>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Pending Petitions */}
          <div className="lg:col-span-2">
            <div className="stat-card mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Petitions Awaiting Review</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {pendingPetitions.map((petition, index) => (
                <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <PetitionCard {...petition} />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Actions */}
            <div className="stat-card">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Recent Actions
              </h3>
              <div className="space-y-3">
                {recentActions.map((action, index) => (
                  <div key={index} className="pb-3 border-b border-border last:border-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium line-clamp-2">{action.title}</p>
                      <Badge 
                        variant="outline" 
                        className={
                          action.type === "approved" 
                            ? "bg-success/10 text-success" 
                            : action.type === "rejected"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-warning/10 text-warning"
                        }
                      >
                        {action.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{action.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Metrics */}
            <div className="stat-card">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Department Overview
              </h3>
              <div className="space-y-4">
                {departmentMetrics.map((dept, index) => (
                  <div key={index} className="p-3 bg-secondary rounded-lg">
                    <div className="font-semibold text-sm mb-2">{dept.name}</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">Pending</div>
                        <div className="font-bold text-warning">{dept.pending}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Approved</div>
                        <div className="font-bold text-success">{dept.approved}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg Time</div>
                        <div className="font-bold">{dept.avgTime}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="stat-card bg-gradient-to-br from-primary/5 to-info/5">
              <h3 className="font-bold text-lg mb-4">Community Engagement</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Petitions</span>
                  <span className="font-bold text-lg">234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Polls</span>
                  <span className="font-bold text-lg">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Participation Rate</span>
                  <span className="font-bold text-lg text-success">89%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Satisfaction Score</span>
                  <span className="font-bold text-lg text-info">4.6/5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OfficialDashboard;
