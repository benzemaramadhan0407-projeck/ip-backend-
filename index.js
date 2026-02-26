require('dotenv').config()
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
app.use(cors())

const PORT = process.env.PORT || 3000
const TOKEN = process.env.IPINFO_TOKEN

app.get('/api/ip', async (req, res) => {
  try {
    const ip = req.query.ip || ''
    const url = ip
      ? `https://ipinfo.io/${ip}?token=${TOKEN}`
      : `https://ipinfo.io/json?token=${TOKEN}`

    const response = await axios.get(url)
    res.json(response.data)
  } catch (err) {
    res.status(500).json({
      error: 'Gagal mengambil data IP'
    })
  }
})

app.listen(PORT, () => {
  console.log(`Backend IP aktif di port ${PORT}`)
})