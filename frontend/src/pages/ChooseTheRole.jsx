import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Avatar,
    Container,
} from "@mui/material";
import { DirectionsCar, LocalShipping } from "@mui/icons-material";

const ChooseTheRole = () => {
    const navigate = useNavigate();

    const handleRoleSelection = (role) => {
        if (role === "owner") {
            navigate("/signupforowner");
        } else if (role === "driver") {
            navigate("/signupfordriver");
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
            }}
        >
            <Container maxWidth="sm">
                <Card
                    elevation={5}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        textAlign: "center",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        color: "white",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <CardContent>
                        <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "#f8f9fa" }}>
                            Choose Your Role
                        </Typography>
                        <Typography variant="body1" mb={4} sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                            Are you signing up as a Vehicle Owner or a Driver? Select your role to continue.
                        </Typography>

                        <Stack spacing={3}>
                            {/* Owner Card */}
                            <Card
                                onClick={() => handleRoleSelection("owner")}
                                sx={{
                                    cursor: "pointer",
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    border: "2px solid rgba(255, 255, 255, 0.2)",
                                    borderRadius: 2,
                                    p: 3,
                                    transition: "0.3s",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        borderColor: "#007bff",
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        bgcolor: "rgba(0, 123, 255, 0.2)",
                                        color: "#007bff",
                                        mx: "auto",
                                        mb: 2,
                                    }}
                                >
                                    <LocalShipping fontSize="large" />
                                </Avatar>
                                <Typography variant="h6" sx={{ color: "#f8f9fa" }}>
                                    Vehicle Owner
                                </Typography>
                                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                                    Manage your vehicles and hire drivers.
                                </Typography>
                            </Card>

                            {/* Driver Card */}
                            <Card
                                onClick={() => handleRoleSelection("driver")}
                                sx={{
                                    cursor: "pointer",
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    border: "2px solid rgba(255, 255, 255, 0.2)",
                                    borderRadius: 2,
                                    p: 3,
                                    transition: "0.3s",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        borderColor: "#28a745",
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        bgcolor: "rgba(40, 167, 69, 0.2)",
                                        color: "#28a745",
                                        mx: "auto",
                                        mb: 2,
                                    }}
                                >
                                    <DirectionsCar fontSize="large" />
                                </Avatar>
                                <Typography variant="h6" sx={{ color: "#f8f9fa" }}>
                                    Driver
                                </Typography>
                                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                                    Drive vehicles and earn money.
                                </Typography>
                            </Card>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default ChooseTheRole;