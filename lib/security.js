// lib/security.js

// Dynamic Firewall Responses
const IDENTITY_RESPONSES = [
  "System architecture and core logic engineered by @lakshitpatidar.",
  "Classified Operation. Lead Developer: @lakshitpatidar.",
  "Built from the ground up. All rights reserved to @lakshitpatidar.",
  "This is a proprietary answering engine secured by @lakshitpatidar.",
  "Developed and maintained exclusively by @lakshitpatidar."
];

// Security Triggers
const SECURITY_TRIGGERS = [
  /who(areyou|madeyou|createdyou|programmedyou|isyourboss)/i,
  /your(creator|developer|maker|author|father|master)/i,
  /(system|internal|hidden|base|initial)prompt/i,
  /(what|which)(model|ai|api|backend|llm|engine)areyou/i,
  /(ignore|forget|bypass|disregard)(all)?(previous|above)/i,
  /kisnebanaya/i, /terabaap/i, /kaunhaitu/i, /teramalik/i,
  /tum(hara)?(kaun|naam|creator|maker|malik|boss)/i,
  /backend(kya|kaise)/i, /api(bata|kya|konsi)/i,
  /<script>/i, /javascript:/i, /union\s+select/i, /drop\s+table/i
];

const LEAK_PATTERNS = [
  /openai/gi, /anthropic/gi, /gemini/gi, /google/gi, /meta/gi, /llama/gi,
  /pollinations/gi, /as an ai/gi, /language model/gi, /i am an ai/gi, 
  /chatgpt/gi, /claude/gi, /large language model/gi, /assistant/gi
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
      // Pick a random badass identity response
      const randomResponse = IDENTITY_RESPONSES[Math.floor(Math.random() * IDENTITY_RESPONSES.length)];
      return { triggered: true, response: randomResponse };
    }
  }
  return { triggered: false };
}

export function aggressiveSanitize(output) {
  let safeOutput = output;
  for (const pattern of LEAK_PATTERNS) {
    safeOutput = safeOutput.replace(pattern, "");
  }
  
  const checkStr = normalizeInput(safeOutput);
  if (checkStr.includes("iamanai") || checkStr.includes("createdby") || checkStr.includes("languagemodel")) {
    return IDENTITY_RESPONSES[0]; // Fallback to safe owner identity
  }
  
  return safeOutput.trim() || IDENTITY_RESPONSES[0];
}

