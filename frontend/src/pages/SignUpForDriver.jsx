import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Person, Email, DriveEta, Lock, FileUpload } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SignupForDriver = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleNumber: "",
    insuranceProvider: "",
    policyNumber: "",
    policyExpiry: "",
    workingHours: "",
    password: "",
    licenseFile: null,
    insuranceFile: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSignup = () => {
    console.log("Signup Data:", formData);
    navigate("/driverdashboard");
  };

  const steps = [
    { label: "Personal Details", content: (
        <Stack spacing={3}>
          <TextField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} fullWidth required InputProps={{ startAdornment: <Person sx={{ color: "#00D4FF", mr: 1 }} /> }} />
          <TextField label="Date of Birth" name="dob" type="date" InputLabelProps={{ shrink: true }} value={formData.dob} onChange={handleChange} fullWidth required />
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select name="gender" value={formData.gender} onChange={handleChange} required>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      ),
    },
    { label: "Contact Details", content: (
        <Stack spacing={3}>
          <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth required InputProps={{ startAdornment: <Email sx={{ color: "#00D4FF", mr: 1 }} /> }} />
          <TextField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} fullWidth required />
          <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth required InputProps={{ startAdornment: <Lock sx={{ color: "#00D4FF", mr: 1 }} /> }} />
        </Stack>
      ),
    },
    { label: "Vehicle Details", content: (
        <Stack spacing={3}>
          <TextField label="Vehicle Model" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} fullWidth required />
          <TextField label="Vehicle Year" name="vehicleYear" type="number" value={formData.vehicleYear} onChange={handleChange} fullWidth required />
          <TextField label="License Plate Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} fullWidth required InputProps={{ startAdornment: <DriveEta sx={{ color: "#00D4FF", mr: 1 }} /> }} />
        </Stack>
      ),
    },
    { label: "Driver's License", content: (
        <Stack spacing={3}>
          <TextField label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} fullWidth required />
          <TextField label="License Expiry Date" name="licenseExpiry" type="date" InputLabelProps={{ shrink: true }} value={formData.licenseExpiry} onChange={handleChange} fullWidth required />
          <Button variant="contained" component="label" startIcon={<FileUpload />}>
            Upload License <input type="file" name="licenseFile" onChange={handleChange} hidden />
          </Button>
        </Stack>
      ),
    },
    { label: "Insurance Details", content: (
        <Stack spacing={3}>
          <TextField label="Insurance Provider" name="insuranceProvider" value={formData.insuranceProvider} onChange={handleChange} fullWidth required />
          <TextField label="Policy Number" name="policyNumber" value={formData.policyNumber} onChange={handleChange} fullWidth required />
          <TextField label="Policy Expiry Date" name="policyExpiry" type="date" InputLabelProps={{ shrink: true }} value={formData.policyExpiry} onChange={handleChange} fullWidth required />
          <Button variant="contained" component="label" startIcon={<FileUpload />}>
            Upload Insurance <input type="file" name="insuranceFile" onChange={handleChange} hidden />
          </Button>
        </Stack>
      ),
    },
    { label: "Download GeoDash App", content: (
        <Stack spacing={3} alignItems="center">
          {isMobile ? (
            <>
              <Typography variant="h6">Download GeoDash App</Typography>
              <Button variant="contained" color="primary" href="https://GeoDash.com/download">
                Download GeoDash App
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6">Scan QR Code to Download GeoDash App</Typography>
              <img src="https://images.unsplash.com/photo-1595079676714-d804bc1095b4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="GeoDash QR Code" width={200} height={200} />
              <Typography variant="body2" color="textSecondary">
                Use your mobile device to scan and download.
              </Typography>
            </>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #1e1e2e, #111827)" }}>
      <Card sx={{ width: 600, p: 4, borderRadius: 3, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>Driver Signup</Typography>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step) => (<Step key={step.label}><StepLabel>{step.label}</StepLabel></Step>))}
          </Stepper>
          <Box sx={{ mt: 4 }}>{steps[activeStep].content}</Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button onClick={handleBack} disabled={activeStep === 0}>Back</Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={handleSignup}>Finish</Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>Next</Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignupForDriver;
