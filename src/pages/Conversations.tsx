import React from "react";
import SideBar from "../components/Conversations/SideBar";

const Conversations = () => {
  return (
    <div className="flex">
      <SideBar />

      <div className="hidden flex-grow flex-col items-center justify-center gap-3 md:!flex">
        <h1 className="text-center">Select a conversation to start chatting</h1>
      </div>
    </div>
  );
};

export default Conversations;