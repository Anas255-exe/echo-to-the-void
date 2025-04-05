
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, User, Plus, MessageSquare } from 'lucide-react';
import { Group, getUserGroups } from '@/utils/offlineUtils';
import { toast } from '@/components/ui/use-toast';

const GroupsView: React.FC<{
  onSelectGroup: (group: Group) => void;
}> = ({ onSelectGroup }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const userGroups = await getUserGroups();
      setGroups(userGroups);
    } catch (error) {
      console.error('Failed to load groups:', error);
      toast({
        title: "Error Loading Groups",
        description: "Failed to load your groups. Try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Group Name Required",
        description: "Please enter a name for your group",
        variant: "destructive",
      });
      return;
    }

    const newGroup: Group = {
      id: `new-${Date.now()}`,
      name: newGroupName,
      members: [],
      messages: [],
      createdAt: new Date(),
    };

    setGroups([...groups, newGroup]);
    setNewGroupName('');
    setIsDialogOpen(false);

    toast({
      title: "Group Created",
      description: `Group "${newGroupName}" has been created.`,
    });
  };

  const formatLastMessage = (group: Group) => {
    if (group.messages.length === 0) {
      return "No messages yet";
    }

    const lastMessage = group.messages[group.messages.length - 1];
    const sender = group.members.find(m => m.id === lastMessage.senderId);
    
    return `${sender?.name || 'Unknown'}: ${lastMessage.text}`;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Groups</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus size={16} className="mr-1" />
                New Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input 
                    id="group-name" 
                    placeholder="Enter group name" 
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateGroup}>Create Group</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 rounded-full border-echomesh-primary border-t-transparent animate-spin"></div>
            </div>
          ) : groups.length > 0 ? (
            <div className="space-y-3">
              {groups.map((group) => (
                <div 
                  key={group.id}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer card-hover"
                  onClick={() => onSelectGroup(group)}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-echomesh-primary/10 flex items-center justify-center mr-3">
                      <Users size={18} className="text-echomesh-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{group.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {group.members.length} members
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center space-x-1">
                    <MessageSquare size={14} />
                    <span className="truncate">{formatLastMessage(group)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-100 inline-flex rounded-full p-3 mb-4">
                <Users size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No Groups Yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Create a group to start messaging offline
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus size={16} className="mr-1" />
                Create Group
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default GroupsView;
