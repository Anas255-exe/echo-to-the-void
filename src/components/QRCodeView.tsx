
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateConnectionQRData } from '@/utils/offlineUtils';
import { generatePeerConnectionQRData, peerDiscovery } from '@/utils/peerDiscovery';
import { QrCode, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const QRCodeView: React.FC = () => {
  const [qrData, setQrData] = useState<string>('');
  const [usingPeerDiscovery, setUsingPeerDiscovery] = useState(false);
  const [peerIdToConnect, setPeerIdToConnect] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [myPeerId, setMyPeerId] = useState<string | null>(null);

  useEffect(() => {
    initializeQRCode();
    const id = peerDiscovery.getMyPeerId();
    setMyPeerId(id);
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

  const handleConnectToPeer = async () => {
    if (!peerIdToConnect.trim()) {
      toast({
        title: "Error",
        description: "Please enter a peer ID",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      await peerDiscovery.connectToPeer(peerIdToConnect);
      toast({
        title: "Connected",
        description: `Successfully connected to peer: ${peerIdToConnect}`,
      });
    } catch (error) {
      console.error('Failed to connect to peer:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to the specified peer. Check the ID and try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
      setPeerIdToConnect('');
    }
  };

  const copyPeerIdToClipboard = () => {
    if (myPeerId) {
      navigator.clipboard.writeText(myPeerId);
      toast({
        title: "Copied",
        description: "Your peer ID has been copied to clipboard",
      });
    }
  };

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
          {usingPeerDiscovery && myPeerId && (
            <div className="mt-2 text-xs p-2 bg-echomesh-primary/10 rounded-md">
              <div className="flex items-center justify-between">
                <span><strong>Your Peer ID:</strong> {myPeerId}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2"
                  onClick={copyPeerIdToClipboard}
                >
                  Copy
                </Button>
              </div>
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
          className="mb-4"
        >
          Refresh Code
        </Button>

        <div className="w-full border-t border-gray-200 pt-4 mt-2">
          <h3 className="font-medium mb-2 flex items-center">
            <Link size={16} className="mr-2" />
            Connect directly with Peer ID
          </h3>
          
          <div className="flex space-x-2 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Enter peer ID"
                value={peerIdToConnect}
                onChange={(e) => setPeerIdToConnect(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleConnectToPeer}
              disabled={isConnecting || !peerIdToConnect.trim()}
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" className="w-full">
                How to find and share your peer ID
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Finding peers</AlertDialogTitle>
                <AlertDialogDescription>
                  <p className="mb-2">To connect with others:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Make sure both devices are on the same network (WiFi or hotspot)</li>
                    <li>Share your Peer ID from the top of this screen</li>
                    <li>The other person should enter your Peer ID in their "Connect directly" field</li>
                    <li>For easier connection, have them scan your QR code if you're nearby</li>
                  </ol>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeView;
