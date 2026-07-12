import WebSocket from 'ws';
import fs from 'fs';
import readline from 'readline';
import path from 'path';

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
    console.log('[Ingester] Connected to Telemetry WebSocket. Starting log stream...');
    
    const logPath = path.resolve(__dirname, '../../dataset/openstack_abnormal.log');
    if (!fs.existsSync(logPath)) {
        console.error('[Ingester] Dataset not found at', logPath);
        process.exit(1);
    }

    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let count = 0;
    const lines: string[] = [];

    rl.on('line', (line) => {
        if (count < 20) {
            lines.push(line);
            count++;
        }
    });

    rl.on('close', () => {
        let i = 0;
        // Stream logs slowly every 5 seconds for the demo
        setInterval(() => {
            if (i < lines.length) {
                console.log(`[Ingester] Sending log...`);
                ws.send(lines[i]);
                i++;
            } else {
                i = 0; // Loop the incidents for demo purposes
            }
        }, 5000);
    });
});

ws.on('error', (err) => {
    console.error('[Ingester] WebSocket Error:', err);
});
