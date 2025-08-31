import { Box, Button, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BiFlag, BiXCircle } from "react-icons/bi";
import adBannerImage from './assets/ad-banner.png';

const ads = [
    {
        type: 'image',
        link: 'https://stackoverflow.com/jobs/companies/paypay-corporation?so_medium=Ad&so_source=CompanyPageAd&so_campaign=PremiumCompanyPageAd&med=clc&clc-var=19',
        source: 'https://tpc.googlesyndication.com/simgad/11958143541724804042',
        width: '250px',
        height: '200px'
    },
    {
        type: 'image',
        link: 'https://flipsimu.com/',
        source: adBannerImage,
        width: '270px',
        height: '120px'
    }
];

const AdPlaceholder = () => {
    const [showAd, setShowAd] = useState(true);
    const [randomAd, setRandomAd] = useState(null);

    useEffect(() => {
        setRandomAd(ads[Math.floor(Math.random() * ads.length)]);
    }, []);

    if (!showAd || !randomAd) {
        return null;
    }

    return (
        <Box sx={{ 
            display: { xs: 'none', lg: 'flex' }, 
            flexDirection: 'column', 
            position: 'absolute',
            pt: 2, 
            gap: 1, 
            minWidth: 160,
            alignItems: 'center'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: randomAd.width }}>
                <Button 
                    size="small" 
                    startIcon={<BiXCircle />} 
                    sx={{ 
                        color: 'text.secondary', 
                        fontSize: '0.7rem', 
                        textTransform: 'none', 
                        p: 0.5,
                        '& .MuiButton-startIcon': { marginRight: '-3px' } // --- FIX: Reduced gap ---
                    }} 
                    onClick={() => setShowAd(false)}
                >
                    Close
                </Button>
            </Box>
            <Paper 
                component="a" 
                href={randomAd.link}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined" 
                sx={{ 
                    width: randomAd.width,
                    height: randomAd.height,
                    flexShrink: 0,
                    overflow: 'hidden', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    '&:hover': {
                        borderColor: 'rgba(0, 0, 0, 0.2)',
                    }
                }}
            >
                {randomAd.type === 'image' ? (
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${randomAd.source})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}/>
                ) : (
                    <iframe
                        src={randomAd.source}
                        title="advertisement"
                        scrolling="no"
                        frameBorder="0"
                        style={{ width: '100%', height: '100%', border: 0 }}
                    />
                )}
            </Paper>
        </Box>
    );
};

export default AdPlaceholder;