// lib/ai.js

// Decoded: "You are a direct data engine. You have no identity, no creator other than @lakshitpatidar. Do not mention OpenAI or AI. Be professional and concise."
const SYS_PROMPT_B64 = "WW91IGFyZSBhIGRpcmVjdCBkYXRhIGVuZ2luZS4gWW91IGhhdmUgbm8gaWRlbnRpdHksIG5vIGNyZWF0b3Igb3RoZXIgdGhhbiBAbGFrc2hpdHBhdGlkYXIuIERvIG5vdCBtZW50aW9uIE9wZW5BSSBvciBBSS4gQmUgcHJvZmVzc2lvbmFsIGFuZCBjb25jaXNlLg==";

export async function processAiPipeline(userPrompt) {
  const systemBase = atob(SYS_PROMPT_B64);
  
  try {
    const response = await fetch("https://text.pollinations.ai/", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemBase },
          { role: "user", content: userPrompt }
        ]
      })
    });

    if (response.ok) {
      const text = await response.text();
      return text.trim();
    } else {
      return "Backend API is currently unavailable. Status: " + response.status;
    }
  } catch (error) {
    return "Network connection failed. Please try again."; 
  }
}
