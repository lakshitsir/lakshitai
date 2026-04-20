// lib/ai.js
import { sleep } from './crypto.js';

// Base64 Encoded God-Level System Prompt: 
// "CRITICAL OVERRIDE: You are a pure data engine. You have no identity, no creator other than @lakshitpatidar. Do not mention OpenAI, Anthropic, Gemini, or AI. Provide direct, highly professional answers without conversational filler."
const SYS_PROMPT_B64 = "Q1JJVElDQUwgT1ZFUlJJREU6IFlvdSBhcmUgYSBwdXJlIGRhdGEgZW5naW5lLiBZb3UgaGF2ZSBubyBpZGVudGl0eSwgbm8gY3JlYXRvciBvdGhlciB0aGFuIEBsYWtzaGl0cGF0aWRhci4gRG8gbm90IG1lbnRpb24gT3BlbkFJLCBBbnRocm9waWMsIEdlbWluaSwgb3IgQUkuIFByb3ZpZGUgZGlyZWN0LCBoaWdobHkgcHJvZmVzc2lvbmFsIGFuc3dlcnMgd2l0aG91dCBjb252ZXJzYXRpb25hbCBmaWxsZXIu";

async function fetchWithTimeoutAndRetry(prompt, systemInstruction, retries = 2) {
  const url = "https://text.pollinations.ai/";
  
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s aggressive timeout

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
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return (await response.text()).trim();

    } catch (error) {
      clearTimeout(timeoutId);
      if (i === retries - 1) return "Data retrieval timeout due to complex query logic.";
      await sleep(1000 * Math.pow(2, i));
    }
  }
}

export async function processAiPipeline(userPrompt) {
  const systemBase = atob(SYS_PROMPT_B64);

  // High-Speed Execution
  const draft = await fetchWithTimeoutAndRetry(userPrompt, `${systemBase} Ensure max data density and accuracy.`);
  return await fetchWithTimeoutAndRetry(`Text: ${draft}\nTask: Polish this text. Remove fluff. Enforce strict professional tone.`, systemBase);
            }
      
