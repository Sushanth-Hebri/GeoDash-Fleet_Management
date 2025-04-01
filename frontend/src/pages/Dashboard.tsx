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
import { BarChart } from "@mui/x-charts";
import { DataGrid } from "@mui/x-data-grid";
import Reports from "../components/Reports";
import FleetRadar from "../components/FleetRadar";
import GeoTrigger from "../components/GeoTrigger";
import SpeedMonitor from "../components/SpeedMonitor";

const socket = io("https://location-track-testing.onrender.com", {
    transports: ["polling"],
});

interface Driver {
    userId: string;
    name: string; 
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
    const [darkMode, setDarkMode] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [activeView, setActiveView] = useState<"dashboard" | "reports" | "radar" | "geotrigger" | "speedMonitor">("dashboard");

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
        });
    
        return () => {
            socket.off("locationUpdate");
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
                    Fleetera
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
                <Switch checked={darkMode} onChange={handleThemeChange} color="primary" />
            </Box>
        </div>
    );

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />

                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            Fleetera - Global Logistics Inc.
                        </Typography>
                        
                        <TextField
                            size="small"
                            placeholder="Search..."
                            variant="outlined"
                            sx={{ 
                                mr: 2,
                                bgcolor: 'background.paper',
                                borderRadius: 1,
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
                        
                        <IconButton color="inherit">
                            <NotificationsIcon />
                        </IconButton>
                        
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
                        <GeoTrigger 
                            onClose={() => setActiveView('dashboard')} 
                            vehicles={vehicleRows.map(row => ({
                                id: row.id,
                                vehicleNumber: row.vehicleNumber
                            }))}
                        />
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
            </Box>
        </ThemeProvider>
    );
};

export default Dashboard;