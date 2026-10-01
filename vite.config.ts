import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import os from 'os';
import fs from 'fs';
import path from 'path';

function getPrimaryLanIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    if (/wi-fi|wlan|wireless/i.test(name)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
  }
  for (const name of Object.keys(nets)) {
    if (!/virtual|vbox|vmware|loopback/i.test(name)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('192.168.56.')) {
          return net.address;
        }
      }
    }
  }
  return '192.168.1.4';
}

/**
 * GYMOS Real-Time Server Plugin for Multi-Device Sync (PC <-> Real Phone)
 * Provides:
 * - Server-Sent Events (/api/events)
 * - Session Management (/api/checkin, /api/checkout, /api/session/:token)
 * - Network Info (/api/network-info)
 */
function gymosSyncServerPlugin() {
  const sseClients = new Set();
  const sessions = new Map();
  const attendanceLogs = new Map();

  return {
    name: 'gymos-sync-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const parsedUrl = new URL(req.url, 'http://' + (req.headers.host || 'localhost:3006'));
        const pathname = parsedUrl.pathname;

        // CORS headers for local network devices
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        // 1. GET /api/network-info
        if (pathname === '/api/network-info') {
          const lanIp = getPrimaryLanIp();
          const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VITE_APP_URL;
          const appUrl = configuredUrl || ('http://' + lanIp + ':3006');

          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              ip: lanIp,
              port: 3006,
              appUrl: appUrl,
              configuredUrl: configuredUrl || null,
              isConfigured: !!configuredUrl,
            })
          );
          return;
        }

        // 2. GET /api/events (Server-Sent Events)
        if (pathname === '/api/events') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          });

          sseClients.add(res);
          res.write('data: {"type":"CONNECTED"}\n\n');

          const heartbeat = setInterval(() => {
            res.write(': heartbeat\n\n');
          }, 15000);

          req.on('close', () => {
            clearInterval(heartbeat);
            sseClients.delete(res);
          });
          return;
        }

        // 3. POST /api/checkin
        if (pathname === '/api/checkin' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => (body += chunk));
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const session = {
                token: data.token,
                attendanceId: data.attendanceId,
                memberId: data.memberId,
                memberName: data.memberName,
                memberPhone: data.memberPhone,
                memberPlan: data.memberPlan,
                checkInTime: data.checkInTime,
                date: data.date,
                createdAt: Date.now(),
                isUsed: false,
              };

              sessions.set(data.token, session);

              // Broadcast to all connected clients
              const payload = JSON.stringify({ type: 'MEMBER_CHECKED_IN', session });
              sseClients.forEach((client) => client.write('data: ' + payload + '\n\n'));

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, session }));
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 4. GET /api/session/:token
        if (pathname.startsWith('/api/session/') && req.method === 'GET') {
          const token = pathname.replace('/api/session/', '').split('/')[0];
          const session = sessions.get(token);

          if (!session) {
            // Return fallback mock session if token matches format
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                found: false,
                token,
                message: 'Session not found or expired',
              })
            );
            return;
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ found: true, session }));
          return;
        }

        // 5. POST /api/checkout
        if (pathname === '/api/checkout' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => (body += chunk));
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const { token } = data;
              let session = sessions.get(token);

              const now = new Date();
              const checkOutTimeStr = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
              const duration = data.duration || '1h 24m';

              if (session) {
                if (session.isUsed) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'ALREADY_USED', message: 'Checkout already completed.' }));
                  return;
                }
                session.isUsed = true;
                session.completedAt = checkOutTimeStr;
                session.duration = duration;
              }

              // Broadcast checkout event to all connected admin clients via SSE
              const eventPayload = JSON.stringify({
                type: 'MEMBER_CHECKED_OUT',
                token: token,
                attendanceId: session ? session.attendanceId : data.attendanceId,
                memberId: session ? session.memberId : data.memberId,
                memberName: session ? session.memberName : (data.memberName || 'Member'),
                checkInTime: session ? session.checkInTime : (data.checkInTime || 'Earlier'),
                checkOutTime: checkOutTimeStr,
                duration: duration,
                timestamp: Date.now(),
              });

              sseClients.forEach((client) => client.write('data: ' + eventPayload + '\n\n'));

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  checkOutTime: checkOutTimeStr,
                  duration: duration,
                  memberName: session ? session.memberName : data.memberName,
                  checkInTime: session ? session.checkInTime : data.checkInTime,
                })
              );
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), gymosSyncServerPlugin()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces for real mobile phones
    port: 3006,
    strictPort: true,
  },
});
