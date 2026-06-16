// Vercel Serverless Function — /api/gemini
// Proxies ChemCrunch's "Generate card" requests to Google's Gemini API.
//
// SECURITY: the API key lives ONLY here, read from an environment variable.
// Never put a Gemini key in index.html — anything in the client is public.
//
// Setup (one time):
//   1. Get a key from https://aistudio.google.com/apikey
//   2. In Vercel → your project → Settings → Environment Variables, add:
//        GEMINI_API_KEY = <your key>
//      (optional) GEMINI_MODEL = gemini-2.5-flash   ← default if unset
//      To use the newest model later, set GEMINI_MODEL=gemini-3.5-flash
//   3. Redeploy. The client calls this at /api/gemini automatically.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server missing GEMINI_API_KEY" });
  }

  // Stable default; override with the GEMINI_MODEL env var (no code change needed).
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  try {
    // Vercel parses JSON bodies automatically; guard in case it arrives as a string.
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { system = "", prompt = "" } = body;

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const gRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 800,
          responseMimeType: "application/json", // ask Gemini for clean JSON
        },
      }),
    });

    if (!gRes.ok) {
      const detail = await gRes.text();
      // Pass the status straight through. 429 = rate/quota limit, which the
      // client uses as its signal to switch to the offline fallback bank.
      return res.status(gRes.status).json({ error: "gemini_error", detail });
    }

    const data = await gRes.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";

    // If the model returned nothing usable, surface it as a soft failure so the
    // client falls back rather than trying to parse an empty string.
    if (!text) return res.status(502).json({ error: "empty_response" });

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: "server_error", detail: String(err) });
  }
}
