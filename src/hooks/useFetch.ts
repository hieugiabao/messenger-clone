import { useEffect, useState } from "react";

export function useFetch<T>(
  key: string,
  query: (...args: any) => Promise<any>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(false);

  useEffect(() => {
    query()
      .then((res) => {
        setData(res);
        setLoading(false);
        setError(false);
      })
      .catch((err) => {
        console.log(err);
        setData(null);
        setLoading(false);
        setError(true);
      });
  }, [key]);

  return { data, loading, error };
}
