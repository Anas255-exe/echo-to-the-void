
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass, MapPin, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

// This is a simplified map view since we can't use actual maps without APIs
const MapView: React.FC = () => {
  const [isLocating, setIsLocating] = useState(false);
  
  const handleFindNearby = () => {
    setIsLocating(true);
    
    // Simulate location finding
    setTimeout(() => {
      setIsLocating(false);
      
      toast({
        title: "Location Shared",
        description: "Your location is now visible to nearby users",
      });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Nearby</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-full max-w-xs aspect-square bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
            {/* Simulated compass/map */}
            <div className="absolute">
              <div className="relative w-64 h-64">
                {/* User in the center */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                    <AvatarFallback className="bg-echomesh-primary text-white">
                      <User size={24} />
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Compass directions */}
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 font-bold text-lg">N</div>
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 font-bold text-lg">S</div>
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 font-bold text-lg">W</div>
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2 font-bold text-lg">E</div>
                
                {/* Simulated users nearby */}
                <div className="absolute top-[30%] right-[30%]">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-lg">
                    <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                    <AvatarFallback>AK</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute bottom-[25%] left-[20%]">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-lg">
                    <AvatarImage src="https://i.pravatar.cc/150?img=2" />
                    <AvatarFallback>JT</AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Compass rose */}
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <div className="w-56 h-56 border-2 border-gray-300 rounded-full"></div>
                  <div className="absolute w-52 h-52 border border-gray-300/50 rounded-full"></div>
                  <div className="absolute w-36 h-36 border border-gray-300/30 rounded-full"></div>
                </div>
                
                {/* Compass needle */}
                <div className="absolute inset-0 flex items-center justify-center z-1">
                  <div className="w-1 h-1/2 bg-gradient-to-t from-transparent to-red-500 origin-bottom transform rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full">
            <Button 
              className="w-full gradient-bg mb-2"
              onClick={handleFindNearby}
              disabled={isLocating}
            >
              {isLocating ? (
                <>
                  <div className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  Locating...
                </>
              ) : (
                <>
                  <Compass size={18} className="mr-2" />
                  Find Nearby
                </>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Temporarily share your location to find people near you
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;
