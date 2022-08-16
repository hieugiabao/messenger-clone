import {
  AuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Alert from "../components/Alert";
import { auth } from "../firebase";
import { useQueryParams } from "../hooks/useQueryParams";
import { useStore } from "../store";

const SignIn = () => {
  const { redirect } = useQueryParams();

  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAlertOpened, setIsAlertOpened] = useState(false);

  const handleSignIn = (provider: AuthProvider) => {
    setLoading(true);

    signInWithPopup(auth, provider)
      .then((res) => {
        console.log(res.user);
        setCurrentUser(res.user);
      })
      .catch((err) => {
        setIsAlertOpened(true);
        setError(`Error: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (currentUser) {
    return <Navigate to={redirect || "/"} />;
  }

  return (
    <div className="max-h-[700px] overflow-hidden">
      <div className="mx-[5vw] flex justify-center lg:my-10">
        <div className="w-full max-w-[1200px]">
          <div className="flex justify-between fixed">
            <div className="flex items-center gap-2">
              <img src="/icon.svg" alt="" className="h-8 w-8" />
              <span className="text-2xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#62E1FB] via-[#81E3B4] to-[#80E5B0] hover:from-[#80E5B0] hover:to-[#62E1FB]">
                FireMess
              </span>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-10 md:flex-row md:gap-5 lg:mt-10">
            <div className="flex-1 mb-16">
              <img
                src="/illus.svg"
                alt="as"
                className="h-auto w-full scale-75"
              />
            </div>
            <div className="mt-12 flex flex-1 flex-col items-center gap-4 md:items-start lg:mt-24">
              <h1 className="text-center text-4xl font-medium md:text-4xl md:text-left">
                The best solution for messaging
              </h1>
              <p className="mt-2 text-center text-xl md:text-left md:text-2xl">
                It's always free, convenient and secure. You can easy and fun to
                stay close to your favorite people.
              </p>

              <button
                disabled={loading}
                onClick={() => handleSignIn(new GoogleAuthProvider())}
                className="flex min-w-[250px] cursor-pointer items-center gap-3 rounded-md bg-white p-3 text-black transition duration-300 hover:brightness-90 disabled:!cursor-default disabled:!brightness-75"
              >
                <img className="h-6 w-6" src="/google.svg" alt="" />

                <span className="font-medium">Sign in with Google</span>
              </button>

              <button
                disabled={loading}
                onClick={() => handleSignIn(new FacebookAuthProvider())}
                className="bg-primary flex min-w-[250px] cursor-pointer items-center gap-3 rounded-md p-3 text-white transition duration-300 hover:brightness-90 disabled:!cursor-default disabled:!brightness-75"
              >
                <img className="h-6 w-6" src="/facebook.svg" alt="" />

                <span className="font-medium">Sign in with Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Alert
        isOpened={isAlertOpened}
        setIsOpened={setIsAlertOpened}
        content={error}
        isError
      />
    </div>
  );
};

export default SignIn;
