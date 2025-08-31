import React, { useState, useEffect } from 'react';
import { Box, Paper, IconButton, Typography } from "@mui/material";
import { BiXCircle } from "react-icons/bi";
import adBannerImage from './assets/bottom-banner.png';

// Sample ads for the bottom banner
const bottomAds = [
    {
        link: 'https://ad.doubleclick.net/pcs/click?xai=AKAOjssdPZd8tc6O1kRh4DweZJupT2g6i75wLTifRRjqRvEwfVfASRJf919BWfqlgh7lnJRJOgA8YQ5krsHMewmdx3V7FtrAJfcEqpm4L327F_LvFtQPPVbA4_7J3B4Qu_06pEgApZ8darVGSuIKbP0nzye-QTyXF_NYFS5MIrNkpwJKw1svsZ0RXUAUTBlx4-KlXmqVRMav_t19dcZn__lnORdjj0eprBDsDDvVdS95i51n_hZhQDHRARlgErfnrUJ07HIZSgabCdbw69bSAWWkS9Xuc-qRy8hGqOMAwg7ZzUXPnEMyGpfzt40YJl1VNUMtOXdRiH5DPIzIAM3q2qJygM2lJpLBu8qWl8s_srE8VyVHmUrhY8VYL8HH3hjlQVp_CSTJdGX58f1U86WkpBu5SmuSQ73bY8ArDxDPH6OJVvxgSLmJARItSsHVmcrLfvsi82qItpAiA4Oh0sQMVws9PX7TO9yrmu41M5hMTSD5H7Wlf-DWSIpTN47eve6yZDGs-66ajqHUm3i_pTSERrv2LqtMpt2It5NmLGzjTK5QhkrSsUxyIw&sai=AMfl-YQI5deQ97F0NrLd3S8oQwuazrNc0OPaiWlA5dBt7VE5dKibnpXrAYq9aEHU24xt1gABDVF-3Hjs5oUWC8juEyUrJdFi2NMIvjlDpetx7qmBrLvksusFCZm4bcFz1nD2cx9Il1m5TzEfboiCPtYVStsFXK9enne6fhsOuJWV8uwKFU8Tr-QRQi12J74MTU-NhGWnE__eU7on5DSNfEdEBP6bFDAWB6MhAE63g9MQGc3HXA&sig=Cg0ArKJSzAFNh3MRK6_BEAE&cry=1&fbs_aeid=%5Bgw_fbsaeid%5D&crd=aHR0cHM6Ly9hY2Nvci5jb20&urlfix=1&rm_eid=%5Brm_exit_id%5D&nx=451&ny=29&dim=728x90&adurl=https://exch.quantserve.com/r%3F%26a%3Dp-Nfk-wbeA5EZDg%26labels%3D_qc.clk,_click.adserver.rtb,_click.rand.429709420%26rtbip%3D91.228.72.201%26rtbdata2%3DEAw6FGh0dHBzOi8vZmxpcHNpbXUuY29tWih3TGRBZXNHMUUzSGI1Qkoya3JrUEo1WGdRWGZidVVZaHhybUdqUHJugAGUz4yzDroBGFpybHlaSXNGVnE4QUFFeTZBay5hdndBQcABiJgFyAG-_oHyjzPaASgwM2RhM2Y3OC00MmYxLTQ3MGItOWU3Yy0zYzAzMjZkNTU0MTZfeDUxsAIIyAIA0ALO4Yb7-J_3zKkB6ALPAfICDwiZxjAQ_MyH68mU5Ze6AfICDgjPARD5qpDs15y6-cUB8gIMCGYQgLqCg5Xplcgf-AIAigMGMTgyNDk2mAMAqAMAsgMEtPv0ALoDEgmGTk8TLjLZgxEvIk2soWYfh8IDEgmtRLvSZ8PcvxGam-oUu1t2vMgDnYCAggHSAxIJWlo0UMsKPPIRrfVJ0f-kCLTYA-yw88wB4gMPcC1OZmstd2JlQTVFWkRn6gMFCNgFEFryAwUzMDEyOfgDAIAEtE-KBAI3N5IEH0lYM1RQUTFIaWdoVmlld2FiaWxpdHlRdWFudGNhc3SaBBIJlkDtYAdZgDYRd9lTinC997miBBIJWlo0UMsKPPIRrfVJ0f-kCLSqBBIJhk5PEy4y2YMRLyJNrKFmH4e4BNAF0AQD8gQCSUSABQGKBSoyMDkxY2IzMDJiZTY3MDdkM2U2NWUzZjlhMzg3Y2U5MzE1MDRmNDE2ZGSQBQGaBRUgkcswK-ZwfT5l4_mjh86TFQT0Ft2iBSRwQUxLOU1BX3l0NmtlUF9MOVFyUTJ0VVg1TmFzS3YwV2h1dz24BQDABZTPjLMOyAWP6akE0gUGCAEQAhgD6AUFmgYUChIJlkDtYAdZgDYRd9lTinC997mgBgCoBsGEkRm1BnUaWTm6Bl4KAklEEgJTUxiS_xUiFDIwJTIwaWxpciUyMGQuJTIwaWlpKgUzMDEyOTofcHQlMjB0ZWxla29tdW5pa2FzaSUyMGluZG9uZXNpYVoSdGVsa29tJTIwaW5kb25lc2lhyQbBECI-F1suDeoGEWh0dHBzOi8vYWNjb3IuY29t8QYAGCI-F1suDfgGAYAHAIoHEgmtRLvSZ8PcvxGam-oUu1t2vA%26redirecturl3%3Dhttps%3A%2F%2Fall.accor.com%2Fa%2Fid%2Foffers%2Fmeapac%2Ffor-every-you.html%3Fmerchantid%3Ddis-id-all-fey-h2-as-129%26sourceid%3Dquantcast%26utm_source%3Dquantcast%26utm_medium%3Ddisplay%26utm_campaign%3Dfey-h2-as-129%26utm_content%3Dmlt-id-id-multi%26dclid%3D%25edclid!%26gad_source%3D7',
        image: adBannerImage
    }
];

const FixedBottomAd = () => {
    const [showAd, setShowAd] = useState(true);
    const [randomAd, setRandomAd] = useState(null);

    useEffect(() => {
        setRandomAd(bottomAds[Math.floor(Math.random() * bottomAds.length)]);
    }, []);

    if (!showAd || !randomAd) {
        return null;
    }

    return (
        <Paper elevation={8} sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            // width: '100%',
            py: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 1300,
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease-in-out',
            transform: showAd ? 'translateY(0)' : 'translateY(100%)',
        }}>
            <IconButton 
                size="small" 
                onClick={() => setShowAd(false)} 
                sx={{ 
                    position: 'absolute', 
                    top: -10, 
                    right: -5,
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: '#f0f0f0' }
                }}
            >
                <BiXCircle />
            </IconButton>
            <Box 
                component="a" 
                href={randomAd.link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                    display: 'block',
                    width: '728px',
                    height: '90px',
                    // maxWidth: '90vw', // Ensure it doesn't overflow on small screens
                    overflow: 'hidden',
                    textDecoration: 'none',
                    border: '1px solid rgba(0,0,0,0.1)',
                    backgroundImage: `url(${randomAd.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
        </Paper>
    );
};

export default FixedBottomAd;