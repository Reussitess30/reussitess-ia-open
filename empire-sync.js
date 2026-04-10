/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
require('dotenv').config({ path: './.env' });
const axios = require('axios');

async function sync() {
  console.log('🔥 EMPIRE SYNC...');
  
  // REUSS Token
  try {
    const cg = await axios.get('https://api.coingecko.com/api/v3/simple/token_price/polygon-pos?contract_addresses=' + process.env.REUSS_CONTRACT + '&vs_currencies=usd');
    const price = cg.data[process.env.REUSS_CONTRACT]?.usd || 0;
    
    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.CHANNEL_ID,
      text: `💎 **REUSS** $${price.toFixed(6)}
🔗 https://reussitess.fr/investir-reuss
🇬🇵 BOUDOUM c4774d0f`,
      parse_mode: 'Markdown'
    });
    console.log(`✅ REUSS $${price}`);
  } catch(e) {
    console.log('❌ REUSS API fail:', e.message);
  }
  
  console.log('🏆 SYNC OK');
}

// 5min
setInterval(sync, 300000);
sync();
