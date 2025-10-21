import { useState } from "react";
import { ArrowUpDown, Star } from "lucide-react";
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

interface Listing {
  id: string;
  itemName: string;
  quality: "poor" | "common" | "uncommon" | "rare" | "epic" | "legendary";
  price: number;
  quantity: number;
  seller: string;
  timeLeft: string;
  change24h: number;
}

const mockListings: Listing[] = [
  {
    id: "1",
    itemName: "Rousing Fire",
    quality: "uncommon",
    price: 1450,
    quantity: 87,
    seller: "Goldmaster",
    timeLeft: "Long",
    change24h: 12.5,
  },
  {
    id: "2",
    itemName: "Primal Chaos",
    quality: "rare",
    price: 8920,
    quantity: 45,
    seller: "Auctioneer",
    timeLeft: "Medium",
    change24h: -5.3,
  },
  {
    id: "3",
    itemName: "Illimited Diamond",
    quality: "epic",
    price: 24500,
    quantity: 12,
    seller: "CrafterPro",
    timeLeft: "Short",
    change24h: 8.7,
  },
  {
    id: "4",
    itemName: "Awakened Fire",
    quality: "rare",
    price: 3200,
    quantity: 156,
    seller: "TradeKing",
    timeLeft: "Long",
    change24h: 15.2,
  },
  {
    id: "5",
    itemName: "Zaralek Glowspores",
    quality: "uncommon",
    price: 890,
    quantity: 234,
    seller: "Herbalist",
    timeLeft: "Very Long",
    change24h: -2.1,
  },
  {
    id: "6",
    itemName: "Resilient Leather",
    quality: "uncommon",
    price: 650,
    quantity: 412,
    seller: "Skinner",
    timeLeft: "Long",
    change24h: 3.8,
  },
  {
    id: "7",
    itemName: "Crimson Combatant's Emblem",
    quality: "epic",
    price: 45000,
    quantity: 8,
    seller: "PvPMaster",
    timeLeft: "Medium",
    change24h: -8.5,
  },
  {
    id: "8",
    itemName: "Spark of Dreams",
    quality: "legendary",
    price: 125000,
    quantity: 3,
    seller: "RichPlayer",
    timeLeft: "Short",
    change24h: 22.3,
  },
];

const qualityColors = {
  poor: "text-gray-500",
  common: "text-foreground",
  uncommon: "text-green-500",
  rare: "text-blue-500",
  epic: "text-purple-500",
  legendary: "text-orange-500",
};

export const ItemListingsTable = () => {
  const [sortField, setSortField] = useState<keyof Listing>("price");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof Listing) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedListings = [...mockListings].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const modifier = sortDirection === "asc" ? 1 : -1;

    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * modifier;
    }
    return String(aValue).localeCompare(String(bValue)) * modifier;
  });

  return (
    <Card className="panel-ornate">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-12"></TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("itemName")}
                  className="font-semibold"
                >
                  Item Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("price")}
                  className="font-semibold"
                >
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("quantity")}
                  className="font-semibold"
                >
                  Quantity
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Time Left</TableHead>
              <TableHead>24h Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedListings.map((listing) => (
              <TableRow
                key={listing.id}
                className="border-border hover:bg-muted/30 cursor-pointer"
              >
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Star className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${qualityColors[listing.quality]}`}>
                    {listing.itemName}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-primary">
                    {listing.price.toLocaleString()}g
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {listing.quantity}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {listing.seller}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{listing.timeLeft}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={listing.change24h > 0 ? "default" : "destructive"}
                    className="font-semibold"
                  >
                    {listing.change24h > 0 ? "+" : ""}
                    {listing.change24h}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
