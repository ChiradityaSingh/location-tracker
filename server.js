const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());

// Load/save activity to a file (replace with DB for production)
let activity = [];
if (fs.existsSync('activity.json')) {
    activity = JSON.parse(fs.readFileSync('activity.json'));
}

app.get('/api/activity', (req, res) => res.json(activity));
app.post('/api/save-activity', (req, res) => {
    activity.push(req.body);
    fs.writeFileSync('activity.json', JSON.stringify(activity));
    res.sendStatus(200);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));