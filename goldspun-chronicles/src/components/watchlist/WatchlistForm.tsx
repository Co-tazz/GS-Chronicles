import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface WatchlistFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: WatchlistFormData) => void;
}

export interface WatchlistFormData {
  itemName: string;
  realm: string;
  targetBuy: number;
  targetSell: number;
  quality: string;
}

export function WatchlistForm({ open, onOpenChange, onSubmit }: WatchlistFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<WatchlistFormData>({
    itemName: "",
    realm: "",
    targetBuy: 0,
    targetSell: 0,
    quality: "common",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemName || !formData.realm) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.targetBuy <= 0 && formData.targetSell <= 0) {
      toast({
        title: "Invalid Thresholds",
        description: "Please set at least one threshold value.",
        variant: "destructive",
      });
      return;
    }

    onSubmit?.(formData);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      itemName: "",
      realm: "",
      targetBuy: 0,
      targetSell: 0,
      quality: "common",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-primary">Add Watchlist Item</DialogTitle>
          <DialogDescription>
            Set price thresholds to get notified when conditions are met.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name *</Label>
            <Input
              id="itemName"
              placeholder="e.g., Rousing Fire"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="realm">Realm *</Label>
            <Select value={formData.realm} onValueChange={(value) => setFormData({ ...formData, realm: value })}>
              <SelectTrigger id="realm">
                <SelectValue placeholder="Select a realm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stormrage">Stormrage</SelectItem>
                <SelectItem value="area-52">Area 52</SelectItem>
                <SelectItem value="illidan">Illidan</SelectItem>
                <SelectItem value="tichondrius">Tichondrius</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quality">Quality</Label>
            <Select value={formData.quality} onValueChange={(value) => setFormData({ ...formData, quality: value })}>
              <SelectTrigger id="quality">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="poor">Poor</SelectItem>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="uncommon">Uncommon</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetBuy">Target Buy Price (g)</Label>
              <Input
                id="targetBuy"
                type="number"
                min="0"
                step="0.01"
                placeholder="1000"
                value={formData.targetBuy || ""}
                onChange={(e) => setFormData({ ...formData, targetBuy: parseFloat(e.target.value) || 0 })}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Alert when price drops below</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetSell">Target Sell Price (g)</Label>
              <Input
                id="targetSell"
                type="number"
                min="0"
                step="0.01"
                placeholder="2000"
                value={formData.targetSell || ""}
                onChange={(e) => setFormData({ ...formData, targetSell: parseFloat(e.target.value) || 0 })}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Alert when price rises above</p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add to Watchlist</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
