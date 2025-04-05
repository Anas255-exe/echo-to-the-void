
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateConnectionQRData } from '@/utils/offlineUtils';
import { generatePeerConnectionQRData, peerDiscovery } from '@/utils/peerDiscovery';
import { QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const QRCodeView: React.FC = () => {
  const [qrData, setQrData] = useState<string>('');
  const [usingPeerDiscovery, setUsingPeerDiscovery] = useState(false);

  useEffect(() => {
    initializeQRCode();
  }, []);

  const initializeQRCode = () => {
    // Try to use real peer discovery QR code first
    const peerQRData = generatePeerConnectionQRData();
    
    if (peerQRData) {
      setQrData(peerQRData);
      setUsingPeerDiscovery(true);
    } else {
      // Fall back to simulated QR code
      const userId = 'current-user'; // In a real app, this would be the actual user ID
      setQrData(generateConnectionQRData(userId));
      setUsingPeerDiscovery(false);
    }
  };

  const refreshQRCode = () => {
    initializeQRCode();
    
    toast({
      title: "QR Code Refreshed",
      description: "Your connection QR code has been updated",
    });
  };

  // This is a simple QR code display component
  // In a real app, we would import a QR code generation library
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Quick Connect
          {usingPeerDiscovery && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              (WebRTC Enabled)
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Let others scan this code to connect with you directly
          {usingPeerDiscovery && (
            <div className="mt-2 text-xs p-2 bg-echomesh-primary/10 rounded-md">
              <strong>Your Peer ID:</strong> {peerDiscovery.getMyPeerId() || 'Not connected'}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-56 h-56 bg-white p-4 border border-gray-200 rounded-lg mb-4 flex items-center justify-center">
          {/* This is a simple placeholder QR code - in a real app we'd use a proper QR code generator */}
          <div className="w-full h-full bg-white border border-gray-300 rounded grid grid-cols-5 grid-rows-5 gap-1 p-2">
            {/* Fixed pattern for the QR corners */}
            <div className="col-span-1 row-span-1 bg-black rounded"></div>
            <div className="col-span-1 row-span-1"></div>
            <div className="col-span-1 row-span-1 bg-black rounded"></div>
            <div className="col-span-1 row-span-1"></div>
            <div className="col-span-1 row-span-1 bg-black rounded"></div>
            
            <div className="col-span-1 row-span-1"></div>
            <div className="col-span-3 row-span-3 flex items-center justify-center">
              <QrCode size={50} />
            </div>
            <div className="col-span-1 row-span-1"></div>
            
            <div className="col-span-1 row-span-1 bg-black rounded"></div>
            <div className="col-span-1 row-span-1"></div>
            <div className="col-span-1 row-span-1 bg-black rounded"></div>
            <div className="col-span-1 row-span-1"></div>
            <div className="col-span-1 row-span-1 bg-black rounded"></div>
          </div>
        </div>
        
        <p className="text-sm text-center text-muted-foreground mb-3">
          QR code expires after 5 minutes for security
        </p>
        
        <Button 
          variant="outline" 
          onClick={refreshQRCode}
          className="mb-2"
        >
          Refresh Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRCodeView;
