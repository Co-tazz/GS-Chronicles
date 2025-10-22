import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatGold } from "@/lib/utils";

interface HistoricalAlert {
  id: string;
  itemName: string;
  realm: string;
  type: "BUY" | "SELL";
  triggeredPrice: number;
  threshold: number;
  state: "Acknowledged" | "Dismissed";
  timestamp: string;
}

interface AlertHistoryProps {
  alerts?: HistoricalAlert[];
}

const mockHistory: HistoricalAlert[] = [
  {
    id: "h1",
    itemName: "Rousing Fire",
    realm: "Stormrage",
    type: "BUY",
    triggeredPrice: 1150,
    threshold: 1200,
    state: "Acknowledged",
    timestamp: "2025-01-13T10:30:00Z",
  },
  {
    id: "h2",
    itemName: "Primal Chaos",
    realm: "Area 52",
    type: "SELL",
    triggeredPrice: 9200,
    threshold: 9000,
    state: "Dismissed",
    timestamp: "2025-01-12T15:20:00Z",
  },
  {
    id: "h3",
    itemName: "Arcane Crystal",
    realm: "Illidan",
    type: "BUY",
    triggeredPrice: 14800,
    threshold: 15000,
    state: "Acknowledged",
    timestamp: "2025-01-11T08:45:00Z",
  },
  {
    id: "h4",
    itemName: "Elemental Harmony",
    realm: "Tichondrius",
    type: "SELL",
    triggeredPrice: 3100,
    threshold: 3000,
    state: "Acknowledged",
    timestamp: "2025-01-10T12:00:00Z",
  },
];

export function AlertHistory({ alerts = mockHistory }: AlertHistoryProps) {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (alerts.length === 0) {
    return (
      <Card className="panel-ornate p-8 text-center">
        <p className="text-muted-foreground">No alert history yet</p>
      </Card>
    );
  }

  return (
    <Card className="panel-ornate">
      <ScrollArea className="h-[500px]">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-semibold">Item</TableHead>
              <TableHead className="font-semibold">Realm</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Triggered Price</TableHead>
              <TableHead className="font-semibold">Threshold</TableHead>
              <TableHead className="font-semibold">State</TableHead>
              <TableHead className="font-semibold">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow
                key={alert.id}
                className={`border-border hover:bg-muted/30 ${
                  alert.state === "Dismissed" ? "opacity-60" : ""
                }`}
              >
                <TableCell className="font-medium text-foreground">
                  {alert.itemName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {alert.realm}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={alert.type === "BUY" ? "default" : "destructive"}
                    className="font-semibold"
                  >
                    {alert.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  {formatGold(alert.triggeredPrice)}g
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatGold(alert.threshold)}g
                </TableCell>
                <TableCell>
                  <Badge
                    variant={alert.state === "Acknowledged" ? "outline" : "secondary"}
                  >
                    {alert.state}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(alert.timestamp)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
