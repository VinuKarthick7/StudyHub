
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('access_token');
      setIsLoggedIn(!!token);
    };
    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    router.push('/');
    router.refresh(); 
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              StudyHub
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/profile" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Login
                </Link>
                <Link href="/signup" className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};