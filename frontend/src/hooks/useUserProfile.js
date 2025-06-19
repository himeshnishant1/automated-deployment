import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES, API_CONFIG } from '../config/api';

export default function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          throw new Error('No auth token');
        }
        
        const response = await axios.get(API_ROUTES.USER_PROFILE, {
          ...API_CONFIG,
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  return { profile, loading, error };
} 