
import React, { useEffect, useState } from 'react';
import { Wifi, Bluetooth, Network, AlertCircle } from 'lucide-react';
import { ConnectionStatus as StatusType, ConnectionType, getConnectionStatus } from '@/utils/offlineUtils';

const ConnectionStatus: React.FC = () => {
  const [status, setStatus] = useState<StatusType>('disconnected');
  const [type, setType] = useState<ConnectionType>('none');
  const [nearbyCount, setNearbyCount] = useState(0);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const result = await getConnectionStatus();
        setStatus(result.status);
        setType(result.type);
        setNearbyCount(result.nearbyCount);
      } catch (error) {
        console.error('Failed to get connection status:', error);
        setStatus('disconnected');
        setType('none');
        setNearbyCount(0);
      }
    };

    fetchStatus();
    
    // Poll for status changes
    const intervalId = setInterval(fetchStatus, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return `Connected via ${type} • ${nearbyCount} nearby`;
      case 'connecting':
        return `Connecting via ${type}...`;
      case 'disconnected':
        return 'Offline • No connections';
      default:
        return 'Unknown status';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'wifi-direct':
        return <Wifi size={18} />;
      case 'bluetooth':
        return <Bluetooth size={18} />;
      case 'mesh':
        return <Network size={18} />;
      default:
        return <AlertCircle size={18} />;
    }
  };

  return (
    <div className="flex items-center py-2 px-3 text-sm rounded-full bg-white border border-gray-200 shadow-sm">
      <span className={`connection-dot ${status}`}></span>
      <span className="mr-2">{getIcon()}</span>
      <span>{getStatusText()}</span>
    </div>
  );
};

export default ConnectionStatus;
