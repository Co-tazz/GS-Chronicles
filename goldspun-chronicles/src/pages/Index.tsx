import { useState } from "react";
import { Search, TrendingUp, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const popularRealms = [
    "Tarren Mill", "Ravencrest", "Kazzak", "Twisting Nether",
    "Draenor", "Silvermoon", "Outland", "Ragnaros"
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Price Analytics",
      description: "Track real-time AH prices and historical trends across all EU realms"
    },
    {
      icon: Shield,
      title: "Smart Alerts",
      description: "Set custom alerts for price drops, undercuts, and market opportunities"
    },
    {
      icon: Clock,
      title: "Hourly Updates",
      description: "Synchronized with Blizzard's hourly auction house data updates"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background opacity-50" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, hsl(var(--accent) / 0.1) 0%, transparent 50%)`
        }} />
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-5xl lg:text-7xl font-bold mb-6 gold-glow">
              WoW AH Analytics
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-4">
              Master the Auction House
            </p>
            <p className="text-base lg:text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto">
              Track prices, analyze trends, and dominate the EU auction house economy with 
              TSM-inspired analytics and real-time market data.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for a realm (e.g., Tarren Mill, Ravencrest...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg bg-card/50 backdrop-blur border-border hover-gold"
                />
              </div>
            </div>

            {/* Popular Realms */}
            <div className="mb-12">
              <p className="text-sm text-muted-foreground mb-4">Popular EU Realms:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularRealms.map((realm) => (
                  <Button
                    key={realm}
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/dashboard")}
                    className="hover-gold"
                  >
                    {realm}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 h-auto font-semibold"
            >
              Sign In / Sign Up
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-center mb-4">
            Professional-Grade Market Intelligence
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Powered by Blizzard's official API with hourly snapshots and comprehensive analytics
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="panel-ornate p-6 text-center hover-gold">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto panel-ornate p-12 rounded-lg">
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Trading Smarter?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of players using data-driven insights to maximize their gold earnings
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="text-lg px-8 py-6 h-auto"
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 h-auto hover-gold"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Not affiliated with or endorsed by Blizzard Entertainment. World of Warcraft and related 
            trademarks are property of Blizzard Entertainment, Inc.
          </p>
          <p className="mt-2">
            Data provided by Blizzard's official Game Data APIs
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
