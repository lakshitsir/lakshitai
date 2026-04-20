// api/ai.js

import { checkInputFirewall, aggressiveSanitize } from '../lib/security.js';
import { processAiPipeline } from '../lib/ai.js';
import { signResponseDynamic, sleep, generateTraceId } from '../lib/crypto.js';

export const config = { runtime: 'edge' };

const DEV_WATERMARKS = [
  "\n\n━━━━━━━━━━━━━━━━━━━━━━\n👨‍💻 ᴅᴇᴠᴇʟᴏᴘᴇʀ : @lakshitpatidar",
  "\n\n___\n*⚙️ Engineered by @lakshitpatidar*",
  "\n\n🚀 < 𝙳𝚎𝚟 : @𝚕𝚊𝚔𝚜𝚑𝚒𝚝𝚙𝚊𝚝𝚒𝚍𝚊𝚛 >",
  "\n\n🛡️ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 & 𝐒𝐞𝐜𝐮𝐫𝐞𝐝 𝐛𝐲 @𝐥𝐚𝐤𝐬𝐡𝐢𝐭𝐩𝐚𝐭𝐢𝐝𝐚𝐫"
];

function getRandomWatermark() {
  return DEV_WATERMARKS[Math.floor(Math.random() * DEV_WATERMARKS.length)];
}

export default async function handler(req) {
  const startTime = Date.now();
  const traceId = generateTraceId();

  // Allow OPTIONS method for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200 });
  }

  // 1. EXTRACT PROMPT FROM BOTH GET & POST
  let prompt = "";
  try {
    if (req.method === 'POST') {
      const body = await req.json();
      prompt = body.prompt || body.text || body.query || "";
    } else if (req.method === 'GET') {
      const url = new URL(req.url);
      prompt = url.searchParams.get('prompt') || url.searchParams.get('q') || "";
    }
  } catch (e) {
    return new Response(JSON.stringify({ status: "error", message: "Invalid Request Parsing" }), { status: 400 });
  }

  // 2. IF NO PROMPT (User just visited the URL in browser)
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === "") {
    return new Response(
      JSON.stringify({ 
        status: "active", 
        owner: "@lakshitpatidar",
        message: "System is online. Send a POST request with {'prompt': '...'} or use GET ?prompt=...",
        version: "V8_Infinity"
      }, null, 2), 
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  if (prompt.length > 4000) {
    return new Response(JSON.stringify({ status: "error", message: "Payload too large" }), { status: 400 });
  }

  try {
    let coreOutput = "";
    const firewallCheck = checkInputFirewall(prompt);

    if (firewallCheck.triggered) {
      await sleep(Math.floor(Math.random() * 500) + 200); // Confuse timing attacks
      coreOutput = firewallCheck.response;
    } else {
      const rawAiResponse = await processAiPipeline(prompt);
      coreOutput = aggressiveSanitize(rawAiResponse);
    }

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
          'X-Engine': 'Infinity-V8'
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", data: "Exception Handled." + getRandomWatermark() }), 
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
                     }
      
