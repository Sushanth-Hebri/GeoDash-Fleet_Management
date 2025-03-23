import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";
import carIconUrl from "../assets/car-navigation.png"; // Ensure this exists
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'; // Icon for Add/Remove Vehicle
import {
    AppBar,
    Toolbar,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    CssBaseline,
    Box,
    Paper,
    Grid,
    Card,
    CardContent,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Switch,
    useTheme,
    ThemeProvider,
    createTheme,
    Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import SearchIcon from "@mui/icons-material/Search";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import BarChartIcon from "@mui/icons-material/BarChart";
import RadarIcon from "@mui/icons-material/Radar";
import SpeedIcon from "@mui/icons-material/Speed";
import ChatIcon from "@mui/icons-material/Chat";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh"; // Import Refresh Icon
import { BarChart } from "@mui/x-charts";
import { DataGrid } from "@mui/x-data-grid";

const socket = io("https://location-track-testing.onrender.com", {
    transports: ["polling"],
});

interface Driver {
    userId: string;
    lat: number;
    lng: number;
}

const drawerWidth = 240;

const vehicleColumns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'vehicleNumber', headerName: 'Vehicle Number', width: 130 },
    { field: 'type', headerName: 'Type', width: 130 },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'location', headerName: 'Current Location', width: 160 },
    { field: 'driver', headerName: 'Assigned Driver', width: 160 },
];

const vehicleRows = [
    { id: 1, vehicleNumber: 'TRK-001', type: 'Heavy Truck', status: 'Active', location: 'Route 66', driver: 'John Doe' },
    { id: 2, vehicleNumber: 'VAN-002', type: 'Delivery Van', status: 'Maintenance', location: 'Service Center', driver: 'Jane Smith' },
    { id: 3, vehicleNumber: 'TRK-003', type: 'Medium Truck', status: 'Active', location: 'Highway 95', driver: 'Mike Johnson' },
];

const menuItems = [
    { text: 'Dashboard', icon: <DirectionsCarIcon /> },
    { text: 'Reports', icon: <BarChartIcon /> },
    { text: 'Fleet Radar', icon: <RadarIcon /> },
    { text: 'Advanced Analytics', icon: <BarChartIcon /> },
    { text: 'Speed Monitor', icon: <SpeedIcon /> },
    { text: 'Communicate with Driver', icon: <ChatIcon /> },
    { text: 'Add/Remove Vehicle', icon: <PlaylistAddCheckIcon /> },
    { text: 'Geo trigger', icon: <GpsFixedIcon /> },
    { text: 'Settings', icon: <SettingsIcon /> },
    
];

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#f50057',
        },
    },
});

const Dashboard: React.FC = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openPanel, setOpenPanel] = useState<string | null>(null);
    const [darkMode, setDarkMode] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Key to force re-render

    // Define handleDrawerToggle
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const handleThemeChange = () => {
        setDarkMode(!darkMode);
    };
    // Define drawer content
    const drawer = (
        <div>
            <Toolbar sx={{ bgcolor: darkMode ? 'primary.main' : 'primary.main', color: 'white' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Fleetera
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton
                            onClick={() => item.text === 'Dashboard' ? handlePanelClose() : handlePanelOpen(item.text)}
                            sx={{
                                '&:hover': {
                                    bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                },
                                py: 1.5,
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} sx={{ color: 'white' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ color: 'white' }}>
                    Dark Mode
                </Typography>
                <Switch checked={darkMode} onChange={handleThemeChange} color="primary" />
            </Box>
        </div>
    );

    // Other handler functions
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handlePanelOpen = (panel: string) => {
        setOpenPanel(panel);
    };

    const handlePanelClose = () => {
        setOpenPanel(null);
    };

   

    const handleRefresh = () => {
        // Force re-render of the map and markers
        setRefreshKey((prevKey) => prevKey + 1);
    };

    useEffect(() => {
        socket.on("locationUpdate", (data: Driver[]) => {
            console.log("Received location update:", data); // Debugging
            setDrivers(data);
            setIsLoading(false);
        });

        return () => {
            socket.off("locationUpdate");
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        console.log("Initializing map..."); // Debugging

        mapInstance.current = L.map(mapRef.current, {
            center: [20.5937, 78.9629],
            zoom: 8,
            zoomControl: true,
            maxZoom: 18,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
        }).addTo(mapInstance.current);
    }, [refreshKey]); // Re-initialize map when refreshKey changes

    useEffect(() => {
        if (!mapInstance.current) return;

        console.log("Updating markers..."); // Debugging

        mapInstance.current.eachLayer((layer) => {
            if ((layer as L.Marker).options?.icon) {
                mapInstance.current?.removeLayer(layer);
            }
        });

        if (drivers.length === 0) return;

        const bounds = L.latLngBounds([]);

        drivers.forEach((driver) => {
            if (search && !driver.userId.toLowerCase().includes(search.toLowerCase())) return;

            const carIcon = L.icon({
                iconUrl: carIconUrl,
                iconSize: [40, 40],
                iconAnchor: [20, 40],
            });

            const marker = L.marker([driver.lat, driver.lng], { icon: carIcon }).addTo(mapInstance.current as L.Map);

            console.log("Marker added for driver:", driver.userId); // Debugging

            marker.bindTooltip(driver.userId, {
                permanent: true,
                direction: "right",
                offset: [10, 0],
                className: "driver-label",
            });

            bounds.extend(marker.getLatLng());
        });

        if (bounds.isValid()) {
            if (drivers.length > 1) {
                mapInstance.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
            } else {
                mapInstance.current.setView(bounds.getCenter(), 18);
            }
        }
    }, [drivers, search, refreshKey]); // Re-render markers when refreshKey changes

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />

                {/* Navbar */}
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        {/* Brand Name (Fleetera) */}
                        <Typography variant="h6" sx={{ fontWeight: 600, mr: 2 }}>
                            Fleetera
                        </Typography>

                        {/* Company Name (Global Logistics Inc.) */}
                        <Typography
                            variant="h6"
                            sx={{
                                flexGrow: 1,
                                textAlign: "center",
                                fontWeight: 600,
                                position: "absolute",
                                left: "50%",
                                transform: "translateX(-50%)",
                            }}
                        >
                            Global Logistics Inc.
                        </Typography>

                        {/* Search Bar */}
                        <TextField
                            size="small"
                            placeholder="Search driver, vehicle..."
                            sx={{ 
                                bgcolor: 'background.paper', 
                                borderRadius: 5, 
                                width: 250,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: 'none', // Remove border
                                    },
                                    '&:hover fieldset': {
                                        border: 'none', // Remove border on hover
                                    },
                                    '&.Mui-focused fieldset': {
                                        border: 'none', // Remove border when focused
                                    },
                                },
                            }}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Notifications */}
                        <IconButton color="inherit" sx={{ ml: 2 }}>
                            <NotificationsIcon />
                        </IconButton>

                        {/* Profile Menu */}
                        <IconButton color="inherit" onClick={handleMenuOpen} sx={{ ml: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <AccountCircleIcon />
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            sx={{ mt: 5 }}
                        >
                            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>

                {/* Sidebar */}
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: "border-box",
                            bgcolor: darkMode ? '#1e1e1e' : 'primary.main',
                            color: 'white',
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Main Content */}
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                    <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
                        <DirectionsCarIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        Live Driver Locations
                    </Typography>

                    {/* Loading Indicator */}
                    {isLoading && (
                        <Typography sx={{ textAlign: "center", color: "#555", mb: 2 }}>Loading driver locations...</Typography>
                    )}

                    {/* Map */}
                    <Paper sx={{ p: 3, boxShadow: 2, mb: 3, position: 'relative' }}>
                        <Button
                            variant="contained"
                            startIcon={<RefreshIcon />}
                            onClick={handleRefresh}
                            sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}
                        >
                            Refresh
                        </Button>
                        <div
                            ref={mapRef}
                            style={{
                                width: "100%",
                                height: "400px",
                                borderRadius: "8px",
                                overflow: "hidden",
                            }}
                        ></div>
                    </Paper>

                    {/* Quick Stats */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {[
                            { title: 'Total Vehicles', value: '45', icon: <DirectionsCarIcon />, color: '#1e88e5' },
                            { title: 'Active Drivers', value: '32', icon: <DirectionsCarIcon />, color: '#43a047' },
                            { title: 'Fuel Usage', value: '2,450L', icon: <DirectionsCarIcon />, color: '#fb8c00' },
                            { title: 'Maintenance Alerts', value: '3', icon: <DirectionsCarIcon />, color: '#e53935' },
                        ].map((stat, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card sx={{ bgcolor: 'background.paper', boxShadow: 2 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Box sx={{ p: 1, borderRadius: 1, mr: 2, color: stat.color }}>
                                                {stat.icon}
                                            </Box>
                                            <Typography variant="h6" component="div">
                                                {stat.title}
                                            </Typography>
                                        </Box>
                                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                            {stat.value}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Vehicle List */}
                    <Paper sx={{ p: 3, boxShadow: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Vehicle Fleet</Typography>
                        <DataGrid
                            rows={vehicleRows}
                            columns={vehicleColumns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                            }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            disableRowSelectionOnClick
                            autoHeight
                            sx={{
                                '& .MuiDataGrid-row:nth-of-type(odd)': {
                                    bgcolor: 'background.default',
                                },
                            }}
                        />
                    </Paper>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Dashboard;