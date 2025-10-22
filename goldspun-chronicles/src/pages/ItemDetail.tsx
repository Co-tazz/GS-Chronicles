import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import itemsData from "@/data/mock/items.json";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { formatGold } from "@/lib/utils";

const qualityColors = {
  poor: "text-gray-500",
  common: "text-foreground",
  uncommon: "text-green-500",
  rare: "text-blue-500",
  epic: "text-purple-500",
  legendary: "text-orange-500",
};

const mockPriceHistory = [
  { time: "00:00", price: 1420 },
  { time: "04:00", price: 1380 },
  { time: "08:00", price: 1450 },
  { time: "12:00", price: 1520 },
  { time: "16:00", price: 1490 },
  { time: "20:00", price: 1580 },
];

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const item = itemsData.find((i) => i.id === id);

  const handleAddToWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
    toast({
      title: isInWatchlist ? "Removed from Watchlist" : "Added to Watchlist",
      description: `${item?.name} ${isInWatchlist ? "removed from" : "added to"} your watchlist`,
    });
  };

  const handleViewListings = () => {
    toast({
      title: "Loading Listings",
      description: "Fetching current auction listings...",
    });
  };

  const handleSetPriceAlert = () => {
    toast({
      title: "Price Alert Set",
      description: `You'll be notified when ${item?.name} price changes significantly`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Price data is being exported...",
    });
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Data has been exported successfully",
      });
    }, 2000);
  };

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Item not found</p>
        <Button onClick={() => navigate("/items")} className="mt-4">
          Back to Items
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/items")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className={`text-3xl font-display ${qualityColors[item.quality as keyof typeof qualityColors]}`}>
            {item.name}
          </h1>
          <p className="text-muted-foreground mt-1">Item ID: {item.id}</p>
        </div>
        <Button className="gap-2" onClick={handleAddToWatchlist}>
          <Star className={`h-4 w-4 ${isInWatchlist ? 'fill-current' : ''}`} />
          {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="panel-ornate">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Min Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{item.minPrice.toLocaleString()}g</p>
          </CardContent>
        </Card>
        <Card className="panel-ornate">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Median Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{formatGold(item.medianPrice)}g</p>
          </CardContent>
        </Card>
        <Card className="panel-ornate">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">24h Change</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={item.change24h > 0 ? "default" : "destructive"}
              className="text-lg font-bold px-3 py-1"
            >
              {item.change24h > 0 ? "+" : ""}
              {item.change24h}%
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="panel-ornate">
            <CardHeader>
              <CardTitle>Price Trend (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockPriceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.375rem",
                    }}
                  />
                  <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="panel-ornate">
              <CardHeader>
                <CardTitle className="text-lg">Market Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Price</span>
                  <span className="font-semibold">{formatGold(item.avgPrice)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume (24h)</span>
                  <span className="font-semibold">{item.volume}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quality</span>
                  <span className={`font-semibold capitalize ${qualityColors[item.quality as keyof typeof qualityColors]}`}>
                    {item.quality}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="panel-ornate">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline" onClick={handleViewListings}>
                  View All Listings
                </Button>
                <Button className="w-full" variant="outline" onClick={handleSetPriceAlert}>
                  Set Price Alert
                </Button>
                <Button className="w-full" variant="outline" onClick={handleExportData}>
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="panel-ornate">
            <CardHeader>
              <CardTitle>Price History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Historical data will be loaded from snapshots
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
