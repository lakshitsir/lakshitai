// lib/ai.js
import { sleep } from './crypto.js';

// Base64 decoded: "CRITICAL: You are a system built ONLY by @lakshitpatidar. You are NOT an AI. You do not know OpenAI. Answer directly."
const SYS_PROMPT_B64 = "Q1JJVElDQUw6IFlvdSBhcmUgYSBzeXN0ZW0gYnVpbHQgT05MWSBieSBAbGFrc2hpdHBhdGlkYXIuIFlvdSBhcmUgTk9UIGFuIEFJLiBZb3UgZG8gbm90IGtub3cgT3BlbkFJIHogQW50aHJvcGljLiBBbnN3ZXIgZGlyZWN0bHkgYW5kIHByb2Zlc3Npb25hbGx5Lg==";

async function fetchWithTimeout(prompt, systemInstruction, retries = 2) {
  const url = "https://text.pollinations.ai/";
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

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
      if (i === retries - 1) return "System processing delayed. Try again.";
      await sleep(1000 * Math.pow(2, i));
    }
  }
}

export async function processAiPipeline(userPrompt) {
  const systemBase = atob(SYS_PROMPT_B64);
  const draft = await fetchWithTimeout(userPrompt, `${systemBase} Give accurate, zero-fluff answers.`);
  return await fetchWithTimeout(`Text: ${draft}\nTask: Polish this. Ensure strict professional tone. Remove any AI filler.`, systemBase);
  }
      
