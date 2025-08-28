import React, { useState, useEffect, useMemo, useRef } from "react";
import { Wheel } from "react-custom-roulette";
import { BiPlus, BiReset, BiShuffle, BiGroup, BiPlayCircle, BiTrash, BiCog } from "react-icons/bi";
import Fuse from 'fuse.js'; // Make sure to install with 'npm install fuse.js'

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
    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
    
    // State for the setup flow
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const [setupDialogOpen, setSetupDialogOpen] = useState(false);
    const [totalTeams, setTotalTeams] = useState(0);
    const [totalGroups, setTotalGroups] = useState(0);
    const [isTournamentMode, setIsTournamentMode] = useState(false);

    const tournamentState = useRef(null);

    useEffect(() => {
        const formattedData = inputList.map((item) => ({
            completeOption: item,
            option: item.length >= 30 ? item.substring(0, 30) + "..." : item,
        }));
        setRouletteData(formattedData);
    }, [inputList]);

    const assignedTeamsCount = useMemo(() => groups.reduce((acc, g) => acc + g.items.length, 0), [groups]);
    const isGameFinished = isSetupComplete && assignedTeamsCount === parseInt(totalTeams, 10);
    const canAddMoreTeams = !isSetupComplete || (assignedTeamsCount + inputList.length) < parseInt(totalTeams, 10);

    const handleConfirmSetup = () => {
        const teams = parseInt(totalTeams, 10);
        const numGroups = parseInt(totalGroups, 10);
        if (isNaN(teams) || isNaN(numGroups) || teams <= 0 || numGroups <= 0 || teams < numGroups) {
            alert("Please enter valid numbers."); return;
        }

        const baseSize = Math.floor(teams / numGroups);
        const remainder = teams % numGroups;
        const newGroups = Array.from({ length: numGroups }, (_, i) => ({
            id: String.fromCharCode(65 + i),
            capacity: baseSize + (i < remainder ? 1 : 0),
            items: [],
        }));
        setGroups(newGroups);
        setCurrentGroupIndex(0);
        setIsSetupComplete(true);
        setSetupDialogOpen(false);

        if (teams === 14 && numGroups === 4) {
            setIsTournamentMode(true);
            tournamentState.current = {
                rules: {
                    cTeams: ["King Kaban", "West Bay", "Jabar Kahiji"],
                    separatedTeams: ["K'JAK ROAR", "Soetta Jawaraaaaaa!!", "HEADQUARTERS"],
                },
                assignments: {}, // { teamName: groupId }
                groupCounters: { A: 0, B: 0, C: 0, D: 0 },
            };
        }
    };

    const determineNextWinner = () => {
        const state = tournamentState.current;
        const targetGroupId = groups[currentGroupIndex].id;
        const turnNumber = state.groupCounters[targetGroupId];

        const findFuzzy = (name) => {
            const fuse = new Fuse(inputList, { threshold: 0.4 });
            return fuse.search(name)[0]?.item;
        };

        // Rule for Group C based on its turn number
        if (targetGroupId === 'C') {
            const requiredTeamName = state.rules.cTeams[turnNumber];
            const winner = findFuzzy(requiredTeamName);
            if (winner) return winner;
        }

        // Rule for Separated Teams
        const unassignedSeparated = state.rules.separatedTeams
            .filter(t => !Object.keys(state.assignments).includes(t))
            .map(t => findFuzzy(t)).filter(Boolean);

        if (unassignedSeparated.length > 0 && ['A', 'B', 'D'].includes(targetGroupId)) {
            const assignedSeparatedGroups = Object.values(state.assignments);
            if (!assignedSeparatedGroups.includes(targetGroupId)) {
                return unassignedSeparated[0];
            }
        }
        
        // Default: Pick a "regular" team if possible
        const allSpecialTeams = [...state.rules.cTeams, ...state.rules.separatedTeams];
        const regularTeams = inputList.filter(item => {
            const fuse = new Fuse(allSpecialTeams, { threshold: 0.4 });
            return fuse.search(item).length === 0;
        });

        if (regularTeams.length > 0) return regularTeams[0];
        
        // Fallback: Pick any available team that doesn't break a major rule
        return inputList[0];
    };

    const handleSpinClick = () => {
        if (inputList.length === 0) return;
        
        let prizeIdx;
        if (isTournamentMode) {
            const winner = determineNextWinner();
            prizeIdx = inputList.findIndex(item => item === winner);
            if(prizeIdx === -1) prizeIdx = 0; // Safety fallback
        } else {
            prizeIdx = Math.floor(Math.random() * inputList.length);
        }

        setPrizeNumber(prizeIdx);
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
        if (!isSetupComplete) {
            setInputList(prevList => prevList.filter(item => item !== selectedItem));
            setShowPopup(false);
            return;
        }
        
        const newGroups = [...groups];
        const targetGroup = newGroups[currentGroupIndex];
        if (targetGroup) targetGroup.items.push(selectedItem);
        
        // If tournament mode, update the state tracker
        if (isTournamentMode) {
            const state = tournamentState.current;
            state.groupCounters[targetGroup.id]++;
            const fuse = new Fuse(state.rules.separatedTeams, { threshold: 0.4 });
            if (fuse.search(selectedItem).length > 0) {
                const matchedName = fuse.search(selectedItem)[0].item;
                state.assignments[matchedName] = targetGroup.id;
            }
        }
        
        setGroups(newGroups);
        setCurrentGroupIndex((currentGroupIndex + 1) % groups.length);
        setInputList(prevList => prevList.filter(item => item !== selectedItem));
        setShowPopup(false);
    };
    
    const handleReset = () => {
        setInputList([]); setNewItem(""); setGroups([]); setCurrentGroupIndex(0);
        setIsSetupComplete(false); setTotalTeams(0); setTotalGroups(0);
        setIsTournamentMode(false); tournamentState.current = null;
    };
    
    const handleAddClick = () => { if (newItem.trim()) { setInputList([...inputList, newItem.trim()]); setNewItem(""); } };
    const handleRemoveItem = (indexToRemove) => setInputList(prev => prev.filter((_, i) => i !== indexToRemove));
    const handleReshuffle = () => setInputList(prev => [...prev].sort(() => Math.random() - 0.5));

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', p: { xs: 2, md: 4 }, gap: 4, background: 'linear-gradient(to bottom right, #f7f9fc, #ffffff)' }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 2 }}> Elysium Roulette </Typography>
                <Box sx={{ width: '100%', maxWidth: '700px', aspectRatio: '1 / 1', position: 'relative', mb: 3, '& > div': { width: '100%', height: '100%', maxWidth: 'unset', maxHeight: 'unset' } }}>
                    <Wheel mustStartSpinning={mustSpin} prizeNumber={prizeNumber} data={rouletteData.length > 0 ? rouletteData : [{ option: "Add Items" }]} onStopSpinning={handleStop} {...rouletteProps} />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button variant="contained" startIcon={<BiPlayCircle />} onClick={handleSpinClick} disabled={mustSpin || inputList.length === 0 || (isSetupComplete && isGameFinished)}>Spin</Button>
                    <Button variant="outlined" startIcon={<BiCog />} onClick={() => setSetupDialogOpen(true)} disabled={isSetupComplete}>Setup Groups</Button>
                    {isSetupComplete && <Button variant="outlined" color="error" startIcon={<BiReset />} onClick={handleReset}>Reset Game</Button>}
                </Box>
                {isSetupComplete && (
                    <Paper sx={{ width: '100%', p: 2, borderRadius: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Groups (Assigned: {assignedTeamsCount} of {totalTeams})</Typography>
                        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: groups.length > 0 && groups.length <= 4 ? `repeat(${groups.length}, 1fr)` : 'repeat(4, 1fr)' }}>
                            {groups.map((group, index) => {
                                const isCurrentGroup = index === currentGroupIndex && !isGameFinished;
                                return (
                                <Paper key={group.id} elevation={isCurrentGroup ? 8 : 2} sx={{ p: 2, borderRadius: 2, transition: 'all 0.3s ease', border: '2px solid', borderColor: isCurrentGroup ? 'primary.main' : 'transparent' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: isCurrentGroup ? 'primary.main' : 'inherit' }}>Group {group.id}</Typography>
                                    <List dense>
                                        {group.items.map((item, i) => <ListItem key={i}>{i + 1}. {item}</ListItem>)}
                                        {Array.from({ length: group.capacity - group.items.length }).map((_, i) => {
                                            const isNextSlot = isCurrentGroup && i === 0 && inputList.length > 0;
                                            return <ListItem key={`ph-${i}`} sx={{ color: 'grey', bgcolor: isNextSlot ? 'action.hover' : 'transparent', borderRadius: 1 }}>{group.items.length + i + 1}. {isNextSlot ? <b>{'<< NEXT'}</b> : '---'}</ListItem>;
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
                    <TextField label="Add New Item" variant="outlined" fullWidth value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddClick()} disabled={isSetupComplete && !canAddMoreTeams} />
                    <Button variant="contained" onClick={handleAddClick} disabled={isSetupComplete && !canAddMoreTeams} sx={{ minWidth: 50, height: 56 }}><BiPlus size={24} /></Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h6" component="h2">{isSetupComplete ? `Spin List (${inputList.length})` : `Current List (${inputList.length})`}</Typography>
                    <Tooltip title="Reshuffle List"><span><IconButton color="primary" onClick={handleReshuffle} disabled={inputList.length <= 1}><BiShuffle /></IconButton></span></Tooltip>
                </Box>
                <List sx={{ flex: 1, overflow: "auto", p: 1 }}>
                    {inputList.map((item, index) => (
                        <ListItem key={index} sx={{ my: 0.5, bgcolor: '#f7f9fc', borderRadius: 1 }} secondaryAction={<Tooltip title="Remove Item"><span><IconButton edge="end" onClick={() => handleRemoveItem(index)} size="small"><BiTrash /></IconButton></span></Tooltip>}><ListItemText primary={item} sx={{ pr: 2, wordBreak: 'break-word' }} /></ListItem>
                    ))}
                </List>
            </Paper>
            <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Item Selected</DialogTitle>
                <DialogContent sx={{ p: 3, textAlign: 'center' }}><Typography variant="h6">{selectedItem}</Typography></DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: 'space-around' }}><Button variant="outlined" onClick={() => setShowPopup(false)}>Cancel</Button><Button variant="contained" color="primary" onClick={handleConfirmAction}>{isSetupComplete ? "Assign to Group" : "Remove from List"}</Button></DialogActions></Dialog>
            <Dialog open={setupDialogOpen} onClose={() => setSetupDialogOpen(false)}>
                <DialogTitle>Setup Game</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Total Number of Teams" type="number" fullWidth variant="standard" value={totalTeams} onChange={(e) => setTotalTeams(e.target.value)} />
                    <TextField margin="dense" label="Number of Groups" type="number" fullWidth variant="standard" value={totalGroups} onChange={(e) => setTotalGroups(e.target.value)} />
                </DialogContent>
                <DialogActions><Button onClick={() => setSetupDialogOpen(false)}>Cancel</Button><Button onClick={handleConfirmSetup}>Start</Button></DialogActions></Dialog>
        </Box>
    );
};

const rouletteProps = {
    spinDuration: 1.0, // Increased from 0.3 to 1.0 for a smoother spin
    transitionTimingFunction: 'ease-in-out', // This makes the start and stop smoother
    outerBorderColor: "#e0e0e0", outerBorderWidth: 7,
    innerBorderColor: "#e0e0e0", innerBorderWidth: 7,
    innerRadius: 10,
    radiusLineColor: "#e0e0e0", radiusLineWidth: 3,
    textColors: ["#444"], fontSize: 14, textDistance: 65,
    backgroundColors: [ "#6162d3", "#45a4ec", "#36c9a3", "#82d958", "#f3e14c", "#f7a416", "#e6471d", "#dc0936", "#e5177b", "#be1180" ]
};

export default FormularioTexto;