import { signOut } from "firebase/auth";
import { collection, orderBy, query, where } from "firebase/firestore";
import React, { useState } from "react";
import Spin from "react-cssfx-loading/src/Spin";
import { Link, useLocation } from "react-router-dom";
import { DEFAULT_AVATAR, IMAGE_PROXY } from "../../constants";
import { auth, db } from "../../firebase";
import { useCollectionQuery } from "../../hooks/useCollectionQuery";
import { useStore } from "../../store";
import { Conversation } from "../../types/Conversation";
import ClickListener from "../ClickListener";
import CreateConversation from "./CreateConversation";
import SelectConversation from "./SelectConversation";
import UserInfo from "./UserInfo";

const SideBar = () => {
  const currentUser = useStore((state) => state.currentUser);
  const [isDropdownMenu, setIsDropdownMenu] = useState(false);
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);

  const { data, error, loading } = useCollectionQuery(
    "conversations",
    query(
      collection(db, "conversations"),
      orderBy("updatedAt", "desc"),
      where("users", "array-contains", currentUser?.uid)
    )
  );

  const location = useLocation();

  return (
    <>
      <div
        className={`border-dark-lighten h-screen flex-shrink-0 overflow-x-hidden overflow-y-auto border-r ${
          location.pathname !== "/chat"
            ? "hidden w-[350px] md:!block"
            : "w-full md:!w-[350px]"
        }`}
      >
        <div className="border-dark-light flex h-20 items-center justify-between border-b px-6">
          <Link to="/" className="flex items-center gap-1 mr-10">
            <img src="/icon.svg" alt="" className="h-8 w-8" />
            <h1 className="text-xl">FireMess</h1>
          </Link>

          <div className="flex items-center gap-1">
            <button
              className="bg-dark-lighten h-8 w-8 rounded-full mr-1"
              onClick={() => setIsCreateChatOpen(true)}
            >
              <i className="bx bxs-edit text-xl"></i>
            </button>

            <ClickListener onClick={() => setIsDropdownMenu(false)}>
              {(ref) => (
                <div ref={ref} className="relative z-10">
                  <img
                    onClick={() => setIsDropdownMenu((prev) => !prev)}
                    className="h-8 w-8 cursor-pointer rounded-full object-cover"
                    src={
                      currentUser?.photoURL
                        ? IMAGE_PROXY(currentUser.photoURL)
                        : DEFAULT_AVATAR
                    }
                  />

                  <div
                    className={`border-dark-lighten bg-dark absolute top-full right-0 flex w-max origin-top-right flex-col items-stretch overflow-hidden rounded-md border py-1 shadow-lg transition-all duration-200
                ${
                  isDropdownMenu
                    ? "visible scale-100 opacity-100"
                    : "invisible scale-0 opacity-0"
                }`}
                  >
                    <button
                      className="hover:bg-dark-lighten flex items-center gap-1 px-3 py-1 transition duration-300"
                      onClick={() => {
                        setIsUserInfoOpen(true);
                        setIsDropdownMenu(false);
                      }}
                    >
                      <i className="bx bxs-user text-xl"></i>
                      <span className="whitespace-nowrap">
                        {currentUser?.displayName
                          ? currentUser.displayName
                          : "Profile"}
                      </span>
                    </button>
                    <button
                      className="hover:bg-dark-lighten flex items-center gap-1 px-3 py-1 transition duration-300"
                      onClick={() => signOut(auth)}
                    >
                      <i className="bx bx-log-out text-xl"></i>
                      <span className="whitespace-nowrap">Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </ClickListener>
          </div>
        </div>

        {loading ? (
          <div className="my-6 flex justify-center">
            <Spin />
          </div>
        ) : error ? (
          <div className="my-6 flex flex-col items-center justify-center">
            <p className="text-center">Have some error occurred</p>
          </div>
        ) : data?.empty ? (
          <div className="my-6 flex flex-col items-center justify-center">
            <p className="text-center">No conversation found</p>
            <button
              className="text-primary text-center"
              onClick={() => setIsCreateChatOpen(true)}
            >
              Create conversation
            </button>
          </div>
        ) : (
          <>
            {data?.docs.map((item) => (
              <SelectConversation
                conversation={item.data() as Conversation}
                conId={item.id}
                key={item.id}
              />
            ))}
          </>
        )}
      </div>

      {isCreateChatOpen && (
        <CreateConversation setIsOpened={setIsCreateChatOpen} />
      )}

      {isUserInfoOpen && <UserInfo setIsOpened={setIsUserInfoOpen} />}
    </>
  );
};

export default SideBar;
