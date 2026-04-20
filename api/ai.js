// api/ai.js

import { signResponseDynamic, sleep, generateTraceId } from '../lib/crypto.js';
import { checkInputFirewall, aggressiveSanitize } from '../lib/security.js';
import { processAiPipeline } from '../lib/ai.js';

export const config = { runtime: 'edge' };

// TERA DYNAMIC DEVELOPER WATERMARK
const DEV_WATERMARKS = [
  "\n\n━━━━━━━━━━━━━━━━━━━━━━\n👨‍💻 ᴅᴇᴠᴇʟᴏᴘᴇʀ : @lakshitpatidar",
  "\n\n___\n*⚙️ Engineered by @lakshitpatidar*",
  "\n\n🚀 < 𝙳𝚎𝚟 : @𝚕𝚊𝚔𝚜𝚑𝚒𝚝𝚙𝚊𝚝𝚒𝚍𝚊𝚛 >",
  "\n\n🛡️ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 & 𝐒𝐞𝐜𝐮𝐫𝐞𝐝 𝐛𝐲 @𝐥𝐚𝐤𝐬𝐡𝐢𝐭𝐩𝐚𝐭𝐢𝐝𝐚𝐫"
];

export default async function handler(req) {
  const startTime = Date.now();
  const traceId = generateTraceId();

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  // CRASH FIX: Safe Parsing
  let prompt = "";
  try {
    const url = new URL(req.url);
    if (req.method === 'POST') {
      const textBody = await req.text(); // Pehle text read karega taaki JSON break na ho
      if (textBody) {
        const body = JSON.parse(textBody);
        prompt = body.prompt || body.text || body.query || "";
      }
    } else if (req.method === 'GET') {
      prompt = url.searchParams.get('prompt') || url.searchParams.get('q') || "";
    }
  } catch (e) {
    // Silent fail if invalid data is sent
  }

  if (!prompt || prompt.trim() === "") {
    return new Response(
      JSON.stringify({ 
        status: "active", 
        owner: "@lakshitpatidar",
        message: "System Online. Use POST with {'prompt':'...'} or GET ?prompt=..."
      }, null, 2), 
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  try {
    let coreOutput = "";
    const firewallCheck = checkInputFirewall(prompt);

    if (firewallCheck.triggered) {
      await sleep(Math.floor(Math.random() * 400) + 200);
      coreOutput = firewallCheck.response;
    } else {
      const rawAiResponse = await processAiPipeline(prompt);
      coreOutput = aggressiveSanitize(rawAiResponse);
    }

    const watermark = DEV_WATERMARKS[Math.floor(Math.random() * DEV_WATERMARKS.length)];
    const finalOutputWithTag = coreOutput + watermark;
    const signature = await signResponseDynamic(finalOutputWithTag);

    return new Response(
      JSON.stringify({
        status: "success",
        data: finalOutputWithTag,
        metadata: { trace_id: traceId, signature, execution_ms: Date.now() - startTime }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-Developer': '@lakshitpatidar'
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        status: "error", 
        data: "Engine intercepted an anomaly.\n\n👨‍💻 ᴅᴇᴠᴇʟᴏᴘᴇʀ : @ʟᴀᴋsʜɪᴛᴘᴀᴛɪᴅᴀʀ" 
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } } 
    );
  }
      }
    
