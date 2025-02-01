const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3500; // my axios baseURL

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // the React app URL
    credentials: true
}));

app.post('/register', (req, res) => {
    const { user, pwd } = req.body;
    res.status(200).json({ message: 'Registration successful' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});