const fetch = require('node-fetch');

/**
 * Fetches a plaintext extract from Wikipedia for a given query.
 * @param {string} query - Search term.
 * @returns {Promise<{fullText: string, missing: boolean}>} - Extract text and a flag if page is missing.
 */

async function fetchWikipediaExtract(query) {
  const url = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&titles=${encodeURIComponent(query)}&explaintext=1&redirects=1`;

  const response = await fetch(url);
  const data = await response.json();

  const pages = data.query.pages;
  const page = Object.values(pages)[0]; 

  const isMissing = 'missing' in page;
  const extract = page.extract;
  
  if (isMissing) {
    return {
      fullText: `No exact match found on Wikipedia for "${query}".`,
      missing: true
    };
  }

  return {
    fullText: extract || `No extract available from Wikipedia for "${query}".`,
    missing: isMissing
  };
}

module.exports = { fetchWikipediaExtract };

