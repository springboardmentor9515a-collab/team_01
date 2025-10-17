import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout"; // Your main layout
import StatCard from "../components/StatCard";
import PetitionCard from "../components/PetitionCard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  FileText, 
  CheckCircle2, 
  BarChart3, 
  Plus, 
  MapPin, 
  Filter 
} from "lucide-react";

const CitizenDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [location, setLocation] = useState("San Diego, CA");
  const [userName, setUserName] = useState("Citizen"); // Default placeholder
  const navigate = useNavigate();

  const categories = ["All Categories"];
  const activePetitions = []; // Replace with your data

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.name) {
          setUserName(parsedUser.name);
        } else if (parsedUser.fullName) {
          setUserName(parsedUser.fullName);
        } else {
          setUserName("Citizen");
        }
      } catch (err) {
        console.error("Error parsing user:", err);
        setUserName("Citizen");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Layout userType="citizen">
      <div className="p-8 max-w-7xl mx-auto 
        bg-gradient-to-br from-[#E3F2F9] via-[#F0F7F4] to-[#DCEEF4] 
        min-h-screen">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-[#0F4C5C] mb-2">
              Welcome back, {userName} 👋
            </h1>
            <p className="text-gray-600">
              See what's happening in your community and make your voice heard.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="My Petitions"
            value="0"
            subtitle="petitions"
            icon={FileText}
            iconColor="bg-[#0F4C5C]/10 text-[#0F4C5C]"
            trend={{ value: "2 new", isPositive: true }}
          />
          <StatCard
            title="Successful Petitions"
            value="0"
            subtitle="or under review"
            icon={CheckCircle2}
            iconColor="bg-green-100 text-green-600"
          />
          <StatCard
            title="Polls Created"
            value="0"
            subtitle="polls"
            icon={BarChart3}
            iconColor="bg-teal-100 text-teal-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            size="lg" 
            className="w-full h-auto py-4 shadow-md hover:shadow-xl 
            bg-[#0F4C5C] text-white hover:bg-[#16697A] transition-all"
          >
            <Plus className="mr-2 w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Create New Petition</div>
              <div className="text-xs opacity-90">Start a petition for your community</div>
            </div>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full h-auto py-4 shadow-sm hover:shadow-md 
            border-[#0F4C5C] text-[#0F4C5C]"
          >
            <BarChart3 className="mr-2 w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Create New Poll</div>
              <div className="text-xs">Get community feedback on issues</div>
            </div>
          </Button>
        </div>

        {/* Active Petitions */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0F4C5C] mb-1">Active Petitions Near You</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>Showing for: {location}</span>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-[#0F4C5C] hover:text-[#16697A]">
                  Change
                </Button>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-[#0F4C5C] text-[#0F4C5C]">
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
                className={`cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 
                  ${selectedCategory === category 
                    ? "bg-[#0F4C5C] text-white" 
                    : "border-[#0F4C5C] text-[#0F4C5C]"}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Petitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePetitions.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No active petitions available.
            </p>
          ) : (
            activePetitions.map((petition, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <PetitionCard {...petition} />
              </div>
            ))
          )}
        </div>

        {/* Community Insights */}
        <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-bold text-[#0F4C5C] mb-4">Community Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0F4C5C] mb-1">0</div>
              <div className="text-sm text-gray-500">Total Signatures This Month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">0</div>
              <div className="text-sm text-gray-500">Petitions Approved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-1">0%</div>
              <div className="text-sm text-gray-500">Community Engagement</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CitizenDashboard;
