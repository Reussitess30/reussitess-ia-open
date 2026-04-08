async function getNasaApod() {
  try {
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    return {
      title: data.title || 'NASA Photo du Jour',
      image: data.url || data.hdurl || 'https://api.nasa.gov/assets/img/fallback.jpg',
      explanation: data.explanation?.slice(0, 400) || 'Explication...',
      date: data.date || new Date().toISOString().split('T')[0]
    };
  } catch (error) {
    console.error('NASA:', error.message);
    return {
      title: '🚀 NASA indisponible',
      image: 'https://apod.nasa.gov/apod/image/2604/art002e000192.jpg',
      explanation: `Error: ${error.message}`,
      date: new Date().toISOString().split('T')[0]
    };
  }
}

module.exports = { getNasaApod };
