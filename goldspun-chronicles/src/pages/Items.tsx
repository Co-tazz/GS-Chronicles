import { useState, useEffect } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import itemsData from "@/data/mock/items.json";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatGold } from "@/lib/utils";

const qualityColors = {
  poor: "text-gray-500",
  common: "text-foreground",
  uncommon: "text-green-500",
  rare: "text-blue-500",
  epic: "text-purple-500",
  legendary: "text-orange-500",
};

export default function Items() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof typeof itemsData[0]>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  // Handle search parameter from URL
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearch(searchParam);
    }
  }, [searchParams]);

  const handleSort = (field: keyof typeof itemsData[0]) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredItems = itemsData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const modifier = sortDirection === "asc" ? 1 : -1;

    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * modifier;
    }
    return String(aValue).localeCompare(String(bValue)) * modifier;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-primary gold-glow">Item Explorer</h1>
        <p className="text-muted-foreground mt-2">Browse and analyze auction house items</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="panel-ornate">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("name")}
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
                    onClick={() => handleSort("minPrice")}
                    className="font-semibold"
                  >
                    Min Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("avgPrice")}
                    className="font-semibold"
                  >
                    Avg Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("medianPrice")}
                    className="font-semibold"
                  >
                    Median
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("volume")}
                    className="font-semibold"
                  >
                    Volume
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>24h Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-border hover:bg-muted/30 cursor-pointer"
                  onClick={() => navigate(`/items/${item.id}`)}
                >
                  <TableCell>
                    <span className={`font-medium ${qualityColors[item.quality as keyof typeof qualityColors]}`}>
                      {item.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-primary font-semibold">
                    {formatGold(item.minPrice)}g
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatGold(item.avgPrice)}g
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatGold(item.medianPrice)}g
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.volume}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.change24h > 0 ? "default" : "destructive"}
                      className="font-semibold"
                    >
                      {item.change24h > 0 ? "+" : ""}
                      {item.change24h}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
