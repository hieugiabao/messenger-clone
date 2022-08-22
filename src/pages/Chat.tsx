import { doc } from "firebase/firestore";
import React, { FC, useState } from "react";
import { useParams } from "react-router-dom";
import ChatHeader from "../components/Chat/ChatHeader";
import SideBar from "../components/Conversations/SideBar";
import InputSection from "../components/Input/InputSection";
import { db } from "../firebase";
import { useDocumentQuery } from "../hooks/useDocumentQuery";
import { useStore } from "../store";
import { Conversation } from "../types/Conversation";

const Chat: FC = () => {
  const { id } = useParams();
  const { data, loading, error } = useDocumentQuery(
    `conversation-${id}`,
    doc(db, "conversations", id as string)
  );

  const conversation = data?.data() as Conversation;
  const currentUser = useStore((state) => state.currentUser);

  const [inputSectionOffset, setInputSectionOffset] = useState(0);
  const [replyInfo, setReplyInfo] = useState(null);

  return (
    <div className="flex">
      <SideBar />

      <div className="flex h-screen flex-grow flex-col items-stretch">
        {loading ? (
          <>
            <div className="border-dark-lighten h-20 border-b"></div>
            <div className="flex-grow"></div>
          </>
        ) : !conversation ||
          error ||
          !conversation.users.includes(currentUser?.uid as string) ? (
          <div className="flex items-center justify-center gap-6 w-full h-full">
            <img src="/error.svg" alt="" className="h-32 w-32 object-cover" />
            <p className="text-center text-lg">Conversation dose not exist</p>
          </div>
        ) : (
          <>
            <ChatHeader conversation={conversation} />
            <div className="h-full w-full"></div>
            <InputSection disabled={false} />
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
