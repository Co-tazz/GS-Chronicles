import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Bell, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for price history
const priceData = [
  { time: "00:00", price: 1250, volume: 245 },
  { time: "01:00", price: 1280, volume: 189 },
  { time: "02:00", price: 1220, volume: 156 },
  { time: "03:00", price: 1190, volume: 134 },
  { time: "04:00", price: 1235, volume: 178 },
  { time: "05:00", price: 1310, volume: 267 },
  { time: "06:00", price: 1295, volume: 289 },
  { time: "07:00", price: 1340, volume: 312 },
  { time: "08:00", price: 1380, volume: 401 },
  { time: "09:00", price: 1425, volume: 478 },
  { time: "10:00", price: 1390, volume: 445 },
  { time: "11:00", price: 1410, volume: 423 },
  { time: "12:00", price: 1450, volume: 489 },
  { time: "13:00", price: 1480, volume: 512 },
  { time: "14:00", price: 1465, volume: 498 },
  { time: "15:00", price: 1490, volume: 534 },
  { time: "16:00", price: 1520, volume: 567 },
  { time: "17:00", price: 1505, volume: 545 },
  { time: "18:00", price: 1535, volume: 589 },
  { time: "19:00", price: 1560, volume: 623 },
  { time: "20:00", price: 1545, volume: 601 },
  { time: "21:00", price: 1575, volume: 645 },
  { time: "22:00", price: 1590, volume: 678 },
  { time: "23:00", price: 1605, volume: 712 },
];

const Dashboard = () => {
  const [selectedRealm] = useState("Tarren Mill");
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
    toast({
      title: "Timeframe Updated",
      description: `Showing data for ${timeframe}`,
    });
  };

  const handleDownloadData = () => {
    toast({
      title: "Download Started",
      description: "Price data is being exported...",
    });
    // Simulate download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Price data has been exported successfully",
      });
    }, 2000);
  };

  const handleAddFirstItem = () => {
    navigate("/items");
  };

  const stats = [
    {
      title: "Median Price",
      value: "1,450g",
      change: "+12.5%",
      isPositive: true,
      subtitle: "24h change",
    },
    {
      title: "Total Volume",
      value: "8,945",
      change: "+8.3%",
      isPositive: true,
      subtitle: "listings today",
    },
    {
      title: "Active Watchlist",
      value: "24",
      change: "3 alerts",
      isPositive: false,
      subtitle: "items tracked",
    },
    {
      title: "Market Value",
      value: "12.4M",
      change: "+5.2%",
      isPositive: true,
      subtitle: "portfolio worth",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader selectedRealm={selectedRealm} />

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="panel-ornate hover-gold">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold font-display">
                    {stat.value}
                  </span>
                  <Badge
                    variant={stat.isPositive ? "default" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {stat.isPositive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Price Chart */}
          <Card className="lg:col-span-2 panel-ornate">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-display">Price History</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant={selectedTimeframe === "24h" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleTimeframeChange("24h")}
                  >
                    24h
                  </Button>
                  <Button 
                    variant={selectedTimeframe === "7d" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleTimeframeChange("7d")}
                  >
                    7d
                  </Button>
                  <Button 
                    variant={selectedTimeframe === "30d" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleTimeframeChange("30d")}
                  >
                    30d
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleDownloadData}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="time"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${value}g`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#priceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Volume Chart */}
          <Card className="panel-ornate">
            <CardHeader>
              <CardTitle className="font-display">Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="time"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    interval={5}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="watchlist" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="watchlist">
              <Bell className="h-4 w-4 mr-2" />
              Watchlist
            </TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
          </TabsList>

          <TabsContent value="watchlist">
            <Card className="panel-ornate">
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-display text-xl font-semibold mb-2">
                  No items in watchlist
                </h3>
                <p className="text-muted-foreground mb-6">
                  Add items to track their prices and get alerts
                </p>
                <Button onClick={handleAddFirstItem}>Add First Item</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trending">
            <Card className="panel-ornate">
              <CardContent className="p-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-display text-xl font-semibold mb-2">
                  Trending Items
                </h3>
                <p className="text-muted-foreground">
                  Coming soon - Most traded items in the last 24 hours
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
