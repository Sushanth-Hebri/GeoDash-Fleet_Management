import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Checkbox,
    FormControlLabel,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const GeoTrigger = ({ onClose, vehicles }) => {
    // Form state
    const [triggerType, setTriggerType] = useState('all');
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [locationMethod, setLocationMethod] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [manualLat, setManualLat] = useState('');
    const [manualLng, setManualLng] = useState('');
    const [radius, setRadius] = useState(1);
    const [customRadius, setCustomRadius] = useState('');
    const [radiusUnit, setRadiusUnit] = useState('km');
    const [notifyDriver, setNotifyDriver] = useState(false);
    const [notifyOwner, setNotifyOwner] = useState(false);
    const [driverMessage, setDriverMessage] = useState('');
    const [ownerMessage, setOwnerMessage] = useState('');
    const [sendNotification, setSendNotification] = useState(true);
    const [durationType, setDurationType] = useState('all-time');
    const [customDays, setCustomDays] = useState('');
    const [customTriggers, setCustomTriggers] = useState('');
    
    // Saved triggers state
    const [savedTriggers, setSavedTriggers] = useState([
        {
            id: 1,
            triggerType: 'single',
            selectedVehicle: 'KA-01-AB-1234',
            location: 'Bangalore, Karnataka',
            radius: 2,
            radiusUnit: 'km',
            duration: '1 Day',
            notifications: {
                driver: true,
                owner: true,
                sendNotification: true
            },
            createdAt: '2023-05-15, 10:30 AM'
        },
        {
            id: 2,
            triggerType: 'all',
            selectedVehicle: 'All Vehicles',
            location: 'Lat: 12.9716, Lng: 77.5946',
            radius: 5,
            radiusUnit: 'km',
            duration: 'All-time',
            notifications: {
                driver: false,
                owner: true,
                sendNotification: true
            },
            createdAt: '2023-05-14, 3:45 PM'
        }
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTrigger = {
            id: Date.now(),
            triggerType,
            selectedVehicle: triggerType === 'single' 
                ? vehicles.find(v => v.id === selectedVehicle)?.vehicleNumber 
                : 'All Vehicles',
            location: locationMethod === 'search' 
                ? searchQuery 
                : `Lat: ${manualLat}, Lng: ${manualLng}`,
            radius: customRadius || radius,
            radiusUnit,
            duration: getDurationText(durationType, customDays, customTriggers),
            notifications: {
                driver: notifyDriver,
                owner: notifyOwner,
                sendNotification
            },
            createdAt: new Date().toLocaleString()
        };
        
        setSavedTriggers([...savedTriggers, newTrigger]);
        resetForm();
    };

    const getDurationText = (type, days, triggers) => {
        switch(type) {
            case 'one-time': return 'One-time';
            case 'all-time': return 'All-time';
            case '1-day': return '1 Day';
            case '2-days': return '2 Days';
            case 'custom-days': return `${days} Days`;
            case 'custom-triggers': return `${triggers} Triggers`;
            default: return '';
        }
    };

    const resetForm = () => {
        setTriggerType('all');
        setSelectedVehicle('');
        setLocationMethod('');
        setSearchQuery('');
        setManualLat('');
        setManualLng('');
        setRadius(1);
        setCustomRadius('');
        setRadiusUnit('km');
        setNotifyDriver(false);
        setNotifyOwner(false);
        setDriverMessage('');
        setOwnerMessage('');
        setSendNotification(true);
        setDurationType('all-time');
        setCustomDays('');
        setCustomTriggers('');
    };

    const handleRemoveTrigger = (id) => {
        setSavedTriggers(savedTriggers.filter(trigger => trigger.id !== id));
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Geo Triggers
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Form Section */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" gutterBottom>
                        Create New Trigger
                    </Typography>
                    <Box sx={{ p: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Get notified instantly with custom alerts using geo-triggers.
                        </Typography>
                    </Box>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Trigger For</InputLabel>
                                <Select
                                    value={triggerType}
                                    onChange={(e) => setTriggerType(e.target.value)}
                                    label="Trigger For"
                                >
                                    <MenuItem value="all">For All Vehicles</MenuItem>
                                    <MenuItem value="single">For Single Vehicle</MenuItem>
                                </Select>
                            </FormControl>

                            {triggerType === 'single' && (
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel>Vehicle Number</InputLabel>
                                    <Select
                                        value={selectedVehicle}
                                        onChange={(e) => setSelectedVehicle(e.target.value)}
                                        label="Vehicle Number"
                                    >
                                        {vehicles.map((vehicle) => (
                                            <MenuItem key={vehicle.id} value={vehicle.id}>
                                                {vehicle.vehicleNumber}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Location Method</InputLabel>
                                <Select
                                    value={locationMethod}
                                    onChange={(e) => setLocationMethod(e.target.value)}
                                    label="Location Method"
                                >
                                    <MenuItem value="search">Search Location</MenuItem>
                                    <MenuItem value="manual">Enter Coordinates</MenuItem>
                                </Select>
                            </FormControl>

                            {locationMethod === 'search' && (
                                <TextField
                                    fullWidth
                                    label="Search Location"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    sx={{ mb: 3 }}
                                />
                            )}

                            {locationMethod === 'manual' && (
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Latitude"
                                            value={manualLat}
                                            onChange={(e) => setManualLat(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Longitude"
                                            value={manualLng}
                                            onChange={(e) => setManualLng(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            )}

                            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                                Trigger Radius
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <FormControl sx={{ minWidth: 120 }}>
                                    <InputLabel>Predefined</InputLabel>
                                    <Select
                                        value={radius}
                                        onChange={(e) => setRadius(Number(e.target.value))}
                                        label="Predefined"
                                    >
                                        {[0.5, 1, 2, 5, 10].map((r) => (
                                            <MenuItem key={r} value={r}>
                                                {r} km
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Custom Radius"
                                    value={customRadius}
                                    onChange={(e) => setCustomRadius(e.target.value)}
                                    sx={{ flex: 1 }}
                                />
                                <FormControl sx={{ minWidth: 80 }}>
                                    <InputLabel>Unit</InputLabel>
                                    <Select
                                        value={radiusUnit}
                                        onChange={(e) => setRadiusUnit(e.target.value)}
                                        label="Unit"
                                    >
                                        <MenuItem value="km">km</MenuItem>
                                        <MenuItem value="m">m</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                                Duration Settings
                            </Typography>
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Trigger Duration</InputLabel>
                                <Select
                                    value={durationType}
                                    onChange={(e) => setDurationType(e.target.value)}
                                    label="Trigger Duration"
                                >
                                    <MenuItem value="one-time">One-time Trigger</MenuItem>
                                    <MenuItem value="all-time">All-time (Until manually removed)</MenuItem>
                                    <MenuItem value="1-day">1 Day</MenuItem>
                                    <MenuItem value="2-days">2 Days</MenuItem>
                                    <MenuItem value="custom-days">Custom Days</MenuItem>
                                    <MenuItem value="custom-triggers">Custom Number of Triggers</MenuItem>
                                </Select>
                            </FormControl>

                            {durationType === 'custom-days' && (
                                <TextField
                                    fullWidth
                                    label="Number of Days"
                                    type="number"
                                    value={customDays}
                                    onChange={(e) => setCustomDays(e.target.value)}
                                    sx={{ mb: 3 }}
                                    InputProps={{ inputProps: { min: 1 } }}
                                />
                            )}

                            {durationType === 'custom-triggers' && (
                                <TextField
                                    fullWidth
                                    label="Number of Triggers"
                                    type="number"
                                    value={customTriggers}
                                    onChange={(e) => setCustomTriggers(e.target.value)}
                                    sx={{ mb: 3 }}
                                    InputProps={{ inputProps: { min: 1 } }}
                                />
                            )}

                            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                                Notification Settings
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={notifyDriver}
                                            onChange={(e) => setNotifyDriver(e.target.checked)}
                                        />
                                    }
                                    label="Notify Driver"
                                />
                                {notifyDriver && (
                                    <TextField
                                        fullWidth
                                        label="Driver Message"
                                        value={driverMessage}
                                        onChange={(e) => setDriverMessage(e.target.value)}
                                        sx={{ mt: 1, mb: 2 }}
                                        multiline
                                        rows={2}
                                    />
                                )}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={notifyOwner}
                                            onChange={(e) => setNotifyOwner(e.target.checked)}
                                        />
                                    }
                                    label="Notify Owner"
                                />
                                {notifyOwner && (
                                    <TextField
                                        fullWidth
                                        label="Owner Message"
                                        value={ownerMessage}
                                        onChange={(e) => setOwnerMessage(e.target.value)}
                                        sx={{ mt: 1, mb: 2 }}
                                        multiline
                                        rows={2}
                                    />
                                )}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={sendNotification}
                                            onChange={(e) => setSendNotification(e.target.checked)}
                                        />
                                    }
                                    label="Send Push Notification"
                                />
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button variant="outlined" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary">
                                    Save Trigger
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Box>

                {/* Saved Triggers Section */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" gutterBottom>
                        Saved Triggers ({savedTriggers.length})
                    </Typography>
                    {savedTriggers.length > 0 ? (
                        <Paper sx={{ p: 2 }}>
                            <List>
                                {savedTriggers.map((trigger) => (
                                    <ListItem
                                        key={trigger.id}
                                        secondaryAction={
                                            <IconButton 
                                                edge="end" 
                                                aria-label="delete"
                                                onClick={() => handleRemoveTrigger(trigger.id)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                        sx={{
                                            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                                            '&:last-child': { borderBottom: 'none' },
                                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography variant="subtitle1" component="span">
                                                        {trigger.selectedVehicle}
                                                    </Typography>
                                                    <Chip 
                                                        label={trigger.duration} 
                                                        size="small" 
                                                        sx={{ 
                                                            ml: 1,
                                                            backgroundColor: trigger.duration === 'All-time' 
                                                                ? '#e3f2fd' 
                                                                : '#e8f5e9',
                                                            color: trigger.duration === 'All-time' 
                                                                ? '#1976d2' 
                                                                : '#2e7d32'
                                                        }} 
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2">
                                                        Location: {trigger.location}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Radius: {trigger.radius} {trigger.radiusUnit}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                        {trigger.notifications.driver && (
                                                            <Chip 
                                                                label="Driver" 
                                                                size="small" 
                                                                variant="outlined" 
                                                            />
                                                        )}
                                                        {trigger.notifications.owner && (
                                                            <Chip 
                                                                label="Owner" 
                                                                size="small" 
                                                                variant="outlined" 
                                                            />
                                                        )}
                                                        {trigger.notifications.sendNotification && (
                                                            <Chip 
                                                                label="Push" 
                                                                size="small" 
                                                                variant="outlined" 
                                                            />
                                                        )}
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Created: {trigger.createdAt}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    ) : (
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                No saved triggers yet. Create your first trigger above.
                            </Typography>
                        </Paper>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default GeoTrigger;