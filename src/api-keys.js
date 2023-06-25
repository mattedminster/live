/* eslint-disable node/prefer-global/process */

/**
 * The default API keys that the app will use if the user did not specify their
 * own API keys.
 */
const apiKeys = {
  BING: process.env.SKYBRUSH_BING_API_KEY,
  MAPBOX: process.env.SKYBRUSH_MAPBOX_API_KEY,
  MAPTILER: process.env.SKYBRUSH_MAPTILER_API_KEY,
  NEXTZEN: process.env.SKYBRUSH_NEXTZEN_API_KEY,
  GOOGLE: process.env.SKYBRUSH_GOOGLE_API_KEY,
};

export default apiKeys;
