import { useEffect } from "react";
import { useState } from "react";
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  onSnapshot,
} from "firebase/firestore";

export const useDocumentQuery = (
  key: string,
  document: DocumentReference<DocumentData>
) => {
  const [data, setData] = useState<DocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsubcribe = onSnapshot(
      document,
      (snapshot) => {
        setData(snapshot);
        setError(false);
        setLoading(false);
      },
      (error) => {
        console.log(error);
        setData(null);
        setError(true);
        setLoading(false);
      }
    );

    return () => {
      unsubcribe();
    };
  }, [key]);

  return {
    loading,
    error,
    data,
  };
};
