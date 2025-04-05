
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center">
            <WifiOff size={40} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-3">Page Not Found</h1>
        
        <p className="text-lg text-gray-600 mb-6">
          Looks like you're trying to access a page that doesn't exist. Don't worry, you can still connect offline!
        </p>
        
        <Button asChild size="lg" className="gradient-bg">
          <Link to="/">
            <ArrowLeft size={18} className="mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
