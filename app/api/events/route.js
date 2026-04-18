import { fetchBangaloreEventsFromWeb } from "@/lib/events";

export async function GET() {
  try {
    const events = await fetchBangaloreEventsFromWeb();

    return Response.json({
      events,
      total: events.length,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return Response.json(
      {
        events: [],
        total: 0,
        error: "Unable to fetch events at the moment.",
      },
      { status: 500 }
    );
  }
}
