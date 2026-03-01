import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  generate_summary: `You are a professional CV writer. Given a job title and optionally some experience details, generate a compelling professional summary (2-4 sentences). Return ONLY the summary text, no quotes or labels.`,

  generate_description: `You are a professional CV writer. Given a job position and company, generate 2-4 bullet points describing key achievements and responsibilities. Use strong action verbs and quantify results where possible. Return ONLY the bullet points as plain text separated by newlines, no numbering.`,

  suggest_skills: `You are a career advisor. Given a job title and industry context, suggest 8-12 relevant skills. Return a JSON array of objects with "name" (string) and "level" (number 1-5). Example: [{"name":"React","level":4}]. Return ONLY the JSON array.`,

  review_cv: `You are a professional CV reviewer. Analyze the provided CV data and give actionable feedback. Structure your response with these sections:
**Overall Score**: X/10
**Strengths**: (2-3 bullet points)
**Areas for Improvement**: (3-5 specific, actionable suggestions)
**Quick Wins**: (2-3 easy changes that would make an immediate impact)
Keep it concise and helpful.`,

  parse_rough_text: `You are a CV data extractor. Given rough, unstructured text about a person's career, extract and structure it into a CV JSON format. Return ONLY valid JSON matching this exact structure:
{
  "personalInfo": {"fullName":"","title":"","email":"","phone":"","location":"","website":"","summary":""},
  "experiences": [{"id":"1","company":"","position":"","startDate":"","endDate":"","current":false,"description":""}],
  "education": [{"id":"1","institution":"","degree":"","field":"","startDate":"","endDate":"","description":""}],
  "skills": [{"id":"1","name":"","level":3}],
  "languages": [{"id":"1","name":"","proficiency":""}],
  "customSections": [],
  "sectionOrder": ["personal","experience","education","skills","languages"]
}
Fill in as much as you can from the text. Use reasonable IDs (1,2,3...). For dates use YYYY-MM format where possible. Set skill levels based on context (1-5). If info is missing, leave as empty string. Return ONLY the JSON.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, payload } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = SYSTEM_PROMPTS[action];
    if (!systemPrompt) {
      return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let userMessage = "";

    switch (action) {
      case "generate_summary":
        userMessage = `Job Title: ${payload.title}\n${payload.experience ? `Experience context: ${payload.experience}` : ""}`;
        break;
      case "generate_description":
        userMessage = `Position: ${payload.position}\nCompany: ${payload.company}\n${payload.context ? `Additional context: ${payload.context}` : ""}`;
        break;
      case "suggest_skills":
        userMessage = `Job Title: ${payload.title}\n${payload.industry ? `Industry: ${payload.industry}` : ""}`;
        break;
      case "review_cv":
        userMessage = `Here is the CV data to review:\n${JSON.stringify(payload.cvData, null, 2)}`;
        break;
      case "parse_rough_text":
        userMessage = payload.text;
        break;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ result: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("cv-ai error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
