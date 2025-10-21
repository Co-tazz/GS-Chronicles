import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Globe } from "lucide-react";
import realmsData from "@/data/mock/realms.json";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Realms() {
  const [search, setSearch] = useState("");
  const [selectedRealm, setSelectedRealm] = useState<string | null>(null);
  const { toast } = useToast();
  
  const filteredRealms = realmsData.filter((realm) =>
    realm.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRealmSelect = (realmName: string, realmId: string) => {
    setSelectedRealm(realmId);
    toast({
      title: "Realm Selected",
      description: `Connected to ${realmName}`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-primary gold-glow">EU Realms</h1>
        <p className="text-muted-foreground mt-2">Select and manage connected realms</p>
      </div>
      
      <Card className="panel-ornate">
        <CardHeader>
          <CardTitle className="text-lg">Search Realms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search realm name..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRealms.map((realm) => (
          <Card 
            key={realm.id} 
            className={`panel-ornate hover-gold cursor-pointer transition-all ${
              selectedRealm === realm.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleRealmSelect(realm.name, realm.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-accent" />
                  <CardTitle className="text-lg font-display">{realm.name}</CardTitle>
                </div>
                <Badge variant={selectedRealm === realm.id ? "default" : "outline"}>
                  {realm.region}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connected: {realm.connectedRealms.join(", ")}
              </p>
              <p className="text-xs text-muted-foreground mt-2">ID: {realm.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
