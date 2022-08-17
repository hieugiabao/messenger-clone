import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { StrictMode, useEffect } from "react";
import { BarWave } from "react-cssfx-loading/lib";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { auth, db } from "./firebase";
import Chat from "./pages/Chat";
import Conversations from "./pages/Conversations";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import { useStore } from "./store";

function App() {
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber || user.providerData?.[0]?.phoneNumber,
        });
      } else setCurrentUser(null);
    });
  }, []);

  if (typeof currentUser === "undefined")
    return (
      <div className="flex min-h-screen items-center justify-center">
        <BarWave />
      </div>
    );

  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route
          path="chat/:id"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="chat"
          element={
            <PrivateRoute>
              <Conversations />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
