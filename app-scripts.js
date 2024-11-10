const apiKey = "TaCléeAPI";
const searchEngineId = "yourSearchEngineId";

/**
 * Find the URL of a LinkedIn profile
 *
 * @param {string} query The person or company whose profile you want to find on LinkedIn
 * @param {boolean} company [OPTIONAL] Type TRUE if you're looking for a company profile. Default is FALSE
 * @param {number} index [OPTIONAL] Get a different result index. Default is 1. Write 0 to return all the results
 * @return if found, the hyperlink of the profile
 * @customfunction
 */
function LINKEDINPROFILE(query, company = false, index = 1) {
  const url = buildUrl(query);

  try {
    const response = UrlFetchApp.fetch(url);
    const res = JSON.parse(response.getContentText());

    if (!res.items || res.items.length === 0) {
      throw new Error("No results found.");
    }

    const results = res.items.map(e => e.formattedUrl);
    const filteredResults = filterResults(results, company);
    return getResults(filteredResults, index);

  } catch (err) {
    throw new Error(`Error fetching LinkedIn profile: ${err.message}`);
  }
}

/**
 * Build the URL for Google Custom Search API.
 * @param {string} query - Search query
 * @return {string} Complete URL with query parameters
 */
function buildUrl(query) {
  const params = new URLSearchParams({
    key: apiKey,
    cx: searchEngineId,
    q: query,
    num: 10
  });
  return `https://www.googleapis.com/customsearch/v1?${params}`;
}

/**
 * Filter results based on profile type.
 * @param {Array} results - Array of URLs from search results
 * @param {boolean} company - true for company profile, false for individual profile
 * @return {Array} Filtered array of URLs
 */
function filterResults(results, company) {
  const profilePath = company ? "/company/" : "/in/";
  return results.filter(url => url.includes(profilePath));
}

/**
 * Get a specific result or all results if index is 0.
 * @param {Array} data - Array of filtered URLs
 * @param {number} index - Result index
 * @return {string|Array} The selected result or all results
 */
function getResults(data, index) {
  if (index === 0) {
    return data.map((e, i) => `${i + 1}. ${e}`);
  } else if (index > 0 && index <= data.length) {
    return data[index - 1] || "Result not found at the specified index.";
  } else {
    throw new Error("Invalid index provided.");
  }
}
