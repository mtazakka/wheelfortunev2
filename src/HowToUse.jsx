import React from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { BiCog, BiPlayCircle, BiListPlus, BiTrophy } from "react-icons/bi";

const HowToUse = () => {
    return (
        <Paper elevation={2} sx={{ width: '100%', p: 4, mt: 4, borderRadius: 4, bgcolor: 'background.paper' }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                How to Use the Elysium Spinner
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Welcome to the Elysium Spinner! This tool is designed to make random selections fun and easy, whether you're picking a prize winner, creating teams for a tournament, or making a random decision. Follow these simple steps to get started.
            </Typography>

            <Typography variant="h5" sx={{ mt: 4, mb: 2, color: 'text.primary' }}>
                Mode 1: Simple Random Spin
            </Typography>
            <List>
                <ListItem>
                    <ListItemIcon><BiListPlus size="1.5em" color="#5856d6" /></ListItemIcon>
                    <ListItemText 
                        primary="Add Items to the List" 
                        secondary="On the right-hand panel, type a name or item into the 'Add New Item' box and click the plus (+) button or press Enter. Repeat for all items you want to include." 
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon><BiPlayCircle size="1.5em" color="#5856d6" /></ListItemIcon>
                    <ListItemText 
                        primary="Spin the Wheel" 
                        secondary="Once you have at least one item in your list, the 'Spin' button will become active. Click it to start the wheel!" 
                    />
                </ListItem>
                 <ListItem>
                    <ListItemIcon><BiTrophy size="1.5em" color="#5856d6" /></ListItemIcon>
                    <ListItemText 
                        primary="See the Winner" 
                        secondary="A popup will appear celebrating the selected item. You can then choose to remove the item from the list for the next spin." 
                    />
                </ListItem>
            </List>

            <Typography variant="h5" sx={{ mt: 4, mb: 2, color: 'text.primary' }}>
                Mode 2: Tournament Grouping
            </Typography>
             <List>
                <ListItem>
                    <ListItemIcon><BiCog size="1.5em" color="#5856d6" /></ListItemIcon>
                    <ListItemText 
                        primary="Setup the Game" 
                        secondary="Click the 'Setup Groups' button. A dialog will appear. Enter your event's title, the total number of teams/participants, and the number of groups you want to create." 
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon><BiListPlus size="1.5em" color="#5856d6" /></ListItemIcon>
                    <ListItemText 
                        primary="Fill the List" 
                        secondary="Just like in the simple mode, add all your participants to the list on the right until it's full." 
                    />
                </ListItem>
                 <ListItem>
                    <ListItemIcon><BiPlayCircle size="1.5em" color="#5856d6" /></ListItemIcon>
                    <ListItemText 
                        primary="Spin to Assign Teams" 
                        secondary="Once the list is full, click the 'Spin' button. The winner will be removed from the wheel and automatically assigned to the highlighted group in the A -> B -> C -> D sequence." 
                    />
                </ListItem>
            </List>
             <Typography variant="body2" color="text.secondary" sx={{mt: 3}}>
                This tool is perfect for teachers making student groups, managers creating project teams, or anyone running a tournament or giveaway. Enjoy the spin!
            </Typography>
        </Paper>
    );
};

export default HowToUse;