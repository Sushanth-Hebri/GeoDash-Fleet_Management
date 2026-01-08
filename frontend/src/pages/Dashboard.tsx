import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";
import carIconUrl from "../assets/car-navigation.png";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
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
    ThemeProvider,
    createTheme,
    Button,
    Badge,
    Chip,
    Select,
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
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { BarChart } from "@mui/x-charts";
import { DataGrid } from "@mui/x-data-grid";
import Reports from "../components/Reports";
import FleetRadar from "../components/FleetRadar";
import GeoTrigger from "../components/GeoTrigger";
import SpeedMonitor from "../components/SpeedMonitor";
import { initializePendo } from "../utils/pendo";


const socket = io("https://location-track-testing.onrender.com", {
    transports: ["polling"],
});

interface Driver {
    userId: string;
    name: string; 
    lat: number;
    lng: number;
}

interface Alert {
    id: string;
    vehicleNumber: string;
    driverId: string;
    driverName: string;
    driverPhone: string;
    driverEmail: string;
    alertType: "overspeed" | "harsh_braking" | "harsh_acceleration" | "geofence" | "maintenance";
    severity: "critical" | "warning" | "info";
    message: string;
    timestamp: Date;
    lat: number;
    lng: number;
}

interface DriverInfo {
    driverId: string;
    name: string;
    phone: string;
    email: string;
}

const drawerWidth = 240;
const rightPanelWidth = 380;

const mockAlerts: Alert[] = [
    {
        id: "alert-1",
        vehicleNumber: "TRK-001",
        driverId: "D001",
        driverName: "John Doe",
        driverPhone: "+1-555-0101",
        driverEmail: "john.doe@example.com",
        alertType: "overspeed",
        severity: "critical",
        message: "Vehicle exceeded speed limit by 20 km/h on Highway 95",
        timestamp: new Date(Date.now() - 5 * 60000),
        lat: 12.9352,
        lng: 77.6245,
    },
    {
        id: "alert-2",
        vehicleNumber: "VAN-002",
        driverId: "D002",
        driverName: "Jane Smith",
        driverPhone: "+1-555-0102",
        driverEmail: "jane.smith@example.com",
        alertType: "harsh_braking",
        severity: "warning",
        message: "Harsh braking detected near intersection",
        timestamp: new Date(Date.now() - 15 * 60000),
        lat: 12.9716,
        lng: 77.5946,
    },
    {
        id: "alert-3",
        vehicleNumber: "TRK-003",
        driverId: "D003",
        driverName: "Mike Johnson",
        driverPhone: "+1-555-0103",
        driverEmail: "mike.johnson@example.com",
        alertType: "maintenance",
        severity: "info",
        message: "Scheduled maintenance due in 500 km",
        timestamp: new Date(Date.now() - 30 * 60000),
        lat: 13.0827,
        lng: 80.2707,
    },
];

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
    const [darkMode, setDarkMode] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [activeView, setActiveView] = useState<"dashboard" | "reports" | "radar" | "geotrigger" | "speedMonitor">("dashboard");
    const [isLive, setIsLive] = useState(true);
    const [timeFilter, setTimeFilter] = useState("today");
    const [selectedFleet, setSelectedFleet] = useState("all");
    const [alertCount, setAlertCount] = useState(3);
    const [showAlertsPanel, setShowAlertsPanel] = useState(false);
    const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleThemeChange = () => {
        setDarkMode(!darkMode);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    useEffect(() => {
        socket.on("locationUpdate", (data: any[]) => {
            setDrivers(data.map(driver => ({
                userId: driver.userId,
                name: driver.name || `Driver ${driver.userId}`,
                lat: driver.lat,
                lng: driver.lng
            })));
            setIsLoading(false);
            setIsLive(true);
        });

        socket.on("connect", () => {
            setIsLive(true);
        });

        socket.on("disconnect", () => {
            setIsLive(false);
        });
    
        return () => {
            socket.off("locationUpdate");
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current || activeView !== 'dashboard') return;

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

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [refreshKey, activeView]);

    useEffect(() => {
        if (!mapInstance.current || activeView !== 'dashboard') return;

        mapInstance.current.eachLayer((layer) => {
            if ((layer as L.Marker).options?.icon) {
                mapInstance.current?.removeLayer(layer);
            }
        });

        if (drivers.length === 0) return;

        const bounds = L.latLngBounds([]);
        const carIcon = L.icon({
            iconUrl: carIconUrl,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
        });

        drivers.forEach((driver) => {
            if (search && !driver.userId.toLowerCase().includes(search.toLowerCase())) return;

            const marker = L.marker([driver.lat, driver.lng], { icon: carIcon })
                .addTo(mapInstance.current as L.Map)
                .bindTooltip(driver.userId, {
                    permanent: true,
                    direction: "right",
                    offset: [10, 0],
                    className: "driver-label",
                });

            bounds.extend(marker.getLatLng());
        });

        if (bounds.isValid()) {
            drivers.length > 1 
                ? mapInstance.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
                : mapInstance.current.setView(bounds.getCenter(), 18);
        }
    }, [drivers, search, refreshKey, activeView]);

    const drawer = (
        <div>
            <Toolbar sx={{ bgcolor: darkMode ? 'primary.main' : 'primary.main', color: 'white' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    GeoDash
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton
                            onClick={() => {
                                if (item.text === 'Dashboard') {
                                    setActiveView("dashboard");
                                } else if (item.text === 'Reports') {
                                    setActiveView("reports");
                                } else if (item.text === 'Fleet Radar') {
                                    setActiveView("radar");
                                } else if (item.text === 'Geo trigger') {
                                    setActiveView("geotrigger");
                                }
                                else if (item.text === 'Speed Monitor') {
                                    setActiveView("speedMonitor");
                                }
                            }}
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
    <Switch 
        checked={darkMode} 
        onChange={() => {
            handleThemeChange(); // Call it without arguments
            window.pendo?.track("Dark Mode Toggled", { darkMode: !darkMode }); // Use the toggled state
        }} 
        color="primary" 
    />
</Box>
        </div>
    );

    // Helper function to get alert severity color
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "critical":
                return "#ff5252";
            case "warning":
                return "#ffa726";
            case "info":
                return "#42a5f5";
            default:
                return "#gray";
        }
    };

    // Helper function to get alert type icon
    const getAlertTypeLabel = (type: string) => {
        switch (type) {
            case "overspeed":
                return "⚡ Overspeed";
            case "harsh_braking":
                return "🛑 Harsh Braking";
            case "harsh_acceleration":
                return "🚀 Harsh Acceleration";
            case "geofence":
                return "📍 Geofence Breach";
            case "maintenance":
                return "🔧 Maintenance";
            default:
                return "Alert";
        }
    };

    // Function to zoom to alert location on map
    const handleAlertSelect = (alert: Alert) => {
        setSelectedAlert(alert);
        if (mapInstance.current) {
            mapInstance.current.setView([alert.lat, alert.lng], 16);
        }
    };

    // Function to close alert details
    const handleCloseAlertDetails = () => {
        setSelectedAlert(null);
    };

    // Function to format timestamp
    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        
        return date.toLocaleDateString();
    };

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />

                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 1, display: { sm: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                            
                            <Typography variant="h6" noWrap component="div" sx={{ minWidth: 200 }}>
                                GeoDash
                            </Typography>
                        </Box>

                        {/* Top Bar Status and Filters */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1, justifyContent: "center" }}>
                            {/* Live Status */}
                            <Chip
                                icon={<FiberManualRecordIcon />}
                                label={isLive ? "Live" : "Offline"}
                                color={isLive ? "success" : "default"}
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    '& .MuiChip-icon': {
                                        animation: isLive ? "pulse 1s infinite" : "none",
                                    },
                                    '@keyframes pulse': {
                                        '0%, 100%': { opacity: 1 },
                                        '50%': { opacity: 0.5 },
                                    },
                                }}
                            />

                            {/* Time Filter */}
                            <Chip
                                label={timeFilter === "today" ? "📅 Today" : "📊 All Time"}
                                onClick={() => setTimeFilter(timeFilter === "today" ? "all" : "today")}
                                variant="outlined"
                                size="small"
                                sx={{ cursor: "pointer", fontWeight: 600 }}
                            />

                            {/* Fleet Dropdown */}
                            <Select
                                value={selectedFleet}
                                onChange={(e) => setSelectedFleet(e.target.value)}
                                size="small"
                                sx={{
                                    color: "inherit",
                                    bgcolor: "rgba(255, 255, 255, 0.15)",
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: "rgba(255, 255, 255, 0.3)",
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: "rgba(255, 255, 255, 0.5)",
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: "white",
                                    },
                                    fontWeight: 600,
                                }}
                            >
                                <MenuItem value="all">All Fleets</MenuItem>
                                <MenuItem value="fleet1">🚚 Fleet A</MenuItem>
                                <MenuItem value="fleet2">🚚 Fleet B</MenuItem>
                                <MenuItem value="fleet3">🚚 Fleet C</MenuItem>
                            </Select>

                            {/* Alerts Badge */}
                            <IconButton 
                                color="inherit" 
                                size="small"
                                onClick={() => setShowAlertsPanel(!showAlertsPanel)}
                            >
                                <Badge badgeContent={alertCount} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Box>

                        {/* Search and User Menu */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <TextField
                                size="small"
                                placeholder="Search..."
                                variant="outlined"
                                sx={{ 
                                    bgcolor: 'background.paper',
                                    borderRadius: 1,
                                    width: { xs: 100, sm: 150 },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { border: 'none' },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            
                            <IconButton color="inherit" onClick={handleMenuOpen}>
                                <AccountCircleIcon />
                            </IconButton>
                            
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                                <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { 
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            bgcolor: darkMode ? '#1e1e1e' : 'primary.main',
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                    {activeView === 'dashboard' && (
                        <>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <DirectionsCarIcon sx={{ mr: 1 }} />
                                Live Driver Locations
                            </Typography>
                            
                            {isLoading && (
                                <Typography color="textSecondary">
                                    Loading driver locations...
                                </Typography>
                            )}
                            
                            <Paper sx={{ p: 2, mb: 3, position: 'relative' }}>
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
                                    style={{ height: 400, borderRadius: 4 }}
                                />
                            </Paper>
                            
                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                {[
                                    { title: 'Total Vehicles', value: '45', icon: <DirectionsCarIcon /> },
                                    { title: 'Active Drivers', value: drivers.length.toString(), icon: <DirectionsCarIcon /> },
                                    { title: 'On Schedule', value: '38', icon: <DirectionsCarIcon /> },
                                    { title: 'Delayed', value: '7', icon: <DirectionsCarIcon /> },
                                ].map((stat, i) => (
                                    <Grid item xs={12} sm={6} md={3} key={i}>
                                        <Card sx={{ height: '100%' }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box sx={{ mr: 2 }}>
                                                        {stat.icon}
                                                    </Box>
                                                    <Typography variant="h6">{stat.title}</Typography>
                                                </Box>
                                                <Typography variant="h3" sx={{ mt: 1 }}>
                                                    {stat.value}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Vehicle Fleet
                                </Typography>
                                <DataGrid
                                    rows={vehicleRows}
                                    columns={vehicleColumns}
                                    pageSizeOptions={[5, 10]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                    autoHeight
                                />
                            </Paper>
                        </>
                    )}

                    {activeView === 'reports' && (
                        <Reports onClose={() => setActiveView('dashboard')} />
                    )}

                    {activeView === 'radar' && (
                        <FleetRadar 
                            drivers={drivers} 
                            onClose={() => setActiveView('dashboard')} 
                        />
                    )}

{activeView === 'geotrigger' && (
    <>
        {window.pendo ? window.pendo.track("geotrigger_clicked") : console.warn("Pendo is not loaded yet!")}

        <GeoTrigger 
            onClose={() => setActiveView('dashboard')} 
            vehicles={vehicleRows.map(row => ({
                id: row.id,
                vehicleNumber: row.vehicleNumber
            }))} 
        />
    </>
)}

                    
                    {activeView === 'speedMonitor' && (
                        <SpeedMonitor 
                            onClose={() => setActiveView('dashboard')} 
                            vehicles={vehicleRows.map(row => ({
                                id: row.id,
                                vehicleNumber: row.vehicleNumber
                            }))}
                        />
                    )}
                </Box>

                {/* Alerts Right Panel */}
                <Drawer
                    anchor="right"
                    open={showAlertsPanel && !selectedAlert}
                    onClose={() => setShowAlertsPanel(false)}
                    sx={{
                        width: rightPanelWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: rightPanelWidth,
                            mt: 8,
                            height: 'calc(100vh - 64px)',
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                🔔 Alerts Room
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={() => setShowAlertsPanel(false)}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
                        </Typography>

                        <List sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                            {alerts.map((alert) => (
                                <Paper
                                    key={alert.id}
                                    sx={{
                                        mb: 2,
                                        p: 1.5,
                                        cursor: 'pointer',
                                        borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: 2,
                                            bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                        },
                                    }}
                                    onClick={() => handleAlertSelect(alert)}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                🚚 {alert.vehicleNumber}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                {getAlertTypeLabel(alert.alertType)}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: 'inline-block',
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: '4px',
                                                    bgcolor: getSeverityColor(alert.severity),
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    mb: 0.5,
                                                }}
                                            >
                                                {alert.severity.toUpperCase()}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                                                {formatTime(alert.timestamp)}
                                            </Typography>
                                        </Box>
                                        <KeyboardArrowRightIcon sx={{ mt: 0.5, color: 'action.disabled' }} />
                                    </Box>
                                </Paper>
                            ))}
                        </List>
                    </Box>
                </Drawer>

                {/* Alert Details Right Panel */}
                <Drawer
                    anchor="right"
                    open={!!selectedAlert}
                    onClose={handleCloseAlertDetails}
                    sx={{
                        width: rightPanelWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: rightPanelWidth,
                            mt: 8,
                            height: 'calc(100vh - 64px)',
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    {selectedAlert && (
                        <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <IconButton
                                    size="small"
                                    onClick={handleCloseAlertDetails}
                                >
                                    <KeyboardArrowRightIcon />
                                </IconButton>
                                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1, textAlign: 'center' }}>
                                    Alert Details
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={handleCloseAlertDetails}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            {/* Alert Header */}
                            <Paper
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                    borderLeft: `4px solid ${getSeverityColor(selectedAlert.severity)}`,
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    {getAlertTypeLabel(selectedAlert.alertType)}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'inline-block',
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: '4px',
                                        bgcolor: getSeverityColor(selectedAlert.severity),
                                        color: 'white',
                                        fontWeight: 600,
                                        mb: 1,
                                    }}
                                >
                                    {selectedAlert.severity.toUpperCase()}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {selectedAlert.message}
                                </Typography>
                            </Paper>

                            {/* Vehicle Information */}
                            <Paper sx={{ p: 2, mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                  Vehicle Information
                                </Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box sx={{ display: 'grid', gap: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="textSecondary">
                                            Vehicle Number:
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {selectedAlert.vehicleNumber}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="textSecondary">
                                            Alert Type:
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {selectedAlert.alertType}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="textSecondary">
                                            Time:
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {formatTime(selectedAlert.timestamp)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Driver Information */}
                            <Paper sx={{ p: 2, mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    👨‍💼 Driver Information
                                </Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box sx={{ display: 'grid', gap: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="textSecondary">
                                            Name:
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {selectedAlert.driverName}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="textSecondary">
                                            Driver ID:
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {selectedAlert.driverId}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Contact Driver Section */}
                            <Paper sx={{ p: 2, mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    📞 Contact Driver
                                </Typography>
                                <Divider sx={{ mb: 1.5 }} />
                                <Box sx={{ display: 'grid', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<PhoneIcon />}
                                        sx={{ justifyContent: 'flex-start' }}
                                    >
                                        {selectedAlert.driverPhone}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<EmailIcon />}
                                        sx={{ justifyContent: 'flex-start' }}
                                    >
                                        {selectedAlert.driverEmail}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<PhoneIcon />}
                                        sx={{ mt: 1 }}
                                    >
                                        Call Driver Now
                                    </Button>
                                </Box>
                            </Paper>

                            {/* Location Information */}
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    📍 Location
                                </Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box sx={{ display: 'grid', gap: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="textSecondary">
                                            Latitude:
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {selectedAlert.lat.toFixed(4)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="textSecondary">
                                            Longitude:
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {selectedAlert.lng.toFixed(4)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                    )}
                </Drawer>
            </Box>
        </ThemeProvider>
    );
};

export default Dashboard;