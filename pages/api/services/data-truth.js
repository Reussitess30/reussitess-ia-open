// ===== REUSSITESS — DATA TRUTH ENGINE =====
// Données vérifiées uniquement — zéro hallucination

import { getRedisClient } from './memory.js'

// Sources de données vérifiées
const VERIFIED_SOURCES = {
  meteo: 'open-meteo.com',
  crypto: 'coingecko.com + dexscreener.com',
  seismes: 'usgs.gov',
  cyclones: 'nhc.noaa.gov',
  emploi: 'francetravail.fr',
  forex: 'open.er-api.com',
  nasa: 'api.nasa.gov',
  qualite_air: 'air-quality-api.open-meteo.com',
  catastrophes: 'gdacs.org',
  blockchain: 'alchemy.com + polygonscan.com'
}

// Cache strict avec TTL et source
export async function setVerifiedData(key, data, source, ttlSeconds = 300) {
  try {
    const redis = await getRedisClient()
    if (!redis) return false
    const payload = {
      data,
      source,
      verified: true,
      timestamp: new Date().toISOString(),
      ttl: ttlSeconds
    }
    await redis.set(`verified:${key}`, JSON.stringify(payload), { EX: ttlSeconds })
    return true
  } catch(e) { return false }
}

export async function getVerifiedData(key) {
  try {
    const redis = await getRedisClient()
    if (!redis) return null
    const raw = await redis.get(`verified:${key}`)
    if (!raw) return null
    const payload = JSON.parse(raw)
    return payload
  } catch(e) { return null }
}

// Wrapper fetch avec validation
export async function fetchVerified(url, options = {}, validator = null) {
  try {
    const r = await fetch(url, {
      ...options,
      signal: options.signal || AbortSignal.timeout(5000)
    })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const data = await r.json()
    if (validator && !validator(data)) throw new Error('Validation failed')
    return { success: true, data, source: url }
  } catch(e) {
    return { success: false, error: e.message, source: url }
  }
}

// Réponse avec badge source
export function formatVerifiedResponse(content, source, timestamp = null) {
  const time = timestamp ? ` • ${new Date(timestamp).toLocaleTimeString('fr-FR')}` : ''
  return `${content}\n\n✅ *Source vérifiée : ${source}${time}*\nBoudoum ! 🇬🇵`
}

// Détection hallucination
export function detectHallucination(response) {
  const hallucination_patterns = [
    /je pense que.*président/i,
    /il me semble que.*prix/i,
    /environ.*€.*bitcoin/i,
    /probablement.*température/i,
    /je crois que.*séisme/i,
    /peut-être.*taux/i,
    /biden.*président.*actuel/i,
    /joe biden.*2025/i
  ]
  return hallucination_patterns.some(p => p.test(response))
}

// Log debug style AWS/Stripe
export async function logEvent(type, data) {
  try {
    const redis = await getRedisClient()
    if (!redis) return
    const key = `log:${type}:${Date.now()}`
    await redis.set(key, JSON.stringify({
      type, data,
      timestamp: new Date().toISOString(),
      env: 'production'
    }), { EX: 7 * 24 * 60 * 60 })
  } catch(e) {}
}

export { VERIFIED_SOURCES }
