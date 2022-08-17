import React, { FC } from "react";
import { Conversation } from "../../types/Conversation";

interface ConversationInfoProps {
  conversation: Conversation;
  setIsOpened: (value: boolean) => void;
}

const ConversationInfo: FC<ConversationInfoProps> = ({
  conversation,
  setIsOpened,
}) => {
  return (
    <div
      className="fixed top-0 left-0 z-20 flex items-center justify-end w-full h-full bg-[#00000080] transition-all duration-300 animate-fade-in"
      onClick={() => setIsOpened(false)}
    >
      <div
        className="bg-dark h-full w-[400px] animate-fade-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-20 border-dark-lighten w-full border-b-[2px] flex items-center">
          <button className="text-3xl ml-4" onClick={() => setIsOpened(false)}>
            <i className="bx bx-left-arrow-alt"></i>
          </button>
          <div className="text-center w-full text-2xl">Chat infomation</div>
        </div>
      </div>
    </div>
  );
};

export default ConversationInfo;
