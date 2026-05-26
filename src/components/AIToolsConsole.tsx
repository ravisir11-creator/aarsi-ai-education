import { useState } from "react";
import { Sparkles, Play, Copy, Check, Download, Info } from "lucide-react";

const AI_TOOLS_LIST = [
  {
    id: "lesson-plan",
    name: "AI પાઠ આયોજન (Lesson Planner)",
    endpoint: "/api/ai/lesson-plan",
    description: "GSEB ધોરણ ૧૦ ગણિત કે વિજ્ઞાન માટે શૈક્ષણિક તત્વો, TLM અને પ્રવૃત્તિઓથી સભર પાઠ મોડ્યુલ તૈયાર કરો.",
    inputs: [
      { key: "topic", label: "પ્રકરણ / શીર્ષક (Topic)", type: "text", defaultValue: "બહુપદીઓ (Polynomials)" },
      { key: "subject", label: "શાળા વિષય (Subject)", type: "select", options: ["Maths - ગણિત", "Science - વિજ્ઞાન", "Gujarati - ગુજરાતી", "Social Science - સામાજિક વિજ્ઞાન"] },
      { key: "grade", label: "કુલ ધોરણ (Grade)", type: "select", options: ["૧૦", "૯", "૮", "૧૧", "૧૨"] },
      { key: "duration", label: "સમયગાળો (Duration)", type: "text", defaultValue: "૪૫ મિનિટ" }
    ]
  },
  {
    id: "homework",
    name: "હશે હોમવર્ક જનરેટર (Homework Sheets)",
    endpoint: "/api/ai/homework",
    description: "વિદ્યાર્થીઓની ક્ષમતા મુજબ આઇકે કસ્ટમાઇઝેશન ગૃહકાર્ય સીધું જનરેટ કરીને પીડીએફ પ્રિન્ટ લો.",
    inputs: [
      { key: "topic", label: "પ્રકરણ (Chapter)", type: "text", defaultValue: "વાસ્તવિક સંખ્યાઓ (Real Numbers)" },
      { key: "subject", label: "શાળા વિષય (Subject)", type: "select", options: ["Maths - ગણિત", "Science - વિજ્ઞાન", "Social Science - સામાજિક વિજ્ઞાન"] },
      { key: "difficulty", label: "મુશ્કેલી સ્તર (Difficulty)", type: "select", options: ["સરળ", "મધ્યમ", "ઉચ્ચ વૈચારિક (HOTS)"] },
      { key: "count", label: "પ્રશ્નોની કુલ સંખ્યા (Count)", type: "number", defaultValue: 5 }
    ]
  },
  {
    id: "question-paper",
    name: "આદર્શ પ્રશ્નપત્ર સેટ (Exam Paper Set)",
    endpoint: "/api/ai/question-paper",
    description: "ગુજરાત સેકન્ડરી પરીક્ષા બોર્ડ માળખા મુજબ ગુણભાર સાથેનું ટેસ્ટ પ્રશ્નપત્ર સેકન્ડોમાં બનાવો.",
    inputs: [
      { key: "chapters", label: "સમાવિષ્ટ પ્રકરણો (Chapters)", type: "text", defaultValue: "બહુપદીઓ અને સમાંતર શ્રેણી" },
      { key: "subject", label: "શાળા વિષય (Subject)", type: "select", options: ["Maths - ગણિત", "Science - વિજ્ઞાન"] },
      { key: "examType", label: "પરીક્ષા મોડ (Exam Mode)", type: "select", options: ["સાપ્તાહિક કસોટી", "દ્વિતીય કસોટી", "પ્રિલિમ પરીક્ષા"] },
      { key: "totalMarks", label: "કુલ ગુણ (Total Marks)", type: "number", defaultValue: 25 }
    ]
  },
  {
    id: "circular",
    name: "પરિપત્ર અને સભા ડ્રાફ્ટ (Circular Maker)",
    endpoint: "/api/ai/circular",
    description: "શાળાના પ્રોટોકોલ મુજબ સત્તાવાર ગુજરાતી પરિપત્ર સચોટ ભાષા શૈલી સાથે કમ્પાઈલ કરો.",
    inputs: [
      { key: "title", label: "પરિપત્ર વિષય (Subject of Circular)", type: "text", defaultValue: "સ્માર્ટ ઇન્ટરએક્ટિવ ક્લાસ લેબોરેટરી અને ડિજિટલ રજીસ્ટ્રેશન પ્રક્રિયા" },
      { key: "targetAudience", label: "લક્ષિત જૂથ (Audience)", type: "select", options: ["માનનીય વાલીશ્રીઓ તથા વહાલા વિદ્યાર્થીઓ", "શાળા સ્ટાફ મિત્રો", "ટ્રસ્ટી મંડળ સભ્યો"] },
      { key: "date", label: "પરિપત્ર તારીખ (Date)", type: "text", defaultValue: "૨૪-૦૫-૨૦૨૬" }
    ]
  },
  {
    id: "prompt",
    name: "શિક્ષક AI પ્રૉમ્પ્ટ્સ સીકર (ChatGPT prompts)",
    endpoint: "/api/ai/prompt",
    description: "વર્ગખંડની પ્રવૃત્તિ અને સમય વ્યવસ્થાપન કરવા ChatGPT/Gemini માં લખવાનો જાદુઈ પ્રૉમ્પ્ટ શોધો.",
    inputs: [
      { key: "role", label: "તમારો રોલ (Your Role)", type: "text", defaultValue: "Maths Teacher" },
      { key: "task", label: "ધ્યેય કાર્ય (Target Task)", type: "text", defaultValue: "બહુપદીઓ પ્રકરણને ભૌમિતિક ટીએલએમ વડે રસપ્રદ બનાવવું" },
      { key: "subject", label: "લક્ષિત વિષય (Subject)", type: "text", defaultValue: "Geometry & Mathematics" }
    ]
  }
];

export default function AIToolsConsole() {
  const [activeToolIdx, setActiveToolIdx] = useState<number>(0);
  const [inputsState, setInputsState] = useState<{ [key: string]: any }>({
    topic: "બહુપદીઓ (Polynomials)",
    subject: "Maths - ગણિત",
    grade: "૧૦",
    duration: "૪૫ મિનિટ",
    difficulty: "મધ્યમ",
    count: 5,
    chapters: "બહુપદીઓ અને સમાંતર શ્રેણી",
    examType: "સાપ્તાહિક કસોટી",
    totalMarks: 25,
    title: "સ્માર્ટ ઇન્ટરએક્ટિવ ક્લાસ લેબોરેટરી અને ડિજિટલ રજીસ્ટ્રેશન પ્રક્રિયા",
    targetAudience: "માનનીય વાલીશ્રીઓ તથા વહાલા વિદ્યાર્થીઓ",
    date: "૨૪-૦૫-૨૦૨૬",
    role: "Maths Teacher",
    task: "બહુપદીઓ પ્રકરણને ભૌમિતિક ટીએલએમ વડે રસપ્રદ બનાવવું"
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const activeTool = AI_TOOLS_LIST[activeToolIdx];

  const handleInputChange = (key: string, value: any) => {
    setInputsState({ ...inputsState, [key]: value });
  };

  const simulateLoadingSteps = (callback: () => void) => {
    setLoadingStep("૧. શિખવવાના અભ્યાસક્રમની ચકાસણી થઈ રહી છે... (1/3)");
    setTimeout(() => {
      setLoadingStep("૨. શ્રેષ્ઠ ગુજરાતી શૈક્ષણિક પરિભાષાઓ કમ્પાઈલ થઈ રહી છે... (2/3)");
      setTimeout(() => {
        setLoadingStep("૩. આરસી AI મોડ્યુલ ફાઇનલ ડાર્ક-પ્રિન્ટિંગ કરી રહ્યો છે... (3/3)");
        setTimeout(() => {
          callback();
        }, 1200);
      }, 1000);
    }, 800);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setOutput("");
    setCopied(false);

    // Prepare endpoint payload
    const payload: any = {};
    activeTool.inputs.forEach(inp => {
      payload[inp.key] = inputsState[inp.key] !== undefined ? inputsState[inp.key] : inp.defaultValue;
    });

    simulateLoadingSteps(async () => {
      try {
        const response = await fetch(activeTool.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          setOutput(data.content);
        } else {
          setOutput("માફ કરશો, AI કનેક્શન પ્રોસેસ અધુરી રહી ગઈ છે. કૃપા કરીને પ્રી-સેટ આયોજન જુઓ.");
        }
      } catch (err) {
        console.error(err);
        setOutput("કનેક્શન નિષ્ફળ થયું. સ્થાનિક બેકઅપ ડેટા જનરેટ કરવામાં આવ્યો છે.");
      } finally {
        setIsLoading(false);
        setLoadingStep("");
      }
    });
  };

  const handleCopyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const element = document.createElement("a");
    const file = new Blob([output], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${activeTool.id}-export.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 rounded-2xl shadow-[6px_6px_0px_#0f172a] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        
        {/* Left Side: Sidebar selection */}
        <div className="lg:col-span-4 border-b-2 lg:border-b-0 lg:border-r-2 border-slate-900 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-5 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-wider text-red-600 dark:text-rose-400 block">
              Aarsi SaaS Workspace
            </span>
            <h4 className="font-sans text-lg font-bold text-slate-900 dark:text-white">
              AI એજ્યુકેશન ટૂલકીટ
            </h4>
          </div>

          <div className="space-y-2">
            {AI_TOOLS_LIST.map((tool, idx) => (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveToolIdx(idx);
                  setOutput("");
                  setCopied(false);
                }}
                className={`w-full text-left p-3 rounded-lg border-2 text-xs transition-all flex flex-col space-y-1 ${
                  activeToolIdx === idx
                    ? "bg-slate-900 text-white border-slate-900 shadow-[3px_3px_0px_#ef4444]"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-slate-800 hover:border-slate-400"
                }`}
              >
                <span className="font-bold">{tool.name}</span>
                <span className={`text-[10px] ${activeToolIdx === idx ? "text-gray-300" : "text-gray-500"}`}>
                  {tool.description.slice(0, 52)}...
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Inputs & Output Renderer */}
        <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h5 className="font-sans text-base font-bold text-slate-900 dark:text-white">
                {activeTool.name} પેનલ
              </h5>
              <p className="text-xs text-slate-500 mt-0.5">{activeTool.description}</p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeTool.inputs.map((inp) => (
                <div key={inp.key} className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {inp.label}
                  </label>
                  {inp.type === "select" ? (
                    <select
                      value={inputsState[inp.key] !== undefined ? inputsState[inp.key] : inp.options?.[0]}
                      onChange={(e) => handleInputChange(inp.key, e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700 rounded-lg p-2 text-xs font-sans text-slate-800 dark:text-white"
                    >
                      {inp.options?.map((opt, oIdx) => (
                        <option key={oIdx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={inp.type}
                      placeholder={`${inp.label} લખો...`}
                      value={inputsState[inp.key] !== undefined ? inputsState[inp.key] : ""}
                      onChange={(e) => handleInputChange(inp.key, e.target.type === "number" ? parseInt(e.target.value) : e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700 rounded-lg p-2 text-xs font-sans text-slate-850 dark:text-white"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white border-2 border-slate-900 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0px_#0f172a]"
          >
            <Sparkles className="w-4 h-4 text-white" /> {isLoading ? "જનરેટિંગ થઈ રહ્યું છે..." : "આરસી AI દ્વારા ફોર્મેટ બનાવો"}
          </button>

          {/* Render Loading steps */}
          {isLoading && (
            <div className="bg-red-50/50 dark:bg-slate-800/40 border border-red-100 dark:border-slate-800 rounded-xl p-4 text-center space-y-2">
              <span className="text-xs text-red-600 dark:text-red-300 font-bold block">{loadingStep}</span>
              <div className="w-full bg-gray-200 dark:bg-slate-755 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full animate-[loading_4s_ease-in-out_infinite]" style={{ width: "80%" }}></div>
              </div>
            </div>
          )}

          {/* Code Output Sandbox Window */}
          {output && !isLoading && (
            <div className="bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl p-5 border-2 border-slate-900 shadow-inner relative overflow-hidden flex flex-col">
              <div className="flex justify-between items-center pb-2 border-b border-white/5 mb-3 text-[10px] text-slate-500 select-none">
                <span>AARSI OUTPUT CONSOLE // {activeTool.id.toUpperCase()}-EXPORT</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyToClipboard}
                    className="hover:text-white flex items-center gap-1 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "કોપી થઈ ગયું!" : "કોપી કરો"}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="hover:text-white flex items-center gap-1 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ડાઉનલોડ</span>
                  </button>
                </div>
              </div>
              
              {/* Output Content */}
              <pre className="overflow-x-auto whitespace-pre-wrap max-h-72 leading-relaxed font-sans text-gray-200 font-normal">
                {output}
              </pre>
            </div>
          )}

          {/* Empty output indicator */}
          {!output && !isLoading && (
            <div className="bg-slate-50 dark:bg-slate-800/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-center justify-center text-center text-xs text-slate-500 select-none gap-2">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>પેરામીટર્સ પસંદ કરી ઉપરના રક્ત બટન વડે શ્રેષ્ઠ ટૂલ પરિણામ ચકાસો.</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
