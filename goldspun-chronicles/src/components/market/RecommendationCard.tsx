import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { formatGold } from "@/lib/utils";

interface BackendRecommendation {
  id: string;
  itemId: number;
  itemName: string;
  signal: "buy" | "sell" | "watch";
  confidence: number; // 0..1
  rationale?: string;
  targetPrice?: number;
  realmId: number;
  lastUpdated: string;
}

interface RecommendationCardProps {
  recommendation: BackendRecommendation;
}

export const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const label = recommendation.signal.toUpperCase();
  const getTypeColor = () => {
    switch (recommendation.signal) {
      case "buy":
        return "bg-success text-success-foreground";
      case "sell":
        return "bg-destructive text-destructive-foreground";
      case "watch":
        return "bg-primary text-primary-foreground";
    }
  };

  return (
    <Card className="panel-ornate hover-gold transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-display">{recommendation.itemName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Realm ID: {recommendation.realmId}</p>
          </div>
          <Badge className={getTypeColor()}>{label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          {recommendation.rationale && (
            <p className="text-sm text-foreground mb-1">{recommendation.rationale}</p>
          )}
          {recommendation.targetPrice != null && (
            <p className="text-xs text-accent font-medium">Target Price: {formatGold(Math.round(recommendation.targetPrice))}g</p>
          )}
        </div>

        <ConfidenceMeter confidence={recommendation.confidence} />

        <Button variant="outline" className="w-full" size="sm">
          <Star className="h-4 w-4 mr-2" />
          Add to Watchlist
        </Button>
      </CardContent>
    </Card>
  );
};
