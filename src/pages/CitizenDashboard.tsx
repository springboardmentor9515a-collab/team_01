import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import PetitionCard from "@/components/PetitionCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, BarChart3, Plus, MapPin, Filter } from "lucide-react";
import { useState } from "react";

const CitizenDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [location, setLocation] = useState("San Diego, CA");

  const categories = [
    "All Categories",
    "Environment",
    "Infrastructure",
    "Education",
    "Public Safety",
    "Transportation",
    "Healthcare",
    "Housing"
  ];

  const activePetitions = [
    {
      title: "Install Solar Panels on Public Buildings",
      description: "Reduce carbon footprint by installing solar panels on all municipal buildings to promote renewable energy.",
      category: "Environment",
      location: "Downtown",
      supporters: 1247,
      timeLeft: "12 days left"
    },
    {
      title: "Repair Potholes on Main Street",
      description: "Main Street has numerous dangerous potholes that need immediate attention for public safety.",
      category: "Infrastructure",
      location: "Main Street",
      supporters: 892,
      timeLeft: "8 days left"
    },
    {
      title: "Extend Library Hours on Weekends",
      description: "Increase access to educational resources by extending public library hours on Saturday and Sunday.",
      category: "Education",
      location: "City Center",
      supporters: 634,
      timeLeft: "15 days left"
    },
    {
      title: "Add More Street Lighting in Parks",
      description: "Improve safety in public parks by installing additional lighting fixtures along walking paths.",
      category: "Public Safety",
      location: "Balboa Park",
      supporters: 1089,
      timeLeft: "5 days left"
    },
    {
      title: "Create Dedicated Bike Lanes",
      description: "Promote eco-friendly transportation by adding protected bike lanes on major thoroughfares.",
      category: "Transportation",
      location: "Various Locations",
      supporters: 2156,
      timeLeft: "20 days left"
    },
    {
      title: "Free Health Screenings Program",
      description: "Launch a community health initiative providing free annual health screenings for all residents.",
      category: "Healthcare",
      location: "Community Centers",
      supporters: 1543,
      timeLeft: "10 days left"
    }
  ];

  return (
    <Layout userType="citizen">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, John!
          </h1>
          <p className="text-muted-foreground">
            See what's happening in your community and make your voice heard.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="My Petitions"
            value="3"
            subtitle="petitions"
            icon={FileText}
            iconColor="bg-primary/10"
            trend={{ value: "2 new", isPositive: true }}
          />
          <StatCard
            title="Successful Petitions"
            value="2"
            subtitle="or under review"
            icon={CheckCircle2}
            iconColor="bg-success/10"
          />
          <StatCard
            title="Polls Created"
            value="1"
            subtitle="polls"
            icon={BarChart3}
            iconColor="bg-info/10"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button size="lg" className="w-full h-auto py-4 shadow-lg hover:shadow-xl transition-all">
            <Plus className="mr-2 w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Create New Petition</div>
              <div className="text-xs opacity-90">Start a petition for your community</div>
            </div>
          </Button>
          <Button size="lg" variant="outline" className="w-full h-auto py-4 shadow-sm hover:shadow-md transition-all">
            <BarChart3 className="mr-2 w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Create New Poll</div>
              <div className="text-xs">Get community feedback on issues</div>
            </div>
          </Button>
        </div>

        {/* Active Petitions Section */}
        <div className="stat-card mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Active Petitions Near You</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Showing for: {location}</span>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-primary hover:text-primary/80">
                  Change
                </Button>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Petitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePetitions.map((petition, index) => (
            <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <PetitionCard {...petition} />
            </div>
          ))}
        </div>

        {/* Community Insights */}
        <div className="mt-8 stat-card">
          <h3 className="text-xl font-bold mb-4">Community Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">12,450</div>
              <div className="text-sm text-muted-foreground">Total Signatures This Month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-1">37</div>
              <div className="text-sm text-muted-foreground">Petitions Approved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-info mb-1">89%</div>
              <div className="text-sm text-muted-foreground">Community Engagement</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CitizenDashboard;
