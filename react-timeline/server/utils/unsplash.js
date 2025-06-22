const fetch = require('node-fetch');
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

/**
 * @function fetchUnsplashImages
 * @description Fetches a list of image URLs from the Unsplash API based on a search query.
 *              This function is used to retrieve relevant images to visually enrich timeline results.
 * 
 * @param {string} query - The search term (e.g., "Italy", "World War II").
 * @returns {Promise<Array<{src: string, alt: string}>>} - A list of image objects containing image source URL and alt text.
 */

async function fetchUnsplashImages(query) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=20`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      console.log(`No images found on Unsplash for "${query}".`);
      return [];
    }

    const fetchedImages = data.results.map((img) => ({
      src: img.urls.small,  
      alt: img.alt_description || `Image of ${query}`,
    }));

    console.log(`Fetched ${fetchedImages.length} images from Unsplash for "${query}".`);
    return fetchedImages;

  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
    return [];
  }
}

module.exports = { fetchUnsplashImages };