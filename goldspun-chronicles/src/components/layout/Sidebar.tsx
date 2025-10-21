import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Globe, Package, Star, TrendingUp, Settings, Coins, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Realms", url: "/realms", icon: Globe },
  { title: "Items", url: "/items", icon: Package },
  { title: "Watchlist", url: "/watchlist", icon: Star },
  { title: "Market Advisor", url: "/market-advisor", icon: TrendingUp },
  { title: "WoW Token", url: "/wow-token", icon: Coins },
  { title: "Settings", url: "/settings", icon: Settings },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6">
        <h1 className="font-display text-2xl text-primary gold-glow">AH Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-1">EU Realms</p>
        {user && (
          <div className="mt-3 pt-3 border-t border-sidebar-border">
            <p className="text-xs text-sidebar-foreground">{user.username}</p>
            {user.isAdmin && (
              <span className="text-xs text-primary">Admin</span>
            )}
          </div>
        )}
      </div>
      
      <nav className="px-3 space-y-1 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all hover-gold",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};
