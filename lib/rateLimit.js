const ipRequests = new Map()
const LIMIT = 30
const WINDOW = 60 * 1000 // 1 minute

export function rateLimit(ip) {
  const now = Date.now()
  const data = ipRequests.get(ip) || { count: 0, start: now }
  
  if (now - data.start > WINDOW) {
    ipRequests.set(ip, { count: 1, start: now })
    return { allowed: true, remaining: LIMIT - 1 }
  }
  
  if (data.count >= LIMIT) {
    return { allowed: false, remaining: 0 }
  }
  
  data.count++
  ipRequests.set(ip, data)
  return { allowed: true, remaining: LIMIT - data.count }
}
