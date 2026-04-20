// api/ai.js

import { checkInputFirewall, aggressiveSanitize, sleep, DEV_WATERMARKS } from '../lib/security.js';
import { processAiPipeline } from '../lib/ai.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  // CORS Preflight
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
          prompt = textBody; // Fallback for raw text
        }
      }
    } else if (req.method === 'GET') {
      prompt = url.searchParams.get('prompt') || url.searchParams.get('q') || "";
    }
  } catch (error) {
    // Silent parsing fail
  }

  // Welcome / Empty Prompt screen
  if (!prompt || prompt.trim() === "") {
    return new Response(
      JSON.stringify({ 
        status: "success", 
        data: "System is Active. Send your query.\n\n\nDeveloper @lakshitpatidar"
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  try {
    let coreOutput = "";
    const firewallCheck = checkInputFirewall(prompt);

    if (firewallCheck.triggered) {
      await sleep(100); // Super fast 100ms block
      coreOutput = firewallCheck.response;
    } else {
      const rawAiResponse = await processAiPipeline(prompt);
      coreOutput = aggressiveSanitize(rawAiResponse);
    }

    // Attach Watermark
    const watermark = DEV_WATERMARKS[Math.floor(Math.random() * DEV_WATERMARKS.length)];
    const finalOutputWithTag = coreOutput + watermark;

    // Pure Clean JSON Return
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
        data: "System encountered an unexpected exception.\n\n\nDeveloper @lakshitpatidar"
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
        }
    
