import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeBackground from "../components/HomeBackground";
import { useStore } from "../store";

const Home = () => {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);

  const onScroll = (e: Event) => {
    const tag = document.getElementById("nav");
    const signIn = document.getElementById("toD");
    if (
      document.body.scrollTop > 200 ||
      document.documentElement.scrollTop > 200
    ) {
      tag?.classList.remove("absolute", "top-48");
      tag?.classList.add(
        "animate-scroll-to-top",
        "fixed",
        "top-0",
        "z-20",
        "left-0"
      );
      signIn?.classList.remove("hidden");
      signIn?.classList.add("animate-fade-in");
    } else {
      tag?.classList.remove(
        "animate-scroll-to-top",
        "fixed",
        "top-0",
        "z-20",
        "left-0"
      );
      tag?.classList.add("absolute", "top-48");
      signIn?.classList.remove("animate-fade-in");
      signIn?.classList.add("hidden");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll, false);
    return () => {
      window.removeEventListener("scroll", onScroll, false);
    };
  }, []);

  return (
    <>
      <div className="w-full h-10 absolute">
        <HomeBackground />
      </div>
      <div className="flex items-center flex-col">
        <button
          id="toD"
          onClick={() =>
            currentUser ? navigate("/chat") : navigate("/sign-in")
          }
          className="hidden fixed top-6 right-8 z-10 min-w-[80px] cursor-pointer items-center gap-3 rounded-md bg-primary p-3 text-white transition duration-300 hover:brightness-90 disabled:!cursor-default disabled:!brightness-75"
        >
          <span className="font-medium">
            {currentUser ? "Go to chat" : "Join with us"}
          </span>
        </button>
        <div className="relative h-[100vh]">
          <div
            id="nav"
            className="absolute top-48 w-full max-w-[1200px] justify-center flex space-between scale-[1.2]"
          >
            <div className="flex items-center gap-2 mt-[15%] mb-[35%]">
              <img src="/icon.svg" alt="" className="h-24 w-24" />
              <div className="flex flex-col">
                <span className="text-9xl tracking-widest font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#62E1FB] via-[#81E3B4] to-[#80E5B0] hover:from-[#80E5B0] hover:to-[#62E1FB]">
                  FireMess
                </span>
                <span className="mt-2 ml-2 text-3xl font-light">
                  Access any where
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-[80vh] bg-dark-lighten relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1680 40"
            className="absolute w-full z-[1] top-[-32px]"
          >
            <path
              d="M0 40h1680V30S1340 0 840 0 0 30 0 30z"
              fill="#3B3C3D"
            ></path>
          </svg>
        </div>
      </div>
    </>
  );
};

export default Home;
