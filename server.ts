import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// ── GEMINI MODEL FALLBACK CHAIN ──────────────────────────────
// gemini-3.5-flash does NOT exist. Use this priority list:
const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-002",
  "gemini-1.5-pro",
];

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && key !== "") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } },
      });
    }
  }
  return aiClient;
}

async function generateEducationalContent(
  prompt: string,
  fallbackText: string
): Promise<string> {
  const client = getGeminiClient();
  if (!client) {
    console.warn("Gemini API key not set. Using pre-optimised template.");
    return fallbackText;
  }

  for (const model of GEMINI_MODELS) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: { temperature: 0.7 },
      });
      const text = response.text;
      if (text) {
        console.log(`[Gemini] Success with model: ${model}`);
        return text;
      }
    } catch (error: any) {
      const msg: string = error?.message || String(error);
      // Hard stop — bad key or quota
      if (msg.includes("API_KEY_INVALID") || msg.includes("API key not valid")) {
        console.error("[Gemini] Invalid API key.");
        return fallbackText + "\n\n*(નોંધ: API key અમાન્ય છે. Render → Environment → GEMINI_API_KEY ચકાસો.)*";
      }
      if (msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")) {
        console.error("[Gemini] Quota exceeded.");
        return fallbackText + "\n\n*(નોંધ: API quota સમાપ્ત. થોડીવાર રાહ જોઈ ફરી પ્રયાસ કરો.)*";
      }
      // Model not found — try next
      console.warn(`[Gemini] Model ${model} failed: ${msg.slice(0, 80)}. Trying next…`);
      continue;
    }
  }

  console.error("[Gemini] All models exhausted.");
  return fallbackText + "\n\n*(નોંધ: AI સેવા અસ્થાયી ધોરણે ઉપલબ્ધ નથી. Pre-set template બતાવવામાં આવ્યો.)*";
}

// ── STATIC TOOLS PAGE (/tools) ───────────────────────────────
// Serves the standalone Aarsi AI Tools HTML at /tools
// Place aarsi-tools.html in the project root before deploying.
app.get("/tools", (req: Request, res: Response) => {
  const toolsPath = path.join(process.cwd(), "aarsi-tools.html");
  if (fs.existsSync(toolsPath)) {
    res.sendFile(toolsPath);
  } else {
    res.status(404).send(`
      <h2>aarsi-tools.html not found</h2>
      <p>Upload <code>aarsi-tools.html</code> to the project root on GitHub.</p>
    `);
  }
});

// Also serve the lesson planner at /lesson-planner
app.get("/lesson-planner", (req: Request, res: Response) => {
  const lpPath = path.join(process.cwd(), "aarsi-tools.html");
  if (fs.existsSync(lpPath)) {
    res.sendFile(lpPath);
  } else {
    res.redirect("/tools");
  }
});

// ── API ENDPOINTS ─────────────────────────────────────────────

// 1. Lesson Planner
app.post("/api/ai/lesson-plan", async (req: Request, res: Response) => {
  const { subject, topic, grade, duration, language = "gu" } = req.body;
  const systemPrompt = `You are an elite educational curriculum designer for GSEB / CBSE Gujarat.
Generate a professional Lesson Plan (પાઠ આયોજન) in Gujarati.
Subject: ${subject || "Maths - ગણિત"}
Topic: ${topic || "વાસ્તવિક સંખ્યાઓ (Real Numbers)"}
Grade: ${grade || "10"}
Duration: ${duration || "45 Minutes"}
Include: Learning Objectives, TLM, Previous Knowledge Check, Step-by-Step Presentation (Engage/Explore/Elaborate), Assessment, Homework.
Respond in rich Markdown in professional Gujarati with English sub-technical terms in parentheses.`;

  const fallback = `# પાઠ આયોજન: ${topic || "વાસ્તવિક સંખ્યાઓ"}
**વિષય**: ${subject || "ગણિત"} | **ધોરણ**: ${grade || "૧૦"} | **સમય**: ${duration || "૪૫ મિ."}

## ૧. શિખવવાના હેતુઓ
* **જ્ઞાનાત્મક**: વિભાવના અને મૂળભૂત નિયમ સ્પષ્ટ કરવા.
* **કૌશલ્ય**: ગણિતિક સમસ્યાઓ તાર્કિક રીતે ઉકેલવી.
* **પ્રયોજનાત્મક**: ઉદાહરણ દ્વારા સ્વાયત્ત ઉકેલ.

## ૨. TLM
* સ્માર્ટ બોર્ડ, ઇન્ટરેક્ટિવ ડિજિટલ મોડ્યુલ.

## ૩. પૂર્વ-જ્ઞાન ચકાસણી
* ૧. દૈનિક જીવનમાં કઈ સંખ્યાઓ ઉપયોગી?
* ૨. વિભાજ્ય vs અવિભાજ્ય ભેદ?

## ૪. Step-by-Step Presentation
* **Engage (૫ મિ.)**: ઉદાહરણ દ્વારા જિજ્ઞાસા.
* **Explain (૨૦ મિ.)**: ચિત્ર/ઍનિમ દ્વારા ઊંડી સમજ.
* **Elaborate (૧૦ મિ.)**: જૂથ કાર્ય, ડિજિટલ tool.

## ૫. Assessment
* ૧. અવિભાજ્ય અવયવ ઓળખો.
* ૨. સૂત્ર-ચકાસો.

## ૬. Homework
* સ્વાધ્યાય ૧–૫ ગણતરી સહ ઉકેલો.`;

  const doc = await generateEducationalContent(systemPrompt, fallback);
  res.json({ content: doc });
});

// 2. Homework Generator
app.post("/api/ai/homework", async (req: Request, res: Response) => {
  const { subject, topic, difficulty = "Medium", count = 5 } = req.body;
  const prompt = `Create a GSEB homework worksheet (ગૃહકાર્ય શીટ) in Gujarati.
Subject: ${subject} | Topic: ${topic} | Difficulty: ${difficulty} | Questions: ${count}
Sections: Key Formulas → Core Problems → HOTS Challenge.`;

  const fallback = `# ગૃહકાર્ય - ${subject || "ગણિત"}: ${topic || "બહુપદીઓ"}
### Section A: Key Formulas
* આ પ્રકરણના મુખ્ય સૂત્રો.
### Section B: Core Problems
1–5. ક્રમશ: MCQ, ટૂંકા, ગણતરી.
### Section C: HOTS
* ઉચ્ચ-સ્તરીય ઉકેલ.`;

  const doc = await generateEducationalContent(prompt, fallback);
  res.json({ content: doc });
});

// 3. Question Paper
app.post("/api/ai/question-paper", async (req: Request, res: Response) => {
  const { examType, subject, chapters, totalMarks = 50, duration = "2 Hours" } = req.body;
  const prompt = `Design a GSEB SSC question paper in Gujarati.
Exam: ${examType || "Second Exam"} | Subject: ${subject || "ગણિત"} | Chapters: ${chapters || "2–5"} | Marks: ${totalMarks} | Time: ${duration}
Sections: A (1 mark×6), B (2 marks×5), C (3 marks×4), D (4 marks×2).`;

  const fallback = `# આદર્શ પ્રશ્નપત્ર — ${subject || "ગણિત"} | ${totalMarks} ગુણ | ${duration}
**Section A** (6×1): ટૂંકા/MCQ
**Section B** (5×2): ટૂંકા દાખલા
**Section C** (4×3): આંતરિક વિકલ્પ
**Section D** (2×4): પ્રમેય/આકૃતિ`;

  const doc = await generateEducationalContent(prompt, fallback);
  res.json({ content: doc });
});

// 4. Timetable
app.post("/api/ai/timetable", async (req: Request, res: Response) => {
  const { className, type = "Study Schedule", hoursPerDay = "6 hours" } = req.body;
  const prompt = `Generate a daily study timetable in Gujarati.
Class: ${className || "ધોરણ ૧૦"} | Type: ${type} | Hours: ${hoursPerDay}
Include subject blocks, breaks, revision windows, board exam tips.`;

  const fallback = `# સ્માર્ટ સ્ટડી ટાઇમટેબલ — ${className || "ધોરણ ૧૦"}
| સમય | પ્રવૃત્તિ | ધ્યેય |
|---|---|---|
| 06:00–07:00 | Science Theory | સ્મૃતિ ધારદાર |
| 07:30–09:00 | Mathematics | ૨–૩ ઉકેલ |
| 03:00–05:00 | Social / Language | ટૂંકા પ્રશ્ન |
| 09:00–10:00 | Revision | ઝડપી સરવૈયું |`;

  const doc = await generateEducationalContent(prompt, fallback);
  res.json({ content: doc });
});

// 5. Circular
app.post("/api/ai/circular", async (req: Request, res: Response) => {
  const { title, date, targetAudience = "Parents & Students", details } = req.body;
  const prompt = `Write a professional school circular (શાળા પરિપત્ર) in Gujarati.
School: Aarsi AI Model School | Title: ${title} | Date: ${date || "Current"} | Audience: ${targetAudience}
Context: ${details || "Annual function and parent meeting"}
Include: Circular ID, salutation, body, inspiring slogan, Principal signature.`;

  const fallback = `## શાળા પરિપત્ર — AARSI-EDU/2026/047
**તારીખ**: ${date || "૨૬-૦૫-૨૦૨૬"} | **પ્રતિ**: ${targetAudience}
**વિષય**: ${title || "વાર્ષિક સ્માર્ટ પ્લાનિંગ"}
માનનીય વાલીશ્રી, આ ઇ-પ્રિન્ટ નોટિસ ઉપર ખાસ ધ્યાન આપવા વિનંતી.
**આભારી, આચાર્ય — Aarsi AI Model School**`;

  const doc = await generateEducationalContent(prompt, fallback);
  res.json({ content: doc });
});

// 6. AI Prompt Generator
app.post("/api/ai/prompt", async (req: Request, res: Response) => {
  const { role, task, subject } = req.body;
  const prompt = `Generate ready-to-use ChatGPT/Gemini prompts for:
Role: ${role || "Maths Teacher"} | Task: ${task || "Engaging lesson"} | Subject: ${subject || "Geometry"}
Output: Master Prompt (English code block) + How to use (Gujarati) + Benefits (Gujarati).`;

  const fallback = `# AI Prompt — ${role || "Teacher"} | ${subject || "ગણિત"}
\`\`\`
Act as a Class 10 ${subject || "Maths"} teacher. Create an engaging ${task || "lesson plan"} with real-life examples, step-by-step explanations, and 3 MCQs.
\`\`\`
**ઉપયોગ**: ઉપર copy કરી Gemini/ChatGPT માં paste કરો.
**ફાયદા**: ૧૦ કલાકનું આયોજન ૨ મિનિટમાં.`;

  const doc = await generateEducationalContent(prompt, fallback);
  res.json({ content: doc });
});

// 7. Performance Analyzer
app.post("/api/ai/analyze-performance", async (req: Request, res: Response) => {
  const { studentName, scores = [], attendance = "95%" } = req.body;
  const prompt = `Write a student performance report (વ્િ઼ ́ ̈ ́ ́ ́ ́ ̈ ́ ́ ́ ́ ́ ́) in Gujarati.
Student: ${studentName || "વિવેક"} | Scores: ${JSON.stringify(scores)} | Attendance: ${attendance}
Include: Strengths, Improvement areas, Action items, Parent tips.`;

  const fallback = `# વિદ્ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ — ${studentName || "વ ́ ́ ́ ́"}
**Attendance**: ${attendance}
## Strengths: નિ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́.
## Improvement: ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́.
## Action: ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́.`;

  const doc = await generateEducationalContent(prompt, fallback);
  res.json({ content: doc });
});

// 8. Blog Article
app.post("/api/ai/blog-write", async (req: Request, res: Response) => {
  const { title, category, targetAudience = "Teachers & Students", outline } = req.body;
  const prompt = `Write a complete educational blog article in Gujarati.
Title: ${title || "ગ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́"}
Category: ${category || "AI-Tech"} | Audience: ${targetAudience}
Outline: ${outline || "Benefits of visual learning"}
Format with ## subheadings. Minimum 400 words. Encouraging Gujarati prose.`;

  const fallback = `## ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́
${title || "ĝ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈ ̈"}
## ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́
́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́ ́.`;

  const doc = await generateEducationalContent(prompt, fallback);
  res.json({ content: doc });
});

// ── STATIC SERVING ────────────────────────────────────────────
const distPath = path.join(process.cwd(), "dist");

async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    // SPA fallback — but NOT for /tools (already handled above)
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aarsi] Server running on port ${PORT}`);
    console.log(`[Aarsi] Tools page: http://localhost:${PORT}/tools`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
});
