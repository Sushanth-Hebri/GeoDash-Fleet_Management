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
    Stepper,
    Step,
    StepLabel,
    Paper,
    Grid,
} from "@mui/material";
import { Visibility, VisibilityOff, DirectionsCar, TwoWheeler, LocalShipping, Edit, Delete } from "@mui/icons-material";

const backgrounds = [
    "https://plus.unsplash.com/premium_photo-1733259739350-d30a39452c9a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1717013781636-a9207818c98a?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const vehicleTypes = [
    { type: "Truck", icon: <LocalShipping fontSize="large" />, image: "https://via.placeholder.com/100" },
    { type: "Car", icon: <DirectionsCar fontSize="large" />, image: "https://via.placeholder.com/100" },
    { type: "Bike", icon: <TwoWheeler fontSize="large" />, image: "https://via.placeholder.com/100" },
];

const SignupForOwner = () => {
    const [backgroundIndex, setBackgroundIndex] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const [ownerName, setOwnerName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [profilePhotoURL, setProfilePhotoURL] = useState(null);
    const [photoError, setPhotoError] = useState(false);
    const [otp, setOtp] = useState("");
    const [vehicles, setVehicles] = useState([]);
    const [vehicleDetails, setVehicleDetails] = useState({
        type: "",
        number: "",
        driverName: "",
        height: "",
        width: "",
        length: "",
        tyres: "",
        model: "",
        registeredAt: "",
        brand: "",
    });
    const [editIndex, setEditIndex] = useState(null); // Track the vehicle being edited
    const navigate = useNavigate();

    // Background slideshow effect
    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleSignup = (e) => {
        e.preventDefault();

        if (!profilePhoto) {
            setPhotoError(true);
            alert("❌ Please upload a profile photo!");
            return;
        }

        if (!ownerName || !companyName || !email || !password || !confirmPassword) {
            alert("❌ Please fill in all fields!");
            return;
        }

        if (password !== confirmPassword) {
            alert("❌ Passwords do not match!");
            return;
        }

        setActiveStep(1); // Move to OTP Verification step
    };

    const handleProfilePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(file);
            setProfilePhotoURL(URL.createObjectURL(file));
            setPhotoError(false);
        }
    };

    const handleOtpVerification = (e) => {
        e.preventDefault();
        if (!otp) {
            alert("❌ Please enter the OTP!");
            return;
        }
        setActiveStep(2); // Move to Vehicle Details step
    };

    const handleVehicleDetailsChange = (e) => {
        const { name, value } = e.target;
        setVehicleDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddVehicle = () => {
        if (
            !vehicleDetails.type ||
            !vehicleDetails.number ||
            !vehicleDetails.driverName
        ) {
            alert("❌ Please fill in all required vehicle details!");
            return;
        }

        if (editIndex !== null) {
            // Update existing vehicle
            const updatedVehicles = [...vehicles];
            updatedVehicles[editIndex] = vehicleDetails;
            setVehicles(updatedVehicles);
            setEditIndex(null);
        } else {
            // Add new vehicle
            setVehicles((prev) => [...prev, vehicleDetails]);
        }

        // Reset form
        setVehicleDetails({
            type: "",
            number: "",
            driverName: "",
            height: "",
            width: "",
            length: "",
            tyres: "",
            model: "",
            registeredAt: "",
            brand: "",
        });
    };

    const handleEditVehicle = (index) => {
        const vehicle = vehicles[index];
        setVehicleDetails(vehicle);
        setEditIndex(index);
    };

    const handleDeleteVehicle = (index) => {
        const updatedVehicles = vehicles.filter((_, i) => i !== index);
        setVehicles(updatedVehicles);
    };

    const handleConfirmAndSave = () => {
        if (vehicles.length === 0) {
            alert("❌ Please add at least one vehicle!");
            return;
        }
        console.log("Owner Details:", { ownerName, companyName, email });
        console.log("Vehicles:", vehicles);
        navigate("/dashboard");
    };

    const steps = [
        {
            label: "Basic Signup",
            content: (
                <form onSubmit={handleSignup}>
                    <Stack spacing={2}>
                        {/* Profile Photo Upload */}
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

                        <TextField
                            label="Owner Name"
                            variant="filled"
                            fullWidth
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            required
                            sx={{
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                borderRadius: 1,
                                input: { color: "white" },
                                "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                            }}
                        />
                        <TextField
                            label="Company Name"
                            variant="filled"
                            fullWidth
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                            sx={{
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                borderRadius: 1,
                                input: { color: "white" },
                                "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                            }}
                        />
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
                        />
                        <TextField
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            variant="filled"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, borderRadius: 2 }}>
                            Next
                        </Button>
                    </Stack>
                </form>
            ),
        },
        {
            label: "OTP Verification",
            content: (
                <form onSubmit={handleOtpVerification}>
                    <Stack spacing={2}>
                        <TextField
                            label="Enter OTP"
                            variant="filled"
                            fullWidth
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            sx={{
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                borderRadius: 1,
                                input: { color: "white" },
                                "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                            }}
                        />
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, borderRadius: 2 }}>
                            Verify OTP
                        </Button>
                    </Stack>
                </form>
            ),
        },
        {
            label: "Vehicle Details",
            content: (
                <Stack spacing={3}>
                    <Typography variant="h6" sx={{ color: "#f8f9fa" }}>
                        Select Vehicle Type
                    </Typography>
                    <Grid container spacing={2}>
                        {vehicleTypes.map((vehicle) => (
                            <Grid item xs={4} key={vehicle.type}>
                                <Card
                                    onClick={() => handleVehicleDetailsChange({ target: { name: "type", value: vehicle.type } })}
                                    sx={{
                                        cursor: "pointer",
                                        backgroundColor:
                                            vehicleDetails.type === vehicle.type
                                                ? "rgba(0, 123, 255, 0.2)"
                                                : "rgba(255, 255, 255, 0.1)",
                                        border:
                                            vehicleDetails.type === vehicle.type
                                                ? "2px solid #007bff"
                                                : "none",
                                        textAlign: "center",
                                        p: 2,
                                        transition: "0.3s",
                                        "&:hover": {
                                            transform: "scale(1.05)",
                                        },
                                    }}
                                >
                                    <Avatar
                                        src={vehicle.image}
                                        sx={{ width: 60, height: 60, mx: "auto", mb: 1 }}
                                    >
                                        {vehicle.icon}
                                    </Avatar>
                                    <Typography variant="body1" sx={{ color: "#f8f9fa" }}>
                                        {vehicle.type}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
        
                    {vehicleDetails.type && (
                        <Paper sx={{ p: 3, backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
                            <Typography variant="h6" sx={{ color: "#f8f9fa", mb: 2 }}>
                                Enter {vehicleDetails.type} Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Vehicle Number"
                                        variant="filled"
                                        fullWidth
                                        name="number"
                                        value={vehicleDetails.number}
                                        onChange={handleVehicleDetailsChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Driver Name"
                                        variant="filled"
                                        fullWidth
                                        name="driverName"
                                        value={vehicleDetails.driverName}
                                        onChange={handleVehicleDetailsChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Vehicle Height"
                                        variant="filled"
                                        fullWidth
                                        name="height"
                                        value={vehicleDetails.height}
                                        onChange={handleVehicleDetailsChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Vehicle Width"
                                        variant="filled"
                                        fullWidth
                                        name="width"
                                        value={vehicleDetails.width}
                                        onChange={handleVehicleDetailsChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Vehicle Length"
                                        variant="filled"
                                        fullWidth
                                        name="length"
                                        value={vehicleDetails.length}
                                        onChange={handleVehicleDetailsChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Number of Tyres"
                                        variant="filled"
                                        fullWidth
                                        name="tyres"
                                        value={vehicleDetails.tyres}
                                        onChange={handleVehicleDetailsChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Vehicle Model"
                                        variant="filled"
                                        fullWidth
                                        name="model"
                                        value={vehicleDetails.model}
                                        onChange={handleVehicleDetailsChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Registered At"
                                        variant="filled"
                                        fullWidth
                                        name="registeredAt"
                                        value={vehicleDetails.registeredAt}
                                        onChange={handleVehicleDetailsChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Vehicle Brand"
                                        variant="filled"
                                        fullWidth
                                        name="brand"
                                        value={vehicleDetails.brand}
                                        onChange={handleVehicleDetailsChange}
                                        required
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                variant="contained"
                                onClick={handleAddVehicle}
                                fullWidth
                                sx={{ mt: 2, borderRadius: 2 }}
                            >
                                {editIndex !== null ? "Update Vehicle" : "Add Vehicle"}
                            </Button>
                        </Paper>
                    )}
        
                    {vehicles.length > 0 && (
                        <Box>
                            <Typography variant="h6" sx={{ color: "#f8f9fa", mb: 2 }}>
                                Added Vehicles
                            </Typography>
                            <Stack spacing={1}>
                                {vehicles.map((vehicle, index) => (
                                    <Typography key={index} variant="body1" sx={{ color: "#f8f9fa" }}>
                                        {vehicle.type} - {vehicle.number} (Driver: {vehicle.driverName})
                                    </Typography>
                                ))}
                            </Stack>
                        </Box>
                    )}
        
                    {/* Next Button */}
                    <Button
                        variant="contained"
                        onClick={() => setActiveStep(3)}
                        fullWidth
                        sx={{ mt: 2, borderRadius: 2 }}
                    >
                        Next
                    </Button>
                </Stack>
            ),
        },
        {
            label: "Confirmation",
            content: (
                <Stack spacing={2}>
                    <Typography variant="h6">Owner Details</Typography>
                    <Typography>Name: {ownerName}</Typography>
                    <Typography>Company: {companyName}</Typography>
                    <Typography>Email: {email}</Typography>

                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Vehicles
                    </Typography>
                    {vehicles.map((vehicle, index) => (
                        <Paper key={index} sx={{ p: 2, mb: 2 }}>
                            <Typography>Vehicle Type: {vehicle.type}</Typography>
                            <Typography>Vehicle Number: {vehicle.number}</Typography>
                            <Typography>Driver Name: {vehicle.driverName}</Typography>
                        </Paper>
                    ))}
                    <Button variant="contained" onClick={handleConfirmAndSave} fullWidth sx={{ mt: 2, borderRadius: 2 }}>
                        Confirm and Save
                    </Button>
                </Stack>
            ),
        },
    ];

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
                    background: "rgba(0, 0, 0, 0.6)",
                },
            }}
        >
            <Card
                elevation={5}
                sx={{
                    width: "90%",
                    maxWidth: 800,
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
                        Owner Signup
                    </Typography>

                    {/* Horizontal Stepper */}
                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((step, index) => (
                            <Step key={step.label}>
                                <StepLabel>{step.label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/* Step Content */}
                    <Box sx={{ mt: 2 }}>
                        {steps[activeStep].content}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default SignupForOwner;