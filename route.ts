import OpenAI from 'openai';
import {NextResponse} from 'next/server';

const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

function extractJson(text:string){
 const cleaned=text.trim().replace(/^```(?:json)?/i,'').replace(/```$/,'').trim();
 return JSON.parse(cleaned);
}

export async function POST(req:Request){
 try{
  if(!process.env.OPENAI_API_KEY) return NextResponse.json({error:'Missing OPENAI_API_KEY on the server.'},{status:500});
  const {character,setting,idea,previous}=await req.json();
  if(!character||!setting) return NextResponse.json({error:'Character and setting are required.'},{status:400});
  const previousContext=previous?`\nPrevious chapter title: ${previous.title}\nPrevious chapter text: ${previous.text}\nPrevious choices: ${previous.choices.join(' | ')}\nPrevious story history count: ${previous.history?.length||1}`:'';
  const response=await client.responses.create({
   model:process.env.OPENAI_TEXT_MODEL||'gpt-5.6',
   instructions:`You are the story editor for Tiny Worlds, a premium illustrated storybook for all ages. Write in vivid, warm prose. Preserve the exact character identity and visual traits implied by the character description across every chapter. Continue naturally from prior context. If the user supplies an idea, treat it as the next plot beat, not as a replacement for the character or setting. Return ONLY valid JSON with exactly these keys: title (string), text (string, 2-4 short paragraphs), choices (array of exactly 3 strings, each a distinct concrete next action), image_prompt (string). The image_prompt must describe one cinematic storybook illustration of the current scene and explicitly preserve the same character appearance, clothing, proportions, and visual identity from prior chapters when known. Do not include text, logos, UI, captions, speech bubbles, or watermarks in the image.`,
   input:`Character: ${character}\nSetting: ${setting}\nUser's next idea: ${idea||'(none — create the opening)'}${previousContext}`,
   max_output_tokens:1000
  });
  const story=extractJson(response.output_text);
  const imageResponse=await client.responses.create({
   model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-2',
   input:`Create a polished illustrated storybook scene. ${story.image_prompt}\nVisual continuity is critical: the main character is ${character}; preserve the same character appearance across scenes. Setting: ${setting}. Painterly editorial children's-book illustration, rich texture, cinematic composition, warm atmospheric light, expressive but natural character pose. No text, letters, logos, UI, borders, speech bubbles, or watermark.`,
   tools:[{type:'image_generation',size:'1024x1024',quality:'medium'} as any],
   tool_choice:'required' as any,
  });
  const call=(imageResponse.output as any[]).find(x=>x.type==='image_generation_call');
  if(!call?.result) throw new Error('Image generation did not return an image.');
  return NextResponse.json({...story,image:`data:image/png;base64,${call.result}`,character,setting,history:[...(previous?.history||[]),story.title]});
 }catch(err){console.error(err);return NextResponse.json({error:err instanceof Error?err.message:'Unexpected server error.'},{status:500})}
}
