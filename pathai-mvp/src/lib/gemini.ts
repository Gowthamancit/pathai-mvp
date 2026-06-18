const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

export async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4000,
        thinkingConfig: {
          thinkingBudget: 0
        }
      }
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${error}`)
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

export async function callGeminiJSON<T>(prompt: string): Promise<T> {
  const fullPrompt = `${prompt}

IMPORTANT: Return ONLY valid JSON. No markdown, no backticks, no explanation. 
Just the raw JSON object.`

  const text = await callGemini(fullPrompt)
  
  // Strip any accidental markdown code blocks
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  
  try {
    return JSON.parse(cleaned) as T
  } catch (e) {
    throw new Error(`Gemini returned invalid JSON: ${cleaned}`)
  }
}
