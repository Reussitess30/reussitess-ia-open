async function getNasaApod() {
  try {
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`, {
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validation stricte
    if (!data.title || !data.url) {
      throw new Error('NASA data incomplete');
    }
    
    return {
      title: data.title,
      image: data.url || data.hdurl,
      explanation: data.explanation?.slice(0, 400) + '...',
      date: data.date
    };
  } catch (error) {
    console.error('NASA:', error.message);
    
    // Fallback statique APOD 2026-04-08
    return {
      title: 'Earthset - Artemis II',
      image: 'https://apod.nasa.gov/apod/image/2604/earthset_artemis2_nasa.jpg',
      explanation: 'Vue Terre-Orion spacecraft. Artemis II mission autour Lune.',
      date: '2026-04-08'
    };
  }
}

module.exports = { getNasaApod };
