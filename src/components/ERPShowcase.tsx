import React, { useState } from "react";
import { ERP_FEATURES } from "../data/mockData";
import { 
  UserCheck, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Search, 
  FileText, 
  Check, 
  ShieldAlert, 
  UserPlus, 
  Award, 
  MessageSquare, 
  Smartphone, 
  Printer, 
  Briefcase, 
  Layers 
} from "lucide-react";

const ICON_MAP: any = {
  UserCheck: UserCheck,
  BookOpen: BookOpen,
  Clock: Clock,
  TrendingUp: TrendingUp,
};

// Simulated General Register Database Records
const MOCK_GR_DATABASE = [
  { grNo: "10940", studentName: "વિવેક કુમાર રમેશભાઈ પ્રજાપતિ", birthDate: "૧૯-૦૪-૨૦૧૦", joinDate: "૧૫-૦૬-૨૦૧૬", leaveDate: "૨૧-૦૫-૨૦૨૬", standard: "૧૦ માધ્યમિક", conduct: "ખૂબ જ ઉત્તમ", progress: "મહત્ત્વપૂર્ણ સુધારો", reason: "ધોરણ ૧૦ બોર્ડ પાસ કરવા બાબત", division: "અ" },
  { grNo: "11245", studentName: "પ્રિયાબેન સંજયભાઈ પંડ્યા", birthDate: "૦૭-૧૧-૨૦૧૦", joinDate: "૧૫-૦૬-૨૦૧૬", leaveDate: "૨૪-૦૫-૨૦૨૬", standard: "૧૦ માધ્યમિક", conduct: "ઉત્તમ અને શિસ્તબદ્ધ", progress: "ખૂબ જ સરસ", reason: "ઉચ્ચતર અભ્યાસ અર્થે અન્યત્ર જવા હેતુ", division: "બ" },
  { grNo: "11602", studentName: "કેવલ જયેશભાઈ દોશી", birthDate: "૦૪-૦૨-૨૦૧૦", joinDate: "૧૮-૦૬-૨૦૧૭", leaveDate: "૧૮-૦૫-૨૦૨૬", standard: "૧૦ માધ્યમિક", conduct: "યોગ્ય સહયોગી", progress: "આશાસ્પદ વિદ્યાર્થી", reason: "ગૃહ બદલાવના કારણે", division: "અ" }
];

// Initial Admission Application pipeline
const INITIAL_ADMISSIONS = [
  { id: "ad-1", name: "ગાયત્રીબેન વિષ્ણુકુમાર બારોટ", parent: "વિષ્ણુકુમાર બારોટ", phone: "98765 43210", grade: "ધોરણ ૧૦", quota: "EWS સહાય (EWS)", stage: 1, docs: ["આધાર કાર્ડ", "જન્મનો દાખલો"], date: "૨૪-૦૫-૨૦૨૬" },
  { id: "ad-2", name: "મિહિરકુમાર હર્ષદભાઈ ચૌહાણ", parent: "હર્ષદભાઈ ચૌહાણ", phone: "94260 88122", grade: "ધોરણ ૧૧", quota: "મેરિટ સ્કોલરશીપ (Merit)", stage: 3, docs: ["આધાર કાર્ડ", "અગાઉનું LC", "જન્મનો દાખલો"], date: "૨૨-૦૫-２૦૨૬" },
  { id: "ad-3", name: "સાક્ષીબેન રાજેશભાઈ લાખાણી", parent: "રાજેશભાઈ લાખાણી", phone: "90481 22890", grade: "ધોરણ ૯", quota: "સામાન્ય (General)", stage: 0, docs: ["આધાર કાર્ડ"], date: "૨૪-૦૫-૨૦૨૬" }
];

// Initial student attendance roster for RFID Simulator
const INITIAL_ATTENDANCE_ROSTER = [
  { gr: "10940", name: "વિવેક પ્રજાપતિ", grade: "ધોરણ ૧૦", status: "Absent", rfid: "RFID-940", time: "-" },
  { gr: "11245", name: "પ્રિયા પંડ્યા", grade: "ધોરણ ૧૦", status: "Absent", rfid: "RFID-245", time: "-" },
  { gr: "11602", name: "કેવલ દોશી", grade: "ધોરણ ૧૦", status: "Absent", rfid: "RFID-602", time: "-" },
  { gr: "12088", name: "દિવ્યા મહેતા", grade: "ધોરણ ૧૦", status: "Absent", rfid: "RFID-088", time: "-" },
  { gr: "12314", name: "હર્ષિલ શાહ", grade: "ધોરણ ૧૦", status: "Present", rfid: "RFID-314", time: "૦૭:૫પ AM" }
];

export default function ERPShowcase() {
  const [activeTab, setActiveTab] = useState<"general-register" | "admission" | "attendance-rfid" | "report-cards">("general-register");

  // Tab 1 (General Register) State
  const [grSearchQuery, setGrSearchQuery] = useState<string>("");
  const [grSearchResults, setGrSearchResults] = useState<typeof MOCK_GR_DATABASE>([]);
  const [selectedLC, setSelectedLC] = useState<typeof MOCK_GR_DATABASE[0] | null>(null);
  const [showEmptyGrAlert, setShowEmptyGrAlert] = useState<boolean>(false);

  // Tab 2 (Admissions Pipeline) State
  const [admissions, setAdmissions] = useState<typeof INITIAL_ADMISSIONS>(INITIAL_ADMISSIONS);
  const [selectAdId, setSelectAdId] = useState<string>("ad-1");
  const [newAdName, setNewAdName] = useState("");
  const [newAdParent, setNewAdParent] = useState("");
  const [newAdPhone, setNewAdPhone] = useState("");
  const [newAdGrade, setNewAdGrade] = useState("ધોરણ ૧૦");
  const [newAdQuota, setNewAdQuota] = useState("સામાન્ય (General)");
  const [newAdDocs, setNewAdDocs] = useState<string[]>(["આધાર કાર્ડ"]);
  const [admissionSuccessMsg, setAdmissionSuccessMsg] = useState("");

  // Tab 3 (RFID Attendance) State
  const [attendanceList, setAttendanceList] = useState<typeof INITIAL_ATTENDANCE_ROSTER>(INITIAL_ATTENDANCE_ROSTER);
  const [rfidLog, setRfidLog] = useState<string[]>([
    "[૦૭:૪૫:૦૦]: RFID એટેન્ડન્સ સિસ્ટમ સક્રિય સ્કેન મોડમાં છે --",
    "[૦૭:૫૫:૧૨]: RFID-314 સ્કેન થયો - હર્ષિલ શાહ (ધોરણ ૧૦) - હાજર નોંધાયેલ"
  ]);
  const [lastScannedStudent, setLastScannedStudent] = useState<typeof INITIAL_ATTENDANCE_ROSTER[0] | null>(null);
  const [totalPresent, setTotalPresent] = useState<number>(1);
  const [showRfidBleep, setShowRfidBleep] = useState<boolean>(false);

  // Tab 4 (Report Cards Calculator) State
  const [selectedResultStudent, setSelectedResultStudent] = useState<typeof MOCK_GR_DATABASE[0]>(MOCK_GR_DATABASE[0]);
  const [scores, setScores] = useState<{ [subject: string]: number }>({
    "ગણિત (Maths)": 94,
    "વિજ્ઞાન (Science)": 88,
    "સામાજિક વિજ્ઞાન (S.S.)": 75,
    "ગુજરાતી (Language)": 85,
    "અંગ્રેજી (English)": 72
  });
  const [showPrintableReport, setShowPrintableReport] = useState<boolean>(false);

  // ──── Tab 1: General Register handlers ────
  const handleGrSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grSearchQuery.trim()) {
      setGrSearchResults([]);
      setSelectedLC(null);
      return;
    }

    const filtered = MOCK_GR_DATABASE.filter(student => 
      student.studentName.includes(grSearchQuery.trim()) || 
      student.grNo.includes(grSearchQuery.trim())
    );

    setGrSearchResults(filtered);
    if (filtered.length > 0) {
      setSelectedLC(filtered[0]);
      setShowEmptyGrAlert(false);
    } else {
      setSelectedLC(null);
      setShowEmptyGrAlert(true);
    }
  };

  // ──── Tab 2: Admissions Pipeline handlers ────
  const handleRegisterAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdName.trim() || !newAdParent.trim() || !newAdPhone.trim()) {
      alert("કૃપા કરીને બધી ફરજિયાત વિગતો ભરો!");
      return;
    }

    const newAdObj = {
      id: `ad-${Date.now()}`,
      name: newAdName.trim(),
      parent: newAdParent.trim(),
      phone: newAdPhone.trim(),
      grade: newAdGrade,
      quota: newAdQuota,
      stage: 0,
      docs: [...newAdDocs],
      date: new Date().toLocaleDateString("gu-IN")
    };

    setAdmissions([newAdObj, ...admissions]);
    setSelectAdId(newAdObj.id);
    setNewAdName("");
    setNewAdParent("");
    setNewAdPhone("");
    setAdmissionSuccessMsg(`અરજીકર્તા "${newAdObj.name}" ની પ્રવેશ અરજી સફળતાપૂર્વક ઓટોમેટેડ પાઇપલાઇનમાં દાખલ થઈ છે!`);
    setTimeout(() => setAdmissionSuccessMsg(""), 5000);
  };

  const handleToggleDocSelection = (doc: string) => {
    if (newAdDocs.includes(doc)) {
      setNewAdDocs(newAdDocs.filter(d => d !== doc));
    } else {
      setNewAdDocs([...newAdDocs, doc]);
    }
  };

  const handleAdvanceAdmissionStage = (id: string) => {
    setAdmissions(prev => prev.map(ad => {
      if (ad.id === id) {
        const nextStage = ad.stage < 3 ? ad.stage + 1 : 3;
        return { ...ad, stage: nextStage };
      }
      return ad;
    }));
  };

  const selectedAdmission = admissions.find(ad => ad.id === selectAdId) || admissions[0];

  const getTuitionFeeDetails = (grade: string, quota: string) => {
    let base = 12000;
    if (grade.includes("૧૦")) base = 15000;
    if (grade.includes("૧૧") || grade.includes("૧૨")) base = 18000;

    let discountPct = 0;
    let label = "સામાન્ય ફી માળખું";
    if (quota.includes("EWS")) {
      discountPct = 75;
      label = "EWS સરકાર પોલિસી (૭૫% શિષ્યવૃત્તિ)";
    } else if (quota.includes("મેરિટ")) {
      discountPct = 90;
      label = "આરસી એલિટ સ્કોલર્સ (૯૦% મેરિટ રિબેટ)";
    }

    const discountAmount = (base * discountPct) / 100;
    const finalFee = base - discountAmount;

    return { base, discountPct, discountAmount, finalFee, label };
  };

  // ──── Tab 3: RFID Attendance handlers ────
  const handleSwipeRFID = (gr: string) => {
    const timeNow = new Date().toLocaleTimeString("gu-IN", { hour: "2-digit", minute: "2-digit" });
    
    // Play virtual bleep
    setShowRfidBleep(true);
    setTimeout(() => {
      setShowRfidBleep(false);
    }, 450);

    setAttendanceList(prev => prev.map(std => {
      if (std.gr === gr) {
        if (std.status === "Absent") {
          const updated = { ...std, status: "Present" as const, time: timeNow };
          setLastScannedStudent(updated);
          // Append to RFID Machine Logs
          setRfidLog(l => [
            `[${new Date().toLocaleTimeString("gu-IN")}]: RFID CARD READ - #${std.rfid} (${std.name}) -- સ્માર્ટ ગેઇટ હાજરી નોંધાયેલ`,
            ...l
          ]);
          return updated;
        }
      }
      return std;
    }));

    // Recalculate Attendance Rate
    setTimeout(() => {
      setAttendanceList(curr => {
        const presentCount = curr.filter(s => s.status === "Present").length;
        setTotalPresent(presentCount);
        return curr;
      });
    }, 50);
  };

  const handleResetAttendance = () => {
    setAttendanceList(INITIAL_ATTENDANCE_ROSTER);
    setTotalPresent(1);
    setLastScannedStudent(null);
    setRfidLog([
      `[${new Date().toLocaleTimeString("gu-IN")}]: RFID એટેન્ડન્સ લાઈવ રીસેટ પૂર્ણ કરવામાં આવ્યું છે.`
    ]);
  };

  // ──── Tab 4: Report Card computations ────
  const handleScoreChange = (subject: string, val: number) => {
    setScores(prev => ({
      ...prev,
      [subject]: val
    }));
  };

  const handleSelectResultStudent = (gr: string) => {
    const found = MOCK_GR_DATABASE.find(s => s.grNo === gr);
    if (found) {
      setSelectedResultStudent(found);
      // Alter scores slightly to simulate different profiles
      if (gr === "11245") {
        setScores({
          "ગણિત (Maths)": 96,
          "વિજ્ઞાન (Science)": 94,
          "સામાજિક વિજ્ઞાન (S.S.)": 89,
          "ગુજરાતી (Language)": 92,
          "અંગ્રેજી (English)": 85
        });
      } else if (gr === "11602") {
        setScores({
          "ગણિત (Maths)": 78,
          "વિજ્ઞાન (Science)": 81,
          "સામાજિક વિજ્ઞાન (S.S.)": 85,
          "ગુજરાતી (Language)": 79,
          "અંગ્રેજી (English)": 74
        });
      } else {
        setScores({
          "ગણિત (Maths)": 94,
          "વિજ્ઞાન (Science)": 88,
          "સામાજિક વિજ્ઞાન (S.S.)": 75,
          "ગુજરાતી (Language)": 85,
          "અંગ્રેજી (English)": 72
        });
      }
    }
  };

  const scoreStats = React.useMemo(() => {
    const list = Object.values(scores) as number[];
    const total = list.reduce((a, b) => a + b, 0);
    const pct = total / list.length;
    
    let grade = "D";
    if (pct >= 91) grade = "A1";
    else if (pct >= 81) grade = "A2";
    else if (pct >= 71) grade = "B1";
    else if (pct >= 61) grade = "B2";
    else if (pct >= 51) grade = "C1";
    else if (pct >= 35) grade = "C2";

    const isPassed = list.every(score => score >= 35);

    let remark = "સાધારણ પરિણામ. નિયમિત પુનરાવર્તન અને વિશેષ પદ્ધતિસર અભ્યાસ વધારવાની તાતી જરૂર છે.";
    if (pct >= 90) remark = "અદ્ભુત! અસાધારણ અને સર્વશ્રેષ્ઠ શૈક્ષણિક પ્રાવીણ્ય બોર્ડ ટોપર પદવી લાયક ગુણોત્તર!";
    else if (pct >= 75) remark = "સરસ અને ઉન્નત સ્તરનું પરિણામ. નબળા વિષયો ઉપર થોડો વિશેષ મહાવરો ગણિત ને મજબૂત કરશે.";
    else if (pct < 50) remark = "ખૂબ જ ચિંતાજનક પ્રદર્શન. શાળાના વિશેષ ઉપચારાત્મક (Remedial) વધારાના વર્ગોમાં હાજરી અતિ અનિવાર્ય છે.";

    return { total, pct, grade, remark, isPassed };
  }, [scores]);

  return (
    <div className="bg-[#fbf8ee] text-slate-900 border-2 border-slate-900 rounded-3xl p-5 sm:p-7 space-y-8 shadow-[6px_6px_0px_#0f172a] select-none transition-colors duration-200">
      
      {/* Brand & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-slate-900 pb-5">
        <div>
          <span className="bg-[#DC2626] text-white text-[10px] px-3 py-1 rounded-md font-black tracking-widest uppercase inline-block mb-1.5">
            🏫 AARSI SMART CAMPUS ERP
          </span>
          <h3 className="font-sans text-2xl font-black text-slate-900 flex items-center gap-1 leading-tight uppercase font-sans">
            શિક્ષણ પ્રણાલી સંસાધન પોર્ટલ <Layers className="w-5 h-5 text-red-650" />
          </h3>
          <p className="text-xs text-slate-650 max-w-2xl mt-1 leading-relaxed">
            શિક્ષણ સદ્ગૃહસ્થ, આચાર્યશ્રી અને શાળા વહીવટી સ્ટાફને ચિંતામુક્ત બનાવવા માટેનું પ્રબળ વહીવટી ઓટોમેશન હાર્નેસ. નીચે આપેલા રિયલ-ટાઇમ સ્માર્ટ ડેસ્ક પરથી લાઈવ સેન્ડબોક્સ ટેસ્ટ લો.
          </p>
        </div>
        
        {/* Quick overall statistical indicators */}
        <div className="bg-white border-2 border-slate-900 p-3 rounded-2xl shadow-[3px_3px_0px_#0f172a] flex items-center gap-4 flex-shrink-0">
          <div className="text-center">
            <span className="text-[8px] text-slate-400 font-bold uppercase block">ઓટો હાજરી દર</span>
            <span className="text-sm font-mono font-black text-[#DC2626]">
              {Math.round((totalPresent / attendanceList.length) * 100)}%
            </span>
          </div>
          <div className="w-[1px] h-8 bg-slate-200"></div>
          <div className="text-center">
            <span className="text-[8px] text-slate-400 font-bold uppercase block">પ્રવેશ અરજીઓ</span>
            <span className="text-sm font-mono font-black text-teal-600">{admissions.length}</span>
          </div>
        </div>
      </div>

      {/* Grid: 4 Interactive Mini Features Highlight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ERP_FEATURES.map((feat) => {
          const IconComponent = ICON_MAP[feat.iconName] || BookOpen;
          return (
            <div
              key={feat.id}
              className="bg-white border-2 border-slate-900 p-4 rounded-2xl flex flex-col justify-between space-y-3.5 shadow-[3px_3px_0px_#1e293b] hover:shadow-[5px_5px_0px_#1e293b] transition-all cursor-pointer"
              onClick={() => {
                if (feat.id === "general-register") setActiveTab("general-register");
                else if (feat.id === "admission") setActiveTab("admission");
                else if (feat.id === "attendance-rfid") setActiveTab("attendance-rfid");
                else if (feat.id === "report-cards") setActiveTab("report-cards");
              }}
            >
              <div className="space-y-1.5">
                <div className="p-2 bg-red-50 text-red-650 border border-slate-200 rounded-xl inline-block">
                  <IconComponent className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-black text-xs text-slate-900 leading-tight">
                  {feat.gujTitle}
                </h4>
                <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                  {feat.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-dashed border-gray-150 text-[10px]">
                {feat.metrics.map((m, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <span className="text-[8px] text-slate-400 block uppercase tracking-tight truncate">
                      {m.label}
                    </span>
                    <span className="font-mono font-bold text-[#DC2626]">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Retro Neobrutalist Tab Switcher Row */}
      <div className="flex flex-wrap gap-2 border-b-2 border-slate-900 pb-3">
        {[
          { id: "general-register", label: "જનરલ રજીસ્ટર LC", icon: BookOpen },
          { id: "admission", label: "પ્રવેશ એડમિશન પાઇપલાઇન", icon: UserPlus },
          { id: "attendance-rfid", label: "RFID સ્માર્ટ હાજરી", icon: Clock },
          { id: "report-cards", label: "પ્રગતિ રિપોર્ટ કાર્ડ", icon: Award }
        ].map(tab => {
          const TabIcon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setShowPrintableReport(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all border-2 flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                isSelected
                  ? "bg-[#1E3A8A] text-white border-slate-900 shadow-[3px_3px_0px_#dc2626]"
                  : "bg-white text-slate-800 border-slate-200 hover:border-slate-950 shadow-sm"
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Main Workspace Box */}
      <div className="min-h-[400px]">
        
        {/* ==================== TAB 1: GENERAL REGISTER (GR & LC) ==================== */}
        {activeTab === "general-register" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            
            {/* Search sidebar panel */}
            <div className="lg:col-span-4 bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] space-y-4">
              <h5 className="font-black text-xs uppercase tracking-wider text-slate-500 mb-1">
                ૧. જનરલ રજીસ્ટર સર્ચ ડેસ્ક (GR Search)
              </h5>
              <p className="text-[10px] text-slate-500 leading-normal">
                ઇન્સ્ટન્ટ વિદ્યાર્થી પૂર્વાનુમાન માટે રજીસ્ટર અંકો અથવા પુખ્ત નામ લખો.
              </p>
              
              <form onSubmit={handleGrSearch} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="નામ (જેમ કે: વિવેક, પ્રિયા, કેવલ)..."
                    value={grSearchQuery}
                    onChange={(e) => setGrSearchQuery(e.target.value)}
                    className="w-full bg-[#fbf8ee] border-2 border-slate-900 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold font-sans transition flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.8)]"
                >
                  <Search className="w-4 h-4" /> વિગતો શોધો
                </button>
              </form>

              {/* Sample helpers quick click */}
              <div className="border-t border-dashed border-gray-200 pt-3">
                <span className="text-[10px] text-slate-400 font-bold block mb-1.5">ડેમો માહિતી મેળવવા માટે સીધા ક્લિક કરો:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {["વિવેક", "પ્રિયા", "કેવલ"].map(name => (
                    <button
                      key={name}
                      onClick={() => {
                        setGrSearchQuery(name);
                        const filtered = MOCK_GR_DATABASE.filter(s => s.studentName.includes(name));
                        setGrSearchResults(filtered);
                        if (filtered.length > 0) {
                          setSelectedLC(filtered[0]);
                          setShowEmptyGrAlert(false);
                        }
                      }}
                      className="text-[10px] py-1 bg-[#faf6ea] border border-slate-350 hover:border-slate-900 rounded-lg text-slate-850 font-bold text-center transition"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated Leaving Certificate visual renderer */}
            <div className="lg:col-span-8">
              {selectedLC ? (
                <div className="bg-[#fcfaf4] border-2 border-yellow-850 border-double p-5 sm:p-7 rounded-2xl shadow-[4px_4px_0px_#854d0e] space-y-6 relative overflow-hidden">
                  
                  {/* Decorative vintage seal graphic */}
                  <div className="absolute right-8 top-12 opacity-5 pointer-events-none select-none">
                    <FileText className="w-56 h-56 rotate-12 text-[#854d0e]" />
                  </div>

                  <div className="flex justify-between items-start border-b border-amber-900/10 pb-4">
                    <div className="space-y-1 text-center w-full">
                      <h4 className="font-serif text-lg font-black text-[#854d0e] tracking-wider uppercase">
                        આરસી મોડલ સેકન્ડરી હાઇસ્કૂલ, અમદાવાદ
                      </h4>
                      <p className="text-[9px] font-bold text-slate-550 italic leading-none">
                        ગુજરાત શૈક્ષણિક વિનિમય કાયદા (GSEB-SSC/114.09) સલગ્ન મંજૂરીપત્ર
                      </p>
                      <span className="font-sans text-xs bg-amber-100 border border-amber-900/15 text-amber-900 px-4 py-0.5 rounded-md inline-block uppercase font-bold mt-2">
                        શાળા છોડ્યા પ્રમાણપત્ર (SCHOOL LEAVING CERTIFICATE)
                      </span>
                    </div>
                  </div>

                  {/* Metadata matrix */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-amber-900/10 pb-4 text-xs">
                    <div>
                      <span className="text-slate-400 text-[8px] uppercase font-bold block">GR બુક નોંધ ક્રમ</span>
                      <strong className="text-slate-900 font-mono text-xs">{selectedLC.grNo}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[8px] uppercase font-bold block">યુનિક કોડ નંબર</span>
                      <strong className="text-slate-905 font-mono text-xs">UID-GSEB{selectedLC.grNo}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[8px] uppercase font-bold block">વિદ્યાર્થી વર્ગ શાખા</span>
                      <strong className="text-slate-905 text-xs">{selectedLC.standard} (વર્ગ-{selectedLC.division})</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[8px] uppercase font-bold block">રજુઆત તારીખ</span>
                      <strong className="text-slate-905 text-xs font-mono">{selectedLC.leaveDate}</strong>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-3 text-xs leading-loose text-slate-800 font-serif">
                    <p>
                      ૧. વિદ્યાર્થીનું આખું નામ (સરકારી વ્યાકરણ મુજબ) : <strong className="border-b border-amber-900/30 pb-0.5">{selectedLC.studentName}</strong>
                    </p>
                    <p>
                      ૨. બોર્ડ રજીસ્ટ્રેશન નોંધમાં જન્મ તારીખ : <strong className="border-b border-amber-900/30 pb-0.5">{selectedLC.birthDate}</strong>
                    </p>
                    <p>
                      ૩. કાયદેસર શાળા પ્રવેશ દિવસ : <strong>{selectedLC.joinDate}</strong> અને શાળા ત્યાગની અંતિમોક્ત તારીખ : <strong className="text-[#DC2626]">{selectedLC.leaveDate}</strong>.
                    </p>
                    <p>
                      ૪. શાળામાં સાપ્તાહિક પ્રવૃત્તિ આચરણ : <strong className="bg-amber-100/50 px-1.5 py-0.5 rounded font-bold text-amber-950">{selectedLC.conduct}</strong>.
                    </p>
                    <p>
                      ૫. બોર્ડ પ્રકરણ અભ્યાસ પ્રગતિ : <strong>{selectedLC.progress}</strong>.
                    </p>
                    <p>
                      ૬. શાળા છોડવાનું સ્પષ્ટ ઠોસ કારણ : <strong className="italic">{selectedLC.reason}</strong>.
                    </p>
                  </div>

                  {/* Stamp Seals and sign block */}
                  <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-dashed border-amber-900/20 gap-4 text-xs font-serif text-[#854d0e]">
                    <div className="text-center sm:text-left space-y-1">
                      <span className="block text-[10px] text-slate-400 italic">ડ્રાફ્ટ તૈયારી કારક</span>
                      <strong className="block border-t border-amber-900/20 pt-1 w-28">નિરુપમા ભટ્ટ</strong>
                    </div>
                    
                    {/* Retro Stamp */}
                    <div className="w-16 h-16 bg-red-50 rounded-full border-2 border-red-500 border-dashed flex flex-col items-center justify-center text-[7px] font-black tracking-widest text-red-500 rotate-12 shadow-sm">
                      <span className="uppercase text-[5px]">APPROVED</span>
                      <span>AARSI ERP</span>
                      <span>અધિકૃત મહોર</span>
                    </div>

                    <div className="text-center sm:text-right space-y-1">
                      <span className="block text-[10px] text-slate-400 italic">માનનીય રજિસ્ટ્રાર આચાર્યશ્રી હસ્તે</span>
                      <strong className="block border-t border-amber-900/20 pt-1 w-36">આર. કે. મહેતા (Sign)</strong>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="bg-white border-2 border-slate-900 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[360px]">
                  <FileText className="w-12 h-12 text-[#DC2626] animate-pulse" />
                  <h5 className="font-bold text-sm text-slate-800">સંકલિત સર્ટિફિકેટ પ્રિન્ટિંગ પેનલ સક્રિય છે</h5>
                  <p className="text-xs text-slate-500 max-w-sm">
                    ડાબી બાજુ આપેલા રજીસ્ટર સેક્શનમાંથી કોઈપણ બાળકના નામ પર ગોઠવીને સિલેક્ટ કરો જેથી GSEB પરિશિષ્ટ માળખુ સચોટ લાઈવ લોડ અને પ્રિન્ટ કરી શકાય.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================== TAB 2: ADMISSIONS PIPELINE ==================== */}
        {activeTab === "admission" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Show success message if any */}
            {admissionSuccessMsg && (
              <div className="bg-emerald-50 border-2 border-emerald-500 p-3 rounded-xl text-emerald-800 text-xs font-bold animate-bounce flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{admissionSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Form: Intake registration */}
              <div className="lg:col-span-4 bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_#000000] space-y-4">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <UserPlus className="w-4 h-4 text-[#DC2626]" />
                  <h5 className="font-sans text-xs font-black uppercase text-slate-500">
                    નવું એડમિશન રજીસ્ટ્રેશન ડેસ્ક
                  </h5>
                </div>

                <form onSubmit={handleRegisterAdmission} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">વિદ્યાર્થીનું પૂરું નામ (Gujarati)</label>
                    <input
                      type="text"
                      placeholder="જેમ કે: કુમાર દર્શક સોરેન..."
                      value={newAdName}
                      onChange={(e) => setNewAdName(e.target.value)}
                      className="w-full bg-[#fbf8ee] border-2 border-slate-900 rounded-lg p-2 font-sans focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">માતા/પિતા અથવા વાલીનું નામ</label>
                    <input
                      type="text"
                      placeholder="જેમ કે: દર્જીતકુમાર સોરેન..."
                      value={newAdParent}
                      onChange={(e) => setNewAdParent(e.target.value)}
                      className="w-full bg-[#fbf8ee] border-2 border-slate-900 rounded-lg p-2 font-sans focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">વાલીનો વોટ્સએપ મોબાઈલ</label>
                    <input
                      type="text"
                      placeholder="૯૮૭૯૦ XXXXX..."
                      value={newAdPhone}
                      onChange={(e) => setNewAdPhone(e.target.value)}
                      className="w-full bg-[#fbf8ee] border-2 border-slate-900 rounded-lg p-2 font-mono font-bold focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">પ્રવેશ ધોરણ</label>
                      <select
                        value={newAdGrade}
                        onChange={(e) => setNewAdGrade(e.target.value)}
                        className="w-full bg-[#fbf8ee] border-2 border-slate-900 rounded-lg p-1.5"
                      >
                        <option value="ધોરણ ૮">ધોરણ ૮</option>
                        <option value="ધોરણ ૯">ધોરણ ૯</option>
                        <option value="ધોરણ ૧૦">ધોરણ ૧૦ (SSC)</option>
                        <option value="ધોરણ ૧૧">ધોરણ ૧૧</option>
                        <option value="ધોરણ ૧૨">ધોરણ ૧૨ (HSC)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">રિબેટ કોટા</label>
                      <select
                        value={newAdQuota}
                        onChange={(e) => setNewAdQuota(e.target.value)}
                        className="w-full bg-[#fbf8ee] border-2 border-slate-900 rounded-lg p-1.5"
                      >
                        <option value="સામાન્ય (General)">સામાન્ય (General)</option>
                        <option value="EWS સહાય (EWS)">EWS સહાય (75%)</option>
                        <option value="મેરિટ સ્કોલરશીપ (Merit)">મેરિટ સ્કોલર્સ (90%)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="font-bold block text-slate-700 mb-1">ચકાસેલ મૂળ દસ્તાવેજો</span>
                    <div className="space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      {["આધાર કાર્ડ", "અગાઉનું LC", "જન્મનો દાખલો", "આવકનું પ્રમાણપત્ર"].map(doc => (
                        <label key={doc} className="flex items-center gap-2 cursor-pointer text-[10px]">
                          <input
                            type="checkbox"
                            checked={newAdDocs.includes(doc)}
                            onChange={() => handleToggleDocSelection(doc)}
                            className="rounded border-slate-400"
                          />
                          <span>{doc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-red-650 hover:bg-red-750 text-white rounded-xl font-bold tracking-wider transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.9)] text-xs mt-2"
                  >
                    અરજી સબમિટ કરો (Register Form)
                  </button>
                </form>
              </div>

              {/* Right content: Pipeline pipeline workflow */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Applicants quick list selector row */}
                <div className="bg-white p-3.5 border-2 border-slate-900 rounded-2xl flex flex-wrap items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">ચકાસણી હેઠળ અરજીઓ:</span>
                  {admissions.map(ad => (
                    <button
                      key={ad.id}
                      onClick={() => setSelectAdId(ad.id)}
                      className={`text-[10px] px-3 py-1 rounded-lg border font-bold transition ${
                        selectAdId === ad.id
                          ? "bg-[#1E3A8A] text-white border-slate-900"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-transparent"
                      }`}
                    >
                      {ad.name.split(" ")[0]}
                    </button>
                  ))}
                </div>

                {/* Selected applicant timeline detail card */}
                {selectedAdmission && (
                  <div className="bg-white p-5 border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,0.85)] space-y-6">
                    
                    {/* Card heading details */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] bg-slate-100 px-2 py-0.5 border border-slate-200 text-slate-500 font-mono font-bold rounded-md">
                          APPLICATION ID: {selectedAdmission.id.toUpperCase()}
                        </span>
                        <h4 className="font-sans text-sm font-black text-slate-900">
                          {selectedAdmission.name}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          વાલી: {selectedAdmission.parent} | સંપર્ક નંબર: {selectedAdmission.phone}
                        </p>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-300 p-2 text-right rounded-xl text-[10px] flex-shrink-0">
                        <span className="text-slate-400 block uppercase font-bold text-[8px]">સૂચિત કોટા / નોંધણી</span>
                        <strong className="text-amber-800 font-bold block">{selectedAdmission.quota}</strong>
                        <span className="text-slate-500 font-bold">{selectedAdmission.grade}</span>
                      </div>
                    </div>

                    {/* Stage Timeline step chart visualization */}
                    <div className="space-y-2">
                      <span className="text-[9.5px] text-slate-400 font-bold uppercase block">
                        પ્રવેશ વહીવટ પ્રક્રિયા ટ્રેકર (Workflow Pipeline Stage)
                      </span>
                      
                      {/* Flex steps diagram */}
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] pt-1">
                        {[
                          { id: 0, text: "૧. અરજી સબમિટ", badge: "સફળ રેકોર્ડ" },
                          { id: 1, text: "૨. ચકાસણી ઓકે", badge: "દસ્તાવેજો ફાઇલ" },
                          { id: 2, text: "૩. એડમિશન ટેસ્ટ", badge: "મહેનત ગુણોત્તર" },
                          { id: 3, text: "૪. પ્રવેશ નિશ્ચિત!", badge: "પીન જનરેટ" }
                        ].map((stage, sIdx) => {
                          const isDone = selectedAdmission.stage >= stage.id;
                          const isCurrent = selectedAdmission.stage === stage.id;
                          return (
                            <div key={stage.id} className="space-y-1.5 relative">
                              {/* Circle node wrapper */}
                              <div className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center font-bold font-mono text-xs border-2 transition ${
                                isDone
                                  ? isCurrent 
                                    ? "bg-red-600 text-white border-slate-900 animate-pulse" 
                                    : "bg-emerald-500 text-white border-slate-900"
                                  : "bg-slate-50 text-slate-400 border-slate-200"
                              }`}>
                                {isDone && !isCurrent ? <Check className="w-3.5 h-3.5" /> : stage.id + 1}
                              </div>
                              <div className={`font-semibold shrink-0 truncate ${isCurrent ? "text-slate-900 font-bold" : "text-slate-500"}`}>
                                {stage.text}
                              </div>
                              <span className="text-[8px] text-slate-400 block translate-y-[-2px]">{stage.badge}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Interactive workflow management triggers */}
                    <div className="bg-[#fcfbf9] border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-800 block">વહીવટી પગલું ક્રિયા ડેસ્ક:</span>
                        <p className="text-[10.5px] text-slate-500 leading-normal max-w-sm">
                          {selectedAdmission.stage === 0 && "અરજી ચકાસણી યોગ્ય લાગે તો સ્ટાફ આગળના પગલા પર આગળ વધારી શકે છે."}
                          {selectedAdmission.stage === 1 && "મૂળભૂત વિગતો ઓનલાઈન યોગ્ય જણાયેલ છે. પ્રવેશ મૂલ્યાંકન ટેસ્ટ શિડ્યુલ કરવા બટન દબાવો."}
                          {selectedAdmission.stage === 2 && "વિદ્યાર્થીએ મૂલ્યાંકન ટેસ્ટમાં સારો બોર્ડ લાયક સ્કોર મેળવ્યો છે. પ્રવેશ મંજૂર કરવા ફાઇનલ ક્લિક લો."}
                          {selectedAdmission.stage === 3 && "અભિનંદન! આ વિદ્યાર્થીનું એડમિશન શાળા રજિસ્ટર માં નિશ્ચિત થઈ ચૂક્યું છે. વાલીને ઓટોમેટેડ મેસેજ જશે."}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAdvanceAdmissionStage(selectedAdmission.id)}
                        disabled={selectedAdmission.stage === 3}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold font-sans transition-all active:scale-95 flex-shrink-0 flex items-center gap-1.5 shadow ${
                          selectedAdmission.stage === 3
                            ? "bg-emerald-100 text-emerald-800 cursor-not-allowed border-transparent"
                            : "bg-[#1E3A8A] hover:bg-blue-850 text-white border-2 border-slate-950 font-bold"
                        }`}
                      >
                        {selectedAdmission.stage === 3 ? (
                          <><Check className="w-4 h-4" /> પ્રક્રિયા મંજૂર!</>
                        ) : (
                          <>પગલું આગળ ધપાવો શિફ્ટ →</>
                        )}
                      </button>
                    </div>

                    {/* Fee estimate details section */}
                    <div className="border-t border-dashed border-slate-200 pt-4 space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">નવું ફી વિભાજન અને ભરપાઈ (Calculated Tuition Fee):</span>
                      
                      {(() => {
                        const feeDetails = getTuitionFeeDetails(selectedAdmission.grade, selectedAdmission.quota);
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                            <div className="p-3 bg-slate-50 rounded-lg">
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">ધોરણ વાર્ષિક ફી</span>
                              <strong className="text-slate-700 text-sm font-mono">₹{feeDetails.base.toLocaleString()}</strong>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg">
                              <span className="text-red-650 block text-[9px] uppercase font-bold">લાભાર્થી સ્કોલરશીપ</span>
                              <strong className="text-[#DC2626] text-sm font-mono">₹{feeDetails.discountAmount.toLocaleString()} ({feeDetails.discountPct}%)</strong>
                              <span className="text-[8px] text-slate-400 block mt-0.5 truncate">{feeDetails.label}</span>
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-250">
                              <span className="text-emerald-800 block text-[9px] uppercase font-bold">અંતિમ પકલી ફી (પર ટર્મ)</span>
                              <strong className="text-emerald-700 text-sm font-semibold font-mono">₹{feeDetails.finalFee.toLocaleString()}</strong>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Summary Document list for checklist */}
                    <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                      <div className="space-y-1">
                        <span className="text-slate-400 font-bold text-[9px] uppercase block">દસ્તાવેજો ચેકલિસ્ટ સબમિટ:</span>
                        <div className="space-y-1">
                          {["આધાર કાગળ", "અગાઉનું શાળા LC", "જન્મ નોંધણી પ્રમાણપત્ર"].map((item, idx) => {
                            const isIncluded = idx === 0 || (idx === 1 && selectedAdmission.stage >= 1) || (idx === 2 && selectedAdmission.stage >= 2);
                            return (
                              <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-700">
                                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-[8px] ${isIncluded ? "bg-emerald-100 text-emerald-600" : "bg-red-50 text-red-400"}`}>
                                  {isIncluded ? "✓" : "✗"}
                                </span>
                                <span>{item}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 font-bold text-[9px] uppercase block">ન્યૂ સત્ર બેચ લોન્ચિંગ:</span>
                        <strong className="text-slate-800 block text-[10px]">જૂન ૨૦૨૬ શૈક્ષણિક સત્ર</strong>
                        <span className="text-[10px] text-slate-500 leading-normal block">
                          પ્રવેશ મંજૂર થતાં જ બોર્ડની ઓરિએન્ટેશન કીટો અને આઇકાર્ડ વાલીને રજીસ્ટર્ડ પોસ્ટ અથવા સ્માર્ટ કલેક્શન દ્વારા મળશે.
                        </span>
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB 3: RFID ATTENDANCE ==================== */}
        {activeTab === "attendance-rfid" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in relative">
            
            {/* Visual virtual scanner module column */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Retro Device design */}
              <div className="bg-slate-900 border-4 border-slate-950 p-5 rounded-2xl text-white space-y-4 shadow-xl relative overflow-hidden">
                
                {/* Decorative blinking light */}
                <div className="absolute right-4 top-4 flex items-center gap-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${showRfidBleep ? "bg-green-500 animate-ping" : "bg-red-500"}`}></span>
                  <span className="text-[8px] text-slate-400 font-mono">STATUS: ONLINE</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-mono text-xs font-bold text-slate-400">
                    AARSI-GATEWAY // MODEL-R12
                  </h4>
                  <h3 className="font-sans text-sm font-black text-rose-400 uppercase">
                    RFID વાયરલેસ રીડર (Simulator Device)
                  </h3>
                </div>

                {/* Simulated Swipe Area Box */}
                <div className={`border-4 border-double rounded-xl p-8 text-center flex flex-col items-center justify-center space-y-2 transition-all ${
                  showRfidBleep ? "bg-emerald-950 border-green-500 scale-[1.01]" : "bg-slate-950 border-slate-800"
                }`}>
                  <Clock className={`w-8 h-8 ${showRfidBleep ? "text-emerald-400" : "text-rose-500"}`} />
                  <span className="text-[10px] font-mono text-slate-450 block uppercase">
                    {showRfidBleep ? "🔴 || SCANNING RFID - COMPLETED" : "વિદ્યાર્થી RFID ટેગ સ્કેન કરવા માટે લાયક છે"}
                  </span>
                  <h5 className="font-black text-sm text-white">
                    {showRfidBleep && lastScannedStudent ? `${lastScannedStudent.name} હાજર` : "સ્કેનર સેન્સર પેનલ"}
                  </h5>
                  {showRfidBleep && (
                    <span className="text-[10px] font-mono text-emerald-400 animate-bounce block mt-1">
                      🔊 BEEP! (ગુજરાતી એસ.એમ.એસ મોકલાયો)
                    </span>
                  )}
                </div>

                {/* Actions reset */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 py-1">
                  <span>વાલી ચકાસણી ટેસ્ટિગ</span>
                  <button
                    onClick={handleResetAttendance}
                    className="text-red-400 font-bold hover:underline"
                  >
                    હાજરી ડેટા રીસેટ કરો
                  </button>
                </div>

              </div>

              {/* Rolling logs console */}
              <div className="bg-[#1e293b] text-emerald-400 font-mono text-[10px] p-4 rounded-xl border-2 border-slate-900 shadow-inner space-y-2">
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">
                  લગભગ લાઈવ મશીન ઈનપુટ (Machine Log Output)
                </span>
                <div className="h-28 overflow-y-auto space-y-1.5 scrollbar-thin">
                  {rfidLog.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Simulated smartphone interface & Roster list */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Roster lists column (col-7) */}
              <div className="md:col-span-7 space-y-3">
                <h5 className="font-bold text-xs uppercase text-slate-500 block">
                  ૨. વિધાર્થી વર્ગ રજીસ્ટર (RFID Tags Roster)
                </h5>
                <p className="text-[10.5px] text-slate-500 leading-normal mb-2">
                  વિદ્યાર્થી સ્વાઇપ કરી હાજર નોંધવા પેલા કી-બટનને દબાવો:
                </p>

                <div className="space-y-2">
                  {attendanceList.map((std) => {
                    const isPresent = std.status === "Present";
                    return (
                      <div
                        key={std.gr}
                        className={`p-2.5 rounded-xl border-2 text-xs flex items-center justify-between transition-all ${
                          isPresent
                            ? "bg-emerald-50 border-emerald-500"
                            : "bg-white border-slate-900"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="text-[8.5px] text-slate-450 block font-bold font-mono">GR : {std.gr} | {std.rfid}</span>
                          <span className="font-sans font-bold text-slate-900">{std.name}</span>
                          <span className="text-[9.5px] text-slate-400 block font-sans">{std.grade}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                            isPresent ? "bg-emerald-100 text-emerald-800" : "bg-red-50 text-red-650"
                          }`}>
                            {isPresent ? `હાજર (${std.time})` : "ગેરહાજર"}
                          </span>
                          
                          <button
                            onClick={() => handleSwipeRFID(std.gr)}
                            disabled={isPresent}
                            className={`p-1.5 text-[10px] font-black rounded-lg border-2 transition ${
                              isPresent
                                ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"
                                : "bg-[#DC2626] text-white border-slate-950 hover:bg-rose-700 active:scale-90"
                            }`}
                          >
                            સ્વાઇપ
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Simulated smart SMS preview screen on right side (col-5) */}
              <div className="md:col-span-5 space-y-3">
                <h5 className="font-bold text-xs uppercase text-slate-500 block">
                  ૩. વોટ્સએપ એલર્ટ ફોન પ્રિવ્યુ
                </h5>
                
                {/* Mock phone wrapper */}
                <div className="bg-slate-950 p-2 rounded-[24px] border-4 border-slate-850 shadow-lg min-h-[300px] flex flex-col justify-between">
                  <div className="bg-slate-900 py-1 px-3.5 rounded-t-xl text-center text-[7px] text-slate-400 tracking-wider flex justify-between">
                    <span>AARSI SENSOR CONNECT</span>
                    <span>10:04 AM</span>
                  </div>

                  <div className="p-2 flex-grow bg-slate-950 flex flex-col justify-center">
                    {lastScannedStudent ? (
                      <div className="bg-emerald-900/10 border border-emerald-500/35 text-white p-3 rounded-2xl text-[10px] space-y-2 leading-relaxed animate-fade-in relative">
                        {/* Whatsapp green icon heading */}
                        <div className="flex items-center gap-1.5 border-b border-white/5 pb-1 text-emerald-400 font-bold">
                          <Smartphone className="w-3.5 h-3.5" /> <span>🟢 Smart SMS Alert</span>
                        </div>

                        <p className="font-sans font-medium text-gray-200 text-[10px]">
                          <strong>માનનીય વાલીશ્રી</strong>,<span className="block mt-1">આપનો તેજસ્વી પુત્ર/પુત્રી <strong>{lastScannedStudent.name}</strong> આજે ધોરણ ૧૦ માં આપણી આરસી મોડલ ગ્રુપ સેકન્ડરી શાળા પરિસરમાં સમયસર સવારે <strong>{lastScannedStudent.time}</strong> વાગ્યે RFID દ્વારેથી પ્રવેશી સુરક્ષિત હાજર નોંધાયેલ છે.</span>
                        </p>
                        
                        <span className="text-[8px] text-slate-450 italic block border-t border-white/5 pt-1 text-right">
                          – આચાર્યશ્રી હસ્તે, આરસી ગ્રુપ
                        </span>
                      </div>
                    ) : (
                      <div className="text-center p-3 text-slate-500 space-y-2 text-[10px]">
                        <Smartphone className="w-8 h-8 text-slate-650 mx-auto animate-bounce" />
                        <p>હાજરી સૂચક વોટ્સએપ એસ.એમ.એસ ડેમો પ્રિવ્યુ</p>
                        <small className="text-[9px] text-slate-600 block leading-normal">
                          ડાબી બાજુ કોઈપણ ગેરહાજર બાળકના 'સ્વાઇપ' બટન પર ક્લિક કરો જેથી ઓટોમેટેડ વાલી પરિપત્ર સંદેશો અહીં જનરેટ થાય.
                        </small>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900 p-1 rounded-b-xl text-center text-[6px] text-gray-400">
                    <span>AARSI AI MULTI-USER SYNC READY</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB 4: REPORT CARDS & MARKS ==================== */}
        {activeTab === "report-cards" && (
          <div className="space-y-6 animate-fade-in text-xs font-sans">
            
            {/* Subject slider scores entries */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Score Slider controls (col-4) */}
              <div className="lg:col-span-4 bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_rgba(0,0,0,0.9)] space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-455 uppercase font-bold block">૧. રિઝલ્ટ વિષય પ્રકલ્પો</span>
                  <h5 className="font-semibold text-slate-800">આંકડાકીય ગુણ મૂલ્યાંકન શીટ (Scoresheet)</h5>
                </div>

                {/* Quick Student profile switcher inside results */}
                <div className="space-y-1 pb-2 border-b border-slate-100">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase">વિધાર્થી પ્રોફાઈલ લિંક:</span>
                  <div className="grid grid-cols-3 gap-1">
                    {MOCK_GR_DATABASE.map(std => (
                      <button
                        key={std.grNo}
                        onClick={() => handleSelectResultStudent(std.grNo)}
                        className={`text-[9.5px] p-1 rounded border font-semibold truncate transition ${
                          selectedResultStudent.grNo === std.grNo
                            ? "bg-[#DC2626] text-white border-slate-950"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {std.studentName.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject sliders looping */}
                <div className="space-y-3.5 pt-1">
                  {Object.keys(scores).map((sub) => (
                    <div key={sub} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-700">{sub}</span>
                        <span className="font-mono bg-red-100/50 text-red-650 px-2 py-0.5 rounded">{scores[sub]} / ૧૦૦</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scores[sub]}
                        onChange={(e) => handleScoreChange(sub, parseInt(e.target.value))}
                        className="w-full accent-red-600 h-1 bg-slate-155 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setShowPrintableReport(!showPrintableReport)}
                    className="w-full py-2.5 bg-slate-900 border-2 border-slate-950 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition active:scale-95 text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.9)] cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-white" /> 
                    {showPrintableReport ? "એડિટ સ્લાઈડર પેનલ ખોલો" : "ફાઇનલ પરિણામ પત્રક ડ્રાફ્ટ જુઓ"}
                  </button>
                </div>
              </div>

              {/* Graphic Chart Analytics Box (col-8) */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                
                {showPrintableReport ? (
                  /* Formal Printable vintage double border report */
                  <div className="bg-[#fcfaf4] border-4 border-slate-900 p-5 sm:p-7 rounded-2xl shadow-xl space-y-5 relative overflow-hidden text-[#1a1f2e] select-text">
                    
                    {/* Watermark GSEB shield styling placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                      <div className="w-56 h-56 border-8 border-slate-900 rounded-full flex flex-col items-center justify-center text-slate-950 font-serif font-black text-xs">
                        <span>AARSI ACADEMIC</span>
                        <span>RESCRIPT</span>
                      </div>
                    </div>

                    <div className="text-center space-y-1 border-b border-amber-900/10 pb-3">
                      <h4 className="font-serif text-base font-black text-[#854d0e] tracking-widest uppercase">
                        આરસી આદર્શ ઓટોમેટેડ પ્રગતિ કાર્ડ પત્રક
                      </h4>
                      <p className="text-[10px] text-slate-500 italic block">
                        ધોરણ ૧૦ (દ્વિતીય સત્ર શૈક્ષણિક મૂલ્યાંકન) | બેચ-૨૦૨૬ અમદાવાદ
                      </p>
                    </div>

                    {/* Metadata column details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-100/50 border border-slate-200 p-3 rounded-xl text-[10px] text-slate-755 leading-loose">
                      <div>
                        <span>વિદ્યાર્થી આખું નામ:</span>
                        <strong className="block text-slate-900 text-[11px]">{selectedResultStudent.studentName}</strong>
                      </div>
                      <div>
                        <span>જી.આર બોર્ડ નંબર:</span>
                        <strong className="block text-slate-900 font-mono text-[11.5px]">{selectedResultStudent.grNo}</strong>
                      </div>
                      <div>
                        <span>વર્ગ પ્રભાગ:</span>
                        <strong className="block text-slate-900 text-[11px]">{selectedResultStudent.standard} (વર્ગ-{selectedResultStudent.division})</strong>
                      </div>
                      <div>
                        <span>બોર્ડ પ્રગતિ દર્શક ક્રમાંક:</span>
                        <strong className="block text-emerald-700 text-[11.5px] font-bold">AARSI-GRADE-{scoreStats.grade}</strong>
                      </div>
                    </div>

                    {/* Renders marks in clean monospace styled layout */}
                    <table className="w-full text-[10.5px] border-collapse font-serif leading-none">
                      <thead>
                        <tr className="bg-slate-200/50 text-[#854d0e] uppercase text-[9px] border-b border-amber-900/15">
                          <th className="py-2.5 px-3 text-left font-serif">અભ્યાસ વિષયકો (Subjects)</th>
                          <th className="py-2.5 px-3 text-center font-mono">થીયરી મહત્તમ ગુણ</th>
                          <th className="py-2.5 px-3 text-center font-mono text-slate-900">પ્રાપ્ત થયેલ ગુણ (Obtained)</th>
                          <th className="py-2.5 px-3 text-right">સ્થિતિ પત્રક (Status)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10">
                        {Object.keys(scores).map((sub) => {
                          const isPass = scores[sub] >= 35;
                          return (
                            <tr key={sub}>
                              <td className="py-2.5 px-3 font-serif font-bold text-slate-805">{sub}</td>
                              <td className="py-2.5 px-3 text-center font-mono text-slate-400">૧૦૦</td>
                              <td className="py-2.5 px-3 text-center font-mono text-slate-900 font-black">{scores[sub]}</td>
                              <td className="py-2.5 px-3 text-right">
                                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${isPass ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-[#DC2626]"}`}>
                                  {isPass ? "PASS" : "FAIL"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Summary row stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t-2 border-slate-900 pt-4 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">કુલ સરવાળો (Total Obtained)</span>
                        <strong className="text-slate-900 font-mono text-base font-black">{scoreStats.total} / ૫૦૦</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">મિશ્ર ટકાવારી ગુણોત્તર (Percentage)</span>
                        <strong className="text-red-650 font-mono text-base font-black">{scoreStats.pct.toFixed(1)}%</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">બોર્ડ વાલી પરિણામ સર્ટિફિકેટ</span>
                        <strong className={`block text-sm font-semibold font-sans ${scoreStats.isPassed ? "text-emerald-700 font-bold" : "text-[#DC2626] font-bold"}`}>
                          {scoreStats.isPassed ? "🎓 ઉત્તીર્ણ (PASS)" : "અનુત્તીર્ણ (Withheld)"}
                        </strong>
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-xl">
                      <span className="text-amber-800 font-bold block text-[9.5px] uppercase">આચાર્ય મૂલ્યાંકન પ્રતિભાવ ડાયરી:</span>
                      <p className="text-[10.5px] text-slate-650 mt-1 leading-relaxed italic">{scoreStats.remark}</p>
                    </div>

                    {/* Official Sign seals */}
                    <div className="flex justify-between items-center text-[10px] italic pt-3 font-serif text-slate-400 border-t border-slate-250">
                      <span>વિકસતો શૈક્ષણિક પાથ</span>
                      <div className="text-right">
                        <strong className="block text-slate-700 font-serif not-italic">શ્રી આર. કે. મહેતા (આચાર્યશ્રી હસ્તે)</strong>
                        <span>અમદાવાદ બોર્ડ સ્કોરિંગ શાખા મંજૂરી</span>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* Live SVG Bar Chart visualization panel */
                  <div className="bg-white border-2 border-slate-900 p-5 rounded-2xl shadow-[3px_3px_0px_#000000] space-y-6">
                    
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-black tracking-wider text-red-600 block">
                          ૨. લાઈવ ગ્રાફિકલ વિશ્લેષણ (Analytical Dashboard)
                        </span>
                        <h4 className="font-sans text-sm font-black text-slate-900">
                          {selectedResultStudent.studentName} ના ગુણોત્તર ચાર્ટ
                        </h4>
                      </div>
                      
                      {/* Overall Percentage badge inside result */}
                      <div className="text-right">
                        <span className="text-[8px] text-slate-400 block uppercase font-bold">ટકાવારી</span>
                        <span className="text-base font-mono font-black text-red-650">{scoreStats.pct.toFixed(1)}%</span>
                      </div>
                    </div>

                    {/* Inline custom SVG Column diagram comparing obtained marks vs classroom average & topper */}
                    <div className="relative">
                      
                      {/* Chart container */}
                      <div className="w-full overflow-x-auto">
                        <svg viewBox="0 0 540 260" className="w-full h-auto font-sans" style={{ minWidth: "480px" }}>
                          
                          {/* Grid horizontal guidelines */}
                          {[0, 25, 50, 75, 100].map((yVal, i) => {
                            const yPos = 210 - (yVal * 1.7);
                            return (
                              <g key={i}>
                                <line x1="50" y1={yPos} x2="520" y2={yPos} stroke="#E2E8F0" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "4 4"} />
                                <text x="18" y={yPos + 4} fill="#94A3B8" fontSize="9" fontFamily="monospace" textAnchor="left">{yVal}%</text>
                              </g>
                            );
                          })}

                          {/* Subject columns draw */}
                          {Object.keys(scores).map((subject, subIdx) => {
                            const xStart = 72 + (subIdx * 90);
                            const obtainedVal = scores[subject];
                            
                            // Heights based on scale (max 100 * 1.7)
                            const hObt = obtainedVal * 1.7;
                            const hAvg = 65 * 1.7; // Class Average fixed 65
                            const hTop = 95 * 1.7; // Class Topper fixed 95

                            return (
                              <g key={subject}>
                                
                                {/* 1. CLASS TOP MARK Column (behind / Muted Mustard) */}
                                <rect 
                                  x={xStart} 
                                  y={210 - hTop} 
                                  width="14" 
                                  height={hTop} 
                                  fill="#FEF3C7" 
                                  stroke="#D97706" 
                                  strokeWidth="1.5" 
                                  rx="2"
                                />

                                {/* 2. OBTAINED MARK Column (front/Main red) */}
                                <rect 
                                  x={xStart + 16} 
                                  y={210 - hObt} 
                                  width="16" 
                                  height={hObt} 
                                  fill="#FEE2E2" 
                                  stroke="#DC2626" 
                                  strokeWidth="2.5" 
                                  rx="3"
                                />

                                {/* 3. CLASS AVERAGE Column (Teal outline) */}
                                <rect 
                                  x={xStart + 34} 
                                  y={210 - hAvg} 
                                  width="12" 
                                  height={hAvg} 
                                  fill="#CCFBF1" 
                                  stroke="#0D9488" 
                                  strokeWidth="1.5" 
                                  rx="2"
                                />

                                {/* Floating values on Obtained column */}
                                <text x={xStart + 24} y={210 - hObt - 6} fill="#DC2626" fontSize="9" fontWeight="bold" textAnchor="middle">{obtainedVal}</text>

                                {/* Bottom axis labeling */}
                                <text x={xStart + 25} y="232" fill="#475569" fontSize="9.5" fontWeight="black" textAnchor="middle">
                                  {subject.split(" ")[0]}
                                </text>

                              </g>
                            );
                          })}

                          {/* Base Axis Line */}
                          <line x1="45" y1="210" x2="525" y2="210" stroke="#0F172A" strokeWidth="2.5" />

                        </svg>
                      </div>

                      {/* Chart Legend indicators */}
                      <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-[10px] font-bold select-none text-slate-550 border-t border-slate-100 mt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-3.5 bg-red-100 border-2 border-red-650 rounded"></span>
                          <span>અભ્યાસુ પ્રાપ્ત ગુણ</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3 bg-amber-50 border border-amber-600 rounded"></span>
                          <span>બોર્ડ ટોપર અંક (૯૫%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3 bg-teal-50 border border-teal-600 rounded"></span>
                          <span>વર્ગખંડ સરેરાશ (૬૫%)</span>
                        </div>
                      </div>

                    </div>

                    {/* Custom guidance block */}
                    <div className="bg-[#fbfcfa] border border-emerald-500/15 p-4 rounded-xl flex items-start gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg shrink-0 mt-0.5">
                        <Award className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-900 block">આરસી પ્રગતિપત્ર વિશ્લેષણ પ્રતિભાઓ:</span>
                        <p className="text-[10.5px] text-slate-650 leading-relaxed font-sans font-medium">
                          સમીક્ષિત શૈક્ષણિક ટકાવારી <strong>{scoreStats.pct.toFixed(1)}% ({scoreStats.grade} ગ્રેડ)</strong> કાયદેસર રીતે બતાવે છે કે {scoreStats.remarkableDetails || "વિદ્યાર્થી પાસે બોર્ડના અઘરા પ્રકરણો સોલ્વ કરવા જેવી અસાધારણ બુદ્ધિમત્તા છે."} {scoreStats.remark}
                        </p>
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
