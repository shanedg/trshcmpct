import axios, { AxiosResponse, type AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';

export type UseRequestReturnType<T> = {
  data: T | null,
  error: Error | null,
  isLoading: boolean,
};

/**
 * Wrap network requests in a standard hook interface
 * @param url Request url
 * @param config Request configuration
 * @returns A hook for wrapping network requests in a standard interface
 */
export const useRequest = <T, D = never>(url: string, config?: AxiosRequestConfig<D>) => {
  return (): UseRequestReturnType<T> => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
      const controller = new AbortController();

      if (data === null && error === null) {
        setIsLoading(true);
        axios.request<T>({
          signal: controller.signal,
          url,
          ...(config ? config : {})
        })
          .then((response: AxiosResponse<T>) => {
            setData(response.data);
            setIsLoading(false);
          })
          .catch((error: Error) => {
            // Aborting a request throws an error that should be ignored
            // https://axios-http.com/docs/cancellation
            // Canceled, stale requests do not change the loading state
            // because either:
            // 1. the hook was unmounted before the request completed; or
            // 2. a more recent request is now in-flight
            if (!axios.isCancel(error)) {
              setError(error);
              setIsLoading(false);
            }
          });
      }

      // Cancel stale in-flight requests when cleaned up
      return () => controller.abort();
    }, []);

    return {
      data,
      error,
      isLoading,
    };
  };
};
