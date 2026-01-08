import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initializePendo } from "../utils/pendo";

import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    IconButton,
    InputAdornment,
    Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Define dummy users matching the initializePendo signature
const UserList = [
    {
        id: "user-1",
        email: "sushanth@example.com",
        name: "sushanth",
        accountId: "account-1",
    },
    {
        id: "user-2",
        email: "alice.smith@example.com",
        name: "Alice Smith",
        accountId: "account-2",
    },
    {
        id: "user-3",
        email: "bob.johnson@example.com",
        name: "Bob Johnson",
        accountId: "account-3",
    },
    {
        id: "user-4",
        email: "emily.williams@example.com",
        name: "Emily Williams",
        accountId: "account-4",
    },
    {
        id: "user-5",
        email: "michael.brown@example.com",
        name: "Michael Brown",
        accountId: "account-5",
    },
];

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Find user by email
        const user = UserList.find((user) => user.email === email);

        // Validate login (password is "227" for all users)
        if (user && password === "227") {
            console.log("✅ Login successful!");

            // Initialize Pendo with the user data
            initializePendo({
                id: user.id,
                email: user.email,
                full_name: user.name,
                accountId: user.accountId,
            });
            if (window.pendo) {
                console.log("📡 Pendo: Identifying user", email);
            
                // Ensure correct structure for pendo.identify()
                (window.pendo as any).identify({
                    id: user.id,
                    email: user.email,
                    account: {
                        id: user.accountId, 
                    },
                });
            
                window.pendo.track("User Logged In");
            }
            

            navigate("/dashboard");
        } else {
            alert("❌ Invalid email or password");
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(to right, #007bff, #0056b3)",
                backgroundImage:
                    "url('https://source.unsplash.com/1600x900/?technology,abstract')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(8px)",
                },
            }}
        >
            <Card
                elevation={5}
                sx={{
                    width: 400,
                    p: 4,
                    borderRadius: 3,
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                    zIndex: 2,
                }}
            >
                <CardContent>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        mb={2}
                        sx={{ color: "#0056b3" }}
                    >
                        Welcome Back 👋
                    </Typography>
                    <Typography
                        variant="body1"
                        color="rgba(0, 0, 0, 0.7)"
                        mb={3}
                    >
                        Please enter your credentials to continue
                    </Typography>

                    <form onSubmit={handleLogin}>
                        <Stack spacing={2}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                InputProps={{
                                    sx: {
                                        color: "black",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#0056b3",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor: "#007bff",
                                            },
                                    },
                                }}
                                InputLabelProps={{
                                    style: { color: "rgba(0, 0, 0, 0.6)" },
                                }}
                            />
                            <TextField
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                edge="end"
                                                sx={{ color: "#0056b3" }}
                                            >
                                                {showPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        color: "black",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#0056b3",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor: "#007bff",
                                            },
                                    },
                                }}
                                InputLabelProps={{
                                    style: { color: "rgba(0, 0, 0, 0.6)" },
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 2,
                                    borderRadius: 2,
                                    bgcolor: "#007bff",
                                    color: "white",
                                    transition: "0.3s",
                                    "&:hover": {
                                        bgcolor: "#0056b3",
                                    },
                                }}
                            >
                                Login
                            </Button>
                        </Stack>
                    </form>

                    <Typography variant="body2" mt={3} color="rgba(0, 0, 0, 0.7)">
                        Don't have an account?{" "}
                        <Typography
                            component="span"
                            fontWeight="bold"
                            sx={{
                                cursor: "pointer",
                                color: "#007bff",
                                textDecoration: "underline",
                                "&:hover": { color: "#0056b3" },
                            }}
                            onClick={() => navigate("/signup")}
                        >
                            Sign Up
                        </Typography>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
