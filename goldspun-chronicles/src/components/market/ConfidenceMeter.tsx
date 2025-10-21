interface ConfidenceMeterProps {
  confidence: number;
}

export const ConfidenceMeter = ({ confidence }: ConfidenceMeterProps) => {
  const percentage = Math.round(confidence * 100);
  
  const getColor = () => {
    if (confidence >= 0.8) return "bg-success";
    if (confidence >= 0.6) return "bg-primary";
    return "bg-muted-foreground";
  };
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Confidence</span>
        <span className="font-semibold text-foreground">{percentage}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
