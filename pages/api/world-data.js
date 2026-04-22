export default async function handler(req, res) {
  const { type, country, city } = req.query
  
  // CRYPTO - CoinGecko 200+ pays
  if (type === 'crypto') {
    const currencies = country === 'haiti' ? 'HTG' : 
                      country === 'rwanda' ? 'RWF' :
                      country === 'albania' ? 'ALL' : 'EUR,XCD'
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=${currencies}&include_24hr_change=true`
    try {
      const data = await (await fetch(url)).json()
      return res.json({ response: `₿ **Crypto ${country.toUpperCase()}**
• BTC: ${data.bitcoin?.[Object.keys(data.bitcoin)[0]]?.toLocaleString()}₿
• ETH: ${data.ethereum?.[Object.keys(data.ethereum)[0]]?.toLocaleString()}₿
Boudoum ! 🇬🇵` })
    } catch(e) {
      return res.json({ response: `₿ Crypto ${country} indisponible
Boudoum !` })
    }
  }
  
  // MÉTÉO - Open-Meteo 100% monde
  if (type === 'meteo') {
    const CITIES = {
      'mali': '12.6392, -8.0029', 'niger': '13.5116, 2.1254',
      'tchad': '12.1067, 15.0443', 'burkina': '12.3714, -1.5197',
      'burundi': '-3.3614, 29.3599', 'haiti': '18.5947, -72.3042'
    }
    const [lat, lon] = CITIES[country]?.split(', ') || '16.2650, -61.5510' // Guadeloupe
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=America/Guadeloupe`
    try {
      const data = await (await fetch(url)).json()
      const w = data.current_weather
      return res.json({ response: `🌤 **${country.toUpperCase()}**
${w.temperature}°C ${w.weathercode === 0 ? '☀' : '🌧'}
Vent: ${w.windspeed}km/h
Boudoum ! 🇬🇵` })
    } catch(e) {
      return res.json({ response: `🌤 Météo ${country} indisponible
Boudoum ! 🇬🇵` })
    }
  }
  
  // DEVISES - ExchangeRate 170+ pays
  if (type === 'devises') {
    const symbols = country === 'haiti' ? 'HTG' : 
                   country === 'rwanda' ? 'RWF' :
                   country === 'albania' ? 'ALL' : 'XCD,EUR,USD'
    const url = `https://api.exchangerate-api.com/v4/latest/EUR?symbols=${symbols}`
    try {
      const data = await (await fetch(url)).json()
      const rates = data.rates
      return res.json({ response: `💱 **Devises ${country.toUpperCase()}**
EUR → ${rates[Object.keys(rates)[0]]?.toFixed(2)} ${Object.keys(rates)[0]}
Boudoum ! 🇬🇵` })
    } catch(e) {
      return res.json({ response: `💱 Devises ${country} indisponibles
Boudoum ! 🇬🇵` })
    }
  }
}
