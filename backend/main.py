from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import re
import json
from fastapi.middleware.cors import CORSMiddleware

import google.generativeai as genai

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# configure SDK if key is present; model will be instantiated when possible
model = None
if API_KEY:
    try:
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash")
    except Exception:
        model = None

app = FastAPI(title="SEO Brief Generator")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://microgen.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BriefRequest(BaseModel):
    keyword: str


@app.post("/api/brief")
async def create_brief(req: BriefRequest):
    if model is None:
        raise HTTPException(
            status_code=500,
            detail="Gemini model not configured. Ensure GEMINI_API_KEY is set in .env",
        )

    # System prompt: instruct Gemini to return JSON ONLY with defined fields
    prompt = (
        f"""
You are a senior SEO strategist and content director at a top digital marketing agency.
A client has given you this keyword: "{req.keyword}".

Your job is to produce a comprehensive, actionable SEO content brief that a writer could immediately use to outrank the current top 10 results on Google.

Return a JSON object ONLY with exactly these fields:

- title: A compelling, click-worthy page title (max 60 chars). Should feel human, not generic.

- meta_description: A meta description that creates curiosity or urgency while including the keyword naturally (max 160 chars).

- search_intent: One of "Informational", "Navigational", "Commercial", or "Transactional" — plus one sentence explaining why.

- target_audience: A specific description of who is searching this. Not just demographics — include their pain point or motivation.

- tone: The exact tone the content should use and why it fits this audience.

- word_count: Recommended word count as a number, based on the complexity and competitiveness of the keyword.

- h2_headings: An array of 5-7 H2 headings that are differentiated from what generic competitors would write. Each heading should be specific, useful, and reflect real search behaviour.

- unique_angle: A one or two sentence content angle that no competitor is currently covering well. This is the strategic edge.

- content_gaps: An array of 3-4 questions or subtopics that most existing articles on this keyword fail to address properly.

- internal_linking_suggestions: An array of 3 related topic ideas that could be interlinked with this article to build topical authority.

- cta_suggestion: A specific, contextually relevant call-to-action that fits the search intent and audience.

Return valid JSON and nothing else. No markdown, no explanation, no code fences.
"""
    )

    def try_generate(prompt_text: str):
        """Attempt several possible generate_content signatures for SDK compatibility."""
        kwargs = {"temperature": 0.3, "max_output_tokens": 1024}

        # Try positional prompt first (modern SDK requires positional prompt)
        attempts = [
            ("positional", lambda: model.generate_content(prompt_text, **kwargs)),
            ("positional_no_kwargs", lambda: model.generate_content(prompt_text)),
            ("input_kw", lambda: model.generate_content(input=prompt_text, **kwargs)),
            ("messages", lambda: model.generate_content(messages=[{"role": "system", "content": prompt_text}], **kwargs)),
            ("instances", lambda: model.generate_content(instances=[{"input": prompt_text}], **kwargs)),
            ("request", lambda: model.generate_content(request={"prompt": prompt_text, **kwargs})),
            ("genai_generate_text", lambda: genai.generate_text(prompt_text, model="gemini-2.5-flash", temperature=0.2, max_output_tokens=512)),
        ]

        last_err = None
        for name_fn in attempts:
            name, fn = name_fn
            try:
                return fn()
            except TypeError as te:
                # signature mismatch for this attempt -> try next
                last_err = te
                continue
            except Exception as e:
                # If we get a network/SDK error, raise immediately
                raise

        # If all attempts failed due to signature mismatch, raise the last TypeError
        if last_err:
            raise last_err

    def extract_text_from_response(response_obj) -> str:
        # Common attributes across SDK versions
        if response_obj is None:
            return ""
        if hasattr(response_obj, "text") and response_obj.text:
            return response_obj.text
        if hasattr(response_obj, "output_text") and response_obj.output_text:
            return response_obj.output_text
        if hasattr(response_obj, "result") and getattr(response_obj, "result"):
            try:
                return response_obj.result
            except Exception:
                pass
        # candidates
        try:
            if hasattr(response_obj, "candidates") and response_obj.candidates:
                return response_obj.candidates[0].content
        except Exception:
            pass
        # generations
        try:
            if hasattr(response_obj, "generations") and response_obj.generations:
                gen = response_obj.generations[0]
                if hasattr(gen, "text"):
                    return gen.text
        except Exception:
            pass
        # output list structures
        try:
            out = getattr(response_obj, "output", None)
            if out and isinstance(out, (list, tuple)) and len(out) > 0:
                first = out[0]
                if isinstance(first, dict) and "content" in first:
                    return first["content"]
        except Exception:
            pass
        # dict-like fallback
        try:
            if isinstance(response_obj, dict):
                if "candidates" in response_obj and response_obj["candidates"]:
                    return response_obj["candidates"][0].get("content", "")
                if "output_text" in response_obj:
                    return response_obj.get("output_text", "")
        except Exception:
            pass

        return str(response_obj)

    try:
        response = try_generate(prompt)
        text = extract_text_from_response(response)

        # If the model wrapped JSON in fenced code blocks (``` or ```json), extract it
        fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.S | re.I)
        if fenced:
            json_text = fenced.group(1)
        else:
            # Fallback: find first {...} block
            m = re.search(r"(\{.*\})", text, re.S)
            if not m:
                raise ValueError("No JSON object found in model response")
            json_text = m.group(1)

        # Parse JSON
        data = json.loads(json_text)
        return data

    except HTTPException:
        raise
    except TypeError as te:
        raise HTTPException(status_code=500, detail=f"LLM SDK signature error: {str(te)}")
    except Exception as e:
        # Return readable error message instead of crashing
        raise HTTPException(status_code=500, detail=f"LLM request failed: {str(e)}")

class ArticleRequest(BaseModel):
    keyword: str
    brief: dict


@app.post("/api/article")
async def create_article(req: ArticleRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Gemini model not configured.")

    prompt = f"""
You are an expert SEO content writer. Using the brief below, write a complete,
publish-ready SEO article for the keyword: "{req.keyword}".

Brief:
{json.dumps(req.brief, indent=2)}

Instructions:
- Follow the H2 structure from the brief exactly
- Match the tone specified in the brief
- Address every content gap listed in the brief
- Write in a natural, human voice — avoid sounding like generic AI content
- Aim for the recommended word count

Formatting rules — follow these exactly, no exceptions:
- Use # for the H1 title, ## for H2 headings, ### for H3 subheadings
- Always leave a blank line before and after every heading
- Always leave a blank line between every paragraph
- For lists: ALWAYS use - for every single list item, with no blank lines between items, and a blank line before the first item and after the last item
- NEVER mix list items and paragraphs — if something is a list, every item in that list must use - syntax
- NEVER write a list item as a plain paragraph — if it belongs to a list, it must start with -
- NEVER start a new list partway through what should be a single list
- The CTA must be the very last element, formatted as an ## heading, with a blank line above it and nothing after it
- Do not add any commentary, preamble, or closing notes outside the article itself

Return the full article in markdown. Nothing else.
"""

    try:
        response = model.generate_content(prompt)
        return {"article": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Article generation failed: {str(e)}")