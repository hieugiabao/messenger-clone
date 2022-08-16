import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { FC, useState } from "react";
import { Spin } from "react-cssfx-loading/lib";
import { useNavigate } from "react-router-dom";
import { IMAGE_PROXY, THEMES } from "../../constants";
import { db } from "../../firebase";
import { useCollectionQuery } from "../../hooks/useCollectionQuery";
import { useStore } from "../../store";

interface CreateConversationProps {
  setIsOpened: (value: boolean) => void;
}

const CreateConversation: FC<CreateConversationProps> = ({ setIsOpened }) => {
  const [isCreating, setIsCreating] = useState(false);
  const currentUser = useStore((state) => state.currentUser);
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  const { data, error, loading } = useCollectionQuery(
    "all-users",
    collection(db, "users")
  );

  const handleSelect = (uid: string) => {
    if (selected.includes(uid)) {
      setSelected(selected.filter((item) => item !== uid));
    } else {
      setSelected([...selected, uid]);
    }
  };

  const startConversation = async () => {
    setIsCreating(true);

    const sorted = [...selected, currentUser?.uid].sort();

    const q = query(
      collection(db, "conversations"),
      where("users", "==", sorted)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const created = await addDoc(collection(db, "conversations"), {
        users: sorted,
        group:
          sorted.length > 2
            ? {
                admins: [currentUser?.uid],
                groupName: null,
                groupImage: null,
              }
            : {},
        updatedAt: serverTimestamp(),
        seen: {},
        theme: THEMES[0],
      });

      setIsCreating(false);
      setIsOpened(false);
      navigate(`/chat/${created.id}`);
    } else {
      setIsOpened(false);
      navigate(`chat/${querySnapshot.docs[0].id}`);
      setIsCreating(false);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 z-20 w-full h-full flex items-center justify-center bg-[#00000080]"
      onClick={() => setIsOpened(false)}
    >
      <div
        className="bg-dark mx-3 w-full overflow-hidden rounded-lg max-w-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-dark-lighten flex items-center justify-between border-b py-3 px-3">
          <div className="flex-1"></div>
          <div className="flex flex-1 items-center justify-center">
            <h1 className="whitespace-nowrap text-center text-2xl">
              New Conversation
            </h1>
          </div>
          <div className="flex-1 flex justify-end items-center">
            <button
              className="bg-dark-lighten flex h-8 w-8 items-center justify-center rounded-full"
              onClick={() => setIsOpened(false)}
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Spin color="#0D90F3" />
          </div>
        ) : error ? (
          <div className="flex h-96 items-center justify-center">
            <p className="text-center">An error occurred</p>
          </div>
        ) : (
          <>
            {isCreating && (
              <div className="absolute top-0 left-0 z-20 flex items-center justify-center h-full w-full bg-[#00000080]">
                <Spin color="#0D90F3" />
              </div>
            )}
            <div className="flex items-stretch gap-2 overflow-y-auto flex-col h-96 py-2">
              {data?.docs
                .filter((doc) => doc.data().uid !== currentUser?.uid)
                .map((doc) => (
                  <div
                    className="flex items-center gap-2 px-5 py-2 transition cursor-pointer hover:bg-dark-lighten"
                    key={doc.data().uid}
                    onClick={() => handleSelect(doc.data().uid)}
                  >
                    <input
                      type="checkbox"
                      className="flex-shrink-0 cursor-pointer"
                      checked={selected.includes(doc.data().uid)}
                      readOnly
                    />
                    <img
                      className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                      src={IMAGE_PROXY(doc.data().photoURL)}
                      alt=""
                    />
                    <p>{doc.data().displayName}</p>
                  </div>
                ))}
            </div>
            <div className="flex border-dark-lighten justify-end border-t p-3">
              <button
                className="bg-dark-lighten rounded-lg py-2 px-3 transition duration-300 hover:brightness-125 disabled:!brightness-[80%]"
                disabled={selected.length === 0}
                onClick={() => startConversation()}
              >
                Start conversation
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateConversation;
