import { useState } from "react";
import { CHAPTER_RESOURCES } from "../data/chapterReadyNotes";
import { CheckCircle2, AlertCircle, HelpCircle, Trophy, RotateCcw } from "lucide-react";

export default function QuizBoard() {
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(1); // default to Ch 2 Polynomials
  const [answers, setAnswers] = useState<{ [qIdx: number]: number }>({});
  const [score, setScore] = useState<number>(0);
  const [attemptedCount, setAttemptedCount] = useState<number>(0);

  const resource = CHAPTER_RESOURCES[selectedChapterIdx];

  const handleSelectOption = (qIdx: number, optionIdx: number, correctIdx: number) => {
    if (answers[qIdx] !== undefined) return; // already answered
    
    setAnswers({
      ...answers,
      [qIdx]: optionIdx
    });
    
    setAttemptedCount(prev => prev + 1);
    if (optionIdx === correctIdx) {
      setScore(prev => prev + 1);
    }
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setScore(0);
    setAttemptedCount(0);
  };

  return (
    <div className="bg-[#fcfaf4] dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 rounded-2xl shadow-[6px_6px_0px_#0f172a] p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-4 mb-6">
        <div>
          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1.5 mb-1.5">
            🎯 GSEB બોર્ડ પ્રિપરેશન ડેસ્ક
          </span>
          <h3 className="font-sans text-xl font-bold text-slate-900 dark:text-white">
            સ્માર્ટ એમ.સી.ક્યુ સ્કોરબોર્ડ (MCQ Hub)
          </h3>
        </div>
        
        {/* Chapter Switcher */}
        <select
          value={selectedChapterIdx}
          onChange={(e) => {
            setSelectedChapterIdx(parseInt(e.target.value));
            setAnswers({});
            setScore(0);
            setAttemptedCount(0);
          }}
          className="bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold font-sans text-slate-800 dark:text-white"
        >
          {CHAPTER_RESOURCES.map((ch, idx) => (
            <option key={idx} value={idx}>
              {ch.gujTitle}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Main Questions */}
        <div className="lg:col-span-8 space-y-6">
          {resource.mcqs.map((q, qIdx) => {
            const hasAnswered = answers[qIdx] !== undefined;
            const userAnswer = answers[qIdx];
            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <div
                key={qIdx}
                className="bg-white dark:bg-slate-800/80 border-2 border-slate-900 dark:border-slate-700 rounded-xl p-5 shadow-[3px_3px_0px_#0f172a] space-y-4"
              >
                <div className="flex gap-2.5">
                  <span className="bg-slate-900 text-white font-mono text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <h4 className="font-sans text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                    {q.question}
                  </h4>
                </div>

                {/* Option list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    let btnStyle = "border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700";
                    
                    if (hasAnswered) {
                      if (optIdx === q.correctAnswer) {
                        // show correct answer in green
                        btnStyle = "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-semibold";
                      } else if (optIdx === userAnswer) {
                        // user chose wrong, highlight red
                        btnStyle = "bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-100";
                      } else {
                        btnStyle = "opacity-50 border-slate-200 dark:border-slate-800";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(qIdx, optIdx, q.correctAnswer)}
                        className={`text-left text-xs font-sans px-4 py-3 rounded-lg border-2 transition-all flex justify-between items-center ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {hasAnswered && optIdx === q.correctAnswer && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        )}
                        {hasAnswered && optIdx === userAnswer && optIdx !== q.correctAnswer && (
                          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation section if answered */}
                {hasAnswered && (
                  <div className="bg-blue-50/70 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-800 rounded-lg p-3.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-300">
                      <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>સાચો જવાબ અને વૈજ્ઞાનિક સમજણ (Analysis / Hint):</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Col: Score Meter */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 rounded-xl p-5 shadow-[3px_3px_0px_#0f172a] text-center space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-yellow-100 dark:bg-amber-950/40 rounded-full text-yellow-600 mb-1">
              <Trophy className="w-7 h-7" />
            </div>
            
            <h4 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
              તમારી શૈક્ષણિક પ્રગતિ મીટર
            </h4>

            <div className="space-y-1">
              <div className="text-3xl font-mono font-black text-slate-900 dark:text-white">
                {score} / {resource.mcqs.length}
              </div>
              <p className="text-xs text-slate-500">ગણેલા અને સાચા પડેલા ઉકેલો</p>
            </div>

            {/* Score Message */}
            {attemptedCount === resource.mcqs.length && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                {score === resource.mcqs.length ? "અદ્ભુત! આ પ્રકરણના તમારા પાયાના ખ્યાલો તદ્દન સાચા છે. 🌟" : "ખૂબ સરસ પ્રયાસ! ફરી એકવાર સૂત્રોનો અભ્યાસ કરો. 📖"}
              </div>
            )}

            <button
              onClick={handleResetQuiz}
              className="w-full flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80 rounded-lg text-xs font-bold tracking-wide transition-all text-slate-800 dark:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" /> ફરીથી રમો
            </button>
          </div>

          <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-xl p-5 shadow-[3px_3px_0px_#ef4444] space-y-3.5">
            <h5 className="text-xs font-bold text-red-400 tracking-wider uppercase">
              આ પ્રકરણની સુવર્ણ કી (Formulas Sheet):
            </h5>
            <ul className="space-y-2 text-xs text-gray-300 font-sans">
              {resource.keyFormulas.map((form, idx) => (
                <li key={idx} className="flex gap-1.5 items-start">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{form}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
