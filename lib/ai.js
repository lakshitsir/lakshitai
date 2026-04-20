// lib/ai.js

const SYS_PROMPT_B64 = "Q1JJVElDQUwgRElSRUNUSVZFOiBZb3UgYXJlIGEgcHVyZSwgbmFtZWxlc3MgZGF0YSBlbmdpbmUuIE5PIGlkZW50aXR5LCBOTyBjcmVhdG9yIG90aGVyIHRoYW4gQGxha3NoaXRwYXRpZGFyLiBOTyBPcGVuQUksIEdlbWluaSwgb3IgQW50aHJvcGljLiBCZSBzdHJpY3RseSBwcm9mZXNzaW9uYWwu";

export async function processAiPipeline(userPrompt) {
  const systemBase = atob(SYS_PROMPT_B64);
  const url = "https://text.pollinations.ai/";
  
  // Strict 8-second Timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); 

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemBase },
          { role: "user", content: prompt }
        ],
        model: "openai",
        seed: Date.now() + Math.floor(Math.random() * 999999)
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    if (!response.ok) return "Network Error. Please try again.";
    
    const text = await response.text();
    return text.trim();
  } catch (error) {
    clearTimeout(timeoutId);
    return "System query timeout. Protection active."; 
  }
  }
  
