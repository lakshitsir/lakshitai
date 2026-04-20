// api/ai.js

import { signResponseDynamic, sleep, generateTraceId } from '../lib/crypto.js';
import { checkInputFirewall, aggressiveSanitize } from '../lib/security.js';
import { processAiPipeline } from '../lib/ai.js';

export const config = { runtime: 'edge' };

const DEV_WATERMARKS = [
  "\n\n━━━━━━━━━━━━━━━━━━━━━━\n👨‍💻 ᴅᴇᴠᴇʟᴏᴘᴇʀ : @ʟᴀᴋsʜɪᴛᴘᴀᴛɪᴅᴀʀ",
  "\n\n___\n*⚙️ Engineered by @lakshitpatidar*",
  "\n\n🚀 < 𝙳𝚎𝚟 : @𝚕𝚊𝚔𝚜𝚑𝚒𝚝𝚙𝚊𝚝𝚒𝚍𝚊𝚛 >",
  "\n\n🛡️ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 & 𝐒𝐞𝐜𝐮𝐫𝐞𝐝 𝐛𝐲 @𝐥𝐚𝐤𝐬𝐡𝐢𝐭𝐩𝐚𝐭𝐢𝐝𝐚𝐫"
];

export default async function handler(req) {
  try {
    const startTime = Date.now();
    const traceId = generateTraceId();

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    let prompt = "";
    const url = new URL(req.url);
    
    if (req.method === 'POST') {
      const textBody = await req.text();
      if (textBody) {
        try { 
          const b = JSON.parse(textBody);
          prompt = b.prompt || b.text || b.query || ""; 
        } 
        catch(e) { prompt = textBody; }
      }
    } else if (req.method === 'GET') {
      prompt = url.searchParams.get('prompt') || url.searchParams.get('q') || "";
    }

    if (!prompt || prompt.trim() === "") {
      return new Response(
        JSON.stringify({ 
          status: "active", 
          owner: "@lakshitpatidar",
          message: "V13 Turbo Online. Engine ready."
        }, null, 2), 
        { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    let coreOutput = "";
    const firewallCheck = checkInputFirewall(prompt);

    if (firewallCheck.triggered) {
      await sleep(400); // ⚡ Only lags hackers, legitimate users get 0 delay
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
        metadata: { trace_id: traceId, signature: signature, execution_ms: Date.now() - startTime }
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

  } catch (criticalError) {
    return new Response(
      JSON.stringify({ 
        status: "fatal_error", 
        owner: "@lakshitpatidar",
        debug_info: criticalError.message
      }, null, 2), 
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
                     }
