import { useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import api from '../api';

export const useRequestAction = <T = any>(
  url: string,
  options?: AxiosRequestConfig
): { action: (data?: T) => Promise<any>; loading: boolean; error?: string } => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const action = async (data?: T) => {
    setLoading(true);
    setError(null);
    try {
      return await api.request({
        url,
        data,
        ...options,
      });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return { action, loading, error };
};
