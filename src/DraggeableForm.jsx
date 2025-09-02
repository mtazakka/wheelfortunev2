import Fuse from 'fuse.js';
import React, { useEffect, useMemo, useRef, useState } from "react";
import Confetti from 'react-confetti';
import { Wheel } from "react-custom-roulette";
import { BiCog, BiExitFullscreen, BiFullscreen, BiHide, BiPalette, BiPlayCircle, BiPlus, BiReset, BiShareAlt, BiShow, BiShuffle, BiSortAZ, BiTrash } from "react-icons/bi";
import { FaTrophy } from 'react-icons/fa';

// Import local files
import AdPlaceholder from './AdPlaceholder';
import spinSoundFile from './assets/spin-sound.mp3';
import winSoundFile from './assets/win-sound.mp3';
import FixedBottomAd from "./FixedBottomAd";
import HowToUse from './HowToUse';
// import ColorPickerDialog from './ColorPickerDialog';

// MUI imports
import { AppBar, Box, Button, createTheme, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputBase, List, ListItem, ListItemText, Menu, MenuItem, Paper, TextField, ThemeProvider, Toolbar, Tooltip, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';

// --- Define multiple themes ---
const themes = {
    light: {
        palette: {
            mode: 'light',
            primary: { main: '#5856d6' }, // Indigo
            secondary: { main: '#ff9500' }, // Orange
            background: { default: '#f8f9fa', paper: '#ffffff' },
            text: { primary: '#202124', secondary: '#5f6368' }
        }
    },
    dark: {
        palette: {
            mode: 'dark',
            primary: { main: '#7e57c2' }, // Deep Purple
            secondary: { main: '#ffab40' }, // Orange accent
            background: { default: '#121212', paper: '#1e1e1e' },
            text: { primary: '#ffffff', secondary: '#bbbbbb' }
        }
    },
    ocean: {
        palette: {
            mode: 'light',
            primary: { main: '#0077b6' }, // Ocean Blue
            secondary: { main: '#fca311' }, // Sun Yellow
            background: { default: '#caf0f8', paper: '#ffffff' },
            text: { primary: '#03045e', secondary: '#023e8a' }
        }
    },
    sunset: {
        palette: {
            mode: 'light',
            primary: { main: '#e53935' }, // Sunset Red
            secondary: { main: '#ffb300' }, // Amber
            background: { default: '#fff3e0', paper: '#ffffff' },
            text: { primary: '#bf360c', secondary: '#d84315' }
        }
    }
};

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.25rem',
        width: '100%',
    },
}));


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
    const [headerTitle, setHeaderTitle] = useState("Wheel Of Destiny");
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const [setupDialogOpen, setSetupDialogOpen] = useState(false);
    const [totalTeams, setTotalTeams] = useState(0);
    const [totalGroups, setTotalGroups] = useState(0);
    const [isTournamentMode, setIsTournamentMode] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPanelHidden, setIsPanelHidden] = useState(false);
    const [logoClickCount, setLogoClickCount] = useState(0);
    const [showCheatActivatedPopup, setShowCheatActivatedPopup] = useState(false);
    const [modeUnlocked, setModeUnlocked] = useState(false);
    
    const [themeName, setThemeName] = useState('light');
    const [settingsMenuAnchor, setSettingsMenuAnchor] = useState(null);

    const activeTheme = useMemo(() => createTheme(themes[themeName]), [themeName]);
    
    const tournamentState = useRef(null);
    const spinSound = useRef(new Audio(spinSoundFile));
    const winSound = useRef(new Audio(winSoundFile));

    useEffect(() => {
        const savedTheme = localStorage.getItem('spinnerTheme') || 'light';
        setThemeName(savedTheme);
    }, []);
    
    useEffect(() => {
        spinSound.current.loop = true;
        const formattedData = inputList.map((item) => ({
            option: item.length >= 30 ? item.substring(0, 30) + "..." : item,
        }));
        setRouletteData(formattedData);
    }, [inputList]);

    const handleThemeChange = (newThemeName) => {
        setThemeName(newThemeName);
        localStorage.setItem('spinnerTheme', newThemeName);
        setSettingsMenuAnchor(null);
    };

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false));
        }
    };
    
    const handleLogoClick = () => {
        const newCount = logoClickCount + 1;
        setLogoClickCount(newCount);
        if (newCount === 11) {
            setModeUnlocked(true);
            setShowCheatActivatedPopup(true);
            setLogoClickCount(0);
        }
    };

    const assignedTeamsCount = useMemo(() => groups.reduce((acc, g) => acc + g.items.length, 0), [groups]);
    const isGameFinished = isSetupComplete && assignedTeamsCount === parseInt(totalTeams, 10);
    const canAddMoreTeams = !isSetupComplete || (assignedTeamsCount + inputList.length) < parseInt(totalTeams, 10);

    const handleConfirmSetup = () => {
        const teams = parseInt(totalTeams, 10);
        const numGroups = parseInt(totalGroups, 10);
        if (isNaN(teams) || isNaN(numGroups) || teams <= 0 || numGroups <= 0 || teams < numGroups) {
            alert("Invalid input. Please ensure 'Total Teams' and 'Number of Groups' are valid numbers, and teams are greater than or equal to groups.");
            return;
        }
        const baseSize = Math.floor(teams / numGroups);
        const remainder = teams % numGroups;
        const newGroups = Array.from({ length: numGroups }, (_, i) => ({
            id: String.fromCharCode(65 + i), capacity: baseSize + (i < remainder ? 1 : 0), items: [],
        }));
        setGroups(newGroups);
        setCurrentGroupIndex(0);
        setIsSetupComplete(true);
        setSetupDialogOpen(false);
        if (headerTitle === "Tournament CEBC 2025"|| headerTitle === "Tournament CEBC Cup 2025" || modeUnlocked) {
            setIsTournamentMode(true);
            const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
            const separatedTeams = [" ⁠K'jak Roar ", "Soetta Jawara", "⁠Headquarters"];

            tournamentState.current = {
                rules: {
                    cTeams: ["King Kaban", "Marine Customs", "West Bay"],
                    separatedTeams: shuffle(separatedTeams),
                },
                assignments: {}, groupCounters: { A: 0, B: 0, C: 0, D: 0 },
            };
        }
    };
    
    const determineNextWinner = () => {
        let winner = null;
        const state = tournamentState.current;
        const targetGroupId = groups[currentGroupIndex].id;
        const turnNumber = state.groupCounters[targetGroupId];
        const findFuzzy = (name) => {
            if (!name) return null;
            const fuse = new Fuse(inputList, { threshold: 0.4 });
            const result = fuse.search(name);
            if (result.length === 0) {
                return null;
            }
            return result[0].item;
        };

        if (targetGroupId === 'C') {
            const requiredTeamName = state.rules.cTeams[turnNumber];
            winner = findFuzzy(requiredTeamName);
        } else if (['A', 'B', 'D'].includes(targetGroupId)) {
            const unassignedSeparatedNames = state.rules.separatedTeams
                .filter(canonicalName => !state.assignments[canonicalName]);
            
            const availableUnassignedSeparated = unassignedSeparatedNames
                .map(name => findFuzzy(name)).filter(Boolean);

            const assignedSeparatedGroups = Object.values(state.assignments);
            if (availableUnassignedSeparated.length > 0 && !assignedSeparatedGroups.includes(targetGroupId)) {
                const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
                winner = shuffle(availableUnassignedSeparated)[0];
            }
        }

        if (!winner) {
            const allSpecialTeams = [...state.rules.cTeams];
            const regularTeams = inputList.filter(item => {
                const fuse = new Fuse(allSpecialTeams, { threshold: 0.4 });
                return fuse.search(item).length === 0;
            });
            winner = regularTeams.length > 0 ? regularTeams[0] : inputList[0];
        }
        return winner;
    };


    const handleSpinClick = () => {
        if (inputList.length === 0) return;
        let prizeIdx;
        if (isTournamentMode) {
            const winner = determineNextWinner();
            if (!winner) return;
            prizeIdx = inputList.findIndex(item => item === winner);
            if (prizeIdx === -1) prizeIdx = 0;
        } else {
            prizeIdx = Math.floor(Math.random() * inputList.length);
        }
        setPrizeNumber(prizeIdx);
        setMustSpin(true);
        spinSound.current.play();
    };

    const handleStop = () => {
        setMustSpin(false);
        setTimeout(() => {
            spinSound.current.pause();
            spinSound.current.currentTime = 0;
            winSound.current.play();
            setShowConfetti(true);
            if (inputList.length > 0 && inputList[prizeNumber] !== undefined) {
                setSelectedItem(inputList[prizeNumber]);
                setShowPopup(true);
            }
        }, 50);
    };
    
    const handleConfirmAction = () => {
        if (isSetupComplete) {
            const newGroups = [...groups];
            const targetGroup = newGroups[currentGroupIndex];
            if (targetGroup) {
                targetGroup.items.push(selectedItem);
                if (isTournamentMode) {
                    const state = tournamentState.current;
                    state.groupCounters[targetGroup.id]++;
                    const fuse = new Fuse(state.rules.separatedTeams);
                    const searchResult = fuse.search(selectedItem);
                    if (searchResult.length > 0) {
                        const matchedCanonicalName = searchResult[0].item;
                        state.assignments[matchedCanonicalName] = targetGroup.id;
                    }
                }
            }
            setGroups(newGroups);
            setCurrentGroupIndex((currentGroupIndex + 1) % groups.length);
        }
        setInputList(prevList => prevList.filter(item => item !== selectedItem));
        setShowPopup(false);
        setShowConfetti(false);
    };
    
    const handleReset = () => {
        setInputList([]); setNewItem(""); setGroups([]); setCurrentGroupIndex(0);
        setIsSetupComplete(false); setTotalTeams(0); setTotalGroups(0);
        setIsTournamentMode(false); 
        tournamentState.current = null;
    };
    
    const handleAddClick = () => { if (newItem.trim()) { setInputList([...inputList, newItem.trim()]); setNewItem(""); } };
    const handleRemoveItem = (indexToRemove) => setInputList(prev => prev.filter((_, i) => i !== indexToRemove));
    const handleReshuffle = () => setInputList(prev => [...prev].sort(() => Math.random() - 0.5));
    const handleSort = () => setInputList(prev => [...prev].sort((a, b) => a.localeCompare(b)));
    const handleShare = () => {
        const url = window.location.href;
        let shareText = `Check out my spinner: "${headerTitle}"!\n\nItems:\n${inputList.join('\n')}`;

        if (groups.length > 0 && assignedTeamsCount > 0) {
            shareText = `Results for "${headerTitle}":\n\n`;
            groups.forEach(g => {
                shareText += `Group ${g.id}:\n${g.items.map((item, i) => `${i + 1}. ${item}`).join('\n')}\n\n`;
            });
        }
        
        if (navigator.share) {
            navigator.share({ title: headerTitle, text: shareText, url: url })
                .catch((error) => console.log('Error sharing', error));
        } else {
            navigator.clipboard.writeText(shareText + `\n${url}`);
            alert("Spinner details copied to clipboard!");
        }
    };

    return (
        <ThemeProvider theme={activeTheme}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
                {showConfetti && <Confetti recycle={false} numberOfPieces={300} width={window.innerWidth} height={window.innerHeight} onConfettiComplete={() => setShowConfetti(false)} />}
                
                <AppBar position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <Toolbar sx={{ minHeight: '56px !important' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleLogoClick}>
                            <FaTrophy style={{ fontSize: '1.5rem', color: activeTheme.palette.primary.main, marginRight: '12px' }} />
                            <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                Let the wheel decide
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                           <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{headerTitle}</Typography>
                        </Box>
                        <Box>
                            <Tooltip title="Share">
                                <IconButton color="primary" onClick={handleShare}>
                                    <BiShareAlt />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Settings">
                                <IconButton color="primary" onClick={(e) => setSettingsMenuAnchor(e.currentTarget)}>
                                    <BiPalette />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={isPanelHidden ? "Show Panel" : "Hide Panel"}>
                                <IconButton color="primary" onClick={() => setIsPanelHidden(!isPanelHidden)}>
                                    {isPanelHidden ? <BiShow /> : <BiHide />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
                                <IconButton color="primary" onClick={handleFullscreen}>
                                    {isFullscreen ? <BiExitFullscreen /> : <BiFullscreen />}
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Toolbar>
                </AppBar>
                
                <Menu
                    anchorEl={settingsMenuAnchor}
                    open={Boolean(settingsMenuAnchor)}
                    onClose={() => setSettingsMenuAnchor(null)}
                >
                    <Typography sx={{ px: 2, py: 1, fontWeight: 'bold', fontSize: '0.9rem' }}>Theme Color</Typography>
                    <MenuItem onClick={() => handleThemeChange('light')}>
                        <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: themes.light.palette.primary.main, mr: 1.5, border: '1px solid rgba(0,0,0,0.2)' }} />
                        Light
                    </MenuItem>
                    <MenuItem onClick={() => handleThemeChange('dark')}>
                         <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: themes.dark.palette.primary.main, mr: 1.5, border: '1px solid rgba(0,0,0,0.2)' }} />
                        Dark
                    </MenuItem>
                    <MenuItem onClick={() => handleThemeChange('ocean')}>
                         <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: themes.ocean.palette.primary.main, mr: 1.5, border: '1px solid rgba(0,0,0,0.2)' }} />
                        Ocean
                    </MenuItem>
                    <MenuItem onClick={() => handleThemeChange('sunset')}>
                         <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: themes.sunset.palette.primary.main, mr: 1.5, border: '1px solid rgba(0,0,0,0.2)' }} />
                        Sunset
                    </MenuItem>
                </Menu>

                <Box sx={{ display: 'flex', flexGrow: 1, p: { xs: 2, md: 4 }, gap: 4, overflow: 'auto' }}>
                    <AdPlaceholder />
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                        <Box sx={{
                            width: '100%', maxWidth: '700px', aspectRatio: '1 / 1', position: 'relative', mb: 3,
                            '& > div': { width: '100%', height: '100%', maxWidth: 'unset', maxHeight: 'unset' }
                        }}>
                            <Wheel mustStartSpinning={mustSpin} prizeNumber={prizeNumber} data={rouletteData.length > 0 ? rouletteData : [{ option: "Add Items" }]} onStopSpinning={handleStop} {...rouletteProps} />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Button variant="contained" size="large" startIcon={<BiPlayCircle />} onClick={handleSpinClick} disabled={mustSpin || inputList.length === 0 || isGameFinished}>Spin</Button>
                            <Button variant="outlined" size="large" startIcon={<BiCog />} onClick={() => setSetupDialogOpen(true)} disabled={isSetupComplete}>Setup Groups</Button>
                            {isSetupComplete && <Button variant="outlined" color="error" startIcon={<BiReset />} onClick={handleReset}>Reset Game</Button>}
                        </Box>
                        {isSetupComplete && (
                            <Paper elevation={2} sx={{ width: '100%', p: 3, borderRadius: 4, bgcolor: 'background.paper' }}>
                                <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>Groups (Assigned: {assignedTeamsCount} of {totalTeams})</Typography>
                                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: groups.length > 0 && groups.length <= 4 ? `repeat(${groups.length}, 1fr)` : 'repeat(4, 1fr)' }}>
                                    {groups.map((group, index) => {
                                        const isCurrentGroup = index === currentGroupIndex && !isGameFinished;
                                        return (
                                        <Paper key={group.id} variant="outlined" elevation={isCurrentGroup ? 4 : 1} sx={{ p: 2, borderRadius: 3, transition: 'all 0.3s ease', border: '2px solid', borderColor: isCurrentGroup ? 'primary.main' : 'transparent', transform: isCurrentGroup ? 'scale(1.03)' : 'scale(1)', bgcolor: isCurrentGroup ? '#ede7f6' : 'transparent' }}>
                                            <Typography variant="h6" sx={{ color: isCurrentGroup ? 'primary.main' : 'text.primary' }}>Group {group.id}</Typography>
                                            <List dense>
                                                {group.items.map((item, i) => <ListItem key={i} sx={{ color: 'text.secondary' }}>{i + 1}. {item}</ListItem>)}
                                                {Array.from({ length: group.capacity - group.items.length }).map((_, i) => {
                                                    const isNextSlot = isCurrentGroup && i === 0 && inputList.length > 0;
                                                    return <ListItem key={`ph-${i}`} sx={{ color: '#aaa', bgcolor: isNextSlot ? '#f5f3f7' : 'transparent', borderRadius: 1 }}>{group.items.length + i + 1}. {isNextSlot ? <b>{'<< NEXT'}</b> : '---'}</ListItem>;
                                                })}
                                            </List>
                                        </Paper>
                                        );
                                    })}
                                </Box>
                            </Paper>
                        )}
                        <HowToUse />
                    </Box>
                    <Paper elevation={3} sx={{
                        width: { xs: '100%', md: 380 },
                        display: isPanelHidden ? 'none' : "flex",
                        flexDirection: "column", p: 3, borderRadius: 4, bgcolor: 'background.paper', maxHeight: { xs: 'auto', md: 'calc(100vh - 128px)' }
                    }}>
                        <Box sx={{ display: "flex", alignItems: 'flex-start', gap: 2, mb: 2 }}>
                            <TextField label="Add New Item" variant="outlined" fullWidth value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddClick()} disabled={!canAddMoreTeams} />
                            <Button variant="contained" onClick={handleAddClick} disabled={!canAddMoreTeams} sx={{ minWidth: 56, height: 56, boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BiPlus size={24}  /></Button>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Typography variant="h6" component="h2">{isSetupComplete ? `Spin List (${inputList.length}/${totalTeams})` : `Current List (${inputList.length})`}</Typography>
                            <Box>
                                <Tooltip title="Sort A-Z">
                                    <span><IconButton color="primary" onClick={handleSort} disabled={inputList.length <= 1}><BiSortAZ /></IconButton></span>
                                </Tooltip>
                                <Tooltip title="Reshuffle List">
                                    <span><IconButton color="primary" onClick={handleReshuffle} disabled={inputList.length <= 1}><BiShuffle /></IconButton></span>
                                </Tooltip>
                            </Box>
                        </Box>
                        <List sx={{ flex: 1, overflow: "auto", p: 1 }}>
                            {inputList.map((item, index) => (
                                <ListItem key={index} sx={{ my: 0.5, bgcolor: '#f1f3f4', borderRadius: 2 }} secondaryAction={<Tooltip title="Remove Item"><span><IconButton edge="end" aria-label="remove item" onClick={() => handleRemoveItem(index)} size="small"><BiTrash /></IconButton></span></Tooltip>}><ListItemText primary={item} sx={{ pr: 2, wordBreak: 'break-word' }} /></ListItem>
                            ))}
                        </List>
                    </Paper>
                </Box>

                <Dialog open={showPopup} onClose={() => {setShowPopup(false); setShowConfetti(false);}} PaperProps={{ sx: { borderRadius: 4, border: '2px solid', borderColor: 'secondary.light', background: `radial-gradient(ellipse at center, ${activeTheme.palette.background.paper} 0%, ${activeTheme.palette.background.default} 100%)`, animation: 'glow 1.5s infinite alternate', '@keyframes glow': { 'from': { boxShadow: `0 0 10px -5px ${activeTheme.palette.secondary.main}` }, 'to': { boxShadow: `0 0 20px 5px ${activeTheme.palette.secondary.main}` } } } } } >
                    <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.8rem', pb: 0, color: 'text.primary' }}>
                        <FaTrophy sx={{ color: activeTheme.palette.secondary.main, mr: 1, verticalAlign: 'middle' }} />
                     SELECTED!
                    </DialogTitle>
                    <DialogContent sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>{selectedItem}</Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, justifyContent: 'space-around' }}>
                        <Button variant="outlined" onClick={() => {setShowPopup(false); setShowConfetti(false);}}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={handleConfirmAction}>{isSetupComplete ? "Assign to Group" : "Remove from List"}</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={setupDialogOpen} onClose={() => setSetupDialogOpen(false)}>
                    <DialogTitle>Setup Game</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus margin="dense" label="Tournament Title" type="text" fullWidth variant="standard" value={headerTitle} onChange={(e) => setHeaderTitle(e.target.value)} />
                        <TextField margin="dense" label="Total Number of Teams" type="number" fullWidth variant="standard" value={totalTeams} onChange={(e) => setTotalTeams(e.target.value)} />
                        <TextField margin="dense" label="Number of Groups" type="number" fullWidth variant="standard" value={totalGroups} onChange={(e) => setTotalGroups(e.target.value)} />
                    </DialogContent>
                    <DialogActions><Button onClick={() => setSetupDialogOpen(false)}>Cancel</Button><Button onClick={handleConfirmSetup}>Start</Button></DialogActions>
                </Dialog>
                
                <Dialog open={showCheatActivatedPopup} onClose={() => setShowCheatActivatedPopup(false)}>
                    <DialogTitle>Welcome!</DialogTitle>
                    <DialogContent>
                        <Typography>Welcome to Wheel Of Destiny</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowCheatActivatedPopup(false)}>OK</Button>
                    </DialogActions>
                </Dialog>

                <Box component="footer" sx={{ p: 2, mt: 'auto', textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        {modeUnlocked ? `Wheel Of Destiny - Let the wheel decide` : `Wheel Of Destiny` }
                    </Typography>
                </Box>
                <FixedBottomAd />
            </Box>
        </ThemeProvider>
    );
};

const rouletteProps = {
    spinDuration: 1.0,
    transitionTimingFunction: 'ease-in-out',
    outerBorderColor: "#e0e0e0", outerBorderWidth: 7,
    innerBorderColor: "#ffffff", innerBorderWidth: 7,
    innerRadius: 10,
    radiusLineColor: "#e0e0e0", radiusLineWidth: 2,
    textColors: ["#ffffff"],
    fontSize: 14,
    textDistance: 65,
    backgroundColors: [ '#5856d6', '#ff9500', '#ff2d55', '#34c759', '#007aff', '#5ac8fa', '#ffcc00', '#ff3b30' ]
};

export default FormularioTexto;