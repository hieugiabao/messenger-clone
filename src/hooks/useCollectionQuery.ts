import {
  CollectionReference,
  DocumentData,
  onSnapshot,
  Query,
  QuerySnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export const useCollectionQuery = (
  key: string,
  collection: CollectionReference | Query<DocumentData>
) => {
  const [data, setData] = useState<QuerySnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsubcribe = onSnapshot(
      collection,
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

  return { loading, error, data };
};
