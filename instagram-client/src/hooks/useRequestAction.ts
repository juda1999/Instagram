import { useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

export const useRequestAction = <T = any>(
  url: string,
  options: AxiosRequestConfig,
  auth = true
): { action: (data: T) => Promise<any>; loading: boolean; error?: string } => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const action = async (data: T) => {
    setLoading(true);
    setError(null);
    try {
      return await axios(`http://localhost:3001/${url}`, {
        ...options,
        headers: {
          ...options.headers,
          ...(auth
            ? {
                Authorization: localStorage.getItem('accessToken'),
              }
            : {}),
        },
        data,
      });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return { action, loading, error };
};
