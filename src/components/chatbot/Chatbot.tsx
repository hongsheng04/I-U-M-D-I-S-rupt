
"use client";

import type { FormEvent } from 'react';
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { chatWithBot, type ChatbotInput, type ChatbotOutput } from '@/ai/flows/chatbotFlow';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'initial-greeting', 
      text: 'Hello! I am the ParkWatch Pass AI Assistant. How can I help you today?', 
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaViewportRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const scrollToBottom = () => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTo({
        top: scrollAreaViewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    const historyPayload: ChatbotInput['history'] = [];
    const messagesForHistory = [...messages]; 
    
    for (let i = 0; i < messagesForHistory.length; i++) {
      if (messagesForHistory[i].sender === 'user' && messagesForHistory[i+1]?.sender === 'ai') {
        historyPayload.push({
          user: messagesForHistory[i].text,
          model: messagesForHistory[i+1].text,
        });
        i++; 
      }
    }


    try {
      const aiResponse = await chatWithBot({ message: trimmedInput, history: historyPayload });
      const newAiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: aiResponse.reply,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, newAiMessage]);
    } catch (error) {
      console.error('Error calling chatbot flow:', error);
      toast({
        title: 'Error',
        description: 'Could not get a response from the assistant. Please try again.',
        variant: 'destructive',
      });
       const errorAiMessage: Message = {
        id: `ai-error-${Date.now()}`,
        text: "I'm sorry, I had trouble connecting. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl flex flex-col h-[calc(100vh-10rem)] sm:h-[70vh] max-h-[700px]">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Bot /> ParkWatch Pass AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full" viewportRef={scrollAreaViewportRef}>
          <div className="p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot size={20} /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 shadow ${
                    message.sender === 'user'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                   <p className="text-xs text-muted-foreground/70 mt-1 text-right">
                    {isMounted ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ' '}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><User size={20} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* For auto-scrolling */}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
          <Input
            type="text"
            placeholder="Ask a question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-grow bg-background"
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()} className="bg-primary hover:bg-primary/90">
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
