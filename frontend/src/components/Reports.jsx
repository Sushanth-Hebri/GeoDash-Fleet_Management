import React from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    Divider,
    Grid,
    Card,
    CardContent,
} from "@mui/material";
import { BarChart } from "@mui/x-charts";
import CloseIcon from "@mui/icons-material/Close";

const Reports = ({ onClose }) => {
    // Sample data for reports
    const vehicleData = [
        { id: 1, name: "Truck A", trips: 12, fuelUsed: 450, maintenance: 2 },
        { id: 2, name: "Van B", trips: 18, fuelUsed: 320, maintenance: 1 },
        { id: 3, name: "Truck C", trips: 9, fuelUsed: 380, maintenance: 3 },
    ];

    return (
        <Box sx={{ p: 3 }}>
            {/* Header with close button */}
            <Box sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                mb: 3 
            }}>
                <Typography variant="h4" component="h1">
                    Fleet Reports
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    onClick={onClose}
                    sx={{ ml: 2 }}
                >
                    Close Reports
                </Button>
            </Box>
            <Divider sx={{ mb: 4 }} />

            {/* Report Charts Grid */}
            <Grid container spacing={3}>
                {/* Vehicle Utilization */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
                        <Typography variant="h6" gutterBottom>
                            Vehicle Utilization (Weekly)
                        </Typography>
                        <BarChart
                            xAxis={[{
                                scaleType: "band",
                                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                            }]}
                            series={[{
                                data: [4, 3, 5, 7, 6, 2, 1],
                                color: "#1976d2",
                            }]}
                            height={300}
                        />
                    </Paper>
                </Grid>

                {/* Fuel Consumption */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
                        <Typography variant="h6" gutterBottom>
                            Fuel Consumption (Liters)
                        </Typography>
                        <BarChart
                            xAxis={[{
                                scaleType: "band",
                                data: vehicleData.map(v => v.name),
                            }]}
                            series={[{
                                data: vehicleData.map(v => v.fuelUsed),
                                color: "#4caf50",
                            }]}
                            height={300}
                        />
                    </Paper>
                </Grid>

                {/* Maintenance History */}
                <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Maintenance History
                            </Typography>
                            <BarChart
                                xAxis={[{
                                    scaleType: "band",
                                    data: vehicleData.map(v => v.name),
                                }]}
                                series={[{
                                    data: vehicleData.map(v => v.maintenance),
                                    color: "#ff9800",
                                }]}
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Trip Count */}
                <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Completed Trips
                            </Typography>
                            <BarChart
                                xAxis={[{
                                    scaleType: "band",
                                    data: vehicleData.map(v => v.name),
                                }]}
                                series={[{
                                    data: vehicleData.map(v => v.trips),
                                    color: "#9c27b0",
                                }]}
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Reports;