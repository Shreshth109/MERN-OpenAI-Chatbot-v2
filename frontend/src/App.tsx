import React from "react";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  const auth = useAuth();
  console.log(auth?.isLoggedIn);

  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {auth?.isLoggedIn && auth.user && (<Route path="/chat" element={<Chat />} />
        )}
        {/* Catch all unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Hot toast container */}
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: { background: "white", color: "black" },
          },
          error: {
            style: { background: "white", color: "black" },
          },
        }}
      />
    </main>
  );
}

export default App;
