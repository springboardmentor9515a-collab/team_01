// Simple in-memory token blacklist (use Redis in production)
const blacklistedTokens = new Set();

const addToBlacklist = (token) => {
  blacklistedTokens.add(token);
};

const isBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};

module.exports = { addToBlacklist, isBlacklisted };