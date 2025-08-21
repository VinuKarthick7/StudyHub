"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function CreateHubPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      setError("You must be logged in to create a hub.");
      return;
    }

    const response = await fetch('http://127.0.0.1:8000/api/hubs/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name, description }),
    });

    if (response.ok) {
      router.push('/'); // Redirect to home page on success
    } else {
      const data = await response.json();
      setError('Failed to create hub. Please try again.');
      console.error('Error:', data);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-xs">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-2xl font-bold text-center mb-6">Create a New Hub</h1>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Hub Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Create Hub
          </Button>
          {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
        </form>
      </div>
    </main>
  );
}