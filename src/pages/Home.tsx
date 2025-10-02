import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Building2, Users } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-info/5">
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-5xl font-bold mb-4 gradient-primary bg-clip-text text-transparent">
          Welcome to CivicHub
        </h1>
        <p className="text-xl text-muted-foreground mb-12">
          Your platform for civic engagement and community action
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div 
            className="stat-card cursor-pointer hover:scale-105 transition-transform p-8"
            onClick={() => navigate("/citizen")}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Citizen Portal</h2>
            <p className="text-muted-foreground mb-6">
              Create petitions, participate in polls, and make your voice heard
            </p>
            <Button size="lg" className="w-full">
              Enter as Citizen
            </Button>
          </div>

          <div 
            className="stat-card cursor-pointer hover:scale-105 transition-transform p-8"
            onClick={() => navigate("/official")}
          >
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Official Portal</h2>
            <p className="text-muted-foreground mb-6">
              Review petitions, manage community requests, and track engagement
            </p>
            <Button size="lg" variant="outline" className="w-full">
              Enter as Official
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
