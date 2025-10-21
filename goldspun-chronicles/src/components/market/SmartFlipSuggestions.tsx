import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FlipSuggestion {
  itemName: string;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  rationale: string;
  targetPrice: number;
}

interface SmartFlipSuggestionsProps {
  suggestions?: FlipSuggestion[];
  onRefresh?: () => void;
}

export const SmartFlipSuggestions = ({ 
  suggestions = [], 
  onRefresh 
}: SmartFlipSuggestionsProps) => {
  const getSignalStyles = (signal: string) => {
    switch (signal) {
      case "BUY":
        return "bg-success text-success-foreground";
      case "SELL":
        return "bg-destructive text-destructive-foreground";
      case "HOLD":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">Smart Flip Suggestions</h2>
        <Button 
          onClick={onRefresh}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Insights
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((suggestion, idx) => (
          <div 
            key={idx}
            className="rounded-2xl p-4 border border-border bg-card shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-lg text-card-foreground">{suggestion.itemName}</h3>
              <Badge className={getSignalStyles(suggestion.signal)}>
                {suggestion.signal}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              Target Price: <span className="font-semibold text-foreground">{suggestion.targetPrice.toLocaleString()}g</span>
            </p>

            <p className="text-sm text-muted-foreground mb-2">
              Confidence: <span className="font-semibold text-foreground">{suggestion.confidence}%</span>
            </p>

            <p className="text-xs text-muted-foreground italic mt-3">
              "{suggestion.rationale}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
