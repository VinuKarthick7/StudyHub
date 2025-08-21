"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link
import { Button } from './Button'; // Import Button

// ... (the 'type Hub' definition remains the same) ...
type Hub = {
    id: number;
    name: string;
    description: string;
    owner: string;
    member_count: number;
};


export const HubList = () => {
  // ... (the useState and useEffect hooks remain the same) ...
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHubs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/hubs/');
        if (!response.ok) {
          throw new Error('Data could not be fetched!');
        }
        const data = await response.json();
        setHubs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHubs();
  }, []);

  if (loading) return <p className="text-center">Loading hubs...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Available Hubs</h2>
        {/* --- New Button Below --- */}
        <Link href="/hubs/create">
          <Button>Create a Hub</Button>
        </Link>
      </div>
      {hubs.length === 0 ? (
        <p>No hubs found. Why not create one?</p>
      ) : (
        // ... (the rest of the component remains the same) ...
        <div className="space-y-4">
            {hubs.map((hub) => (
            <div key={hub.id} className="p-4 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold">{hub.name}</h3>
                <p className="text-gray-600">{hub.description}</p>
                <div className="text-sm text-gray-500 mt-2">
                <span>Owner: {hub.owner}</span> | <span>Members: {hub.member_count}</span>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};