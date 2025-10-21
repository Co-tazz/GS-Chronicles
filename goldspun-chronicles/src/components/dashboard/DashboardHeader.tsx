import { Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  selectedRealm: string;
}

export const DashboardHeader = ({ selectedRealm }: DashboardHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const realms = [
    "Tarren Mill",
    "Ravencrest",
    "Kazzak",
    "Twisting Nether",
    "Draenor",
    "Silvermoon",
    "Outland",
    "Ragnaros",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchTerm.trim())}`);
      toast({
        title: "Search",
        description: `Searching for "${searchTerm.trim()}"`,
      });
    }
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold gold-glow">
                WoW AH
              </h1>
            </a>

            {/* Realm Selector */}
            <Select defaultValue={selectedRealm}>
              <SelectTrigger className="w-[200px] bg-secondary border-border">
                <SelectValue placeholder="Select realm" />
              </SelectTrigger>
              <SelectContent>
                {realms.map((realm) => (
                  <SelectItem key={realm} value={realm}>
                    {realm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[300px] pl-10 bg-secondary border-border"
              />
            </form>

            <Button variant="ghost" size="icon" onClick={handleSettingsClick}>
              <Settings className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/watchlist")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Watchlist</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
