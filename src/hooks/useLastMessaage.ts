import {
  collection,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { formatDate } from "../utils/formatDate";

export const useLastMessage = (conId: string) => {
  const [data, setData] = useState<{
    lastMessageId: string | null;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsubcribe = onSnapshot(
      query(
        collection(db, "conversations", conId, "messages"),
        orderBy("createdAt"),
        limitToLast(1)
      ),
      (snap) => {
        if (snap.empty) {
          setData({
            lastMessageId: null,
            message: "No message",
          });
          setLoading(false);
          setError(false);
        }

        const type = snap.docs?.[0]?.data()?.type;
        let res =
          type === "image"
            ? "Image"
            : type === "file"
            ? `File: ${
                snap.docs?.[0].data()?.file?.name.split(".").slice(-1)[0]
              }`
            : type === "sticker"
            ? "A sticker"
            : type === "removed"
            ? "Message removed"
            : (snap.docs?.[0]?.data()?.content as string);
        const second = snap.docs?.[0]?.data()?.createdAt?.seconds;
        const formattedDate = formatDate(second ? second * 1000 : Date.now());

        res =
          res.length > 30 - formattedDate.length
            ? `${res.slice(0, 30 - formattedDate.length)}...`
            : res;

        const message = `${res} • ${formattedDate}`;
        setData({
          lastMessageId: snap.docs?.[0].id,
          message,
        });
        setLoading(false);
        setError(false);
      },
      (err) => {
        console.log(err);
        setData(null);
        setError(true);
        setLoading(false);
      }
    );

    return () => {
      unsubcribe();
    };
  }, [conId]);

  return { data, loading, error };
};
