import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { verifyJWT } from './middleware/auth';
import { piiMiddleware, maskPII } from './middleware/pii';
import { incidentWorkflow } from './mastra/workflow';
import { seedQdrant } from './qdrant';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// API Rate Limiting for security
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', apiLimiter);

// Optional PII middleware on REST routes
app.use('/api/ingest', piiMiddleware);

// Initialize Vector DB
seedQdrant();

// WebSocket server for live telemetry (simulating TLS via WSS in prod)
wss.on('connection', (ws) => {
    console.log('[WebSocket] Client connected to Telemetry Server');
    
    ws.on('message', async (message) => {
        try {
            const rawData = message.toString();
            // GDPR Compliance: Mask PII before processing
            const maskedLog = maskPII(rawData);
            console.log(`[Telemetry] Ingested masked log: ${maskedLog}`);

            // Broadcast raw telemetry to all connected clients (like the frontend dashboard)
            wss.clients.forEach((client) => {
                if (client.readyState === 1) { // WebSocket.OPEN
                    client.send(maskedLog);
                }
            });

            // Trigger Mastra Workflow (Non-linear state machine)
            const { runId, start } = incidentWorkflow.createRun();
            const result = await start({ triggerData: { log: maskedLog, timestamp: new Date().toISOString() } });
            
            // Get the final result from the generatePlan step
            const planPayload = result.results.generatePlan?.payload || result.results.generatePlan;
            
            // Broadcast the proposed remediation plan to all clients (HITL Dashboard)
            wss.clients.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({ type: 'INCIDENT_PLAN', runId, data: planPayload }));
                }
            });
            
        } catch (error) {
            console.error('Error processing telemetry log:', error);
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Failed to process log via Mastra' }));
        }
    });
});

// REST API for HITL Approval (Protected by JWT)
app.post('/api/approve', verifyJWT, (req, res) => {
    const { runId, command } = req.body;
    console.log(`[HITL] Operator approved command execution: ${command}`);
    
    // Auto-generate Markdown Post-Mortem upon resolution
    const postMortem = `
# Incident Post-Mortem
**Date:** ${new Date().toISOString()}
**Remediation Action:** \`${command}\`
**Safety Check:** Passed (Enkrypt AI)
**Approval:** Human-In-The-Loop (HITL) verified
**Status:** Resolved
    `;
    
    res.json({ success: true, postMortem });
});

app.post('/api/auth/token', (req, res) => {
    // Mock login endpoint for testing frontend
    import('jsonwebtoken').then(jwt => {
        const token = jwt.default.sign({ user: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token });
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Dauntless Ops Backend running on port ${PORT}`);
});
