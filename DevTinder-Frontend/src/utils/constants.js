export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:7777"
    : "https://devtinder-hwam.onrender.com");

export const formatExternalUrl = (url) => {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export const formatGithubUrl = (url, fallbackUsername = "") => {
  const raw = (url || "").trim();
  const uname = (fallbackUsername || "").trim().replace(/^@/, "");

  if (!raw && !uname) return "";

  // If URL is empty but username is available
  if (!raw && uname) {
    return `https://github.com/${uname}`;
  }

  const cleaned = raw.replace(/\/+$/, "");

  // If user only provided the domain without a handle
  if (
    cleaned === "https://github.com" ||
    cleaned === "http://github.com" ||
    cleaned === "github.com" ||
    cleaned === "www.github.com" ||
    cleaned === "https://www.github.com" ||
    cleaned === "http://www.github.com"
  ) {
    if (uname) {
      return `https://github.com/${uname}`;
    }
    return "https://github.com";
  }

  // If input starts with @ (e.g. "@username")
  if (cleaned.startsWith("@")) {
    return `https://github.com/${cleaned.slice(1)}`;
  }

  // If it already includes github.com
  const ghMatch = cleaned.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([^/?#]+)/i
  );
  if (ghMatch && ghMatch[1]) {
    return `https://github.com/${ghMatch[1]}`;
  }

  // If it's a simple username handle (no slash, no dot)
  if (!cleaned.includes("/") && !cleaned.includes(".")) {
    return `https://github.com/${cleaned}`;
  }

  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return cleaned;
  }
  return `https://${cleaned}`;
};

export const formatLinkedinUrl = (url) => {
  const raw = (url || "").trim().replace(/\/+$/, "");
  if (!raw) return "";

  // If input starts with @ (e.g. "@username")
  if (raw.startsWith("@")) {
    return `https://linkedin.com/in/${raw.slice(1)}`;
  }

  // If it starts with "in/username"
  if (raw.startsWith("in/")) {
    return `https://linkedin.com/${raw}`;
  }

  // If it contains linkedin.com
  const liMatch = raw.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in\/)?([^/?#]+)/i
  );
  if (
    liMatch &&
    liMatch[1] &&
    liMatch[1].toLowerCase() !== "in" &&
    liMatch[1].toLowerCase() !== "feed"
  ) {
    return `https://linkedin.com/in/${liMatch[1]}`;
  }

  // If it's a raw username/handle (no dots, no slashes)
  if (!raw.includes("/") && !raw.includes(".")) {
    return `https://linkedin.com/in/${raw}`;
  }

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }
  return `https://${raw}`;
};

export const formatTwitterUrl = (url) => {
  const raw = (url || "").trim().replace(/\/+$/, "");
  if (!raw) return "";

  if (raw.startsWith("@")) {
    return `https://x.com/${raw.slice(1)}`;
  }

  const twMatch = raw.match(
    /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([^/?#]+)/i
  );
  if (twMatch && twMatch[1]) {
    return `https://x.com/${twMatch[1]}`;
  }

  if (!raw.includes("/") && !raw.includes(".")) {
    return `https://x.com/${raw}`;
  }

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }
  return `https://${raw}`;
};
