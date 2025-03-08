import { useState, useEffect } from 'react';
import { AxiosRequestConfig } from 'axios';
import api from '../api';

export const useRequest = <T = any>(
  url: string,
  options?: AxiosRequestConfig
): { data: T; loading: boolean; error?: string; refetch: () => void } => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState({});

  const refetch = () => setRefresh({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.request({
          url,
          ...(options ?? []),
        });
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options, refresh]);

  return { data, loading, error, refetch };
};
