// Small helpers shared by the admin editor and the storefront so a pasted
// link (file upload URL, YouTube watch link, Vimeo link, etc.) always ends up
// rendered as just the media itself — never the surrounding page/site chrome.

export function isDirectVideoUrl(url) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url || "");
}

export function isEmbeddableLink(url) {
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url || "");
}

// Converts any YouTube/Vimeo "watch" style link into its bare embed URL so an
// <iframe> shows only the player — not the full YouTube/Vimeo site around it.
export function toEmbedUrl(url) {
  if (!url) return url;

  const ytWatch = url.match(/[?&]v=([^&]+)/);
  const ytShort = url.match(/youtu\.be\/([^?&]+)/);
  const ytShorts = url.match(/youtube\.com\/shorts\/([^?&]+)/);
  const ytId = ytWatch?.[1] || ytShort?.[1] || ytShorts?.[1];
  if (ytId) return `https://www.youtube.com/embed/${ytId}`;
  if (/youtube\.com\/embed\//i.test(url)) return url;

  const vimeoId = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;

  return url;
}

// Adds https:// to a URL if the admin typed it bare (e.g. "instagram.com/x"),
// so links actually navigate instead of being treated as a relative in-site path.
export function normalizeExternalUrl(url) {
  if (!url || url === "#") return "#";
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return "#";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

// Turns whatever the admin pasted for "Lokasi peta" into an embeddable Maps
// iframe src: a real "Sematkan peta" embed URL is used as-is, anything else
// (a plain address, place name, or regular maps.google.com link) is treated
// as a search query — no API key required.
export function toMapEmbedSrc(input) {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/\/maps\/embed|output=embed/i.test(trimmed)) return trimmed;
  return `https://www.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`;
}
