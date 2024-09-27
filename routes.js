const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');

// Serve the login form
router.get('/login', (req, res) => {
    res.send(`
        <html>
            <head><title>Login</title></head>
            <body>
                <form action="/set-username" method="POST">
                    <label>Enter Username:</label>
                    <input type="text" name="username" required>
                    <button type="submit">Login</button>
                </form>
            </body>
        </html>
    `);
});

// Set username in the cookie and redirect to home
router.post('/set-username', (req, res) => {
    const { username } = req.body;
    res.cookie('username', username, { httpOnly: true }); // Set the cookie with the username
    res.redirect('/');
});

// Serve the send message form if the username is set
router.get('/', (req, res) => {
    const username = req.cookies.username; // Retrieve the username from the cookie
    if (!username) {
        return res.redirect('/login');
    }

    // Read existing messages from the file
    let messages = [];
    if (fs.existsSync('messages.json')) {
        messages = JSON.parse(fs.readFileSync('messages.json', 'utf-8'));
    }

    // Display the message form and existing messages
    res.send(`
        <html>
            <head><title>Group Chat</title></head>
            <body>
                <h1>Welcome, ${username}</h1>
                <form action="/send-message" method="POST">
                    <input type="text" name="message" required placeholder="Enter your message">
                    <button type="submit">Send</button>
                </form>
                <h2>Messages:</h2>
                <ul>
                    ${messages.map(msg => `<li><strong>${msg.username}</strong>: ${msg.message}</li>`).join('')}
                </ul>
            </body>
        </html>
    `);
});

// Handle message submission and save it to the file
router.post('/send-message', (req, res) => {
    const username = req.cookies.username; // Retrieve the username from the cookie
    const { message } = req.body;

    if (!username) {
        return res.redirect('/login');
    }

    // Read existing messages and append the new message
    let messages = [];
    if (fs.existsSync('messages.json')) {
        messages = JSON.parse(fs.readFileSync('messages.json', 'utf-8'));
    }

    messages.push({ username, message });
    fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));

    res.redirect('/');
});

module.exports = router;
