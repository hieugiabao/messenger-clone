import React, { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { IMAGE_PROXY } from "../../constants";
import { useLastMessage } from "../../hooks/useLastMessaage";
import { useUsersInfo } from "../../hooks/useUserInfo";
import { useStore } from "../../store";
import { Conversation } from "../../types/Conversation";
import Skeleton from "../Skeleton";

interface SelectConversationProps {
  conversation: Conversation;
  conId: string;
}

const SelectConversation: FC<SelectConversationProps> = ({
  conversation,
  conId,
}) => {
  const currentUser = useStore((state) => state.currentUser);
  const { data: users, error, loading } = useUsersInfo(conversation.users);

  const otherUsers = users?.filter((user) => user.id !== currentUser?.uid);

  const {
    data: lastMessageData,
    loading: lastMessageLoading,
    error: lastMessageError,
  } = useLastMessage(conId);

  const { id } = useParams();

  if (loading)
    return (
      <div className="flex items-stretch gap-2 py-2 px-5">
        <Skeleton className="h-14 w-14 flex-shrink-0 rounded-full" />
        <div className="flex flex-grow flex-col items-start gap-2 py-2">
          <Skeleton className="w-1/2 flex-grow rounded-md" />
          <Skeleton className="w-2/3 flex-grow rounded-md" />
        </div>
      </div>
    );

  if (conversation.users.length === 2)
    return (
      <Link
        to={`/chat/${conId}`}
        className={`hover:bg-dark-lighten relative flex items-stretch gap-2 py-2 px-5 transition duration-300
      ${conId === id ? "!bg-[#263342]" : ""}`}
      >
        <img
          src={IMAGE_PROXY(otherUsers?.[0].data()?.photoURL)}
          alt=""
          className="h-14 w-14 flex-shrink-0 rounded-full whitespace-nowrap"
        />
        <div className="flex flex-grow flex-col items-start gap-1 py-1">
          <p className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap max-w-[240px]">
            {otherUsers?.[0].data()?.displayName}
          </p>
          {lastMessageLoading ? (
            <Skeleton className="w-2/3 flex-grow" />
          ) : (
            <p className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-400">
              {lastMessageData?.message}
            </p>
          )}
        </div>
        {!lastMessageLoading && (
          <>
            {lastMessageData?.lastMessageId !== null &&
              lastMessageData?.lastMessageId !==
                conversation.seen[currentUser?.uid as string] && (
                <div className="bg-primary absolute top-1/2 right-4 h-[10px] w-[10px] -translate-y-1/2 rounded-full"></div>
              )}
          </>
        )}
      </Link>
    );

  return (
    <Link
      to={`/chat/${conId}`}
      className={`flex group items-stretch gap-2 py-2 px-5 relative hover:bg-dark-lighten transition duration-300 ${
        conId === id ? "!bg-[#252F3C]" : ""
      }`}
    >
      {conversation?.group?.groupImage ? (
        <img
          src={conversation?.group?.groupImage}
          alt=""
          className="h-14 w-14 flex-shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="h-14 w-14 relative">
          <img
            src={IMAGE_PROXY(otherUsers?.[0]?.data()?.photoURL)}
            alt=""
            className="absolute top-0 right-0 h-10 w-10 flex-shrink-0 rounded-full object-cover"
          />
          <img
            src={IMAGE_PROXY(otherUsers?.[1]?.data()?.photoURL)}
            alt=""
            className={`border-dark group-hover:border-dark-lighten absolute bottom-0 left-0 z-[1] h-10 w-10 flex-shrink-0 rounded-full border-[3px] object-cover transition duration-300
            ${conId === id ? "!border-[#252F3C]" : ""}`}
          />
        </div>
      )}

      <div className="flex flex-grow flex-col items-start gap-1 py-1">
        <p className="text-ellipsis whitespace-nowrap overflow-hidden max-w-[240px]">
          {conversation.group?.groupName ||
            otherUsers
              ?.map((user) => user.data()?.displayName)
              .splice(0, 3)
              .join(",")}
        </p>
        {lastMessageLoading ? (
          <Skeleton className="w-2/3 flex-grow" />
        ) : (
          <p className="max-w-[240px] flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-300">
            {lastMessageData?.message}
          </p>
        )}
      </div>
      {!lastMessageLoading && (
        <>
          {lastMessageData?.lastMessageId !== null &&
            lastMessageData?.lastMessageId !==
              conversation.seen[currentUser?.uid as string] && (
              <div className="bg-primary absolute top-1/2 right-4 h-[10px] w-[10px] -translate-y-1/2 rounded-full"></div>
            )}
        </>
      )}
    </Link>
  );
};

export default SelectConversation;
