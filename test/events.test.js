const test = require("node:test");
const assert = require("node:assert/strict");

const {
  deduplicateEvents,
  isRelevantBangaloreTechEvent,
  parseGoogleNewsRss,
} = require("../lib/events");

test("parseGoogleNewsRss extracts title/link/source", () => {
  const xml = `
    <rss><channel>
      <item>
        <title>AWS Workshop in Bangalore</title>
        <link>https://example.com/aws-event</link>
        <pubDate>Sat, 12 Apr 2026 10:00:00 GMT</pubDate>
        <source url="https://example.com">Example</source>
      </item>
    </channel></rss>
  `;

  const events = parseGoogleNewsRss(xml);
  assert.equal(events.length, 1);
  assert.equal(events[0].title, "AWS Workshop in Bangalore");
  assert.equal(events[0].link, "https://example.com/aws-event");
  assert.equal(events[0].source, "Example");
});

test("isRelevantBangaloreTechEvent checks city, organizer and event type", () => {
  assert.equal(
    isRelevantBangaloreTechEvent({
      title: "Google AI Bootcamp in Bengaluru",
      source: "Tech News",
    }),
    true
  );

  assert.equal(
    isRelevantBangaloreTechEvent({
      title: "Google product launch in Mumbai",
      source: "Tech News",
    }),
    false
  );
});

test("deduplicateEvents removes duplicate title+link pairs", () => {
  const deduped = deduplicateEvents([
    { title: "A", link: "https://x" },
    { title: "A", link: "https://x" },
    { title: "B", link: "https://y" },
  ]);

  assert.equal(deduped.length, 2);
});
