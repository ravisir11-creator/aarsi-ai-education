import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ id: string; text: string; sender: "user" | "bot"; time: string }[]>([
    {
      id: "m1",
      text: "નમસ્તે! હું આરસી એજ્યુકેશન AI આસિસ્ટન્ટ છું. શિક્ષકો અને વિદ્યાર્થીઓ માટે પાઠ આયોજન, દાખલાઓ ઉકેલવા અને બોર્ડ પરીક્ષાના સ્માર્ટ પ્રશ્નો માટે મને કંઈપણ પૂછો! 🙏",
      sender: "bot",
      time: "01:40 AM"
    }
  ]);
  const [inputVal, setInputVal] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const userText = inputVal.trim();
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add User Message
    const userMsg = {
      id: Math.random().toString(),
      text: userText,
      sender: "user" as const,
      time: formattedTime
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);

    try {
      // Look for custom local math-helper keywords first for extremely fast, reliable response
      const lowercaseText = userText.toLowerCase();
      let botResponse = "";

      if (lowercaseText.includes("નમસ્તે") || lowercaseText.includes("હેલો") || lowercaseText.includes("hello")) {
        botResponse = "નમસ્તે! હું આપને કઈ સહાય કરી શકું? તમે કોઈ પ્રકરણ, દાખલા કે AI પ્રૉમ્પ્ટ્સ સંબંધી પૂછી શકો છો.";
      } else if (lowercaseText.includes("બહુપદી") || lowercaseText.includes("polynomial")) {
        botResponse = "બહુપદીઓ એ ધોરણ ૧૦ ગણિતનું ખૂબ જ સ્કોરિંગ પ્રકરણ છે. દ્વિઘાત બહુપદી p(x) = ax² + bx + c ના શૂન્યોનો સરવાળો α+β = -b/a અને શૂન્યોનો ગુણાકાર α·β = c/a છે. આલેખ પ્લોટર ટેસ્ટ કરવા ઉપર 'Student Hub' માં પ્લોટર ઓપન કરો!";
      } else if (lowercaseText.includes("બોર્ડ") || lowercaseText.includes("પરીક્ષા") || lowercaseText.includes("exam")) {
        botResponse = "બોર્ડ પરીક્ષાની પૂર્વતૈયારી માટે સાપ્તાહિક મોક ટેસ્ટ અને ટાઇમ મેનેજમેન્ટ અનિવાર્ય છે. આપણા 'Student Hub' ના ક્વિઝ અને ફોર્મ્યુલા સેક્શનની મદદથી મહત્વના પ્રશ્નોની પ્રેક્ટિસ કરો.";
      } else {
        // Fallback to calling our generalized OpenAI/Gemini AI prompt backend or mock nicely
        const res = await fetch("/api/ai/prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "Educational Counselor",
            task: userText,
            subject: "Mathematics and AI Education"
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          // Stripping down markdown bold tags since it's inside a simplified small chat widget
          botResponse = data.content.replace(/#+\s/g, "").replace(/\*\*/g, "");
        } else {
          botResponse = "હું ગણિત અને AI શિક્ષણ સંબંધિત સંશોધન કરી રહ્યો છું. આપ આપનો પ્રશ્ન 'AI Tool' માં મૂકીને સચોટ આયોજન કરી શકો છો.";
        }
      }

      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        text: botResponse,
        sender: "bot" as const,
        time: formattedTime
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        text: "ગણતરી પ્રક્રિયામાં થોડો અવરોધ આવ્યો છે. કૃપા કરીને થોડીવાર પછી ફરીથી પૂછો અથવા તમારા 'AI Tools' ને તપાસો.",
        sender: "bot" as const,
        time: formattedTime
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Trigger floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white p-4 rounded-full shadow-2xl border-2 border-slate-900 focus:outline-none flex items-center justify-center relative group transition-all transform hover:scale-105"
        >
          <span className="absolute -top-1 -right-1 bg-red-600 w-3.5 h-3.5 rounded-full inline-flex items-center justify-center text-[8px] font-bold text-white leading-none">
            ૧
          </span>
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Main Chat Panel */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 w-80 sm:w-96 rounded-2xl shadow-[6px_6px_0px_#0f172a] overflow-hidden flex flex-col h-[460px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-600 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-xs">આરસી એજ્યુકેશન AI</h4>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  <span className="text-[9px] text-gray-400">ઓનલાઇન સ્માર્ટ ટીચર</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages lists scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "ml-auto items-end" : "items-start"}`}
              >
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-slate-900 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-slate-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[9px] text-gray-400 mt-1 font-mono">{msg.time}</span>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-1">
                <span className="bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-800 p-2.5 rounded-xl rounded-bl-none text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 border-t-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
            <input
              type="text"
              placeholder="બહુપદીઓ એટલે શું? પૂછો..."
              value={inputVal}
              disabled={isLoading}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-slate-950 text-xs py-2 px-3 rounded-lg border-2 border-transparent dark:border-slate-700 dark:text-white focus:outline-none focus:border-red-600"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800 text-white rounded-lg transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
