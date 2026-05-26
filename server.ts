import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily/Safely so missing key doesn't block startup
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && key !== "") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Helper to call Gemini with a structured prompt or fallback gracefully
async function generateEducationalContent(prompt: string, fallbackText: string): Promise<string> {
  const client = getGeminiClient();
  if (!client) {
    console.warn("Gemini API key is not set. Using detailed pre-optimized educational template.");
    return fallbackText;
  }
  try {
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });
    return response.text || fallbackText;
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return fallbackText + `\n\n*(નોંધ: AI જનરેશન પ્રક્રિયામાં થોડી વિલંબ આવવાના કારણે આપને આ પ્રી-સેટ રિઝોલ્વ્ડ મોડલ બતાવવામાં આવી રહ્યો છે. ભૂલ: ${error.message || error})*`;
  }
}

// --- API ENDPOINTS ---

// 1. Lesson Planner
app.post("/api/ai/lesson-plan", async (req: Request, res: Response) => {
  const { subject, topic, grade, duration, language = "gu" } = req.body;
  
  const systemPrompt = `You are an elite educational curriculum designer for Gujarat Secondary and Higher Secondary Education Board (GSEB / CBSE). 
  Generate a highly professional, ready-to-use Lesson Plan (પાઠ આયોજન) in Gujarati (ગુજરાતી માધ્યમ). 
  Subject (વિષય): ${subject || "Maths - ગણિત"}
  Topic (પ્રકરણ/ટોપિક): ${topic || "વાસ્તવિક સંખ્યાઓ (Real Numbers)"}
  Grade (ધોરણ): ${grade || "10"}
  Duration (સમયગાળો): ${duration || "45 Minutes"}

  Include structural sections with elegant formatting in Markdown:
  1. **શિખવવાના હેતુઓ (Learning Objectives)**: Knowledge, Skill, Attitude.
  2. **જરૂરી સાધન સામગ્રી (Teaching Aids / TLM)**.
  3. **પૂર્વજ્ઞાન ની ચકાસણી (Previous Knowledge Check)**: 3-4 interesting questions or bridge activities.
  4. **વિષયાભિમુખ અને રજૂઆત (Introduction & Step-by-Step Presentation Method)**:
     - Step 1: Engage (5-10 mins)
     - Step 2: Explore & Explain (15-20 mins)
     - Step 3: Elaborate / Real-world math applications (10 mins)
  5. **મૂલ્યાંકન (Assessment / Quick Quiz)**: 3 interactive questions.
  6. **ગૃહકાર્ય (Homework assignment for students)**.

  Respond in rich Markdown in professional Gujarati language. Add English sub-technical terms in parentheses where appropriate to make it premium.`;

  const fallback = `# પાઠ આયોજન (Lesson Plan): ${topic || "વાસ્તવિક સંખ્યાઓ"}
**વિષય**: ${subject || "ગણિત (Mathematics)"} | **ધોરણ**: ${grade || "૧૦"} | **સમયગાળો**: ${duration || "૪૫ મિનિટ"}

## ૧. શિખવવાના હેતુઓ (Learning Objectives)
* **જ્ઞાનાત્મક હેતુ**: વિદ્યાર્થીઓ વિભાવનાઓ અને તેના મૂળભૂત નિયમોથી વાકેફ થાય.
* **કૌશલ્ય હેતુ**: ગણિતિક સમસ્યાઓનું તાર્કિક વિશ્લેષણ કરી વાસ્તવિક જીવન સાથે સંબંધ જોડી શકે.
* **પ્રયોજનાત્મક હેતુ**: વિવિધ ઉદાહરણો દ્વારા સ્વતંત્ર રીતે દાખલાઓ ઉકેલી શકે.

## ૨. જરૂરી સાધન સામગ્રી (Teaching Aids / TLM)
* સ્માર્ટ બોર્ડ, ઇન્ટરેક્ટિવ ડિજિટલ મોડ્યુલ્સ, વાસ્તવિક વસ્તુઓની ચાર્ટ શીટ.

## ૩. પૂર્વજ્ઞાન ચકાસણી (Previous Knowledge Check)
* શું તમે કહી શકો કે દૈનિક જીવનમાં આપણી આસપાસ કઈ-કઈ સંખ્યાઓનો ઉપયોગ થાય છે?
* વિભાજ્ય અને અવિભાજ્ય સંખ્યાઓનો મુખ્ય તફાવત શું છે?

## ૪. રજૂઆત અને વિષયવસ્તુની ચર્ચા (Step-by-Step Presentation)
* **Engagement (૫ મિનિટ)**: દૈનિક વ્યવહારના ઉદાહરણો પ્રદર્શિત કરી વિદ્યાર્થીઓમાં જિજ્ઞાસા જગાડવી.
* **Explanation (૨૦ મિનિટ)**: ચિત્રો અને એનિમેશન દ્વારા સિદ્ધાંતોની ઊંડાણપૂર્વક સરળ રજૂઆત કરવી.
* **Interactive Activity (૧૦ મિનિટ)**: વિદ્યાર્થીઓ પાસે જૂથ કાર્ય કરાવી ડિજિટલ ટૂલ દ્વારા પરિણામો મેળવવા.

## ૫. મૂલ્યાંકન (Assessment & Quiz)
૧. આપેલા પ્રશ્નોમાંથી અવિભાજ્ય અવયવોની જોડી ઓળખો.
૨. સૂત્ર અને રીતની સચોટતા ચકાસો.

## ૬. ગૃહકાર્ય (Homework Assignment)
* સ્વાધ્યાયના પ્રશ્ન ૧ થી ૫ તમારી ગણિતની નોટબુકમાં સચોટ ગણતરી સાથે લખો.`;

  const doc = await generateEducationalContent(systemPrompt, fallback);
  res.json({ content: doc });
});

// 2. Homework Generator
app.post("/api/ai/homework", async (req: Request, res: Response) => {
  const { subject, topic, difficulty = "Medium", count = 5 } = req.body;
  const prompt = `You are a professional Class 10/12 GSEB teacher. Create an elegant, pedagogically balanced homework worksheet (ગૃહકાર્ય શીટ) in Gujarati.
  Subject: ${subject}
  Topic: ${topic}
  Difficulty Level: ${difficulty}
  Number of Questions: ${count}

  Structure the worksheet beautifully:
  - Header: Aarsi AI Education Elite Worksheet
  - Section A: યાદ રાખવાની ચાવીઓ (Key Revision Tips / Formulas)
  - Section B: મુખ્ય પ્રશ્નો (Core Practice Problems) - Provide step-by-step space instructions (using Markdown gaps)
  - Section C: સવિસ્તાર ગણતરી વાળા પ્રશ્નો (HOTS / Challenge Question)
  
  Write in highly encouraging and clear Gujarati. Includes labels in English alongside Gujarati labels (e.g., Section A: વિભાગ A).`;

  const fallback = `# ગૃહકાર્ય પત્રક (Homework Sheet) - Aarsi AI Education
**વિષય**: ${subject || "ગણિત"} | **પ્રકરણ**: ${topic || "બહુપદીઓ (Polynomials)"} | **મુશ્કેલી સ્તર**: ${difficulty || "મધ્યમ (Medium)"}

### વિભાગ A: પાયાની સમજ અને નિયમો (Key Formulas)
* ધોરણ ના સ્તર મુજબ આપેલા પ્રકરણના મુખ્ય સૂત્રો અને નિયમો યાદ કરીને પાકા કરો.

### વિભાગ B: મુખ્ય પ્રશ્નો (Core Practice Problems)
1. આપેલા પદોની કિંમત શોધો અને તેની સત્યાર્થતા ચકાસો.
2. નીચે આપેલ બહુપદીના શૂન્યો અને સહગુણકો વચ્ચેનો સંબંધ સ્થાપિત કરો.
3. આકૃતિ પરથી આલેખ ઓળખી ગણતરી પૂર્ણ કરો.

### વિભાગ C: ઉચ્ચ વૈચારિક પ્રશ્નો (HOTS Questions)
* જો ત્રિઘાત સમીકરણના શૂન્યો પરસ્પર વ્યસ્ત હોય તો અચળ પદ ની કિંમત શોધો.`;

  const doc = await generateEducationalContent(prompt, fallback);
  res.json({ content: doc });
});

// 3. Question Paper Generator
app.post("/api/ai/question-paper", async (req: Request, res: Response) => {
  const { examType, subject, chapters, totalMarks = 50, duration = "2 Hours" } = req.body;
  const prompt = `As the chief paper-setter of Gujarat Education Board, design a mock examination question paper (પ્રશ્નપત્ર) in Gujarati following current board pattern (GSEB SSC System).
  Exam Mode: ${examType || "દ્વિતીય પરીક્ષા (Second Exam)"}
  Subject: ${subject || "ગણિત (Maths)"}
  Chapters included: ${chapters || "પ્રકરણ ૨ થી ૫"}
  Total Marks: ${totalMarks} Marks
  Duration: ${duration}

  Structure requirement (Output must have elegant dividers):
  - **વિભાગ A**: ૧ ગુણ વાળા વૈકલ્પિક/ખાલી જગ્યા આધારિત ટૂંકા પ્રશ્નો (6 Questions)
  - **વિભાગ B**: ૨ ગુણ વાળા હેતુલક્ષી દાખલાઓ/પ્રશ્નો (5 Questions)
  - **વિભાગ C**: ૩ ગુણ વાળા ટૂંકજવાબી દાખલાઓ જેમાં આંતરિક વિકલ્પ હોય (4 Questions)
  - **વિભાગ D**: ૪ ગુણ વાળા સવિસ્તાર મોટા પ્રશ્નો/પ્રમેયો/આકૃતિ વાળા પ્રશ્નો (2 Questions)

  Format beautiful paper header with general instructions for students in Gujarati.`;

  const fallback = `# આદર્શ પ્રશ્નપત્ર (Model Question Paper) - Aarsi AI Education
**પરીક્ષા પ્રકાર**: ${examType || "સાપ્તાહિક પરીક્ષા"} | **વિષય**: ${subject || "ગણિત (Gujarati Medium)"}
**કુલ ગુણ**: ${totalMarks} ગુણ | **સમયગાળો**: ${duration}

---
### સામાન્ય સૂચનાઓ (General Instructions):
૧. બધા જ પ્રશ્નો ફરજિયાત છે. યોગ્ય આંતરિક વિકલ્પો આપેલા છે.
૨. નવીન વિભાગ નવા પાના પરથી જ શરૂ કરવો. જમણી બાજુના અંક ગુણ દર્શાવે છે.

---
### વિભાગ A (૧ ગુણના ટૂંકા પ્રશ્નો)
* વૈકલ્પિક વિકલ્પોમાંથી સાચો વિકલ્પ પસંદ કરો અથવા ખાલી જગ્યા પૂરો:
૧. આપેલ દ્વિઘાત સમીકરણના વિવેચકનું મૂલ્ય કેટલું થાય?
૨. આલેખ પરથી શૂન્યોની સંખ્યા નક્કી કરો.

### વિભાગ B (૨ ગુણના ટૂંકા દાખલા/પ્રશ્નો)
૩. સૂત્ર વાપરીને આપેલી કિંમતો ગણો.
૪. સામાન્ય ગુણોત્તર અને પ્રથમ પદ શોધો.

### વિભાગ C (૩ ગુણના દાખલાઓ)
૫. સાબિત કરો કે આપેલ પદ અસંમેય છે અથવા આલેખ દોરો.

### વિભાગ D (૪ ગુણના સવિસ્તાર પ્રશ્નો)
૬. પ્રમેય અને તેનો સિદ્ધાંત આકૃતિ સહ સાબિત કરો.`;

  const doc = await generateEducationalContent(prompt, fallback);
  res.json({ content: doc });
});

// 4. Timetable Generator
app.post("/api/ai/timetable", async (req: Request, res: Response) => {
  const { className, type = "Class Study Schedule", hoursPerDay = "6 hours" } = req.body;
  const prompt = `Generate a rigorous, highly optimized, multi-subject Daily or Class Study Timetable (સમયપત્રક) in Gujarati.
  Class: ${className || "ધોરણ ૧૦ (Standard 10 - SSC Exam Ready)"}
  Schedule Type: ${type}
  Target Daily Hours: ${hoursPerDay}

  Design a matrix-style time allocation plan from morning to night. Include:
  - Subject study blocks (Mathematics, Science, Social Science, Language etc.)
  - Healthy active breaks (યોગાસન / હળવી કસરત / મનન)
  - Revision windows (પુનરાવર્તન કલાક)
  - Weekly Self-Mock Assessment schedule
  - Pro tips for board exams (બોર્ડ પરીક્ષા ની તૈયારીઓ માટે સુવર્ણ ચાવીઓ)`;

  const fallback = `# શ્રેષ્ઠ અભ્યાસ સમયપત્રક (Smart Study Timetable) - Aarsi AI Education
**ધોરણ**: ${className || "Standard 10 (GSEB Board Batch)"} | **ધ્યેય**: ${hoursPerDay} દૈનિક અભ્યાસ

| સમય (Time Block) | પ્રવૃત્તિ / વિષય (Activity & Subject) | મુખ્ય લક્ષ્ય (Focus Target) |
| :--- | :--- | :--- |
| **06:00 AM - 07:00 AM** | વિજ્ઞાન અને ટેકનિકલ થીયરી | વહેલી સવારે યાદ શક્તિ ધારદાર બને છે |
| **07:00 AM - 07:15 AM** | યોગ અને સ્મરણ કસરત | માનસિક શાંતિ અને ફોકસ વધારવા |
| **07:30 AM - 09:00 AM** | ગણિત (Mathematics Practice) | રોજ ૨-૩ મુશ્કેલ દાખલાઓની જાતે ગણતરી |
| **10:00 AM - 01:00 PM** | સ્కూલ / ઓનલાઇન લર્નિંગ બ્લોક | નૂતન ખ્યાલો સાથે નોટ્સની તૈયારી કરવી |
| **03:00 PM - 05:00 PM** | સામાજિક વિજ્ઞાન અથવા ભાષા | ટૂંકા પ્રશ્નો, નકશા પૂર્તિ અને વ્યાકરણ |
| **06:00 PM - 07:30 PM** | અગાઉની પરીક્ષાઓના પેપર સોલ્યુશન | ટાઇમ-મેનેજમેન્ટ સાથે પ્રેક્ટિસ |
| **09:00 PM - 10:00 PM** | દૈનિક પુનરાવર્તન (Revision Block) | આખા દિવસના અભ્યાસનું ઝડપી સરવૈયું |

## પરીક્ષા લક્ષી સુવર્ણ ટિપ્સ (AI Success Tips):
- દર ૪૫ મિનિટના સતત વાચન પછી ૫ મિનિટનો વિરામ રાખો.
- અતિશય મુશ્કેલીવાળા વિષયો મિત્રો કે શિક્ષકની મદદથી વહેલી તકે ઉકેલો.`;

  const doc = await generateEducationalContent(prompt, fallback);
  res.json({ content: doc });
});

// 5. Circular Generator
app.post("/api/ai/circular", async (req: Request, res: Response) => {
  const { title, date, targetAudience = "Parents & Students", details } = req.body;
  const prompt = `You are the Principal of "Aarsi AI Model School". Write a warm, professional, official School Circular (શાળા પરિપત્ર) in authentic administrative Gujarati.
  Subject/Title: ${title}
  Date of Issue: ${date || "Current date"}
  Target Audience: ${targetAudience}
  Context details: ${details || "શાળા પ્રવાસ અથવા સ્માર્ટ રૂમ ઓર્ગેનાઇઝેશન બાબતે સ્નેહમિલન સભા અને ફીડબેક સેશન્સ"}

  Draft a circular with beautiful letterhead spacing, containing:
  - Official Circular ID Placeholder
  - Respectful salutation (માનનીય વાલીશ્રીઓ તથા વહાલા વિદ્યાર્થીઓ)
  - Clear paragraph explaining importance of the announcement
  - Tables or bullet points for date/time/requirements if relevant
  - An inspiring slogan of Aarsi EdTech ecosystem
  - Principal Signature block with a neat seal markup`;

  const fallback = `## શાળા પરિપત્ર (SCHOOL CIRCULAR) - Aarsi AI Model Group
**પરિપત્ર ક્રમાંક**: AARSI-EDU/2026/047 | **તારીખ**: ${date || "૨૪-૦૫-૨૦૨૬"}
**પ્રતિ**: ${targetAudience || "માનનીય વાલીશ્રીઓ તથા વહાલા વિદ્યાર્થીઓ"}

**વિષય: ${title || "નવા શૈક્ષણિક વર્ષનું સ્માર્ટ પ્લાનિંગ અને ડિજિટલ સત્રનો શુભારંભ"}**

સાદર પ્રણામ સહ જણાવવાનું કે આપણી શાળા શૈક્ષણિક ટેકનોલોજીના માધ્યમથી નવીન શિખરો સર કરવા જઈ રહી છે.

- **મહત્વનો એજન્ડા**: શાળામાં સુસજ્જ તૈયાર કરાયેલી AI સ્માર્ટ લેબોરેટરી દરેક વિદ્યાર્થી માટે ખુલ્લી મુકાશે.
- **બેઠક આયોજન**: આગામી શનિવારે શાળા હોલમાં ટેકનોલોજી પ્રદર્શન સાથે શિક્ષક-વાલી મિલન રાખવામાં આવ્યું છે.

**આપની સક્રિય ભાગીદારી વિદ્યાર્થીઓના ઉજ્જવળ ભવિષ્યની સચોટ ચાવી છે.**

આપનો સ્નેહાધીન,  
**પ્રિન્સિપાલ (શ્રી આર. કે. મહેતા)**  
Aarsi AI Education Ecosystem`;

  const doc = await generateEducationalContent(prompt, fallback);
  res.json({ content: doc });
});

// 6. AI Prompt Generator
app.post("/api/ai/prompt", async (req: Request, res: Response) => {
  const { role, task, subject } = req.body;
  const prompt = `Generate a high-performance ChatGPT/Gemini prompt for teachers or students.
  User Role: ${role || "ગણિત શિક્ષક (Maths Teacher)"}
  Target Task: ${task || "પાઠને રસપ્રદ બનાવતી ફિલ્મો, રમતો અને ઉદાહરણો શોધવા"}
  Subject Context: ${subject || "ભૂમિતિ (Geometry)"}

  Write the output in highly structured blocks:
  1. **જાદુઈ પ્રોમ્પ્ટ (The Master Prompt)** - In English inside markdown blocks so they can directly copy and paste it into AI tools.
  2. **કેવી રીતે ઉપયોગ કરવો (Execution Guide)** - Step by step instruction in Gujarati.
  3. **પ્રોમ્પ્ટ ના ફાયદા (Expected Outcome/Benefits)** in Gujarati.`;

  const fallback = `# AI પ્રોમ્પ્ટ જનરેટર - Aarsi AI Resource Hub
આ મોડ્યુલ શિક્ષકો માટે પાવરફુલ પ્રોમ્પ્ટ તૈયાર કરે છે જે કોપી કરીને કોઈપણ AI માં વાપરી શકાય છે.

### ૧. મુખ્ય કોપી પ્રોમ્પ્ટ (Copyable Master Prompt)
\`\`\`text
You are an expert ${role || "Class 10 Educator"}. I need you to create an engaging classroom activity plan for standard 10 students about the subject: ${subject || "Mathematics"}. The specific task is to list interactive models, practical applications, and common mistakes to avoid. Provide the response as a gamified worksheet with points.
\`\`\`

### ૨. એક્ઝિક્યુશન ગાઈડ (How to use)
* આપેલા પ્રોમ્પ્ટને કોપી બટન પર ક્લિક કરીને ક્લિપબોર્ડમાં સેવ કરો.
* તેને Gemini, ChatGPT અથવા અન્ય કો-પાયલોટ ફ્રેમવર્કમાં પેસ્ટ કરો.
* તમારો મનગમતો વિષય આગળ પાછળ ઉમેરીને પરિણામ બહેતર બનાવો.

### ૩. પ્રોમ્પ્ટથી થતા ફાયદા (Benefits)
* ૧૦ કલાકનું આયોજન માત્ર ૨ મિનિટમાં થઈ જાય છે.
* ગેમિફાઈડ લર્નિંગના પ્રતાપે વર્ગખંડમાં વિદ્યાર્થીઓની હાજરી અને જિજ્ઞાસા બમણી થાય છે.`;

  const doc = await generateEducationalContent(prompt, fallback);
  res.json({ content: doc });
});

// 7. Performance Analyzer
app.post("/api/ai/analyze-performance", async (req: Request, res: Response) => {
  const { studentName, scores = [], attendance = "95%" } = req.body;
  
  const scoreStr = JSON.stringify(scores);
  const prompt = `You are a warm, intelligent educational counselor. Analyze the academic profile of this student and write a comprehensive Student Assessment Report (વિદ્યાર્થી પ્રગતિ મૂલ્યાંકન અહેવાલ) in encouraging, expert Gujarati.
  Student Name: ${studentName || "વિવેક પ્રજાપતિ"}
  Subject Scores: ${scoreStr} (Format: [{subject: 'MathsCode', score: 85, total: 100}, ...])
  Attendance Rate: ${attendance}
  
  Your report must contain:
  1. **કુલ ક્ષમતાનું પૃથક્કરણ (Strengths Analysis)**: Point out their strongest areas.
  2. **સુધારણા માટેના સ્પોટ્સ (Critical Improvement Zones)**: Detail where they need focus.
  3. **વૈયક્તિક સ્માર્ટ ટાસ્ક લિસ્ટ (Personalized Action Items for next month)**.
  4. **માતા-પિતા માટે સુચનો (Parent Counseling Tip)** in warm Gujarati.`;

  const fallback = `# વિદ્યાર્થી શૈક્ષણિક રિપોર્ટ - Aarsi AI Analytics
**નામ**: ${studentName || "પ્રિયાબેન પંડ્યા"} | **હાજરી પ્રમાણ**: ${attendance || "૯૨%"}

## ૧. શક્તિશાળી ગુણો અને વિશ્લેષણ (Strengths)
* વિદ્યાર્થીની તર્ક શક્તિ અને નિયમિતતા અભિનંદનીય છે. ગણિત અને વિજ્ઞાન જેવા ગણતરીવાળા વિષયોમાં પરિણામ ઉત્સાહવર્ધક છે.

## ૨. સુધારણા યોગ્ય ક્ષેત્રો (Improvement Areas)
* શાબ્દિક દાખલાઓ અને લાંબા જવાબોનું પુનરાવર્તન નિયમિત સગવડતા મુજબ કરવું આવશ્યક છે.
* પરીક્ષા સમયે સમયનું સચોટ આયોજન કરી સહેલા પ્રશ્નોને ઝડપથી પૂરા કરવાથી આત્મવિશ્વાસ વધશે.

## ૩. શિક્ષકની વૈયક્તિક ભલામણો
1. રોજ ૧ કલાક પાયાના સૂત્રો અને થીયરીનું લેખિત મૂલ્યાંકન કરો.
2. Aarsi AI ના સેલ્ફ-ટેસ્ટ સેક્શનની મદદથી સાપ્તાહિક પ્રગતિ માપો.

## ૪. વાલીશ્રી માટે સુવર્ણ માર્ગદર્શન
* ઘરમાં શાંત અને તણાવરહિત વાતાવરણ પૂરું પડો અને વિદ્યાર્થીની નાની મોટી પ્રગતિને અચૂક બિરદાવો.`;

  const doc = await generateEducationalContent(prompt, fallback);
  res.json({ content: doc });
});

// 8. Blog Article Generator
app.post("/api/ai/blog-write", async (req: Request, res: Response) => {
  const { title, category, targetAudience = "Teachers & Students", outline } = req.body;
  const prompt = `You are a premium educational editor and Class 10 Gujarat Board expert author.
  Write a complete, professional, highly motivational and educational blog article (બ્લોગ આર્ટિકલ) in Gujarati based on these details:
  Article Title (લેખનું શીર્ષક): ${title || "ગણિત અને નવી શૈક્ષણિક ટેકનોલોજીનો સમન્વય"}
  Category (શ્રેણી): ${category || "AI-Tech"}
  Target Audience: ${targetAudience}
  Outline points: ${outline || "ગણિત વિષયક પ્રકરણોને સરળતાથી એનિમેશન અને એનાલિટિક્સ વડે સમજાવવાના ફાયદા."}

  Please write the article in beautiful GSEB style educational Gujarati prose.
  Format your article content body with Markdown headers:
  Use "## [સેક્શન ટાઇટલ]" for subheaders, and write detailed paragraphs.
  Make it readable, encouraging, and highly technical yet easily accessible. Provide at least 2 detailed subheadings.`;

  const fallback = `## ગણિત અને નવી શૈક્ષણિક ટેકનોલોજીનો સમન્વય
શૈક્ષણિક વિશ્વમાં સ્માર્ટ લર્નિંગ હવે મોજશોખ નહિ પણ જરૂરિયાત બની ગયું છે. ખાસ કરીને ગણિત (Mathematics) જેવા વિજ્ઞાન સંબંધિત વિષયમાં વિદ્યાર્થીઓમાં રહેલી ગેરસમજ દૂર કરવા ટેકનોલોજી એક શક્તિશાળી શસ્ત્ર છે.

## ૧. વિઝ્યુઅલ લર્નિંગથી પ્રમેયો સરળ બને છે
જ્યારે પણ સાબિત કરવાવાળા પ્રશ્નો કે પ્રમેયો પૂછવામાં આવે ત્યારે વિદ્યાર્થીઓ ડર અનુભવતા હોય છે. એનિમેશન અને ગ્રાફિકલ આકૃતિઓ દ્વારા જ્યારે તેમને ભૌમિતિક સિદ્ધાંતો સમજાવવામાં આવે ત્યારે તે કાયમ માટે સ્મૃતિપટ પર અંકિત થઇ જાય છે.

## ૨. ઇન્ટરેક્ટિવ ગ્રાફ અને રિયલ ટાઇમ ડેટા
બહુપદીઓ કે દ્વિઘાત સમીકરણોમાં આલેખ કેવી રીતે બદલાય છે, તે સ્લાઇડરની મદદથી જોતાં વિદ્યાર્થીઓ પોતે જ શૂન્યોની વધશ ઘટશ વ્યાખ્યાયિત કરી શકે છે. આપણું પોર્ટલ આ પ્રકારનું સચોટ લર્નિંગ પૂરું પાડે છે.`;

  const doc = await generateEducationalContent(prompt, fallback);
  res.json({ content: doc });
});

// Serve static assets in production
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
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aarsi API] Express server running perfectly on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start Aarsi server:", err);
});
