
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { User } from '@/lucide-react';

const UserProfile: React.FC<{
  onComplete: (profile: { name: string; avatar?: string }) => void;
}> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to continue",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate creating profile
    setTimeout(() => {
      onComplete({ name, avatar });
      setIsLoading(false);
      
      toast({
        title: "Profile Created!",
        description: "Your profile has been set up successfully.",
      });
    }, 1000);
  };

  // For a real app, we would handle file uploads here
  const handleAvatarClick = () => {
    // Simulate avatar selection from a set of defaults
    const avatars = [
      'https://i.pravatar.cc/150?img=1',
      'https://i.pravatar.cc/150?img=2',
      'https://i.pravatar.cc/150?img=3',
      'https://i.pravatar.cc/150?img=4',
    ];
    
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    setAvatar(randomAvatar);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create Your Profile</CardTitle>
        <CardDescription>
          Set up your profile to connect with others nearby
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-3">
            <Avatar 
              className="w-24 h-24 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleAvatarClick}
            >
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-echomesh-primary text-white">
                <User size={36} />
              </AvatarFallback>
            </Avatar>
            <div className="text-sm text-muted-foreground">Tap to change</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full gradient-bg hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? "Creating Profile..." : "Continue"}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Your profile is only stored on this device
      </CardFooter>
    </Card>
  );
};

export default UserProfile;
