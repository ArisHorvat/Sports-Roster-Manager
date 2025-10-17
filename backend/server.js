const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const accountRoutes = require('./src/routes/accountRoutes');
const playerRoutes = require('./src/routes/playerRoutes');
const teamRoutes = require('./src/routes/teamRoutes');
const fileRoutes = require('./src/routes/fileRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const { Player } = require('./src/domain/Player');

// Initialize app and middleware
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server for Express
const server = http.createServer(app);

// // Create WebSocket server
// const wss = new WebSocket.WebSocketServer({ server });

// // Function to broadcast data to all connected clients
// function broadcast(data) {
//     wss.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify(data));
//         }
//     });
// }

// const positionGroup = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "ST"];

// // Function to get a random position
// function getRandomPosition() {
//     const randomIndex = Math.floor(Math.random() * positionGroup.length);
//     return positionGroup[randomIndex];
// }

// // Function to generate random player data
// function generatePlayer(entityId) {
//     const name = "Name " + entityId;
//     const position = getRandomPosition(); 
//     const age = Math.floor(Math.random() * (21)) + 20; 
//     const experience = Math.floor(Math.random() * (19)) + 1;
//     const height = Math.floor(Math.random() * (99)) + 101;
//     const weight = Math.floor(Math.random() * (90)) + 61;
//     const teamId = Math.floor(Math.random() * (5)) + 1;

//     return new Player(125 + entityId, name, entityId, position, age, experience, height, weight, teamId);
// }

// // Interval to generate new players and broadcast
// let entityId = 1;
// setInterval(() => {
//     const newPlayer = generatePlayer(entityId); 
//     entityId++; 
//     console.log('Generated:', newPlayer); 
//     broadcast(newPlayer); 
// }, 3000);

// // WebSocket connection event
// wss.on('connection', (ws) => {
//     console.log('Client connected');
//     ws.on('message', (message) => {
//         console.log('Received:', message);
//     });

//     ws.on('close', () => {
//         console.log('Client disconnected');
//     });
// });

// Use routes
app.use('/accounts', accountRoutes);
app.use('/players', playerRoutes);
app.use('/teams', teamRoutes);
app.use('/files', fileRoutes);
app.use('/admin', adminRoutes);

// Check if Server is Up
app.get('/ping', (req, res) => {
    res.status(200).send('I am up');
});

// Add health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Start the HTTP and WebSocket server
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

require('./services/monitor');

module.exports = app;
