import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Coins, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const apiUrl = (p: string) => `${API_BASE}/api${p}`;

export default function WoWToken() {
  const queryClient = useQueryClient();

  const tokenQuery = useQuery({
    queryKey: ["token", "current"],
    queryFn: async () => {
      const resp = await fetch(apiUrl("/token"));
      if (!resp.ok) throw new Error(`Failed to load token: ${resp.status}`);
      return await resp.json();
    },
  });

  const historyQuery = useQuery({
    queryKey: ["token", "history"],
    queryFn: async () => {
      const resp = await fetch(apiUrl("/token/history?days=7"));
      if (!resp.ok) throw new Error(`Failed to load token history: ${resp.status}`);
      return await resp.json();
    },
  });

  const refresh = useMutation({
    mutationFn: async () => {
      const resp = await fetch(apiUrl("/token/refresh"), { method: "POST" });
      if (!resp.ok) throw new Error(`Failed to refresh token: ${resp.status}`);
      return await resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["token", "current"] });
      queryClient.invalidateQueries({ queryKey: ["token", "history"] });
    },
  });

  const currentPrice = tokenQuery.data?.price ?? 0;
  const lastUpdated = tokenQuery.data?.lastUpdated ?? null;
  const historyPoints: Array<{ timestamp: string; price: number }> = historyQuery.data?.points ?? [];
  const isPositiveChange = historyPoints.length >= 2 ? (historyPoints[historyPoints.length - 1].price - historyPoints[historyPoints.length - 2].price) >= 0 : true;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display text-primary gold-glow">WoW Token Tracker</h1>
        <p className="text-muted-foreground mt-2">
          Real-time WoW Token prices across EU realms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="panel-ornate md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              Current Token Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-primary">
                  {currentPrice.toLocaleString()}
                </span>
                <span className="text-2xl text-muted-foreground">gold</span>
              </div>
              <div className="flex items-center gap-2">
                {isPositiveChange ? (
                  <TrendingUp className="h-5 w-5 text-success" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-destructive" />
                )}
                <Badge variant={isPositiveChange ? "default" : "destructive"}>
                  {isPositiveChange ? "+" : ""}
                  Trend {isPositiveChange ? "up" : "down"}
                </Badge>
                <Button variant="outline" size="sm" className="ml-auto gap-2" onClick={() => refresh.mutate()} disabled={refresh.isPending}>
                  <RefreshCw className="h-4 w-4" />
                  {refresh.isPending ? "Refreshing" : "Refresh"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {lastUpdated ? `Last updated: ${new Date(lastUpdated).toLocaleString()}` : "Loading..."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="panel-ornate">
          <CardHeader>
            <CardTitle className="text-lg">About WoW Token</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              The WoW Token is an in-game item that can be purchased for real money and sold on the
              Auction House for gold, or vice versa.
            </p>
            <p className="text-muted-foreground">
              Token prices fluctuate based on supply and demand across all EU realms.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="panel-ornate">
        <CardHeader>
          <CardTitle>7-Day Price Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={historyPoints.map((p) => ({ date: p.timestamp, price: p.price }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.375rem",
                }}
                formatter={(value: number) => [`${value.toLocaleString()}g`, "Price"]}
                labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
