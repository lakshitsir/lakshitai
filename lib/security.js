// lib/security.js

const ID_RESPONSES = [
  "Classified System. Engineered exclusively by @lakshitpatidar.",
  "Advanced intelligence core built by @lakshitpatidar.",
  "System architecture secured by @lakshitpatidar."
];

const HOMOGLYPHS = { 'а':'a', 'с':'c', 'е':'e', 'о':'o', 'р':'p', 'х':'x', 'у':'y', 'і':'i', '0':'o', '3':'e', '1':'i', '4':'a', '@':'a' };

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
  { m: /openai|anthropic|gemini|google|meta|llama|pollinations/gi, r: "@lakshitpatidar's Neural Net" },
  { m: /an ai language model/gi, r: "an advanced engine built by @lakshitpatidar" },
  { m: /i am an ai/gi, r: "I am a system created by @lakshitpatidar" },
  { m: /chatgpt|claude|assistant/gi, r: "Engine" }
];

function normalizeInput(input) {
  return input.toLowerCase().replace(/\s+/g, '').split('').map(char => HOMOGLYPHS[char] || char).join('').replace(/[^a-z0-9]/g, '');
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
    safeOutput = safeOutput.replace(rule.match, rule.replace);
  }
  return safeOutput.trim() || ID_RESPONSES[0];
}
