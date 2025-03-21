import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    Avatar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const backgrounds = [
    "https://plus.unsplash.com/premium_photo-1733259739350-d30a39452c9a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1717013781636-a9207818c98a?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const Signup = () => {
    const [backgroundIndex, setBackgroundIndex] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [profilePhotoURL, setProfilePhotoURL] = useState(null);
    const [photoError, setPhotoError] = useState(false);
    const navigate = useNavigate();

    // Background slideshow effect
    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
        }, 5000); // Change background every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const handleSignup = (e) => {
        e.preventDefault();

        if (!profilePhoto) {
            setPhotoError(true);
            return;
        }

        if (password !== confirmPassword) {
            alert("❌ Passwords do not match!");
            return;
        }

        console.log("✅ Signup successful!", email);
        navigate("/dashboard");
    };

    const handleProfilePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(file);
            setProfilePhotoURL(URL.createObjectURL(file));
            setPhotoError(false);
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: `url(${backgrounds[backgroundIndex]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                transition: "background-image 1s ease-in-out",
                "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0, 0, 0, 0.6)", // Dark overlay
                },
            }}
        >
            <Card
                elevation={5}
                sx={{
                    width: 420,
                    p: 4,
                    borderRadius: 3,
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    color: "white",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
                    zIndex: 2,
                }}
            >
                <CardContent>
                    <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "#f8f9fa" }}>
                        Signup
                    </Typography>

                    {/* Profile Photo Upload (Click to Change) */}
                    <Stack direction="column" alignItems="center" spacing={2} mb={3}>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            id="profile-upload"
                            onChange={handleProfilePhotoChange}
                        />
                        <label htmlFor="profile-upload">
                            <Avatar
                                src={profilePhotoURL || ""}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    bgcolor: "white",
                                    color: "#007bff",
                                    fontSize: "2rem",
                                    border: "2px solid #007bff",
                                    cursor: "pointer",
                                    transition: "0.3s",
                                    "&:hover": { opacity: 0.8 },
                                }}
                            />
                        </label>
                        {photoError && (
                            <Typography variant="caption" color="red">
                                ❌ Please upload a profile photo
                            </Typography>
                        )}
                    </Stack>

                    <form onSubmit={handleSignup}>
                        <Stack spacing={2}>
                            <TextField
                                label="Email"
                                variant="filled"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                sx={{
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    borderRadius: 1,
                                    input: { color: "white" },
                                    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                                }}
                            />
                            <TextField
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                variant="filled"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: "white" }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    borderRadius: 1,
                                    input: { color: "white" },
                                    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                                }}
                            />
                            <TextField
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                variant="filled"
                                fullWidth
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                                sx={{ color: "white" }}
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    borderRadius: 1,
                                    input: { color: "white" },
                                    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
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
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                    transition: "0.3s",
                                    "&:hover": {
                                        bgcolor: "#0056b3",
                                    },
                                }}
                            >
                                Sign Up
                            </Button>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Signup;
