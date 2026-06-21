type AssetBinding = {
  fetch(request: Request): Promise<Response>;
};

type Env = {
  ASSETS: AssetBinding;
  CALENDLY_API_TOKEN?: string;
  CALENDLY_EVENT_TYPE_URI?: string;
};

type CalendlyAvailableTime = {
  scheduling_url?: string;
  start_time?: string;
  status?: string;
};

type CalendlyAvailableTimesResponse = {
  collection?: CalendlyAvailableTime[];
};

type AvailabilitySlot = {
  label: string;
  schedulingUrl: string;
};

const CALENDLY_AVAILABLE_TIMES_URL = "https://api.calendly.com/event_type_available_times";
const MAX_SLOTS = 3;
const START_BUFFER_MS = 5 * 60 * 1000;
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const json = (body: unknown, init: ResponseInit = {}, cacheSeconds = 300): Response =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": cacheSeconds > 0 ? `public, max-age=${cacheSeconds}` : "no-store",
      ...init.headers,
    },
  });

const formatSlot = (startTime: string): string => {
  const date = new Date(startTime);
  const parts = new Intl.DateTimeFormat("en-NZ", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Pacific/Auckland",
  }).formatToParts(date);

  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const hour = parts.find((part) => part.type === "hour")?.value ?? "";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "";
  const dayPeriod = parts.find((part) => part.type === "dayPeriod")?.value.toLowerCase() ?? "";

  return `${weekday} ${hour}:${minute}${dayPeriod}`;
};

const isAvailableTime = (slot: CalendlyAvailableTime): slot is Required<CalendlyAvailableTime> => {
  return slot.status === "available" && Boolean(slot.start_time) && Boolean(slot.scheduling_url);
};

const getAvailability = async (env: Env): Promise<Response> => {
  if (!env.CALENDLY_API_TOKEN || !env.CALENDLY_EVENT_TYPE_URI) {
    console.warn("Calendly availability unavailable: missing Worker binding", {
      hasApiToken: Boolean(env.CALENDLY_API_TOKEN),
      hasEventTypeUri: Boolean(env.CALENDLY_EVENT_TYPE_URI),
    });
    return json({ slots: [] }, { status: 503 }, 0);
  }

  const start = new Date(Date.now() + START_BUFFER_MS);
  const end = new Date(start.getTime() + ONE_WEEK_MS);
  const url = new URL(CALENDLY_AVAILABLE_TIMES_URL);
  url.searchParams.set("event_type", env.CALENDLY_EVENT_TYPE_URI);
  url.searchParams.set("start_time", start.toISOString());
  url.searchParams.set("end_time", end.toISOString());

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.CALENDLY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    console.warn("Calendly availability request failed", {
      status: response.status,
      statusText: response.statusText,
      body: body.slice(0, 500),
    });
    return json({ slots: [] }, { status: 502 }, 0);
  }

  const data = (await response.json()) as CalendlyAvailableTimesResponse;
  const slots: AvailabilitySlot[] = (Array.isArray(data.collection) ? data.collection : [])
    .filter(isAvailableTime)
    .slice(0, MAX_SLOTS)
    .map((slot) => ({
      label: formatSlot(slot.start_time),
      schedulingUrl: slot.scheduling_url,
    }));

  return json({ slots });
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/availability") {
      try {
        return await getAvailability(env);
      } catch (error) {
        console.error("Calendly availability request errored", {
          message: error instanceof Error ? error.message : String(error),
        });
        return json({ slots: [] }, { status: 500 }, 0);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
