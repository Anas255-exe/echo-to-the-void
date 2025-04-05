
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import UserProfile from '@/components/UserProfile';
import NearbyUsers from '@/components/NearbyUsers';
import GroupsView from '@/components/GroupsView';
import MessageView from '@/components/MessageView';
import MapView from '@/components/MapView';
import QRCodeView from '@/components/QRCodeView';
import { Group } from '@/utils/offlineUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, Bluetooth, Network } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isProfileSet, setIsProfileSet] = useState(false);
  const { toast } = useToast();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
  };

  const handleBackFromMessages = () => {
    setSelectedGroup(null);
  };

  const handleProfileComplete = (profile: { name: string; avatar?: string }) => {
    console.log('Profile created:', profile);
    setIsProfileSet(true);
    toast({
      title: "Welcome to EchoMesh!",
      description: "Your offline communication app is ready. Start by discovering nearby users."
    });
  };

  // If user hasn't set up their profile yet
  if (!isProfileSet) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 container mx-auto max-w-md flex flex-col justify-center py-12 px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-echomesh-primary">EchoMesh</h1>
            <p className="text-xl text-gray-600 mb-8">Connect Without Internet</p>
            
            <div className="flex justify-center space-x-6 mb-10">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-echomesh-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Wifi size={24} className="text-echomesh-primary" />
                </div>
                <span className="text-sm">WiFi Direct</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-echomesh-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Bluetooth size={24} className="text-echomesh-primary" />
                </div>
                <span className="text-sm">Bluetooth</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-echomesh-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Network size={24} className="text-echomesh-primary" />
                </div>
                <span className="text-sm">Mesh</span>
              </div>
            </div>
          </div>
          
          <UserProfile onComplete={handleProfileComplete} />
        </div>
      </div>
    );
  }

  // If a group is selected, show messages
  if (selectedGroup) {
    return (
      <Layout activeTab="messages" onTabChange={handleTabChange}>
        <div className="h-[calc(100vh-8rem)]">
          <MessageView group={selectedGroup} onBack={handleBackFromMessages} />
        </div>
      </Layout>
    );
  }

  // Main app layout with tabs
  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange}>
      {activeTab === 'discover' && (
        <div className="space-y-6">
          <NearbyUsers />
        </div>
      )}
      
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <GroupsView onSelectGroup={handleSelectGroup} />
        </div>
      )}
      
      {activeTab === 'nearby' && (
        <div className="space-y-6">
          <MapView />
        </div>
      )}
      
      {activeTab === 'connect' && (
        <div className="space-y-6">
          <QRCodeView />
        </div>
      )}
    </Layout>
  );
};

export default Index;
