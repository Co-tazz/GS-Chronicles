import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type Theme = 'midnight' | 'parchment' | 'custom';

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [signupEnabled, setSignupEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<Theme>('midnight');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load signup setting
    const enabled = localStorage.getItem('signupEnabled') !== 'false';
    setSignupEnabled(enabled);
    
    // Load theme setting
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }
  }, []);

  const handleSignupToggle = (checked: boolean) => {
    setSignupEnabled(checked);
    localStorage.setItem('signupEnabled', checked.toString());
    toast({
      title: checked ? 'Signups Enabled' : 'Signups Disabled',
      description: checked 
        ? 'New users can now create accounts' 
        : 'New user registration is disabled',
    });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Map frontend themes to backend themes
      const backendTheme = selectedTheme === 'parchment' ? 'light' : 'dark';
      
      // Save to backend if user is authenticated
      if (user) {
        const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
        const response = await fetch(`${API_BASE}/api/auth/settings`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            theme: backendTheme
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save settings to server');
        }
      }

      // Settings are already saved to localStorage by individual handlers
      toast({
        title: 'Settings Saved',
        description: 'Your preferences have been saved successfully',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    // Reset to default values
    setSignupEnabled(true);
    setSelectedTheme('midnight');
    
    // Clear localStorage
    localStorage.removeItem('signupEnabled');
    localStorage.removeItem('theme');
    
    // Reset theme to default
    handleThemeChange('midnight');
    
    toast({
      title: 'Settings Reset',
      description: 'All settings have been reset to defaults',
    });
  };

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme);
    localStorage.setItem('theme', theme);
    
    // Apply theme to document root
    const root = document.documentElement;
    
    if (theme === 'parchment') {
      root.style.setProperty('--background', '40 45% 88%');
      root.style.setProperty('--foreground', '215 25% 15%');
      root.style.setProperty('--card', '38 40% 92%');
      root.style.setProperty('--card-foreground', '215 25% 15%');
      root.style.setProperty('--primary', '42 65% 45%');
      root.style.setProperty('--primary-foreground', '40 45% 95%');
    } else if (theme === 'custom') {
      root.style.setProperty('--background', '174 55% 12%');
      root.style.setProperty('--foreground', '40 30% 90%');
      root.style.setProperty('--card', '174 45% 16%');
      root.style.setProperty('--card-foreground', '40 30% 90%');
      root.style.setProperty('--primary', '42 85% 58%');
      root.style.setProperty('--primary-foreground', '174 55% 12%');
    } else {
      // Reset to midnight (default)
      root.style.setProperty('--background', '215 25% 8%');
      root.style.setProperty('--foreground', '40 30% 90%');
      root.style.setProperty('--card', '215 20% 12%');
      root.style.setProperty('--card-foreground', '40 30% 90%');
      root.style.setProperty('--primary', '42 65% 62%');
      root.style.setProperty('--primary-foreground', '215 25% 8%');
    }
    
    toast({
      title: 'Theme Applied',
      description: `Switched to ${theme} theme`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-primary gold-glow">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your preferences and notifications</p>
      </div>

      <div className="grid gap-6 max-w-3xl">
        <Card className="panel-ornate">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure alert and notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Price Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts when watchlist items meet conditions
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Market Insights</Label>
                <p className="text-sm text-muted-foreground">
                  Get AI-powered market recommendations
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="panel-ornate">
          <CardHeader>
            <CardTitle>Data Preferences</CardTitle>
            <CardDescription>Control data refresh and snapshot settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Snapshot Frequency</Label>
              <p className="text-sm text-muted-foreground mb-2">
                How often to fetch new auction data (in minutes)
              </p>
              <Input type="number" defaultValue="60" min="15" max="180" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-refresh Charts</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically update charts with new data
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="panel-ornate">
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Customize your dashboard appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme Preset</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={selectedTheme === 'midnight' ? 'default' : 'outline'} 
                  className="h-20 flex-col gap-1"
                  onClick={() => handleThemeChange('midnight')}
                >
                  <div className="w-full h-8 bg-gradient-to-br from-[#141925] to-[#1a202e] rounded border border-border" />
                  <span className="text-xs">Midnight</span>
                </Button>
                <Button 
                  variant={selectedTheme === 'parchment' ? 'default' : 'outline'} 
                  className="h-20 flex-col gap-1"
                  onClick={() => handleThemeChange('parchment')}
                >
                  <div className="w-full h-8 bg-gradient-to-br from-[#e8dcc4] to-[#d4c4a8] rounded border border-border" />
                  <span className="text-xs">Parchment</span>
                </Button>
                <Button 
                  variant={selectedTheme === 'custom' ? 'default' : 'outline'} 
                  className="h-20 flex-col gap-1"
                  onClick={() => handleThemeChange('custom')}
                >
                  <div className="w-full h-8 bg-gradient-to-br from-[#163b38] to-[#d4a843] rounded border border-border" />
                  <span className="text-xs">Custom</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {user?.isAdmin && (
          <Card className="panel-ornate border-primary/30">
            <CardHeader>
              <CardTitle className="text-primary">Admin Controls</CardTitle>
              <CardDescription>Manage user registration and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow New Signups</Label>
                  <p className="text-sm text-muted-foreground">
                    Control whether new users can register accounts
                  </p>
                </div>
                <Switch 
                  checked={signupEnabled}
                  onCheckedChange={handleSignupToggle}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleResetToDefaults}>Reset to Defaults</Button>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
