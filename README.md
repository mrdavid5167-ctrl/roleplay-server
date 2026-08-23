# RP3D Complete Game + Server

This version is configured to connect to the Render server:

https://roleplay-server-gog2.onrender.com

The game includes the 3D character, city, cars, enter/exit, shop/interior,
buying system, multiplayer synchronization, and Node.js/Socket.IO server.

## Local project
Run:
npm install
npm start

## Important
The client is already configured to connect to the Render server above.
The Render service must remain deployed for online multiplayer.

## Test
Open:
https://roleplay-server-gog2.onrender.com/api/health

A healthy response should contain `ok: true`.
