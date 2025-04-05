
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessageSquare, MapPin, QrCode, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ConnectionStatus from './ConnectionStatus';
import { Group } from '@/utils/offlineUtils';

interface LayoutProps {
  children: React.ReactNode;
  onTabChange?: (tab: string) => void;
  onSelectGroup?: (group: Group) => void;
  activeTab?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onTabChange, 
  activeTab = 'discover' 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-echomesh-primary">
            EchoMesh
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <ConnectionStatus />
          
          <Sheet open={showSettings} onOpenChange={setShowSettings}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
                <SheetDescription>
                  Configure your connection preferences
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Connection</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="wifi-direct">WiFi Direct</Label>
                      <p className="text-xs text-muted-foreground">
                        Connect with users over WiFi
                      </p>
                    </div>
                    <Switch id="wifi-direct" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="bluetooth">Bluetooth</Label>
                      <p className="text-xs text-muted-foreground">
                        Connect with users over Bluetooth
                      </p>
                    </div>
                    <Switch id="bluetooth" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mesh">Mesh Network</Label>
                      <p className="text-xs text-muted-foreground">
                        Use other devices to extend range
                      </p>
                    </div>
                    <Switch id="mesh" defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Privacy</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="discoverability">Discoverability</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow others to find you
                      </p>
                    </div>
                    <Switch id="discoverability" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="location">Location Sharing</Label>
                      <p className="text-xs text-muted-foreground">
                        Share your approximate location
                      </p>
                    </div>
                    <Switch id="location" defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="new-connections">New Connections</Label>
                      <p className="text-xs text-muted-foreground">
                        Notify when someone connects
                      </p>
                    </div>
                    <Switch id="new-connections" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="messages">Messages</Label>
                      <p className="text-xs text-muted-foreground">
                        Notify for new messages
                      </p>
                    </div>
                    <Switch id="messages" defaultChecked />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-4 px-4 md:px-6 max-w-5xl">
        {children}
      </main>
      
      <footer className="sticky bottom-0 bg-white border-t">
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="discover" className="py-3">
              <Users size={20} className="mb-1" />
              <span className="text-xs block">Discover</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="py-3">
              <MessageSquare size={20} className="mb-1" />
              <span className="text-xs block">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="nearby" className="py-3">
              <MapPin size={20} className="mb-1" />
              <span className="text-xs block">Nearby</span>
            </TabsTrigger>
            <TabsTrigger value="connect" className="py-3">
              <QrCode size={20} className="mb-1" />
              <span className="text-xs block">Connect</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </footer>
    </div>
  );
};

export default Layout;
