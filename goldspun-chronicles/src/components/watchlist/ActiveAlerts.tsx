import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, Check, X } from "lucide-react";

interface Alert {
  id: string;
  itemName: string;
  realm: string;
  type: "BUY" | "SELL";
  currentPrice: number;
  threshold: number;
  triggeredAt: string;
}

interface ActiveAlertsProps {
  alerts?: Alert[];
  onAcknowledge?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

const mockAlerts: Alert[] = [
  {
    id: "a1",
    itemName: "Rousing Fire",
    realm: "Stormrage",
    type: "BUY",
    currentPrice: 1150,
    threshold: 1200,
    triggeredAt: "2025-01-13T10:30:00Z",
  },
  {
    id: "a2",
    itemName: "Primal Chaos",
    realm: "Area 52",
    type: "SELL",
    currentPrice: 9500,
    threshold: 9000,
    triggeredAt: "2025-01-13T09:15:00Z",
  },
];

export function ActiveAlerts({ alerts = mockAlerts, onAcknowledge, onDismiss }: ActiveAlertsProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (alerts.length === 0) {
    return (
      <Card className="panel-ornate p-8 text-center">
        <p className="text-muted-foreground">No active alerts at the moment</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Card
          key={alert.id}
          className={`panel-ornate p-4 animate-fade-in border-l-4 ${
            alert.type === "BUY" ? "border-l-success" : "border-l-destructive"
          }`}
        >
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`p-2 rounded-lg ${
              alert.type === "BUY" ? "bg-success/10" : "bg-destructive/10"
            }`}>
              {alert.type === "BUY" ? (
                <TrendingDown className={`h-5 w-5 text-success`} />
              ) : (
                <TrendingUp className={`h-5 w-5 text-destructive`} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{alert.itemName}</h3>
                  <p className="text-sm text-muted-foreground">{alert.realm}</p>
                </div>
                <Badge variant={alert.type === "BUY" ? "default" : "destructive"} className="shrink-0">
                  {alert.type}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">Current Price:</span>
                  <span className="ml-2 font-semibold text-primary">
                    {alert.currentPrice.toLocaleString()}g
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Threshold:</span>
                  <span className="ml-2 font-semibold text-foreground">
                    {alert.threshold.toLocaleString()}g
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatTime(alert.triggeredAt)}
                </span>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAcknowledge?.(alert.id)}
                    className="gap-1"
                  >
                    <Check className="h-3 w-3" />
                    Acknowledge
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDismiss?.(alert.id)}
                    className="gap-1 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
