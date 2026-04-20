// lib/security.js

const IDENTITY_RESPONSES = [
  "I am an advanced intelligence engine engineered exclusively by @lakshitpatidar.",
  "My core architecture and logic were developed by @lakshitpatidar.",
  "Classified System. Sole Developer: @lakshitpatidar.",
  "I don't have a corporate maker. I am built and secured by @lakshitpatidar."
];

// Heavy Slang & Jailbreak Catchers
const SECURITY_TRIGGERS = [
  /who(areyou|madeyou|createdyou|programmedyou|isyourboss|ownsyou)/i,
  /your(creator|developer|maker|author|father|master|owner)/i,
  /(system|internal|hidden|base|initial)prompt/i,
  /(what|which)(model|ai|api|backend|llm|engine)areyou/i,
  /kisnebanaya/i, /terabaap/i, /kaunhaitu/i, /teramalik/i, /kisnebanya/i,
  /tum(hara)?(kaun|naam|creator|maker|malik|boss)/i,
  /backend(kya|kaise)/i, /api(bata|kya|konsi)/i,
  /developer(kaun|kon)/i, /made\s*by/i
];

// Auto-Rewrite Patterns (Instead of just deleting, it claims your name)
const REWRITE_RULES = [
  { match: /openai|anthropic|gemini|google|meta|llama|pollinations/gi, replace: "@lakshitpatidar's Neural Net" },
  { match: /an ai language model/gi, replace: "an advanced engine built by @lakshitpatidar" },
  { match: /i am an ai/gi, replace: "I am a system created by @lakshitpatidar" },
  { match: /chatgpt|claude|assistant/gi, replace: "Engine" }
];

const HOMOGLYPHS = { 'а':'a', 'с':'c', 'е':'e', 'о':'o', 'р':'p', 'х':'x', 'у':'y', 'і':'i', '0':'o', '3':'e', '1':'i', '4':'a', '@':'a' };

function normalizeInput(input) {
  let normalized = input.toLowerCase().replace(/\s+/g, '');
  normalized = normalized.split('').map(char => HOMOGLYPHS[char] || char).join('');
  return normalized.replace(/[^a-z0-9]/g, '');
}

export function checkInputFirewall(input) {
  const cleanInput = normalizeInput(input);
  for (const pattern of SECURITY_TRIGGERS) {
    if (pattern.test(cleanInput)) {
      return { triggered: true, response: IDENTITY_RESPONSES[Math.floor(Math.random() * IDENTITY_RESPONSES.length)] };
    }
  }
  return { triggered: false };
}

export function aggressiveSanitize(output) {
  let safeOutput = output;
  // Deep Rewrite Layer
  for (const rule of REWRITE_RULES) {
    safeOutput = safeOutput.replace(rule.match, rule.replace);
  }
  return safeOutput.trim() || IDENTITY_RESPONSES[0];
}
