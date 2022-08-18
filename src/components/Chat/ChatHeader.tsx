import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import { IMAGE_PROXY } from "../../constants";
import { useUsersInfo } from "../../hooks/useUserInfo";
import { useStore } from "../../store";
import { Conversation } from "../../types/Conversation";
import Skeleton from "../Skeleton";
import ConversationInfo from "./ConversationInfo";

interface ChatHeaderProps {
  conversation: Conversation;
}

const ChatHeader: FC<ChatHeaderProps> = ({ conversation }) => {
  const { data: users, loading } = useUsersInfo(conversation.users);
  const currentUser = useStore((state) => state.currentUser);

  const otherUsers = users?.filter((user) => user.id !== currentUser?.uid);

  const [isSettingOpen, setIsSettingOpen] = useState(false);

  return (
    <>
      <div className="border-dark-lighten flex items-center justify-between border-b px-5 h-20">
        <div className="flex flex-grow items-center gap-3">
          <Link to="/chat" className="md:hidden">
            <i className="bx bxs-chevron-left text-primary text-3xl"></i>
          </Link>
          {loading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : (
            <>
              {conversation.users.length === 2 ? (
                <img
                  src={IMAGE_PROXY(otherUsers?.[0]?.data()?.photoURL)}
                  alt=""
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <>
                  {conversation?.group?.groupImage ? (
                    <img
                      src={IMAGE_PROXY(conversation.group.groupImage)}
                      alt=""
                      className="h-10 w-10 flex-shrink-0 object-cover rounded-full"
                    />
                  ) : (
                    <div className="relative h-10 w-10 flex-shrink-0">
                      <img
                        src={IMAGE_PROXY(otherUsers?.[0]?.data()?.photoURL)}
                        alt=""
                        className="absolute top-0 right-0 h-7 w-7 flex-shrink-0 rounded-full object-cover"
                      />
                      <img
                        src={IMAGE_PROXY(otherUsers?.[1]?.data()?.photoURL)}
                        alt=""
                        className="border-dark absolute bottom-0 left-0 h-7 w-7 flex-shrink-0 rounded-full border-2 object-cover transition duration-300 z-[1]"
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {loading ? (
            <Skeleton className="h-6 w-1/4 rounded-md" />
          ) : (
            <p>
              {conversation.users.length > 2 && conversation?.group?.groupName
                ? conversation.group.groupName
                : otherUsers
                    ?.map((user) => user.data()?.displayName)
                    .slice(0, 3)
                    .join(", ")}
            </p>
          )}
        </div>

        {!loading && (
          <button
            onClick={() => setIsSettingOpen(true)}
            className="relative h-9 w-9 hover:before:content-[''] before:absolute before:bg-dark-lighten before:rounded-full hover:before:w-full hover:before:h-full before:top-[-2px] before:left-0 before:z-[-1]"
          >
            <i className="bx bxs-info-circle text-primary text-2xl"></i>
          </button>
        )}
      </div>
      {isSettingOpen && (
        <ConversationInfo
          setIsOpened={setIsSettingOpen}
          conversation={conversation}
        />
      )}
    </>
  );
};

export default ChatHeader;
