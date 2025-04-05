
import Peer, { DataConnection } from 'peerjs';
import { User, ConnectionType } from './offlineUtils';

// Create a type for peer discovery events
type DiscoveryEventType = 'user-discovered' | 'user-disconnected' | 'connection-received';
type DiscoveryCallback = (event: DiscoveryEventType, data: any) => void;

export interface PeerUser extends User {
  peerId: string;
}

interface PeerMessage {
  type: 'discovery' | 'message' | 'disconnect';
  sender: PeerUser;
  content?: any;
}

class PeerDiscoveryService {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private discoveredUsers: Map<string, PeerUser> = new Map();
  private callbacks: DiscoveryCallback[] = [];
  private userId: string;
  private userName: string;
  private userAvatar?: string;
  private isInitialized: boolean = false;

  constructor() {
    // Generate a random user ID if not provided
    this.userId = Math.random().toString(36).substring(2, 15);
    this.userName = 'Anonymous';
  }

  initialize(userName: string, avatar?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.userName = userName;
      this.userAvatar = avatar;
      
      try {
        // Create a new Peer instance with a random ID
        this.peer = new Peer();
        
        this.peer.on('open', (id) => {
          console.log('My peer ID is: ' + id);
          this.userId = id;
          this.isInitialized = true;
          
          // Listen for incoming connections
          this.peer.on('connection', (conn) => {
            this.handleConnection(conn);
          });
          
          this.peer.on('error', (err) => {
            console.error('Peer connection error:', err);
            reject(err);
          });
          
          resolve(id);
        });
      } catch (error) {
        console.error('Failed to initialize peer:', error);
        reject(error);
      }
    });
  }

  // Start broadcasting presence to the given peer IDs
  broadcastPresence(peerIds: string[]) {
    if (!this.isInitialized || !this.peer) {
      console.error('Peer discovery not initialized');
      return;
    }

    const currentUser: PeerUser = {
      id: this.userId,
      peerId: this.userId,
      name: this.userName,
      avatar: this.userAvatar,
      connectionType: 'wifi-direct',
      lastSeen: new Date(),
    };

    peerIds.forEach(peerId => {
      if (!this.connections.has(peerId)) {
        try {
          const conn = this.peer!.connect(peerId);
          
          conn.on('open', () => {
            // Send our user info
            const message: PeerMessage = {
              type: 'discovery',
              sender: currentUser,
            };
            
            conn.send(message);
            this.connections.set(peerId, conn);
            
            // Set up listener for incoming data
            conn.on('data', (data) => {
              this.handleIncomingData(data, conn);
            });
            
            conn.on('close', () => {
              this.connections.delete(peerId);
              this.discoveredUsers.delete(peerId);
              this.notifyCallbacks('user-disconnected', { peerId });
            });
          });
        } catch (error) {
          console.error(`Failed to connect to peer ${peerId}:`, error);
        }
      }
    });
  }

  // Connect to a specific peer by ID
  connectToPeer(peerId: string): Promise<boolean> {
    if (!this.isInitialized || !this.peer) {
      return Promise.reject('Peer discovery not initialized');
    }

    return new Promise((resolve, reject) => {
      try {
        const conn = this.peer!.connect(peerId);
        
        conn.on('open', () => {
          // Send our user info
          const message: PeerMessage = {
            type: 'discovery',
            sender: {
              id: this.userId,
              peerId: this.userId,
              name: this.userName,
              avatar: this.userAvatar,
              connectionType: 'wifi-direct',
              lastSeen: new Date(),
            },
          };
          
          conn.send(message);
          this.connections.set(peerId, conn);
          
          // Set up listener for incoming data
          conn.on('data', (data) => {
            this.handleIncomingData(data, conn);
          });
          
          conn.on('close', () => {
            this.connections.delete(peerId);
            this.discoveredUsers.delete(peerId);
            this.notifyCallbacks('user-disconnected', { peerId });
          });
          
          resolve(true);
        });
        
        conn.on('error', (err) => {
          console.error('Connection error:', err);
          reject(err);
        });
      } catch (error) {
        console.error(`Failed to connect to peer ${peerId}:`, error);
        reject(error);
      }
    });
  }

  private handleConnection(conn: DataConnection) {
    const peerId = conn.peer;
    
    conn.on('open', () => {
      this.connections.set(peerId, conn);
      
      // Notify that we received a connection
      this.notifyCallbacks('connection-received', { peerId });
      
      // Set up listener for incoming data
      conn.on('data', (data) => {
        this.handleIncomingData(data, conn);
      });
      
      conn.on('close', () => {
        this.connections.delete(peerId);
        this.discoveredUsers.delete(peerId);
        this.notifyCallbacks('user-disconnected', { peerId });
      });
    });
  }

  private handleIncomingData(data: any, conn: DataConnection) {
    const message = data as PeerMessage;
    
    if (message.type === 'discovery') {
      const user = message.sender;
      
      // Add approximate distance (simulated for now, but could use geolocation)
      user.distance = Math.floor(Math.random() * 200) + 10; 
      
      this.discoveredUsers.set(user.peerId, user);
      this.notifyCallbacks('user-discovered', user);
    }
  }

  // Subscribe to discovery events
  subscribe(callback: DiscoveryCallback) {
    this.callbacks.push(callback);
    
    // Immediately notify of all currently discovered users
    this.discoveredUsers.forEach(user => {
      callback('user-discovered', user);
    });
  }

  // Unsubscribe from discovery events
  unsubscribe(callback: DiscoveryCallback) {
    const index = this.callbacks.indexOf(callback);
    if (index !== -1) {
      this.callbacks.splice(index, 1);
    }
  }

  private notifyCallbacks(event: DiscoveryEventType, data: any) {
    this.callbacks.forEach(callback => {
      callback(event, data);
    });
  }

  // Get all currently discovered users
  getDiscoveredUsers(): PeerUser[] {
    return Array.from(this.discoveredUsers.values());
  }

  // Get your own peer ID
  getMyPeerId(): string | null {
    if (!this.isInitialized) return null;
    return this.userId;
  }

  // Disconnect from all peers and clean up
  disconnect() {
    this.connections.forEach(conn => {
      conn.close();
    });
    
    this.connections.clear();
    this.discoveredUsers.clear();
    
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    
    this.isInitialized = false;
  }
}

// Create a singleton instance
export const peerDiscovery = new PeerDiscoveryService();

// Export a function to generate a QR code data with the peer ID
export const generatePeerConnectionQRData = (): string | null => {
  const peerId = peerDiscovery.getMyPeerId();
  if (!peerId) return null;
  
  const data = {
    peerId,
    timestamp: Date.now(),
    type: 'peer-connect',
  };
  
  return JSON.stringify(data);
};
