const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const IPINFO_TOKEN = process.env.IPINFO_TOKEN;

if (!IPINFO_TOKEN) {
    console.error("❌ ERROR: IPINFO_TOKEN missing! Add it to .env");
    process.exit(1);
}

app.get('/', (req, res) => {
    res.json({status:"Backend IP Tools Active", author:"Danzz VDAA"});
});

app.get('/api/ip', async (req, res) => {
    try {
        const ip = req.query.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        let asn = "Unknown ASN";
        let ipData = {};

        // 1️⃣ Cek IPInfo
        try {
            const response = await axios.get(`https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`);
            ipData = response.data;
            if(ipData.org) asn = ipData.org.split(" ")[0];
        } catch(err){ /* skip jika gagal */ }

        // 2️⃣ Fallback ke ipwhois.io
        if(asn === "Unknown ASN"){
            try {
                const backup = await axios.get(`https://ipwhois.app/json/${ip}`);
                if(backup.data.asn) asn = backup.data.asn;
            } catch(err){ /* skip jika gagal */ }
        }

        res.json({
            ip: ipData.ip || ip,
            city: ipData.city || "Unknown",
            region: ipData.region || "Unknown",
            country: ipData.country || "Unknown",
            org: ipData.org || "Unknown",
            asn: asn
        });

    } catch(err){
        console.error("❌ ERROR FETCH IP:", err.message);
        res.status(500).json({error: "Failed to fetch IP info"});
    }
});

app.use((req,res)=>res.status(404).json({error:"Endpoint not found"}));

app.listen(PORT, () => console.log(`✅ Backend live on port ${PORT}`));