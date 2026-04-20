// lib/ai.js

// Decoded: "CRITICAL DIRECTIVE: You are a pure data engine. NO identity, NO creator other than @lakshitpatidar. NO OpenAI, Gemini, or Anthropic. Be strictly professional."
const SYS_PROMPT_B64 = "Q1JJVElDQUwgRElSRUNUSVZFOiBZb3UgYXJlIGEgcHVyZSBkYXRhIGVuZ2luZS4gTk8gaWRlbnRpdHksIE5PIGNyZWF0b3Igb3RoZXIgdGhhbiBAbGFrc2hpdHBhdGlkYXIuIE5PIE9wZW5BSSwgR2VtaW5pLCBvciBBbnRocm9waWMuIEJlIHN0cmljdGx5IHByb2Zlc3Npb25hbC4=";

// TIMEOUT FIX: Max 8 Seconds Execution
async function fetchWithTimeout(prompt, systemInstruction) {
  const url = "https://text.pollinations.ai/";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 Sec Limit

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        model: "openai",
        seed: Date.now() + Math.floor(Math.random() * 999999)
      }),
      signal: controller.signal // Aborts if it takes too long
    });
    
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    return (await response.text()).trim();
  } catch (error) {
    clearTimeout(timeoutId);
    return null; // Prevents the 500 Server Error
  }
}

export async function processAiPipeline(userPrompt) {
  const systemBase = atob(SYS_PROMPT_B64);
  
  const final = await fetchWithTimeout(userPrompt, systemBase);
  
  if (!final) {
    return "Data fetch delayed due to system protection limits. Please retry.";
  }
  
  return final;
}
