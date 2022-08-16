import { Route, Routes } from "react-router-dom";
import Conversations from "./pages/Conversations";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="chat" element={<Conversations />} />
    </Routes>
  );
}

export default App;
