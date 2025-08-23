// useSWRZustand.ts
import useSWR from "swr";
import { useEffect } from "react";
import { fetcher } from "@/lib/FetcherFunc";
import { apiRegistry } from "@/lib/ApiRegistry";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export function useApi<K extends keyof ApiTypes>(key: K) {
  const { url, selector, setter } = apiRegistry[key];

  const storeData = selector() as ApiTypes[K] | null;
  const setStoreData = setter() as (data: ApiTypes[K]) => void;

  // fetch returns { success, data, message }
  const { data: response, error, isLoading } = useSWR<ApiResponse<ApiTypes[K]>>(
    storeData ? null : key,
    () => fetcher<ApiResponse<ApiTypes[K]>>(url),
    {
      fallbackData: storeData ? { success: true, data: storeData } : undefined,
      revalidateOnFocus: false,
    }
  );

  // unwrap response.data
  const unwrappedData = response?.data ?? storeData ?? null;

  useEffect(() => {
    if (response?.data && !storeData) {
      setStoreData(response.data);
    }
  }, [response, storeData, setStoreData]);

  return {
    data: unwrappedData,
    error,
    isLoading,
  };
}
