// Utility functions for SoundCloud integration
// Uses the SoundCloud Widget API and oEmbed API (no authentication required)

/**
 * Validates if a URL is a valid SoundCloud track URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid SoundCloud URL
 */
export function isValidSoundCloudUrl(url) {
  if (!url || typeof url !== "string") return false;

  // Clean up the URL - remove whitespace
  url = url.trim();

  // SoundCloud track URL patterns
  // Matches both desktop and mobile URLs (m.soundcloud.com or soundcloud.app.goo.gl)
  const patterns = [
    /^https?:\/\/(www\.|m\.)?soundcloud\.com\/[\w-]+\/[\w-]+/,
    /^https?:\/\/(www\.|m\.)?soundcloud\.com\/[\w-]+\/sets\/[\w-]+/,
    /^https?:\/\/soundcloud\.app\.goo\.gl\/[\w]+/, // Mobile share links
    /^https?:\/\/on\.soundcloud\.com\/[\w]+/, // Short links
  ];

  return patterns.some((pattern) => pattern.test(url));
}

/**
 * Fetches track metadata from SoundCloud using their oEmbed endpoint
 * This is publicly accessible and doesn't require API credentials
 * @param {string} url - The SoundCloud track URL
 * @returns {Promise<Object>} - Track metadata
 */
export async function getSoundCloudTrackInfo(url) {
  try {
    if (!isValidSoundCloudUrl(url)) {
      throw new Error("Invalid SoundCloud URL");
    }

    // Use SoundCloud's public oEmbed API
    const oembedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`;

    const response = await fetch(oembedUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch track information from SoundCloud");
    }

    const data = await response.json();

    // Extract relevant information
    return {
      success: true,
      track: {
        title: data.title || "Unknown Track",
        author_name: data.author_name || "Unknown Artist",
        thumbnail_url: data.thumbnail_url || null,
        html: data.html || null, // Embed HTML
        soundcloud_url: url,
      },
    };
  } catch (error) {
    console.error("Error fetching SoundCloud track info:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch track information",
    };
  }
}

/**
 * Extracts the track title and artist from SoundCloud oEmbed data
 * SoundCloud typically formats titles as "Artist - Track" or just "Track"
 * @param {Object} trackInfo - The track info from getSoundCloudTrackInfo
 * @returns {Object} - Separated title and artist
 */
export function parseSoundCloudTrackData(trackInfo) {
  if (!trackInfo || !trackInfo.track) {
    return { title: "", artist: "" };
  }

  const { title, author_name } = trackInfo.track;

  // Try to split title if it contains " - "
  if (title && title.includes(" - ")) {
    const [artist, ...trackParts] = title.split(" - ");
    return {
      title: trackParts.join(" - ").trim(),
      artist: artist.trim(),
    };
  }

  // Try to split if it contains " by " (case insensitive)
  const byPattern = / by /i;
  if (title && byPattern.test(title)) {
    const parts = title.split(byPattern);
    return {
      title: parts[0].trim(),
      artist: parts[1]?.trim() || author_name || "Unknown Artist",
    };
  }

  // Otherwise use the title and author_name as-is
  return {
    title: title || "Unknown Track",
    artist: author_name || "Unknown Artist",
  };
}

/**
 * Creates a SoundCloud Widget iframe element
 * @param {string} url - The SoundCloud track URL
 * @param {Object} options - Widget options
 * @returns {string} - HTML string for the iframe
 */
export function createSoundCloudWidget(url, options = {}) {
  const {
    autoPlay = false,
    hideRelated = true,
    showComments = false,
    showUser = true,
    showReposts = false,
    visual = false,
    color = "E03FD8", // Your theme color
  } = options;

  const params = new URLSearchParams({
    url: url,
    auto_play: autoPlay,
    hide_related: hideRelated,
    show_comments: showComments,
    show_user: showUser,
    show_reposts: showReposts,
    visual: visual,
    color: color,
  });

  return `https://w.soundcloud.com/player/?${params.toString()}`;
}
