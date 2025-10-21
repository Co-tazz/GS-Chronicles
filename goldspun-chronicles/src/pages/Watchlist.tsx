import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Bell, BellOff, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import watchlistData from "@/data/mock/watchlist.json";
import { WatchlistForm } from "@/components/watchlist/WatchlistForm";
import { ActiveAlerts } from "@/components/watchlist/ActiveAlerts";
import { AlertHistory } from "@/components/watchlist/AlertHistory";

const qualityColors = {
  poor: "text-gray-500",
  common: "text-foreground",
  uncommon: "text-green-500",
  rare: "text-blue-500",
  epic: "text-purple-500",
  legendary: "text-orange-500",
};

export default function Watchlist() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = (data: any) => {
    toast({
      title: "Item Added",
      description: `${data.itemName} has been added to your watchlist.`,
    });
  };

  const handleAcknowledge = (id: string) => {
    toast({
      title: "Alert Acknowledged",
      description: "Alert has been moved to history.",
    });
  };

  const handleDismiss = (id: string) => {
    toast({
      title: "Alert Dismissed",
      description: "Alert has been removed.",
      variant: "destructive",
    });
  };

  const handleToggleAlert = (itemId: string, enabled: boolean) => {
    toast({
      title: enabled ? "Alert Enabled" : "Alert Disabled",
      description: enabled ? "You will receive notifications for this item." : "Notifications disabled for this item.",
    });
  };

  const handleRemoveItem = (itemId: string) => {
    toast({
      title: "Item Removed",
      description: "Item has been removed from your watchlist.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display text-primary gold-glow">Watchlist & Alerts</h1>
          <p className="text-muted-foreground mt-2">Track items and manage price alerts</p>
        </div>
        <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      <Tabs defaultValue="watchlist" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist" className="mt-6">
          <Card className="panel-ornate">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-semibold">Item</TableHead>
                    <TableHead className="font-semibold">Current Price</TableHead>
                    <TableHead className="font-semibold">24h Change</TableHead>
                    <TableHead className="font-semibold">Alert Condition</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {watchlistData.map((item) => (
                    <TableRow key={item.id} className="border-border hover:bg-muted/30">
                      <TableCell>
                        <span className={`font-medium ${qualityColors[item.quality as keyof typeof qualityColors]}`}>
                          {item.itemName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-primary font-semibold">
                          {item.currentPrice.toLocaleString()}g
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.change24h > 0 ? "default" : "destructive"}
                          className="font-semibold"
                        >
                          {item.change24h > 0 ? "+" : ""}
                          {item.change24h}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.alertCondition}
                      </TableCell>
                      <TableCell>
                        {item.status === "triggered" ? (
                          <Badge variant="destructive">Triggered</Badge>
                        ) : (
                          <Badge variant="outline">Normal</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleToggleAlert(item.id, !item.alertEnabled)}
                          >
                            {item.alertEnabled ? (
                              <Bell className="h-4 w-4 text-accent" />
                            ) : (
                              <BellOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <ActiveAlerts
            onAcknowledge={handleAcknowledge}
            onDismiss={handleDismiss}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <AlertHistory />
        </TabsContent>
      </Tabs>

      <WatchlistForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
