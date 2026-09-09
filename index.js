
import express from 'express'
import moment from 'moment';

moment().format();
const app = express()

app.get('/timestamp', (req, res) => {
    res.json({
        "date": moment().format('YYYY-MM-DD')
    })
})
app.get('/health', (req, res) => {
    res.json({
        "status": "ok"
    })
})
app.get('/stats', (req, res) => {
    res.json({
        "uptime": process.uptime(),
        "nodeVersion": process.versions.node,
        "timestamp": moment().format('YYYY-MM-DD')
    })
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})