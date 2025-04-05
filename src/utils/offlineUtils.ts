
// Types for our app
export type ConnectionType = 'wifi-direct' | 'bluetooth' | 'mesh' | 'none';
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export type User = {
  id: string;
  name: string;
  avatar?: string;
  lastSeen?: Date;
  distance?: number; // in meters
  connectionType?: ConnectionType;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read' | 'failed';
};

export type Group = {
  id: string;
  name: string;
  members: User[];
  messages: Message[];
  createdAt: Date;
};

// Simulate network discovery
export const discoverNearbyUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Mock data
      const users: User[] = [
        {
          id: '1',
          name: 'Alex Kim',
          avatar: 'https://i.pravatar.cc/150?img=1',
          lastSeen: new Date(),
          distance: 15,
          connectionType: 'wifi-direct',
        },
        {
          id: '2',
          name: 'Jordan Taylor',
          avatar: 'https://i.pravatar.cc/150?img=2',
          lastSeen: new Date(Date.now() - 5 * 60000), // 5 minutes ago
          distance: 35,
          connectionType: 'bluetooth',
        },
        {
          id: '3',
          name: 'Sam Rivera',
          avatar: 'https://i.pravatar.cc/150?img=3',
          lastSeen: new Date(Date.now() - 15 * 60000), // 15 minutes ago
          distance: 120,
          connectionType: 'mesh',
        },
        {
          id: '4',
          name: 'Morgan Chen',
          avatar: 'https://i.pravatar.cc/150?img=4',
          lastSeen: new Date(),
          distance: 200,
          connectionType: 'mesh',
        },
      ];
      resolve(users);
    }, 1500);
  });
};

// Simulate getting user groups
export const getUserGroups = (): Promise<Group[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const groups: Group[] = [
        {
          id: '1',
          name: 'Family',
          members: [
            {
              id: '1',
              name: 'Alex Kim',
              avatar: 'https://i.pravatar.cc/150?img=1',
            },
            {
              id: '2',
              name: 'Jordan Taylor',
              avatar: 'https://i.pravatar.cc/150?img=2',
            },
          ],
          messages: [
            {
              id: '1',
              senderId: '1',
              text: 'Is everyone ok?',
              timestamp: new Date(Date.now() - 3600000),
              status: 'read',
            },
            {
              id: '2',
              senderId: '2',
              text: 'Yes, we are safe. How about you?',
              timestamp: new Date(Date.now() - 3500000),
              status: 'read',
            },
          ],
          createdAt: new Date(Date.now() - 24 * 3600000),
        },
        {
          id: '2',
          name: 'Neighbors',
          members: [
            {
              id: '3',
              name: 'Sam Rivera',
              avatar: 'https://i.pravatar.cc/150?img=3',
            },
            {
              id: '4',
              name: 'Morgan Chen',
              avatar: 'https://i.pravatar.cc/150?img=4',
            },
          ],
          messages: [
            {
              id: '1',
              senderId: '3',
              text: 'Meeting at the park at 3pm',
              timestamp: new Date(Date.now() - 7200000),
              status: 'delivered',
            },
          ],
          createdAt: new Date(Date.now() - 48 * 3600000),
        },
      ];
      resolve(groups);
    }, 1000);
  });
};

// Simulate connection status
export const getConnectionStatus = (): Promise<{
  status: ConnectionStatus;
  type: ConnectionType;
  nearbyCount: number;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Randomly select status for simulation
      const statuses: ConnectionStatus[] = ['connected', 'connecting', 'disconnected'];
      const types: ConnectionType[] = ['wifi-direct', 'bluetooth', 'mesh', 'none'];
      
      const randomStatus = statuses[Math.floor(Math.random() * 3)];
      const randomType = randomStatus !== 'disconnected' 
        ? types[Math.floor(Math.random() * 3)] 
        : 'none';
      
      const nearbyCount = randomStatus !== 'disconnected' 
        ? Math.floor(Math.random() * 10) 
        : 0;
      
      resolve({
        status: randomStatus,
        type: randomType,
        nearbyCount,
      });
    }, 800);
  });
};

// Generate QR code data for connecting
export const generateConnectionQRData = (userId: string): string => {
  // In a real app, this would create a secure, temporary token
  const data = {
    userId,
    timestamp: Date.now(),
    type: 'direct-connect',
  };
  
  return JSON.stringify(data);
};
