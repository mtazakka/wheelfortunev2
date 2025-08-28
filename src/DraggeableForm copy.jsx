import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import { BiPlus, BiReset, BiShuffle, BiGroup, BiPlayCircle, BiTrash } from "react-icons/bi";

// MUI imports
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Paper, IconButton, Tooltip } from "@mui/material";

const FormularioTexto = () => {
    const [inputList, setInputList] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [rouletteData, setRouletteData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedItem, setSelectedItem] = useState("");
    const [groups, setGroups] = useState([]);
    const [groupDialogOpen, setGroupDialogOpen] = useState(false);
    const [numGroupsInput, setNumGroupsInput] = useState("");
    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

    useEffect(() => {
        const formattedData = inputList.map((item) => ({
            completeOption: item,
            option: item.length >= 30 ? item.substring(0, 30) + "..." : item,
        }));
        setRouletteData(formattedData);
    }, [inputList]);

    const handleAddClick = () => {
        if (newItem.trim()) {
            setInputList([...inputList, newItem.trim()]);
            setNewItem("");
        }
    };

    const handleRemoveItem = (indexToRemove) => {
        setInputList(prevList => prevList.filter((_, index) => index !== indexToRemove));
    };

    const handleCreateGroups = () => {
        const num = parseInt(numGroupsInput, 10);
        if (isNaN(num) || num <= 0 || num > inputList.length || num > 26) {
            alert("Please enter a valid number of groups (1-26).");
            return;
        }
        
        const totalItems = inputList.length;
        const baseSize = Math.floor(totalItems / num);
        const remainder = totalItems % num;
        
        const newGroups = Array.from({ length: num }, (_, i) => ({
            id: String.fromCharCode(65 + i),
            capacity: baseSize + (i < remainder ? 1 : 0),
            items: [],
        }));
        
        setGroups(newGroups);
        setCurrentGroupIndex(0);
        setGroupDialogOpen(false);
        setNumGroupsInput("");
    };
    
    const handleSpinClick = () => {
        if (inputList.length === 0) return;
        setPrizeNumber(Math.floor(Math.random() * inputList.length));
        setMustSpin(true);
    };

    const handleStop = () => {
        if (inputList.length > 0 && inputList[prizeNumber] !== undefined) {
            setSelectedItem(inputList[prizeNumber]);
            setShowPopup(true);
        }
        setMustSpin(false);
    };
    
    const handleConfirmAction = () => {
        if (groups.length > 0) {
            const newGroups = [...groups];
            const targetGroup = newGroups[currentGroupIndex];
            
            if (targetGroup && targetGroup.items.length < targetGroup.capacity) {
                targetGroup.items.push(selectedItem);
            }
            
            setGroups(newGroups);
            setCurrentGroupIndex((currentGroupIndex + 1) % groups.length);
        }
        
        setInputList(prevList => prevList.filter(item => item !== selectedItem));
        setShowPopup(false);
    };
    
    const handleResetGroups = () => {
        const itemsFromGroups = groups.flatMap(g => g.items);
        setInputList(prev => [...prev, ...itemsFromGroups]);
        setGroups([]);
        setCurrentGroupIndex(0);
    };

    const handleReshuffle = () => {
        setInputList(prev => [...prev].sort(() => Math.random() - 0.5));
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', p: { xs: 2, md: 4 }, gap: 4, background: 'linear-gradient(to bottom right, #f7f9fc, #ffffff)' }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 2 }}> Elysium Roulette </Typography>
                <Box sx={{ width: '100%', maxWidth: '700px', aspectRatio: '1 / 1', position: 'relative', mb: 3, '& > div': { width: '100%', height: '100%', maxWidth: 'unset', maxHeight: 'unset' } }}>
                    <Wheel mustStartSpinning={mustSpin} prizeNumber={prizeNumber} data={rouletteData.length > 0 ? rouletteData : [{ option: "Add Items" }]} onStopSpinning={handleStop} {...rouletteProps} />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button variant="contained" startIcon={<BiPlayCircle />} onClick={handleSpinClick} disabled={mustSpin || inputList.length === 0}>Spin</Button>
                    <Button variant="outlined" startIcon={<BiGroup />} onClick={() => setGroupDialogOpen(true)} disabled={mustSpin || inputList.length === 0 || groups.length > 0}>Create Groups</Button>
                </Box>
                {groups.length > 0 && (
                    <Paper sx={{ width: '100%', p: 2, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Groups</Typography>
                            <Button variant="outlined" color="error" startIcon={<BiReset />} onClick={handleResetGroups}>Reset</Button>
                        </Box>
                        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: groups.length > 0 && groups.length <= 4 ? `repeat(${groups.length}, 1fr)` : 'repeat(4, 1fr)' }}>
                            {groups.map((group, index) => {
                                const isCurrentGroup = index === currentGroupIndex;
                                return (
                                <Paper key={group.id} elevation={isCurrentGroup ? 8 : 2} sx={{ p: 2, borderRadius: 2, transition: 'all 0.3s ease', border: '2px solid', borderColor: isCurrentGroup ? 'primary.main' : 'transparent' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: isCurrentGroup ? 'primary.main' : 'inherit' }}>Group {group.id}</Typography>
                                    <List dense>
                                        {group.items.map((item, i) => <ListItem key={i} sx={{ wordBreak: 'break-word' }}>{i + 1}. {item}</ListItem>)}
                                        {Array.from({ length: group.capacity - group.items.length }).map((_, i) => {
                                            const isNextSlot = isCurrentGroup && i === 0;
                                            return (
                                                <ListItem key={`ph-${i}`} sx={{ color: 'grey', bgcolor: isNextSlot ? 'action.hover' : 'transparent', borderRadius: 1 }}>
                                                    {group.items.length + i + 1}. {isNextSlot ? <b>{'<< NEXT'}</b> : '---'}
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Paper>
                                );
                            })}
                        </Box>
                    </Paper>
                )}
            </Box>
            <Paper elevation={3} sx={{ width: { xs: '100%', md: 380 }, display: "flex", flexDirection: "column", p: 3, borderRadius: 3, bgcolor: '#fff', maxHeight: 'calc(100vh - 64px)' }}>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField label="Add New Item" variant="outlined" fullWidth value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddClick()} disabled={groups.length > 0} />
                    <Button variant="contained" onClick={handleAddClick} disabled={groups.length > 0} sx={{ minWidth: 50, height: 56 }}><BiPlus size={24} /></Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h6" component="h2">Current List ({inputList.length})</Typography>
                    <Tooltip title="Reshuffle List"><span><IconButton color="primary" onClick={handleReshuffle} disabled={inputList.length <= 1 || groups.length > 0}><BiShuffle /></IconButton></span></Tooltip>
                </Box>
                <List sx={{ flex: 1, overflow: "auto", p: 1 }}>
                    {inputList.map((item, index) => (
                        <ListItem key={index} sx={{ my: 0.5, bgcolor: '#f7f9fc', borderRadius: 1 }} secondaryAction={<Tooltip title="Remove Item"><span><IconButton edge="end" onClick={() => handleRemoveItem(index)} disabled={groups.length > 0} size="small"><BiTrash /></IconButton></span></Tooltip>}><ListItemText primary={item} sx={{ pr: 2, wordBreak: 'break-word' }} /></ListItem>
                    ))}
                </List>
            </Paper>
            <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Item Selected</DialogTitle>
                <DialogContent sx={{ p: 3, textAlign: 'center' }}><Typography variant="h6">{selectedItem}</Typography></DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: 'space-around' }}><Button variant="outlined" onClick={() => setShowPopup(false)}>Cancel</Button><Button variant="contained" color="primary" onClick={handleConfirmAction}>{groups.length > 0 ? "Assign to Group" : "Remove from List"}</Button></DialogActions></Dialog>
            <Dialog open={groupDialogOpen} onClose={() => setGroupDialogOpen(false)}>
                <DialogTitle>Create Groups</DialogTitle>
                <DialogContent><TextField autoFocus margin="dense" label="Number of Groups" type="number" fullWidth variant="standard" value={numGroupsInput} onChange={(e) => setNumGroupsInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleCreateGroups()} /></DialogContent>
                <DialogActions><Button onClick={() => setGroupDialogOpen(false)}>Cancel</Button><Button onClick={handleCreateGroups}>Create</Button></DialogActions></Dialog>
        </Box>
    );
};

// Constant props for the wheel to keep the render function clean
const rouletteProps = {
    spinDuration: 0.3,
    outerBorderColor: "#e0e0e0", outerBorderWidth: 10,
    innerBorderColor: "#e0e0e0", innerBorderWidth: 10,
    innerRadius: 20,
    radiusLineColor: "#e0e0e0", radiusLineWidth: 2,
    textColors: ["#444"], fontSize: 14, textDistance: 65,
    backgroundColors: [ "#6162d3", "#45a4ec", "#36c9a3", "#82d958", "#f3e14c", "#f7a416", "#e6471d", "#dc0936", "#e5177b", "#be1180" ]
};

export default FormularioTexto;