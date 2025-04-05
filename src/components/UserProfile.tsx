import React, { useState } from 'react';
import { Camera, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserProfileProps {
  onComplete: (profile: { name: string; avatar?: string }) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Simulate file upload with delay
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatar(e.target?.result as string);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim()) {
      const profile = { name, avatar };
      
      // Store profile in localStorage for use by peer discovery
      localStorage.setItem('userProfile', JSON.stringify(profile));
      
      onComplete(profile);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Your Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-echomesh-primary text-white text-xl">
                <User size={32} />
              </AvatarFallback>
            </Avatar>
            
            <div className="absolute bottom-0 right-0">
              <Label 
                htmlFor="avatar-upload" 
                className="flex items-center justify-center w-8 h-8 rounded-full bg-echomesh-primary text-white cursor-pointer shadow-md"
              >
                <Camera size={16} />
              </Label>
              <Input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
                disabled={isUploading}
              />
            </div>
          </div>
          
          {isUploading && (
            <span className="text-sm text-gray-500">Uploading...</span>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={handleNameChange}
            required
            className="w-full"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full gradient-bg"
          disabled={!name.trim() || isUploading}
        >
          Continue
        </Button>
      </form>
    </div>
  );
};

export default UserProfile;
