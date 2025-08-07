import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Avatar, Box, Button, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { red } from "@mui/material/colors";
import ChatItem from "../components/chat/ChatItem";
import axios from "axios";
import { deleteUserChats, sendChatRequest } from "../helpers/api-communicators";
import { toast } from "react-hot-toast";
import { IoMdSend } from "react-icons/io";

// type for chat messages
type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const content = inputRef.current?.value?.trim();
    if (!content) {
      setIsLoading(false);
      return;
    }
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    try {
      const chatData = await sendChatRequest(content);
      setChatMessages([...chatData.chats]);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats successfully", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting Chats failed", { id: "deletechats" });
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      axios
        .get("/chat/all-chats")
        .then((data) => {
          setChatMessages([...data.data.chats]);
          toast.success("Successfully loaded chats", { id: "loadchats" });
        })
        .catch(() => {
          toast.error("Loading failed", { id: "loadchats" });
        });
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, [auth]);

  // Defensive initials rendering
  const name = auth?.user?.name;
  let initials = "";
  if (name) {
    const parts = name.trim().split(" ");
    initials = parts[0][0] || "";
    if (parts.length > 1) {
      initials += parts[1][0] || "";
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flexDirection: "column",
          flex: 0.2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to a chatbot
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
            You can ask some questions related to Business, Science, Code, etc.
            But avoid sharing personal information
          </Typography>
          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": { bgcolor: red.A400 },
            }}
          >
            CLEAR CONVERSATION
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          py: 3,
          mx: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "60px",
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "300",
          }}
        >
          Model : GPT-4o-Mini
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.map((chat, index) => (
            <ChatItem
              content={chat.content}
              role={chat.role}
              key={`${chat.role}-${index}-${chat.content.substring(0, 10)}`}
            />
          ))}
          {isLoading && (
            <div style={{ color: "#00fffc", textAlign: "center" }}>Sending...</div>
          )}
        </Box>
        <div
          style={{
            width: "100%",
            borderRadius: 10,
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            margin: "auto",
            marginTop: "3px",
            paddingTop: "5px",
            paddingBottom: "5px",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              border: "none",
              padding: "15px",
              outline: "none",
              color: "white",
              fontSize: "16px",
            }}
            placeholder="Type your message..."
            disabled={isLoading}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <IconButton
            onClick={handleSubmit}
            sx={{ ml: "auto", color: "white", mr: "10px" }}
            disabled={isLoading}
          >
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;
