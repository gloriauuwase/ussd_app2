const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/ussd', (req, res) => {
    try {
        // Read the variables sent via POST from our API
        const { sessionId, serviceCode, phoneNumber, text } = req.body;

        if (!sessionId || !serviceCode || !phoneNumber || text === undefined) {
            return res.status(400).send('Bad Request: Missing required parameters');
        }

        let response = '';

        if (text === '') {
            // This is the first request. Note how we start the response with CON
            response = `CON What would you like to check
1. My account
2. My phone number`;
        } else if (text === '1') {
            // Business logic for first level response
            response = `CON Choose account information you want to view
1. Account number`;
        } else if (text === '2') {
            // Business logic for first level response
            // This is a terminal request. Note how we start the response with END
            response = `END Your phone number is ${phoneNumber}`;
        } else if (text === '1*1') {
            // This is a second level response where the user selected 1 in the first instance
            const accountNumber = 'ACC100101';  // Ideally, fetch this from a database
            // This is a terminal request. Note how we start the response with END
            response = `END Your account number is ${accountNumber}`;
        } else {
            response = 'END Invalid input. Please try again.';
        }

        // Send the response back to the API
        res.set('Content-Type', 'text/plain');
        res.send(response);
    } catch (error) {
        console.error('Error handling USSD request:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`USSD service running on port ${PORT}`);
});
