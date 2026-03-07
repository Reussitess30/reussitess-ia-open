async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retry(fn, retries = 3, wait = 1000) {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      await delay(wait);
      return retry(fn, retries - 1, wait);
    }
    throw err;
  }
}

module.exports = { delay, retry };
