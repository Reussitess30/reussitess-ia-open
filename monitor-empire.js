/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
require('dotenv').config({ path: './.env' });
const axios = require('axios');

setInterval(async () => {
  const checks = [
    'https://reussitess.fr',
    'https://reussitess.fr/reuss-live'
  ];
  
  for(let url of checks) {
    try {
      await axios.get(url, { timeout: 10000 });
    } catch(e) {
      console.log(`🚨 ${url} DOWN`);
      await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        chat_id: process.env.CHANNEL_ID,
        text: `🚨 ${url} DOWN ! Fix now !`
      }).catch(() => {});
    }
  }
}, 60000); // 1min

console.log('👀 MONITOR OK');
