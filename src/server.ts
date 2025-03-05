import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 9000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for players and invitations
interface Player {
    id: string;
    name: string;
}

interface Invitation {
    fromPlayerId: string;
    toPlayerId: string;
    roomName: string;
}

let players: Player[] = [];
let invitations: Invitation[] = [];

// Register a player
app.post('/register', (req: Request, res: Response) => {
    const player: Player = req.body;

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
app.get('/players', (req: Request, res: Response) => {
    res.json(players);
});

// Unregister a player
app.post('/unregister', (req: Request, res: Response) => {
    const player: Player = req.body;

    // Remove the player from the list
    players = players.filter(p => p.id !== player.id);
    console.log(`Player unregistered: ${player.name} (${player.id})`);

    res.json({ status: 'success', players });
});

// Send an invitation
app.post('/invite', (req: Request, res: Response) => {
    const invitation: Invitation = req.body;

    // Check if the invitation already exists
    const existingInvitation = invitations.find(
        inv => inv.fromPlayerId === invitation.fromPlayerId && inv.toPlayerId === invitation.toPlayerId
    );
    if (existingInvitation) {
        return res.status(400).json({ status: 'error', message: 'Invitation already sent' });
    }

    // Add the invitation to the list
    invitations.push(invitation);
    console.log(`Invitation sent from ${invitation.fromPlayerId} to ${invitation.toPlayerId} for room ${invitation.roomName}`);

    res.json({ status: 'success', invitation });
});

// Get invitations for a player
app.get('/invitations/:playerId', (req: Request, res: Response) => {
    const playerId = req.params.playerId;

    // Find all invitations for the player
    const playerInvitations = invitations.filter(inv => inv.toPlayerId === playerId);
    res.json(playerInvitations);
});

// Remove an invitation (when accepted or declined)
app.post('/remove-invitation', (req: Request, res: Response) => {
    const invitation: Invitation = req.body;

    // Remove the invitation from the list
    invitations = invitations.filter(
        inv => inv.fromPlayerId !== invitation.fromPlayerId || inv.toPlayerId !== invitation.toPlayerId
    );
    console.log(`Invitation removed from ${invitation.fromPlayerId} to ${invitation.toPlayerId}`);

    res.json({ status: 'success' });
});

// Start the server
app.listen(port, () => {
    console.log(`Local server running at http://localhost:${port}`);
});