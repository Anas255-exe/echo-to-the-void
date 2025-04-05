
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Wifi, Bluetooth, Network, User, Clock, MapPin } from 'lucide-react';
import { discoverNearbyUsers, User as UserType, ConnectionType } from '@/utils/offlineUtils';
import { toast } from '@/components/ui/use-toast';

const NearbyUsers: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const nearbyUsers = await discoverNearbyUsers();
      setUsers(nearbyUsers);
    } catch (error) {
      console.error('Failed to discover users:', error);
      toast({
        title: "Connection Error",
        description: "Failed to discover nearby users. Try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadUsers();
  };

  const handleConnect = (user: UserType) => {
    toast({
      title: "Connection Request Sent",
      description: `Connecting to ${user.name}...`,
    });
  };

  const getConnectionIcon = (type: ConnectionType | undefined) => {
    switch (type) {
      case 'wifi-direct':
        return <Wifi size={16} className="text-echomesh-primary" />;
      case 'bluetooth':
        return <Bluetooth size={16} className="text-echomesh-primary" />;
      case 'mesh':
        return <Network size={16} className="text-echomesh-primary" />;
      default:
        return null;
    }
  };

  const formatDistance = (distance: number | undefined) => {
    if (!distance) return 'Unknown';
    if (distance < 1000) {
      return `${distance}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  const formatLastSeen = (date: Date | undefined) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Nearby Users</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Scanning...' : 'Scan Again'}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 rounded-full border-4 border-echomesh-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-muted-foreground">Scanning for nearby users...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Avatar className="mr-3 h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-echomesh-primary/20">
                      <User size={18} />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="flex items-center text-xs text-muted-foreground space-x-2">
                      <span className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {formatLastSeen(user.lastSeen)}
                      </span>
                      <span className="flex items-center">
                        <MapPin size={12} className="mr-1" />
                        {formatDistance(user.distance)}
                      </span>
                      {user.connectionType && (
                        <span className="flex items-center">
                          {getConnectionIcon(user.connectionType)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleConnect(user)}
                >
                  Connect
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-100 inline-flex rounded-full p-3 mb-4">
              <Network size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No users found</h3>
            <p className="text-muted-foreground text-sm">
              Try moving to an area with more people
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NearbyUsers;
