"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type UserProfile = {
  username: string;
  email: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        // If no token, redirect to login page
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/users/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // If token is invalid or expired, also redirect to login
          if (response.status === 401) {
              router.push('/login');
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10">Could not load profile. Please try logging in again.</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Your Profile</h1>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</p>
            <p className="text-lg font-semibold">{user.username}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>
        </div>
      </div>
    </main>
  );
}