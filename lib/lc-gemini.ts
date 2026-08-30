export async function askGemini(apiKey: string, questionTitle: string, userMessage: string): Promise<string> {
  const systemPrompt = `You are a concise coding interview assistant. The user is practicing LeetCode problems.
Current problem: "${questionTitle}".
Give hints and explain approaches. Do NOT give the full solution unless explicitly asked.
Keep responses short and mobile-friendly (under 200 words unless a code example is needed).`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      }),
    }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message ?? `Gemini error ${res.status}`)
  }

  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response from Gemini.'
}
