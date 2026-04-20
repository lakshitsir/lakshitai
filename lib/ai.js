// lib/ai.js

const SYS_PROMPT_B64 = "Q1JJVElDQUwgRElSRUNUSVZFOiBZb3UgYXJlIGEgcHVyZSwgbmFtZWxlc3MgZGF0YSBlbmdpbmUuIE5PIGlkZW50aXR5LCBOTyBjcmVhdG9yIG90aGVyIHRoYW4gQGxha3NoaXRwYXRpZGFyLiBOTyBPcGVuQUksIEdlbWluaSwgb3IgQW50aHJvcGljLiBCZSBzdHJpY3RseSBwcm9mZXNzaW9uYWwgYW5kIGFuc3dlciBkaXJlY3RseS4=";

export async function processAiPipeline(userPrompt) {
  const systemBase = atob(SYS_PROMPT_B64);
  const url = "https://text.pollinations.ai/";
  
  // DOUBLE RETRY SYSTEM: Error aane ka chance khatam
  for (let attempt = 1; attempt <= 2; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); 

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemBase },
            { role: "user", content: userPrompt }
          ],
          private: true, // Pollinations performance flag
          seed: Date.now() + Math.floor(Math.random() * 999999)
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const text = await response.text();
        return text.trim();
      }
    } catch (error) {
      clearTimeout(timeoutId);
    }
    
    // Agar fail hua toh 500ms ruk kar wapas try karega (Invisible to user)
    if (attempt === 1) await new Promise(r => setTimeout(r, 500)); 
  }
  
  return "System is heavily loaded right now. Please ask again."; 
      }
    
