const WebSocket = require('ws');
const ROOM_ID = 79873; // Remplace par ta room ID Kick

const ws = new WebSocket('wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7');
ws.on('open', () => {
  console.log('🔴 KICK PUSHER 971 LIVE !');
  ws.send(JSON.stringify({
    event: 'pusher:subscribe',
    data: { channel: `chatrooms.${ROOM_ID}.v2` }
  }));
});
ws.on('message', (data) => console.log('💬 KICK:', data.toString()));
