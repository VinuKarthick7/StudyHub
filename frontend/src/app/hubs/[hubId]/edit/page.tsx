"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function EditHubPage() {
  const router = useRouter();
  const params = useParams();
  const hubId = params.hubId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // New state for saving feedback
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hubId) return;

    // Fetch the current hub data to pre-fill the form
    const fetchHubData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/hubs/${hubId}/`);
        if (!response.ok) {
          throw new Error("Failed to fetch hub data.");
        }
        const data = await response.json();
        setName(data.name);
        setDescription(data.description);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHubData();
  }, [hubId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true); // Set saving state to true
    const accessToken = localStorage.getItem('access_token');

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/hubs/${hubId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        alert("Hub updated successfully!");
        router.push(`/hubs/${hubId}`);
      } else {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }
    } catch (err: any) {
      setError("Failed to update hub. You might not be the owner.");
      console.error(err);
    } finally {
      setIsSaving(false); // Set saving state back to false
    }
  };

  if (loading) return <p className="text-center mt-10">Loading hub data...</p>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-2xl font-bold text-center mb-6">Edit Hub</h1>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">
              Hub Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Hub Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <Input
              id="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {/* --- UPDATED BUTTONS SECTION --- */}
          <div className="flex items-center justify-between gap-4">
            <Link href={`/hubs/${hubId}`} className="w-full">
              <Button type="button" className="w-full bg-gray-200 text-black hover:bg-gray-300">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
          {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
        </form>
      </div>
    </main>
  );
}
