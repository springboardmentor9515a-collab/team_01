import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button"; // Make sure Button.jsx has default export
import { Building2, Users, HeartHandshake } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const portals = [
    {
      title: "Citizen Portal",
      description: "Create petitions, join discussions, and vote on community matters.",
      icon: Users,
      route: "/citizen",
      buttonVariant: "solid",
    },
    {
      title: "Official Portal",
      description: "Review petitions, manage approvals, and track community engagement.",
      icon: Building2,
      route: "/official",
      buttonVariant: "outline",
    },
    {
      title: "Volunteer Portal",
      description: "Connect with citizens, support local causes, and make an impact.",
      icon: HeartHandshake,
      route: "/volunteer",
      buttonVariant: "solid",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E3F2F9] via-[#F0F7F4] to-[#DCEEF4]">
      <div className="max-w-6xl p-8 text-center">
        <h1 className="text-5xl font-extrabold text-[#0F4C5C] mb-4">Welcome to Civic</h1>
        <p className="text-lg text-[#0F4C5C] mb-12">
          Empowering communities through petitions, polls, and civic engagement
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {portals.map((portal) => (
            <div
              key={portal.title}
              className="cursor-pointer hover:scale-105 transition-transform p-8 bg-white rounded-2xl shadow-lg border border-gray-200"
              onClick={() => navigate(portal.route)}
            >
              <div className="w-16 h-16 bg-[#0F4C5C]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <portal.icon className="w-8 h-8 text-[#0F4C5C]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0F4C5C] mb-3">{portal.title}</h2>
              <p className="text-[#0F4C5C] mb-6">{portal.description}</p>
              <Button
                size="lg"
                variant={portal.buttonVariant === "outline" ? "outline" : undefined}
                className={`w-full ${
                  portal.buttonVariant === "outline"
                    ? "border-[#0F4C5C] text-[#0F4C5C] hover:bg-[#0F4C5C] hover:text-white"
                    : "bg-[#0F4C5C] text-white hover:bg-[#16697A]"
                }`}
              >
                Enter as {portal.title.split(" ")[0]}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
