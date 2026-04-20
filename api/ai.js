// api/ai.js

import { checkInputFirewall, aggressiveSanitize, sleep, DEV_WATERMARKS } from '../lib/security.js';
import { processAiPipeline } from '../lib/ai.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  let prompt = "";
  try {
    const url = new URL(req.url);
    if (req.method === 'POST') {
      const textBody = await req.text();
      if (textBody) {
        try { 
          const b = JSON.parse(textBody);
          prompt = b.prompt || b.text || b.query || ""; 
        } catch(e) { 
          prompt = textBody; 
        }
      }
    } else if (req.method === 'GET') {
      prompt = url.searchParams.get('prompt') || url.searchParams.get('q') || "";
    }
  } catch (error) {
    // Silent parsing fail
  }

  if (!prompt || prompt.trim() === "") {
    return new Response(
      JSON.stringify({ 
        status: "success", 
        data: "System is Active. Send your query.\n\n---\nDeveloper: @lakshitpatidar"
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  try {
    let coreOutput = "";
    const firewallCheck = checkInputFirewall(prompt);

    if (firewallCheck.triggered) {
      await sleep(150); // Minimal delay
      coreOutput = firewallCheck.response;
    } else {
      const rawAiResponse = await processAiPipeline(prompt);
      coreOutput = aggressiveSanitize(rawAiResponse);
    }

    const watermark = DEV_WATERMARKS[Math.floor(Math.random() * DEV_WATERMARKS.length)];
    const finalOutputWithTag = coreOutput + watermark;

    return new Response(
      JSON.stringify({
        status: "success",
        data: finalOutputWithTag
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

  } catch (criticalError) {
    return new Response(
      JSON.stringify({ 
        status: "error", 
        data: "System encountered an unexpected exception.\n\n---\nDeveloper: @lakshitpatidar"
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
  
