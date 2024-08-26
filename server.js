const express = require('express');
const app = express();
const EmailService = require('./src/EmailService'); 

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Email Service API!');
});

app.post('/send-email', async (req, res) => {
    const emailService = new EmailService([/* your providers */]);
    try {
        const result = await emailService.sendEmail(req.body);
        res.status(200).json({ message: 'Email sent successfully', result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
