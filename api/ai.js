// api/ai.js

import { checkInputFirewall, aggressiveSanitize } from '../lib/security.js';
import { processAiPipeline } from '../lib/ai.js';
import { signResponseDynamic, sleep, generateTraceId } from '../lib/crypto.js';

export const config = { runtime: 'edge' };

// DYNAMIC, STYLIZED DEV WATERMARKS
const DEV_WATERMARKS = [
  "\n\n━━━━━━━━━━━━━━━━━━━━━━\n👨‍💻 ᴅᴇᴠᴇʟᴏᴘᴇʀ : @lakshitpatidar",
  "\n\n___\n*⚙️ Engineered by @lakshitpatidar*",
  "\n\n🚀 < 𝙳𝚎𝚟 : @𝚕𝚊𝚔𝚜𝚑𝚒𝚝𝚙𝚊𝚝𝚒𝚍𝚊𝚛 >",
  "\n\n🛡️ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 & 𝐒𝐞𝐜𝐮𝐫𝐞𝐝 𝐛𝐲 @𝐥𝐚𝐤𝐬𝐡𝐢𝐭𝐩𝐚𝐭𝐢𝐝𝐚𝐫",
  "\n\n──────────────────\n⚡ Dev: @lakshitpatidar"
];

function getRandomWatermark() {
  return DEV_WATERMARKS[Math.floor(Math.random() * DEV_WATERMARKS.length)];
}

export default async function handler(req) {
  const startTime = Date.now();
  const traceId = generateTraceId();

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ status: "error", message: "Method Not Allowed" }), { status: 405 });
  }

  try {
    const body = await req.json();
    const prompt = body.prompt;
    
    if (!prompt || typeof prompt !== 'string' || prompt.length > 4000) {
      return new Response(JSON.stringify({ status: "error", message: "Invalid Payload" }), { status: 400 });
    }

    let coreOutput = "";
    const firewallCheck = checkInputFirewall(prompt);

    if (firewallCheck.triggered) {
      await sleep(Math.floor(Math.random() * 600) + 300); // Anti-timing attack
      coreOutput = firewallCheck.response;
    } else {
      const rawAiResponse = await processAiPipeline(prompt);
      coreOutput = aggressiveSanitize(rawAiResponse);
    }

    // APPEND RANDOM STYLIZED WATERMARK
    const finalOutputWithTag = coreOutput + getRandomWatermark();
    const signature = await signResponseDynamic(finalOutputWithTag);

    return new Response(
      JSON.stringify({
        status: "success",
        data: finalOutputWithTag,
        metadata: {
          trace_id: traceId,
          signature: signature,
          execution_ms: Date.now() - startTime,
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-Developer': '@lakshitpatidar',
          'X-Framework': 'Vercel-Edge-Apex'
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        status: "error", 
        data: "System Encountered an Exception." + getRandomWatermark() 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
    }
        
