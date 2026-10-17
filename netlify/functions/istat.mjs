const ISTAT_ROOT = "https://esploradati.istat.it/SDMXWS/rest/v1";
const CACHE_SECONDS = 900;
const allowedStructures = new Set(["dataflow", "datastructure", "codelist"]);

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

export default async (request) => {
  if (request.method !== "GET") {
    return json({ error: "Sono ammesse solo richieste di lettura." }, 405, { Allow: "GET" });
  }

  const input = new URL(request.url);
  const structure = (input.searchParams.get("structure") || "dataflow").toLowerCase();
  const agency = input.searchParams.get("agency") || "ALL";
  const resource = input.searchParams.get("resource") || "ALL";
  const version = input.searchParams.get("version") || "latest";
  const identifier = /^[A-Za-z0-9_.-]{1,100}$/;
  if (!allowedStructures.has(structure) || !identifier.test(agency) || !identifier.test(resource) || !identifier.test(version)) {
    return json({ error: "Richiesta non valida." }, 400);
  }

  const upstream = new URL(ISTAT_ROOT + "/" + structure + "/" + encodeURIComponent(agency) + "/" + encodeURIComponent(resource) + "/" + encodeURIComponent(version));
  const detail = input.searchParams.get("detail");
  if (detail && ["allstubs", "referencepartial", "full"].includes(detail)) upstream.searchParams.set("detail", detail);

  try {
    const response = await fetch(upstream, {
      headers: { Accept: "application/vnd.sdmx.structure+json;version=2.0, application/json;q=0.8" },
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) {
      return json({ error: "ISTAT non ha completato la richiesta.", upstreamStatus: response.status }, response.status === 429 ? 429 : 502, { "Cache-Control": "no-store" });
    }
    const body = await response.text();
    return new Response(body, {
      status: 200,
      headers: {
        "content-type": response.headers.get("content-type") || "application/json",
        "Netlify-CDN-Cache-Control": "public, durable, max-age=" + CACHE_SECONDS + ", stale-while-revalidate=86400",
        "Cache-Control": "public, max-age=0, s-maxage=" + CACHE_SECONDS + ", stale-while-revalidate=86400",
      },
    });
  } catch {
    return json({ error: "ISTAT non è raggiungibile al momento. Riprova più tardi." }, 502, { "Cache-Control": "no-store" });
  }
};

export const config = {
  path: "/api/istat",
  rateLimit: { windowLimit: 4, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
