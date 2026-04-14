export async function migrateLegacyKeys(redis) {
  const legacyUsers = await redis.keys('user:*')

  for (const k of legacyUsers) {
    const data = await redis.get(k)
    if (!data) continue

    // duplication safe vers nouveau format
    await redis.set(`user:migrated:${k}`, data, {
      ex: 60 * 60 * 24 * 30
    })
  }

  return {
    migrated: legacyUsers.length
  }
}
