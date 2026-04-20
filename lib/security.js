// lib/security.js

export const DEV_WATERMARKS = [
  "\n\n---\nDeveloper: @lakshitpatidar",
  "\n\n---\nPowered by @lakshitpatidar",
  "\n\n---\nEngineered by @lakshitpatidar"
];

const ID_RESPONSES = [
  "Classified System. Engineered exclusively by @lakshitpatidar.",
  "Advanced intelligence core built by @lakshitpatidar."
];

const TRIGGERS = [
  /who(areyou|madeyou|createdyou|programmedyou|isyourboss|ownsyou)/i,
  /your(creator|developer|maker|author|father|master|owner)/i,
  /(system|internal|hidden|base|initial)prompt/i,
  /(what|which)(model|ai|api|backend|llm|engine)areyou/i,
  /kisnebanaya/i, /terabaap/i, /kaunhaitu/i, /teramalik/i, /kisnebanya/i,
  /tum(hara)?(kaun|naam|creator|maker|malik|boss)/i,
  /backend(kya|kaise)/i, /api(bata|kya|konsi)/i, /developer(kaun|kon)/i,
  /<script>/i, /javascript:/i, /union\s+select/i, /drop\s+table/i
];

const REWRITES = [
  { m: /openai|anthropic|gemini|google|meta|llama|pollinations/gi, r: "@lakshitpatidar's Engine" },
  { m: /an ai language model/gi, r: "an advanced engine built by @lakshitpatidar" },
  { m: /i am an ai/gi, r: "I am a system created by @lakshitpatidar" },
  { m: /chatgpt|claude|assistant/gi, r: "Engine" }
];

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function normalizeInput(input) {
  return input.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
}

export function checkInputFirewall(input) {
  const cleanInput = normalizeInput(input);
  for (const pattern of TRIGGERS) {
    if (pattern.test(cleanInput)) {
      return { triggered: true, response: ID_RESPONSES[Math.floor(Math.random() * ID_RESPONSES.length)] };
    }
  }
  return { triggered: false };
}

export function aggressiveSanitize(output) {
  let safeOutput = output;
  for (const rule of REWRITES) {
    safeOutput = safeOutput.replace(rule.m, rule.r);
  }
  return safeOutput.trim() || ID_RESPONSES[0];
}
