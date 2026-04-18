# EventFind

EventFind is a Next.js web app that scrapes the web for Bangalore-based tech and AI events and lists source links on a webpage.

## What it finds

- Workshops, bootcamps, seminars, and similar events
- Bangalore/Bengaluru focused results
- Events linked to major organizers such as AWS, Google, Y Combinator, and other large tech/AI companies

## How it works

- Backend API route: `/api/events`
- Scrapes Google News RSS web search results for curated Bangalore event queries
- Filters events by city + organizer + event type keywords
- Frontend page shows a clickable list of source links

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.
