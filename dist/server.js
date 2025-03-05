"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 9000;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
let players = [];
let invitations = [];
// Register a player
app.post('/register', (req, res) => {
    const player = req.body;
    // Check if the player is already registered
    const existingPlayer = players.find(p => p.id === player.id);
    if (existingPlayer) {
        return res.status(400).json({ status: 'error', message: 'Player already registered' });
    }
    // Add the player to the list
    players.push(player);
    console.log(`Player registered: ${player.name} (${player.id})`);
    res.json({ status: 'success', players });
});
// Get list of players
app.get('/players', (req, res) => {
    res.json(players);
});
// Unregister a player
app.post('/unregister', (req, res) => {
    const player = req.body;
    // Remove the player from the list
    players = players.filter(p => p.id !== player.id);
    console.log(`Player unregistered: ${player.name} (${player.id})`);
    res.json({ status: 'success', players });
});
// Send an invitation
app.post('/invite', (req, res) => {
    const invitation = req.body;
    // Check if the invitation already exists
    const existingInvitation = invitations.find(inv => inv.fromPlayerId === invitation.fromPlayerId && inv.toPlayerId === invitation.toPlayerId);
    if (existingInvitation) {
        return res.status(400).json({ status: 'error', message: 'Invitation already sent' });
    }
    // Add the invitation to the list
    invitations.push(invitation);
    console.log(`Invitation sent from ${invitation.fromPlayerId} to ${invitation.toPlayerId} for room ${invitation.roomName}`);
    res.json({ status: 'success', invitation });
});
// Get invitations for a player
app.get('/invitations/:playerId', (req, res) => {
    const playerId = req.params.playerId;
    // Find all invitations for the player
    const playerInvitations = invitations.filter(inv => inv.toPlayerId === playerId);
    res.json(playerInvitations);
});
// Remove an invitation (when accepted or declined)
app.post('/remove-invitation', (req, res) => {
    const invitation = req.body;
    // Remove the invitation from the list
    invitations = invitations.filter(inv => inv.fromPlayerId !== invitation.fromPlayerId || inv.toPlayerId !== invitation.toPlayerId);
    console.log(`Invitation removed from ${invitation.fromPlayerId} to ${invitation.toPlayerId}`);
    res.json({ status: 'success' });
});
// Start the server
app.listen(port, () => {
    console.log(`Local server running at http://localhost:${port}`);
});
