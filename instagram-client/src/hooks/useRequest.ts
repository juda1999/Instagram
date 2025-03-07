import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

export const useRequest = <T = any>(
  url: string,
  options: AxiosRequestConfig,
  auth = true
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
        const response = await axios(`http://localhost:3001/${url}`, {
          ...options,
          headers: {
            ...options.headers,
            ...(auth
              ? {
                  Authorization: localStorage.getItem('accessToken'),
                }
              : {}),
          },
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
