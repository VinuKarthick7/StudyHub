"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useUser } from '@/hooks/useUser';

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
  const router = useRouter();
  const hubId = params.hubId;
  const { user: currentUser } = useUser();

  const [hub, setHub] = useState<HubDetail | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [isMember, setIsMember] = useState(false); // New state to track membership

  useEffect(() => {
    if (!hubId) return;
    const fetchHubData = async () => {
      try {
        // ... (fetch logic remains the same)
        const [hubRes, channelsRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/hubs/${hubId}/`),
          fetch(`http://127.0.0.1:8000/api/hubs/${hubId}/channels/`),
        ]);
        if (!hubRes.ok || !channelsRes.ok) throw new Error('Failed to fetch hub data');
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

  // New effect to check membership status
  useEffect(() => {
    if (hub && currentUser) {
      const memberCheck = hub.members.some(member => member.id === currentUser.id);
      setIsMember(memberCheck);
    }
  }, [hub, currentUser]);

  const handleCreateChannel = async (e: React.FormEvent) => { /* ... (no changes) ... */ };
  const handleDeleteHub = async () => { /* ... (no changes) ... */ };

  // --- NEW JOIN/LEAVE HANDLERS ---
  const handleJoinOrLeave = async () => {
    const action = isMember ? 'leave' : 'join';
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      alert("You must be logged in.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/hubs/${hubId}/${action}/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      if (response.ok) {
        // Refresh the page to update member list and button state
        router.refresh(); 
      } else {
        const data = await response.json();
        throw new Error(data.detail || `Failed to ${action} hub.`);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };


  if (loading) return <p className="text-center">Loading hub...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!hub) return <p>Hub not found.</p>;

  const isOwner = currentUser?.username === hub.owner;

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-4xl font-bold">{hub.name}</h1>
            <p className="text-lg text-gray-600 mt-2">{hub.description}</p>
          </div>
          <div className="flex gap-2">
            {/* --- UPDATED BUTTON LOGIC --- */}
            {isOwner ? (
              <>
                <Link href={`/hubs/${hubId}/edit`}>
                  <Button className="bg-gray-200 text-black hover:bg-gray-300">Edit</Button>
                </Link>
                <Button onClick={handleDeleteHub} className="bg-red-600 hover:bg-red-700">
                  Delete
                </Button>
              </>
            ) : (
              currentUser && (
                <Button onClick={handleJoinOrLeave} className={isMember ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}>
                  {isMember ? 'Leave Hub' : 'Join Hub'}
                </Button>
              )
            )}
          </div>
        </div>
        
        {/* ... (The rest of the JSX remains the same) ... */}
      </div>
    </main>
  );
}
