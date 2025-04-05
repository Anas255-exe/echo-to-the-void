
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, User, Check, CheckCheck, AlertCircle } from 'lucide-react';
import { Group, Message } from '@/utils/offlineUtils';

const MessageView: React.FC<{
  group: Group;
  onBack: () => void;
}> = ({ group, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(group.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user', // In a real app, this would be the actual user ID
      text: newMessage,
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate message delivery status change
    setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check size={14} />;
      case 'delivered':
        return <CheckCheck size={14} />;
      case 'read':
        return <CheckCheck size={14} className="text-echomesh-primary" />;
      case 'failed':
        return <AlertCircle size={14} className="text-destructive" />;
      default:
        return null;
    }
  };

  const isCurrentUser = (senderId: string) => senderId === 'current-user';

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-1 mr-2">
          <ArrowLeft size={20} />
        </Button>
        <CardTitle className="flex items-center text-base">
          <div className="bg-echomesh-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-2">
            <User size={16} className="text-echomesh-primary" />
          </div>
          {group.name}
        </CardTitle>
        <div className="text-xs text-muted-foreground">
          {group.members.length} members
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="flex flex-col space-y-2 p-4">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-10">
              <div className="text-center">
                <div className="bg-gray-100 inline-flex rounded-full p-4 mb-4">
                  <Send size={24} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No messages yet</p>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const sender = group.members.find(m => m.id === message.senderId);
              const isSentByCurrentUser = isCurrentUser(message.senderId);
              
              return (
                <div 
                  key={message.id}
                  className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex flex-col max-w-[75%]">
                    {!isSentByCurrentUser && (
                      <div className="flex items-center mb-1 ml-1">
                        <Avatar className="h-5 w-5 mr-1">
                          <AvatarImage src={sender?.avatar} />
                          <AvatarFallback className="text-[8px] bg-echomesh-primary/20">
                            {sender?.name.substring(0, 2) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{sender?.name || "Unknown"}</span>
                      </div>
                    )}
                    <div className={`rounded-lg px-3 py-2 ${
                      isSentByCurrentUser 
                        ? 'bg-echomesh-primary text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {message.text}
                    </div>
                    <div className={`flex text-xs text-muted-foreground mt-1 ${
                      isSentByCurrentUser ? 'justify-end mr-1' : 'ml-1'
                    }`}>
                      {formatTime(message.timestamp)}
                      {isSentByCurrentUser && (
                        <span className="ml-1">{getStatusIcon(message.status)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <div className="p-3 border-t">
        <div className="flex">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="mr-2"
          />
          <Button onClick={handleSendMessage} className="gradient-bg px-3">
            <Send size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MessageView;
