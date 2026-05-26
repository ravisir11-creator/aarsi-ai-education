import React, { useState, useMemo } from "react";
import { Sparkles, RotateCcw, Lightbulb, BadgeInfo } from "lucide-react";

export default function PolynomialPlotter() {
  const [polyType, setPolyType] = useState<"quadratic" | "linear">("quadratic");
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-2);
  const [c, setC] = useState<number>(-3);

  // Reset values
  const handleReset = () => {
    setA(1);
    setB(-2);
    setC(-3);
  };

  // Calculations for graph
  const analysis = useMemo(() => {
    if (polyType === "linear") {
      const root = a !== 0 ? -b / a : null;
      return {
        type: "Linear (સુરેખ બહુપદી)",
        equation: `p(x) = ${a === 0 ? "" : a === 1 ? "x" : a === -1 ? "-x" : `${a}x`}${b >= 0 ? ` + ${b}` : ` - ${Math.abs(b)}`}`,
        zeros: root !== null ? [root] : [],
        discriminant: null,
        vertex: null,
      };
    } else {
      const disc = b * b - 4 * a * c;
      const vertexX = a !== 0 ? -b / (2 * a) : 0;
      const vertexY = a * vertexX * vertexX + b * vertexX + c;
      
      let zeros: number[] = [];
      if (a !== 0) {
        if (disc > 0) {
          const r1 = (-b + Math.sqrt(disc)) / (2 * a);
          const r2 = (-b - Math.sqrt(disc)) / (2 * a);
          zeros = [r1, r2].sort((x, y) => x - y);
        } else if (disc === 0) {
          zeros = [(-b) / (2 * a)];
        }
      }
      return {
        type: "Quadratic (દ્વિઘાત બહુપદી)",
        equation: `p(x) = ${a === 1 ? "x²" : a === -1 ? "-x²" : `${a}x²`}${b >= 0 ? ` + ${b === 1 ? "x" : `${b}x`}` : ` - ${b === -1 ? "x" : `${Math.abs(b)}x`}`}${c >= 0 ? ` + ${c}` : ` - ${Math.abs(c)}`}`,
        zeros,
        discriminant: disc,
        vertex: { x: vertexX, y: vertexY }
      };
    }
  }, [polyType, a, b, c]);

  // Generate SVG path coordinate mapping
  // We'll map math coords (X: -10 to 10, Y: -10 to 10) to SVG viewbox (W: 400, H: 400)
  const svgSize = 400;
  const padding = 20;
  const mapCoord = (x: number, y: number) => {
    // Math X [-8, 8] -> SVG X [padding, svgSize - padding]
    // Math Y [-8, 8] -> SVG Y [svgSize - padding, padding] (inverted Y axis)
    const svgX = padding + ((x + 8) / 16) * (svgSize - 2 * padding);
    const svgY = svgSize - padding - ((y + 8) / 16) * (svgSize - 2 * padding);
    return { x: svgX, y: svgY };
  };

  // Generate path d-attribute
  const pathD = useMemo(() => {
    let points: string[] = [];
    const step = 0.1;
    for (let xNum = -8; xNum <= 8; xNum += step) {
      let yNum = 0;
      if (polyType === "quadratic") {
        yNum = a * xNum * xNum + b * xNum + c;
      } else {
        yNum = a * xNum + b;
      }
      // Clamping outrageous Y values for clean curves
      if (yNum >= -15 && yNum <= 15) {
        const svgPt = mapCoord(xNum, yNum);
        points.push(`${svgPt.x},${svgPt.y}`);
      }
    }
    return points.length > 0 ? `M ${points.join(" L ")}` : "";
  }, [polyType, a, b, c]);

  // Origin point
  const origin = mapCoord(0, 0);

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-2xl shadow-[6px_6px_0px_#0f172a] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
        <div>
          <span className="bg-red-50 text-red-600 dark:bg-purple-950/40 dark:text-purple-300 text-xs px-2.5 py-1 rounded-full font-semibold inline-flex items-center gap-1.5 leading-none mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> પ્રકરણ ૨ આલેખ વિઝ્યુલાઈઝર (Std 10 Live Setup)
          </span>
          <h3 className="font-sans text-xl font-bold text-slate-900 dark:text-white">
            બહુપદી શૂન્ય અને ગ્રાફ પ્લોટર
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setPolyType("quadratic"); setA(1); setB(-2); setC(-3); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-slate-900 transition-all ${
              polyType === "quadratic"
                ? "bg-slate-900 text-white shadow-[2px_2px_0px_#ef4444]"
                : "bg-gray-50 text-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700 hover:bg-gray-100"
            }`}
          >
            દ્વિઘાત (Quadratic)
          </button>
          <button
            onClick={() => { setPolyType("linear"); setA(2); setB(-4); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-slate-900 transition-all ${
              polyType === "linear"
                ? "bg-slate-900 text-white shadow-[2px_2px_0px_#ef4444]"
                : "bg-gray-50 text-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700 hover:bg-gray-100"
            }`}
          >
            સુરેખ (Linear)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Controls & Math analysis */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 block mb-1">લાઈવ સમીકરણ (Active Formula):</span>
              <code className="text-lg font-mono font-bold text-red-600 dark:text-rose-400 block tracking-wide">
                {analysis.equation}
              </code>
            </div>

            {/* Coefficient Sliders */}
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>સહગુણક a (x² coefficient)</span>
                  <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-red-600 font-bold">{a}</span>
                </div>
                {polyType === "quadratic" ? (
                  <input
                    type="range"
                    min="-4"
                    max="4"
                    step="1"
                    value={a}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setA(val === 0 ? 1 : val); // prevent division by zero gracefully
                    }}
                    className="w-full accent-red-600 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                  />
                ) : (
                  <input
                    type="range"
                    min="-4"
                    max="4"
                    step="1"
                    value={a}
                    onChange={(e) => setA(parseInt(e.target.value))}
                    className="w-full accent-red-600 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                  />
                )}
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>સહગુણક b (x coefficient)</span>
                  <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-red-600 font-bold">{b}</span>
                </div>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  value={b}
                  onChange={(e) => setB(parseInt(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                />
              </div>

              {polyType === "quadratic" && (
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>અચળ પદ c (Constant)</span>
                    <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-red-600 font-bold">{c}</span>
                  </div>
                  <input
                    type="range"
                    min="-8"
                    max="8"
                    value={c}
                    onChange={(e) => setC(parseInt(e.target.value))}
                    className="w-full accent-emerald-600 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Analysis report card */}
            <div className="bg-red-50/50 dark:bg-slate-800/40 border border-red-100 dark:border-slate-800 rounded-xl p-4 space-y-3 text-slate-700 dark:text-slate-300">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> ગણિત કૂલ પૃથક્કરણ (Math Profile)
              </h4>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                {polyType === "quadratic" && (
                  <div className="space-y-1">
                    <span className="text-slate-500 block">વિવેચક (D = b² - 4ac):</span>
                    <span className={`font-mono font-bold ${analysis.discriminant! > 0 ? "text-emerald-600" : analysis.discriminant === 0 ? "text-blue-600" : "text-red-500"}`}>
                      {analysis.discriminant}
                    </span>
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-slate-500 block">વાસ્તવિક શૂન્યોની数量:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    {analysis.zeros.length} શૂન્ય
                  </span>
                </div>
                
                {polyType === "quadratic" && analysis.vertex && (
                  <div className="col-span-2 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 block">પરવલય શિરોબિંદુ / ધરી (Parabola Vertex):</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      ({analysis.vertex.x.toFixed(2)}, {analysis.vertex.y.toFixed(2)})
                    </span>
                  </div>
                )}

                <div className="col-span-2 space-y-1">
                  <span className="text-slate-500 block">બહુપદીના શૂન્યો (Roots / X-intercepts):</span>
                  {analysis.zeros.length > 0 ? (
                    <div className="flex gap-2 mt-1">
                      {analysis.zeros.map((z, idx) => (
                        <span key={idx} className="bg-slate-900 text-white dark:bg-slate-700 dark:text-white px-2 py-0.5 rounded text-xs font-mono font-bold">
                          x = {z.toFixed(2)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs italic text-red-500 font-semibold">વાસ્તવિક શૂન્યોનું અસ્તિત્વ નથી (No real roots)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border-2 border-slate-950 dark:border-slate-600 rounded-xl text-xs font-bold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> ગ્રાફ રીસેટ કરો
          </button>
        </div>

        {/* Right Side: Coordinate System Plot rendering using SVG */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative bg-slate-50 dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-800 rounded-xl p-3 w-full max-w-[360px] sm:max-w-full">
            <svg
              viewBox={`0 0 ${svgSize} ${svgSize}`}
              className="w-full h-auto aspect-square overflow-visible"
            >
              {/* Grid Lines */}
              {Array.from({ length: 17 }).map((_, i) => {
                const val = -8 + i;
                const ptX = mapCoord(val, 0);
                const ptY = mapCoord(0, val);
                return (
                  <React.Fragment key={i}>
                    {/* Vertical grid line */}
                    <line
                      x1={ptX.x}
                      y1={padding}
                      x2={ptX.x}
                      y2={svgSize - padding}
                      stroke={val === 0 ? "rgba(15, 23, 42, 0.45)" : "rgba(148, 163, 184, 0.15)"}
                      strokeWidth={val === 0 ? 2 : 1}
                    />
                    {/* Horizontal grid line */}
                    <line
                      x1={padding}
                      y1={ptY.y}
                      x2={svgSize - padding}
                      y2={ptY.y}
                      stroke={val === 0 ? "rgba(15, 23, 42, 0.45)" : "rgba(148, 163, 184, 0.15)"}
                      strokeWidth={val === 0 ? 2 : 1}
                    />
                    {/* Tick Mark Number Labels */}
                    {val !== 0 && val % 2 === 0 && (
                      <>
                        <text
                          x={ptX.x}
                          y={origin.y + 12}
                          fontSize="9"
                          fill="#64748b"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {val}
                        </text>
                        <text
                          x={origin.x - 10}
                          y={ptY.y + 3}
                          fontSize="9"
                          fill="#64748b"
                          textAnchor="end"
                          fontFamily="monospace"
                        >
                          {val}
                        </text>
                      </>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Parabola / Line Path */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              )}

              {/* Plot Vertex point */}
              {polyType === "quadratic" && analysis.vertex && (
                (() => {
                  const svPt = mapCoord(analysis.vertex.x, analysis.vertex.y);
                  if (svPt.x >= padding && svPt.x <= svgSize - padding && svPt.y >= padding && svPt.y <= svgSize - padding) {
                    return (
                      <g>
                        <circle cx={svPt.x} cy={svPt.y} r="6" fill="#1e3a8a" stroke="#fff" strokeWidth="1.5" />
                        <text x={svPt.x + 8} y={svPt.y - 4} fontSize="9" fill="#1e3a8a" className="font-bold bg-white/80 select-none">
                          શિરોબિંદુ ({analysis.vertex.x.toFixed(1)},{analysis.vertex.y.toFixed(1)})
                        </text>
                      </g>
                    );
                  }
                  return null;
                })()
              )}

              {/* Plot Zeros crossings */}
              {analysis.zeros.map((z, idx) => {
                const svPt = mapCoord(z, 0);
                return (
                  <g key={idx}>
                    <circle cx={svPt.x} cy={svPt.y} r="7" fill="#10b981" stroke="#fff" strokeWidth="2" />
                    <text
                      x={svPt.x}
                      y={svPt.y - 10}
                      fontSize="10"
                      fill="#065f46"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="select-none"
                    >
                      શૂન્ય ({z.toFixed(1)})
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Micro tooltip instruction */}
            <div className="flex gap-1.5 items-center justify-center mt-3 bg-blue-50/70 dark:bg-slate-800 text-blue-800 dark:text-blue-300 p-2 rounded-lg text-[10px] font-semibold">
              <BadgeInfo className="w-3.5 h-3.5 flex-shrink-0" />
              <span>આલેખ X-અક્ષને જેટલા બિંદુઓમાં છેદે, તેટલા તે બહુપદીના શૂન્યો છે! પ્લોટર સ્કેલ [-૮ થી ૮] નો છે.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
