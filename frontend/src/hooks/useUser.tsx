import { useState, useEffect } from 'react';

type User = {
  id: number;
  username: string;
  email: string;
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/users/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading };
}