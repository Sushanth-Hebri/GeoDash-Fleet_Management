import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    MenuItem,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    Autocomplete,
    CircularProgress
} from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import carIconUrl from '../assets/car-navigation.png';

interface Driver {
    userId: string;
    name?: string;
    lat: number;
    lng: number;
}

interface LocationResult {
    display_name: string;
    lat: string;
    lon: string;
}

const FleetRadar: React.FC<{ drivers: Driver[]; onClose: () => void }> = ({ drivers, onClose }) => {
    const [locationSearch, setLocationSearch] = useState('');
    const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [radius, setRadius] = useState(1);
    const [customRadius, setCustomRadius] = useState('');
    const [radiusUnit, setRadiusUnit] = useState<'km' | 'm'>('km');
    const [vehiclesInRange, setVehiclesInRange] = useState<Array<Driver & { distance: number }>>([]);
    
    const mapRef = React.useRef<HTMLDivElement>(null);
    const mapInstance = React.useRef<L.Map | null>(null);
    const markersRef = React.useRef<L.Marker[]>([]);
    const circleRef = React.useRef<L.Circle | null>(null);

    const searchLocations = async (query: string) => {
        if (!query.trim()) return;
        
        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
            );
            const data = await response.json();
            setLocationResults(data);
        } catch (error) {
            console.error('Location search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (locationSearch) {
                searchLocations(locationSearch);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [locationSearch]);

    useEffect(() => {
        if (selectedLocation) {
            handleSearch(parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon));
        }
    }, [selectedLocation]);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstance.current);
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    const handleSearch = (lat: number, lng: number) => {
        let searchRadius = radius;
        if (customRadius) {
            searchRadius = parseFloat(customRadius);
            if (radiusUnit === 'm') {
                searchRadius = searchRadius / 1000;
            }
        }

        const results = drivers
            .map(driver => ({
                ...driver,
                distance: calculateDistance(lat, lng, driver.lat, driver.lng)
            }))
            .filter(vehicle => vehicle.distance <= searchRadius)
            .sort((a, b) => a.distance - b.distance);

        setVehiclesInRange(results);
        updateMapVisualization(lat, lng, searchRadius, results);
    };

    const updateMapVisualization = (lat: number, lng: number, radius: number, vehicles: typeof vehiclesInRange) => {
        if (!mapInstance.current) return;

        markersRef.current.forEach(marker => mapInstance.current?.removeLayer(marker));
        markersRef.current = [];

        const carIcon = L.icon({
            iconUrl: carIconUrl,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        vehicles.forEach(vehicle => {
            const displayName = vehicle.name || vehicle.userId;
            const marker = L.marker([vehicle.lat, vehicle.lng], { icon: carIcon })
                .addTo(mapInstance.current!)
                .bindPopup(`
                    <b>${displayName}</b><br>
                    Distance: ${vehicle.distance.toFixed(2)} km
                `);
            markersRef.current.push(marker);
        });

        if (circleRef.current) {
            mapInstance.current.removeLayer(circleRef.current);
        }
        circleRef.current = L.circle([lat, lng], {
            radius: radius * 1000,
            color: '#3388ff',
            fillColor: '#3388ff',
            fillOpacity: 0.2
        }).addTo(mapInstance.current);

        mapInstance.current.setView([lat, lng], 12);
    };

    return (
        <Box sx={{ p: 3 }}>
           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Radar Pulse Animation */}
        <Box sx={{
            position: 'relative',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Static center circle */}
            <Box sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                zIndex: 2,
                position: 'relative'
            }} />
            
            {/* Pulsing circles */}
            <Box sx={{
                position: 'absolute',
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                opacity: 0.6,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                    '0%': {
                        transform: 'scale(0.5)',
                        opacity: 0.6
                    },
                    '70%': {
                        transform: 'scale(1.3)',
                        opacity: 0
                    },
                    '100%': {
                        transform: 'scale(0.5)',
                        opacity: 0
                    }
                }
            }} />
            <Box sx={{
                position: 'absolute',
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                opacity: 0.6,
                animation: 'pulse 2s infinite',
                animationDelay: '1s',
                '@keyframes pulse': {
                    '0%': {
                        transform: 'scale(0.5)',
                        opacity: 0.6
                    },
                    '70%': {
                        transform: 'scale(1.3)',
                        opacity: 0
                    },
                    '100%': {
                        transform: 'scale(0.5)',
                        opacity: 0
                    }
                }
            }} />
        </Box>
        
        <Typography variant="h4">Fleet Radar</Typography>
    </Box>
    <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                 Use our satellite radar to find vehicles within range and get their details
            </Typography>
        </Box>
    <Button variant="contained" onClick={onClose}>
        Back to Dashboard
    </Button>
</Box>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>Radar Settings</Typography>
                        
                        {/* Location Search with Button */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Autocomplete
                                freeSolo
                                options={locationResults}
                                getOptionLabel={(option) => 
                                    typeof option === 'string' ? option : option.display_name
                                }
                                onInputChange={(_, value) => setLocationSearch(value)}
                                onChange={(_, value) => setSelectedLocation(value as LocationResult)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search Location"
                                        fullWidth
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                                sx={{ flex: 1 }}
                            />
                            <Button
                                variant="contained"
                                onClick={() => {
                                    if (selectedLocation) {
                                        handleSearch(
                                            parseFloat(selectedLocation.lat),
                                            parseFloat(selectedLocation.lon)
                                        );
                                    }
                                }}
                                disabled={!selectedLocation}
                                sx={{ height: '56px', minWidth: '120px' }}
                            >
                                Search
                            </Button>
                        </Box>

                        <Typography variant="subtitle1" gutterBottom>Predefined Radii (km)</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            {[0.5, 1, 5, 10].map(r => (
                                <Button
                                    key={r}
                                    variant={radius === r && !customRadius ? 'contained' : 'outlined'}
                                    onClick={() => {
                                        setRadius(r);
                                        setCustomRadius('');
                                        if (selectedLocation) {
                                            handleSearch(
                                                parseFloat(selectedLocation.lat),
                                                parseFloat(selectedLocation.lon)
                                            );
                                        }
                                    }}
                                >
                                    {r} km
                                </Button>
                            ))}
                        </Box>
                        
                        <Typography variant="subtitle1" gutterBottom>Custom Radius</Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                            <TextField
                                value={customRadius}
                                onChange={(e) => setCustomRadius(e.target.value)}
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                select
                                value={radiusUnit}
                                onChange={(e) => setRadiusUnit(e.target.value as 'km' | 'm')}
                                sx={{ width: 100 }}
                            >
                                <MenuItem value="km">km</MenuItem>
                                <MenuItem value="m">m</MenuItem>
                            </TextField>
                        </Box>
                        
                        {selectedLocation && (
                            <Box sx={{ mb: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                                <Typography variant="body2">
                                    <strong>Selected Location:</strong><br />
                                    {selectedLocation.display_name}<br />
                                    Lat: {parseFloat(selectedLocation.lat).toFixed(4)}, 
                                    Lng: {parseFloat(selectedLocation.lon).toFixed(4)}
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                    
                    {vehiclesInRange.length > 0 && (
                        <Paper sx={{ p: 2, mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Results: {vehiclesInRange.length} vehicles in range
                            </Typography>
                            <List>
                                {vehiclesInRange.map((vehicle, index) => (
                                    <React.Fragment key={vehicle.userId}>
                                        <ListItem>
                                            <ListItemText
                                                primary={`${vehicle.name || vehicle.userId}`}
                                                secondary={`Distance: ${vehicle.distance.toFixed(2)} km`}
                                            />
                                        </ListItem>
                                        {index < vehiclesInRange.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Grid>
                
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 1, height: '600px' }}>
                        <div 
                            ref={mapRef} 
                            style={{ 
                                width: '100%', 
                                height: '100%',
                                borderRadius: '4px'
                            }}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FleetRadar;