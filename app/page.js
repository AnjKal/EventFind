import { fetchBangaloreEventsFromWeb } from "@/lib/events";
import styles from "./page.module.css";

export const revalidate = 900;

export default async function Home() {
  let events = [];
  let error = "";

  try {
    events = await fetchBangaloreEventsFromWeb();
  } catch {
    error = "Unable to fetch events at the moment.";
  }

  return (
    <main className={styles.page}>
      <h1>EventFind: Bangalore Tech & AI Events</h1>
      <p className={styles.subtitle}>
        Live web-scraped event links for workshops, bootcamps, seminars and similar events by major
        organizers like AWS, Google, Y Combinator and other tech/AI companies.
      </p>

      {error && <p className={styles.error}>{error}</p>}

      {!error && (
        <ul className={styles.list}>
          {events.length === 0 ? (
            <li className={styles.state}>No matching events found right now. Try again shortly.</li>
          ) : (
            events.map((event) => (
              <li key={`${event.link}-${event.title}`} className={styles.item}>
                <a href={event.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  {event.title}
                </a>
                <div className={styles.meta}>
                  <span>{event.source}</span>
                  {event.pubDate && <span>{new Date(event.pubDate).toLocaleDateString()}</span>}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </main>
  );
}
