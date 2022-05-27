import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export const useUsersInfo = (userIds: string[]) => {
  const [data, setData] = useState<DocumentSnapshot<DocumentData>[] | null>(
    null
  );
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      (async () => {
        const response = await Promise.all(
          userIds.map(async (id) => {
            const res = await getDoc(doc(db, "users", id));
            return res;
          })
        );

        setData(response);
        setLoading(false);
        setError(false);
      })();
    } catch (error) {
      console.log(error);
      setLoading(false);
      setData(null);
      setError(true);
    }
  }, [JSON.stringify(userIds)]);

  return { data, loading, error };
};
