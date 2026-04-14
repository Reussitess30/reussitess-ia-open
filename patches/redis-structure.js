export function getUserKey(userId) {
  return `user:${userId}:profile`
}

export function getConvKey(userId) {
  return `user:${userId}:conv`
}

export function getStatsKey(userId) {
  return `user:${userId}:stats`
}

export function getSatisfactionKey(userId) {
  return `satisfaction:${userId}`
}
