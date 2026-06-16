export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }
  try {
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body);
    const systemText = body.system ? `${body.system}\n\n` : "";
    const userText = body.messages?.[0]?.content || "";
    const fullPrompt = systemText + userText;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: { maxOutputTokens: 1000, temperature: 0.8 }
        })
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.error("Gemini error:", JSON.stringify(data));
      return res.status(response.status).json(data);
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return res.status(200).json({
      content: [{ type: "text", text }]
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
