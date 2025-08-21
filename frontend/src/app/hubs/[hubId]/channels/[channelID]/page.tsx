"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

type Message = {
  username: string;
  message: string;
  timestamp: string;
};

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.channelId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for auto-scrolling

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // This effect runs every time the messages array changes

  useEffect(() => {
    if (!channelId) return;

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      alert("You must be logged in to chat.");
      return;
    }

    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${channelId}/`
    );
    socketRef.current = socket;

    socket.onopen = () => console.log("WebSocket connection established");
    socket.onclose = () => console.log("WebSocket connection closed");
    socket.onerror = (error) => console.error("WebSocket error:", error);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prevMessages => [...prevMessages, data]);
    };

    return () => {
      socket.close();
    };
  }, [channelId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socketRef.current) {
      socketRef.current.send(JSON.stringify({ 'message': newMessage }));
      setNewMessage('');
    }
  };

  return (
    <main className="flex flex-col h-screen p-4 max-w-4xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-4">Channel Chat</h1>
      <div className="flex-grow overflow-y-auto mb-4 p-4 border rounded bg-white dark:bg-gray-800">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.username}</strong> 
            <span className="text-gray-500 text-xs ml-2">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
            <p className="ml-1">{msg.message}</p>
          </div>
        ))}
        {/* Empty div at the end of the list to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          autoComplete="off"
        />
        <Button type="submit">Send</Button>
      </form>
    </main>
  );
}
