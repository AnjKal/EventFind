const ORGANIZER_KEYWORDS = [
  "aws",
  "amazon web services",
  "google",
  "y combinator",
  "microsoft",
  "openai",
  "meta",
  "nvidia",
  "anthropic",
];

const EVENT_TYPE_KEYWORDS = ["workshop", "bootcamp", "seminar", "event"];
const SEARCH_QUERIES = [
  "Bangalore AWS workshop",
  "Bangalore Google seminar",
  "Bangalore Y Combinator bootcamp",
  "Bangalore AI workshop",
  "Bangalore tech event",
];

function normalize(text = "") {
  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

function extractTagValue(itemXml, tagName) {
  const match = itemXml.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? match[1].trim() : "";
}

function parseGoogleNewsRss(xmlText = "") {
  const itemBlocks = xmlText.match(/<item>[\s\S]*?<\/item>/gi) || [];

  return itemBlocks
    .map((itemXml) => {
      const title = extractTagValue(itemXml, "title");
      const link = extractTagValue(itemXml, "link");
      const pubDate = extractTagValue(itemXml, "pubDate");
      const source = extractTagValue(itemXml, "source") || "Unknown Source";

      return {
        title,
        link,
        pubDate,
        source,
      };
    })
    .filter((item) => item.title && item.link);
}

function isRelevantBangaloreTechEvent(event) {
  const combined = normalize(`${event.title} ${event.source}`);

  const hasBangalore = combined.includes("bangalore") || combined.includes("bengaluru");
  const hasOrganizer = ORGANIZER_KEYWORDS.some((keyword) => combined.includes(keyword));
  const hasEventType = EVENT_TYPE_KEYWORDS.some((keyword) => combined.includes(keyword));

  return hasBangalore && hasOrganizer && hasEventType;
}

function deduplicateEvents(events) {
  const seen = new Set();
  return events.filter((event) => {
    const key = `${event.title}|${event.link}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchGoogleNewsForQuery(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch feed for query: ${query}`);
  }

  const xmlText = await response.text();
  return parseGoogleNewsRss(xmlText);
}

async function fetchBangaloreEventsFromWeb() {
  const allResults = await Promise.allSettled(SEARCH_QUERIES.map(fetchGoogleNewsForQuery));

  const merged = allResults
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value)
    .filter(isRelevantBangaloreTechEvent);

  return deduplicateEvents(merged).slice(0, 30);
}

module.exports = {
  ORGANIZER_KEYWORDS,
  EVENT_TYPE_KEYWORDS,
  parseGoogleNewsRss,
  isRelevantBangaloreTechEvent,
  deduplicateEvents,
  fetchBangaloreEventsFromWeb,
};
