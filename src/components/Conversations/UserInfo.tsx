import React, { FC } from "react";
import { IMAGE_PROXY } from "../../constants";
import { useStore } from "../../store";

interface UserInfoProps {
  setIsOpened: (value: boolean) => void;
}

const UserInfo: FC<UserInfoProps> = ({ setIsOpened }) => {
  const currentUser = useStore((state) => state.currentUser);

  return (
    <div
      className="fixed top-0 left-0 z-20 flex items-center justify-center w-full h-full transition-all duration-300 bg-[#00000080] visible opacity-100"
      onClick={() => setIsOpened(false)}
    >
      <div
        className="bg-dark mx-2 w-full rounded-lg max-w-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-dark-lighten border-b p-3">
          <div className="flex-1"></div>
          <div className="flex-1 flex items-center justify-center">
            <h1 className="whitespace-nowrap text-center text-2xl">
              Your Profile
            </h1>
          </div>
          <div className="flex-1 flex items-center justify-end">
            <button
              className="bg-dark-lighten flex h-8 w-8 items-center justify-center rounded-full"
              onClick={() => setIsOpened(false)}
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex gap-4">
            <img
              src={IMAGE_PROXY(currentUser?.photoURL as string)}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-xl">{currentUser?.displayName}</h1>
              <p>ID: {currentUser?.uid}</p>
              <p>Email: {currentUser?.email || ""}</p>
              <p>Phone number: {currentUser?.phoneNumber || ""}</p>
            </div>
          </div>
          <p className="mt-4 text-gray-400">
            Change your google avatar or username to update.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
