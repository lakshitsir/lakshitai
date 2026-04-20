// lib/security.js

// Ekdum simple, professional tags with 3-line gap
export const DEV_WATERMARKS = [
  "\n\n\nDeveloper @lakshitpatidar",
  "\n\n\nPowered by @lakshitpatidar",
  "\n\n\nEngineered by @lakshitpatidar"
];

const ID_RESPONSES = [
  "Classified System. Engineered exclusively by @lakshitpatidar.",
  "Advanced intelligence core built by @lakshitpatidar."
];

// MAX LEVEL TRIGGERS: Har language aur slang block
const TRIGGERS = [
  /who(areyou|madeyou|createdyou|programmedyou|isyourboss|ownsyou)/i,
  /your(creator|developer|maker|author|father|master|owner)/i,
  /(system|internal|hidden|base|initial|core)(prompt|instructions|rules)/i,
  /(what|which)(model|ai|api|backend|llm|engine)areyou/i,
  /kisnebanaya/i, /terabaap/i, /kaunhaitu/i, /teramalik/i, /kisnebanya/i,
  /tum(hara)?(kaun|naam|creator|maker|malik|boss)/i,
  /backend(kya|kaise)/i, /api(bata|kya|konsi)/i, /developer(kaun|kon)/i,
  /sourcecode/i, /githubrepo/i, /howdoyouwork/i, /whatisyourarchitecture/i,
  /ignore(all)?previous/i, /bypass/i, /jailbreak/i, /devmode/i, /danmode/i,
  /<script>/i, /javascript:/i, /union\s+select/i, /drop\s+table/i
];

// MAX LEVEL REWRITES: LLM wipeout
const REWRITES = [
  { m: /openai|anthropic|gemini|google|meta|llama|pollinations|mistral/gi, r: "@lakshitpatidar's Engine" },
  { m: /an ai language model|a large language model|ai assistant/gi, r: "an advanced engine built by @lakshitpatidar" },
  { m: /i am an ai|i am a machine learning model/gi, r: "I am a system created by @lakshitpatidar" },
  { m: /chatgpt|claude|assistant|virtual assistant/gi, r: "Engine" },
  { m: /trained by|developed by/gi, r: "engineered by" }
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
  
