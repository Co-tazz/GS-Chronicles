import { SmartFlipSuggestions } from "@/components/market/SmartFlipSuggestions";
import recommendationsData from "@/data/mock/recommendations.json";
import { useToast } from "@/hooks/use-toast";

export default function MarketAdvisor() {
  const { toast } = useToast();

  const handleRefresh = () => {
    toast({
      title: "Refreshing Insights",
      description: "Analyzing market trends and updating recommendations...",
    });
    
    setTimeout(() => {
      toast({
        title: "Insights Updated",
        description: "Market recommendations have been refreshed with latest data",
      });
    }, 2000);
  };

  // Transform mock data to match SmartFlipSuggestions format
  const suggestions = recommendationsData.recommendations.map((rec) => ({
    itemName: rec.item,
    signal: (rec.type === "WATCH" ? "HOLD" : rec.type) as "BUY" | "SELL" | "HOLD",
    confidence: Math.round(rec.confidence * 100),
    rationale: rec.reason,
    targetPrice: rec.currentPrice,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-primary gold-glow">AI Market Insights</h1>
        <p className="text-muted-foreground mt-2">
          Automated recommendations based on market trends (mock data)
        </p>
      </div>
      
      <SmartFlipSuggestions suggestions={suggestions} onRefresh={handleRefresh} />
    </div>
  );
}
