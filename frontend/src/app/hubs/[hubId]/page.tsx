"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import Link from 'next/link'; // Import the Link component

// Define types for our data
type HubDetail = {
  id: number;
  name: string;
  description: string;
  owner: string;
  members: { id: number; username: string; email: string }[];
};

type Channel = {
  id: number;
  name: string;
  owner: string;
};

export default function HubDetailPage() {
  const params = useParams();
  const hubId = params.hubId;

  const [hub, setHub] = useState<HubDetail | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newChannelName, setNewChannelName] = useState('');

  useEffect(() => {
    if (!hubId) return;
    const fetchHubData = async () => {
      try {
        const [hubRes, channelsRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/hubs/${hubId}/`),
          fetch(`http://127.0.0.1:8000/api/hubs/${hubId}/channels/`),
        ]);
        if (!hubRes.ok || !channelsRes.ok) {
          throw new Error('Failed to fetch hub data');
        }
        const hubData = await hubRes.json();
        const channelsData = await channelsRes.json();
        setHub(hubData);
        setChannels(channelsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHubData();
  }, [hubId]);

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      alert('You must be logged in to create a channel.');
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/hubs/${hubId}/channels/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: newChannelName }),
      });
      if (!response.ok) {
        throw new Error('Failed to create channel.');
      }
      const newChannel = await response.json();
      setChannels([...channels, newChannel]); 
      setNewChannelName('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center">Loading hub...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!hub) return <p>Hub not found.</p>;

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">{hub.name}</h1>
        <p className="text-lg text-gray-600 mb-6">{hub.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Channels</h2>
            <form onSubmit={handleCreateChannel} className="flex gap-2 mb-4">
              <Input
                type="text"
                placeholder="New channel name"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                required
              />
              <Button type="submit">Create</Button>
            </form>

            {channels.length > 0 ? (
              <div className="space-y-2">
                {channels.map(channel => (
                  <Link href={`/hubs/${hubId}/channels/${channel.id}`} key={channel.id}>
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                      #{channel.name}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p>No channels in this hub yet.</p>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Members ({hub?.members?.length ?? 0})</h2>
            <div className="space-y-2">
              {hub?.members?.map(member => (
                <div key={member.id} className="p-2 text-sm">
                  {member.username}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
