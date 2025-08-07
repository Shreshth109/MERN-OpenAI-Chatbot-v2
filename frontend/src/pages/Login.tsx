import { useEffect, useState } from "react";
import { IoIosLogIn } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CustomizedInput from "../components/shared/CustomizedInput";
import { Box, Button, Typography } from "@mui/material";
import { toast } from "react-hot-toast";

const Login = () => {
   const auth = useAuth();
  const navigate = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

   

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      toast.loading("Signing In", { id: "login" });
      await auth?.login(email, password);
      toast.success("Signed In successfully", { id: "login" });
    } catch (error: any) {
      console.log(error);
      // Show backend error if available
      const message = error?.response?.data?.message || "Signing In failed";
      toast.error(message, { id: "login" });
    }
  };

  useEffect(() => {
    if (auth?.user) {
      return navigate("/chat");
    }
  }, [auth]);


  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ padding: 4 }}
    >
      <Typography variant="h4" sx={{ color: "white", mb: 2 }}>
        {isLoginMode ? "Login" : "Sign Up"}
      </Typography>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "400px",
        }}
      >
        {!isLoginMode && (
          <CustomizedInput
            name="name"
            type="text"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <CustomizedInput
          name="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <CustomizedInput
          name="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Typography sx={{ color: "red", mt: 1 }}>{error}</Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "#00fffc",
            color: "black",
            width: "400px",
            fontWeight: "bold",
          }}
          startIcon={<IoIosLogIn />}
        >
          {isLoginMode ? "Login" : "Sign Up"}
        </Button>
      </form>

      <Typography sx={{ mt: 2, color: "white" }}>
        {isLoginMode ? "Don't have an account?" : "Already have an account?"}
        <Button
          onClick={() => setIsLoginMode((prev) => !prev)}
          sx={{
            color: "#00fffc",
            textTransform: "none",
            ml: 1,
          }}
        >
          {isLoginMode ? "Sign Up" : "Login"}
        </Button>
      </Typography>
    </Box>
  );
};

export default Login;
