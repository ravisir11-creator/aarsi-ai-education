import React, { useState, useEffect, useMemo } from "react";
import { BLOG_ARTICLES } from "./data/blogArticles";
import { TEACHER_RESOURCES, YOUTUBE_VIDEOS, TESTIMONIALS } from "./data/mockData";
import PolynomialPlotter from "./components/PolynomialPlotter";
import QuizBoard from "./components/QuizBoard";
import ERPShowcase from "./components/ERPShowcase";
import AIToolsConsole from "./components/AIToolsConsole";
import AIAssistant from "./components/AIAssistant";

import {
  Sparkles,
  BookOpen,
  UserCheck,
  Clock,
  TrendingUp,
  Menu,
  X,
  ChevronRight,
  Download,
  Play,
  Lightbulb,
  Check,
  Briefcase,
  GraduationCap,
  Search,
  FileText,
  Mail,
  Sun,
  Moon,
  ArrowRight,
  Heart,
  Share2,
  MessageSquare,
  Star,
  Plus
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "blog" | "ai-tools" | "teacher" | "student" | "erp">("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Blog Filter States
  const [blogSearchQuery, setBlogSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [readingArticle, setReadingArticle] = useState<any | null>(null);
  
  // Dynamic reactive states for updated Blog and Interactive comments
  const [articles, setArticles] = useState<any[]>(() => BLOG_ARTICLES);
  const [blogComments, setBlogComments] = useState<{[articleId: string]: Array<{ name: string; text: string; date: string; stars: number }>}>({
    "ai-teachers-revolution": [
      { name: "રાકેશભાઈ પરમાર (સહાયક શિક્ષક)", text: "કબીર પાઠ આયોજન માટેનું AI Lesson Planner ખરેખર સમય બચાવવા માટે અદ્ભુત છે! બોર્ડના નવા માળખા અનુસાર છે.", date: "૨૩ મે, ૨૦૨૬", stars: 5 },
      { name: "જ્યોત્સનાબેન વ્યાસ", text: "ખૂબ શાનદાર રજૂઆત. રોજના વહીવટી સમય બચાવી આયોજન કરવા માટે આ સચોટ ચાવી છે.", date: "૨૪ મે, ૨૦૨૬", stars: 4 }
    ],
    "gseb-maths-std10": [
      { name: "હરીશ પટેલ (ગણિત વિષય શિક્ષક)", text: "બહુપદીઓ અને સમાંતર શ્રેણીના વિવેચક ગણતરી માધ્યમો સાચે જ ઉપયોગી છે.", date: "૨૨ મે, ૨૦૨૬", stars: 5 }
    ]
  });
  const [blogLikes, setBlogLikes] = useState<{[articleId: string]: number}>({
    "ai-teachers-revolution": 14,
    "gseb-maths-std10": 26,
    "digital-school-erp": 8
  });

  // Track article completion and progress percentage
  const [articleProgress, setArticleProgress] = useState<{[articleId: string]: number}>({
    "ai-teachers-revolution": 66,
    "gseb-maths-std10": 33,
    "digital-school-erp": 0
  });

  // Track checked sections per article
  const [checkedSections, setCheckedSections] = useState<{[articleId: string]: string[]}>({
    "ai-teachers-revolution": ["intro", "core"],
    "gseb-maths-std10": ["intro"],
    "digital-school-erp": []
  });

  const handleToggleSection = (articleId: string, sectionKey: string) => {
    setCheckedSections(prev => {
      const current = prev[articleId] || [];
      const updated = current.includes(sectionKey)
        ? current.filter(k => k !== sectionKey)
        : [...current, sectionKey];
      
      const totalSections = 3; // We offer exactly 3 interactive checklist steps for each post
      const pct = Math.round((updated.length / totalSections) * 100);
      
      setArticleProgress(prevProg => ({
        ...prevProg,
        [articleId]: pct
      }));

      return {
        ...prev,
        [articleId]: updated
      };
    });
  };

  // Custom user input comment state
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentStars, setNewCommentStars] = useState(5);

  // Author Studio states
  const [isAuthorConsoleOpen, setIsAuthorConsoleOpen] = useState(false);
  const [authorTitle, setAuthorTitle] = useState("");
  const [authorExcerpt, setAuthorExcerpt] = useState("");
  const [authorCategory, setAuthorCategory] = useState("GSEB");
  const [authorNameText, setAuthorNameText] = useState("શ્રી સવજીભાઈ આહુજા");
  const [authorRoleText, setAuthorRoleText] = useState("ગણિત મુખ્યાધ્યાપક, સેન્ટ્રલ વિદ્યાલય");
  const [authorTagsText, setAuthorTagsText] = useState("GSEB, MathEd, SmartEd");
  const [authorImgPreset, setAuthorImgPreset] = useState("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800");
  const [authorContent, setAuthorContent] = useState("");
  const [authorAiOutline, setAuthorAiOutline] = useState("");
  const [isAiAuthorGenerating, setIsAiAuthorGenerating] = useState(false);
  const [authorSuccessAlert, setAuthorSuccessAlert] = useState("");

  const handleSubmitComment = (articleId: string) => {
    if (!newCommentName.trim() || !newCommentText.trim()) {
      alert("કૃપા કરીને પૂરતું નામ અને ટિપ્પણી બંને લખો!");
      return;
    }
    const commentRecord = {
      name: newCommentName.trim(),
      text: newCommentText.trim(),
      date: "આજે સવારે",
      stars: newCommentStars
    };
    
    setBlogComments(prev => ({
      ...prev,
      [articleId]: [commentRecord, ...(prev[articleId] || [])]
    }));

    setNewCommentName("");
    setNewCommentText("");
    setNewCommentStars(5);
  };

  const handleLikeArticle = (articleId: string) => {
    setBlogLikes(prev => ({
      ...prev,
      [articleId]: (prev[articleId] || 0) + 1
    }));
  };

  const handleAiAutoBlogGenerate = async () => {
    if (!authorTitle.trim()) {
      alert("કૃપા કરીને આર્ટિકલ શીર્ષક પહેલા લખો, જેથી AI તે વિષય પર સામગ્રી બનાવી શકે!");
      return;
    }
    setIsAiAuthorGenerating(true);
    setAuthorContent("");
    
    try {
      const response = await fetch("/api/ai/blog-write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: authorTitle,
          category: authorCategory,
          outline: authorAiOutline || "ગણિત પ્રકરણો સરળ બનાવવાની નવી પદ્ધતિઓ."
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAuthorContent(data.content);
      } else {
        setAuthorContent(`## ${authorTitle}\nશિક્ષણ પ્રક્રિયામાં ઓનલાઈન ટૂલ્સનો ઉપયોગ વધારવો ખુબ ફાયદાકારક છે. \n\n## મુખ્ય તારણો \nઅમે આશા રાખીએ છીએ કે આ આર્ટિકલ તમારા ગણિત અને સાયન્સ કન્સેપ્ટ ક્લિયરન્સમાં મદદ કરે.`);
      }
    } catch (e) {
      console.error(e);
      setAuthorContent(`## ${authorTitle}\nલાયક પ્લેટફોર્મની મદદથી સમય આયોજન કરવું અત્યંત સરળ બને છે.`);
    } finally {
      setIsAiAuthorGenerating(false);
    }
  };

  const handlePublishCustomArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorTitle.trim() || !authorExcerpt.trim() || !authorContent.trim()) {
      alert("કૃપા કરીને શીર્ષક, ટૂંકો સારાંશ અને સંપૂર્ણ વિગત ત્રણેય લખો!");
      return;
    }

    const tagsArray = authorTagsText.split(",").map(t => t.trim()).filter(Boolean);
    const newArt = {
      id: `custom-art-${Date.now()}`,
      title: authorTitle.trim(),
      excerpt: authorExcerpt.trim(),
      category: authorCategory,
      readTime: "૪ મિનિટ",
      date: new Date().toLocaleDateString("gu-IN", { day: "numeric", month: "long", year: "numeric" }),
      author: {
        name: authorNameText.trim(),
        role: authorRoleText.trim(),
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
      },
      image: authorImgPreset,
      tags: tagsArray.length > 0 ? tagsArray : ["UserPost", "AarsiEd"],
      commentsCount: 0,
      content: authorContent.trim()
    };

    setArticles([newArt, ...articles]);
    
    setAuthorTitle("");
    setAuthorExcerpt("");
    setAuthorContent("");
    setAuthorAiOutline("");
    
    setAuthorSuccessAlert(`અભિનંદન! આપનો શૈક્ષણિક લેખ "${newArt.title}" ક્રિએટિવ બ્લોગ સંગ્રહમાં ઓનલાઈન પબ્લિશ કરવામાં આવ્યો છે!`);
    setIsAuthorConsoleOpen(false);
    setTimeout(() => setAuthorSuccessAlert(""), 5000);
  };
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [showNewsletterToast, setShowNewsletterToast] = useState<boolean>(false);

  // Video modal state
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // Initialize Dark Mode theme state
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.body.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  // Filtered Blog list
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch = article.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) || 
                            article.excerpt.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                            article.tags.some(tag => tag.toLowerCase().includes(blogSearchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, blogSearchQuery, selectedCategory]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setShowNewsletterToast(true);
      setNewsletterEmail("");
      setTimeout(() => setShowNewsletterToast(false), 3500);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-[#F8FAFC] text-[#334155]"}`}>
      
      {/* Dynamic Reading Progress Bar for Blogs */}
      {readingArticle && (
        <div className="fixed top-0 left-0 w-full h-1.5 bg-red-100 dark:bg-slate-850 z-50">
          <div className="bg-red-600 h-full w-4/5 animate-[pulse_2s_infinite]"></div>
        </div>
      )}

      {/* Dynamic Success Toast */}
      {showNewsletterToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 border-2 border-emerald-500 text-white px-5 py-4 rounded-xl shadow-[4px_4px_0px_rgba(16,185,129,0.3)] animate-bounce flex items-center gap-3">
          <div className="bg-emerald-500 p-1 rounded-full">
            <Check className="w-4 h-4 text-slate-900" />
          </div>
          <div>
            <h5 className="font-bold text-xs">ઉત્તમ! રજીસ્ટ્રેશન સફળ રહ્યું</h5>
            <p className="text-[10px] text-gray-300">તમને દૈનિક AI સિક્રેટ પત્રો ઇમેઇલ દ્વારા મળશે.</p>
          </div>
        </div>
      )}

      {/* Floated Glassmorphism Header */}
      <header className="sticky top-0 z-40 bg-[#0F172A] text-white border-none shadow-lg transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Startup Brand Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setActiveTab("home"); setReadingArticle(null); }}>
              <div className="w-8 h-8 bg-[#DC2626] rounded-md rotate-45 flex items-center justify-center shadow-lg transition-transform hover:rotate-90 duration-350">
                <span className="-rotate-45 font-bold text-base text-white font-sans">A</span>
              </div>
              <div>
                <h1 className="font-sans text-sm font-black tracking-tight text-white flex items-center gap-1 leading-none uppercase">
                  Aarsi <span className="text-[#DC2626]">AI</span> Education
                </h1>
                <span className="text-[9px] text-slate-400 font-bold block mt-0.5">આરસી ડિજિટલ એજ્યુકેશન પ્લેટફોર્મ</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex space-x-1.5">
              {[
                { id: "home", label: "મુખ્ય પેજ (Home)" },
                { id: "blog2", label: "શિક્ષણ બ્લોગ (Blog)", tab: "blog" },
                { id: "ai-tools", label: "AI ટૂલ્સ (SaaS Dashboard)", tab: "ai-tools" },
                { id: "student", label: "વિદ્યાર્થી હબ (Student Learning)", tab: "student" },
                { id: "teacher", label: "શિક્ષક સાધનો (Teacher Hub)", tab: "teacher" },
                { id: "erp", label: "સ્કૂલ ERP (Showcase)", tab: "erp" }
              ].map((item: any) => {
                const target = item.tab || item.id;
                const isActive = activeTab === target;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(target);
                      setReadingArticle(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all font-sans ${
                      isActive
                        ? "bg-[#1E3A8A] text-white shadow-md border-transparent"
                        : "text-slate-300 hover:bg-[#1E3A8A]/30 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Header: Dark Mode & CTAs */}
            <div className="hidden lg:flex items-center gap-2.5">
              <button
                onClick={toggleDarkMode}
                className="p-2 border border-slate-800 rounded-xl hover:bg-slate-800 transition text-white"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
              </button>
              
              <button
                onClick={() => { setActiveTab("ai-tools"); setReadingArticle(null); }}
                className="bg-[#DC2626] hover:bg-red-750 text-white text-xs px-4 py-2 rounded-xl font-bold tracking-wide transition-all shadow-md"
              >
                Explore AI Workspace
              </button>
            </div>

            {/* Mobile Nav Menu Trigger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleDarkMode}
                className="p-1.5 border border-slate-350 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-800" />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 border border-slate-350 dark:border-slate-850 rounded-lg text-slate-800 dark:text-white"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1.5 shadow-xl animate-fade-in-down">
            {[
              { id: "home", label: "મુખ્ય પેજ (Home)", tab: "home" },
              { id: "blog", label: "શિક્ષણ બ્લોગ (Blog)", tab: "blog" },
              { id: "ai-tools", label: "AI ટૂલ્સ (Tools Dashboard)", tab: "ai-tools" },
              { id: "student", label: "વિદ્યાર્થી હબ (SSC Resource)", tab: "student" },
              { id: "teacher", label: "શિક્ષક સાધનો (Teacher Portal)", tab: "teacher" },
              { id: "erp", label: "સ્કૂલ ERP (Campus Management)", tab: "erp" }
            ].map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.tab as any);
                    setReadingArticle(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex justify-between items-center ${
                    isActive
                      ? "bg-[#1E3A8A] text-white"
                      : "text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Core Main Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-12">

          {/* ======================= SECTION H: HOME (DEFAULT VIEW) ======================= */}
          {activeTab === "home" && (
            <div className="space-y-16">
              
              {/* Premium Hero startup banner */}
              <div className="relative bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] text-white rounded-3xl p-6 sm:p-12 overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
                
                {/* Visual geometric blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-650/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-650/10 rounded-full filter blur-3xl"></div>
                
                {/* Creative geometric accent inside hero */}
                <div className="absolute right-12 bottom-12 w-32 h-32 border border-white/10 rounded-full hidden md:flex items-center justify-center">
                  <div className="w-24 h-24 border border-white/20 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#DC2626]/20 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/15 rounded-full text-xs font-black uppercase text-red-350">
                  <Sparkles className="w-3.5 h-3.5 animate-bounce" /> GSEB + AI Smart Learning Applet
                </div>

                <h2 className="font-sans text-3xl sm:text-5xl font-black text-white leading-tight max-w-4xl tracking-tight">
                  Transforming Education With AI & Smart Technology
                </h2>

                <p className="text-sm text-gray-300 max-w-2xl leading-relaxed font-sans font-medium">
                  Helping teachers, principals, schools, and students use AI, automation, and digital tools to improve learning, student results, and admin productivity.
                </p>

                {/* Quick Interactive action buttons */}
                <div className="flex flex-wrap justify-center gap-4 pt-4 z-10">
                  <button
                    onClick={() => setActiveTab("ai-tools")}
                    className="px-6 py-3 bg-[#DC2626] hover:bg-rose-700 text-white rounded-xl font-bold text-xs tracking-wider transition-all shadow-lg active:scale-95"
                  >
                    શિક્ષક AI ટૂલ્સ ખોલો
                  </button>
                  <button
                    onClick={() => setActiveTab("student")}
                    className="px-6 py-3 bg-white text-[#0F172A] hover:bg-slate-100 rounded-xl font-bold text-xs tracking-wider transition-all shadow-md active:scale-95"
                  >
                    ગણિત ગ્રાફ પ્લોટર પ્લોટ
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById("yt-tutorials");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-6 py-3 bg-transparent hover:bg-white/10 text-white/90 rounded-xl border border-white/20 font-bold text-xs tracking-wider transition"
                  >
                    Watch Tutorials
                  </button>
                </div>

                {/* Counter Stats section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl pt-8 border-t border-white/10 text-xs mt-4">
                  {[
                    { label: "તાલીમ પામેલ શિક્ષકો", value: "૫,૦૦૦+" },
                    { label: "અપગ્રેડ કરેલી સ્કૂલ્સ", value: "૫૫+" },
                    { label: "ગૃહકાર્ય શીટ્સ જનરેટેડ", value: "૧,૨૮,૦૦૦+" },
                    { label: "ગણિત શૂન્યો ઉકેલેલ", value: "૯૪,૨૦૦+" }
                  ].map((stat, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-gray-400 uppercase tracking-wider block">{stat.label}</span>
                      <span className="text-2xl font-mono font-black text-[#DC2626] block">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
                          {/* Featured Category Card Grid section */}
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-xs uppercase font-black text-[#DC2626] tracking-wider">વાઈબ્રન્ટ કેટેગરીઝ</span>
                  <h3 className="font-sans text-2xl font-black text-slate-800 dark:text-white">
                    એજ્યુકેશન ટેકનોલોજીની સ્માર્ટ પાંખો
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "AI For Teachers (શિક્ષક ક્રાંતિ)", desc: "શિક્ષણ કાર્ય સરળ કરવા પાઠ આયોજન, પરીક્ષા પત્રો અને સ્માર્ટ ગુણ મીટિંગ્સનું સેકન્ડોમાં આયોજન કરો.", tab: "ai-tools", icon: Sparkles },
                    { title: "School ERP (સંપૂર્ણ શાળા ડિજીટલ)", desc: "જનરલ રજીસ્ટર, ફી મેનેજમેન્ટ, RFID એટેન્ડન્સ અને પ્રગતિપત્રકના ઓટોમેટિક વોટ્સએપ એડમિનિસ્ટ્રેશન.", tab: "erp", icon: Briefcase },
                    { title: "Student Learning (વિદ્યાર્થી હબ)", desc: "ધોરણ ૧૦ બોર્ડ ગણિત આલેખો, દ્વિઘાત બહુપદી ઉકેલો, વાસ્તવિક ક્વિઝ ટેસ્ટ અને સૂત્ર શીટ્સ.", tab: "student", icon: GraduationCap },
                    { title: "Teacher Sheets / Templates", desc: "ડાઉનલોડ કરો લિવિંગ સર્ટિફિકેટના ફોર્મેટ્સ, નોટિફિકેશન લેટર્સ, કેલેન્ડર્સ અને ઓફિસિયલ GR કાયદા.", tab: "teacher", icon: FileText },
                    { title: "YouTube શૈક્ષણિક વિડીયો", desc: "શિક્ષણમાં નવી રાષ્ટ્રીય નીતિ NEP ૨૦૨૦ અને ટેકનોલોજીના અમલ વિશેના વિશિષ્ટ દસ્તાવેજી પાઠો.", tab: "home", icon: Play, scroll: "yt-tutorials" }
                  ].map((cat, idx) => {
                    const IconComp = cat.icon;
                    return (
                      <div
                        key={idx}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-lg hover:border-[#1E3A8A] hover:scale-[1.01] transition-all flex flex-col justify-between space-y-4 cursor-pointer"
                        onClick={() => {
                          if (cat.scroll) {
                            const el = document.getElementById(cat.scroll);
                            el?.scrollIntoView({ behavior: "smooth" });
                          } else {
                            setActiveTab(cat.tab as any);
                          }
                        }}
                      >
                        <div className="space-y-3">
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl inline-block">
                            <IconComp className="w-5 h-5 text-[#DC2626]" />
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                            {cat.title}
                          </h4>
                          <p className="text-xs text-slate-500 max-w-sm leading-relaxed dark:text-gray-300">
                            {cat.desc}
                          </p>
                        </div>

                        <span className="text-[11px] font-bold text-[#DC2626] dark:text-rose-400 group inline-flex items-center gap-1">
                          સ્પષ્ટ એક્સપ્લોર કરો <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Embedded Interactive Teaser Blog */}
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-xs uppercase font-black text-[#DC2626] tracking-wider">નવીનતમ આર્ટીકલ્સ</span>
                    <h3 className="font-sans text-2xl font-black text-slate-800 dark:text-white">
                      શૈક્ષણિક માહિતી પોર્ટલ (Trending Posts)
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("blog")}
                    className="text-xs font-bold text-[#DC2626] bg-red-50 dark:bg-slate-800 dark:text-rose-400 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg whitespace-nowrap"
                  >
                    બધા લેખો જુઓ (Read Blog)
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {articles.slice(0, 3).map((art) => (
                    <article
                      key={art.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Article Image cover */}
                        <div className="h-44 overflow-hidden relative border-b border-slate-200 dark:border-slate-800">
                          <img
                            src={art.image}
                            alt={art.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-all"
                          />
                          <span className="absolute top-3 left-3 bg-[#0F172A] text-white font-sans text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            {art.category}
                          </span>
                        </div>

                        {/* Article meta */}
                        <div className="p-4 space-y-2">
                          <span className="text-[10px] text-slate-400 font-bold block">{art.date} • વાંચન સમય: {art.readTime}</span>
                          <h4 className="font-sans text-xs font-bold text-slate-900 dark:text-white leading-snug">
                            {art.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm">
                            {art.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <button
                          onClick={() => {
                            setReadingArticle(art);
                            setActiveTab("blog");
                          }}
                          className="w-full text-[#0f172a] dark:text-white text-center py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold rounded-lg transition"
                        >
                          સંપૂર્ણ લેખ વાંચો
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* YouTube Video Tutorials Section */}
              <div id="yt-tutorials" className="space-y-6 pt-4 border-t-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="text-center space-y-1">
                  <span className="text-xs uppercase font-black text-red-600 tracking-wider">વીડિયો ટ્યુટોરીયલ્સ</span>
                  <h3 className="font-sans text-2xl font-black text-slate-800 dark:text-white">
                    આરસી એજ્યુકેશન યુટ્યુબ ટીવી
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {YOUTUBE_VIDEOS.map((vid) => (
                    <div
                      key={vid.id}
                      className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 rounded-2xl overflow-hidden shadow-[3px_3px_0px_#0f172a] transform transition hover:scale-[1.01]"
                    >
                      <div className="relative h-44 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-85"
                        />
                        <button
                          onClick={() => setActiveVideoId(vid.id)}
                          className="absolute bg-red-650 hover:bg-red-750 text-white w-12 h-12 rounded-full border-2 border-slate-950 flex items-center justify-center transition-all transform hover:scale-110 shadow-lg cursor-pointer"
                        >
                          <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                        </button>
                        <span className="absolute bottom-3 right-3 bg-slate-900 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                          {vid.duration}
                        </span>
                      </div>

                      <div className="p-4 space-y-1">
                        <h4 className="font-sans text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                          {vid.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-bold block">{vid.views}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Video Modal Embed Simulator */}
                {activeVideoId && (
                  <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-slate-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl space-y-4 p-5 relative">
                      <button
                        onClick={() => setActiveVideoId(null)}
                        className="absolute right-4 top-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 p-1.5 rounded-full transition text-slate-900 dark:text-white cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      
                      <h4 className="font-sans text-sm font-bold text-slate-900 dark:text-white pr-8">
                        {YOUTUBE_VIDEOS.find(v => v.id === activeVideoId)?.title}
                      </h4>

                      <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative">
                        {(() => {
                          const video = YOUTUBE_VIDEOS.find(v => v.id === activeVideoId);
                          if (!video) return null;
                          const match = video.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*?[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
                          const videoId = match ? match[1] : "dQw4w9WgXcQ";
                          const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

                          return (
                            <iframe
                              className="w-full h-full"
                              src={embedUrl}
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ======================= SECTION 2: BLOG SYSTEM ======================= */}
          {activeTab === "blog" && (
            <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-slate-800 pb-5">
                <div>
                  <h3 className="font-sans text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[#DC2626]" /> શૈક્ષણિક તજજ્ઞ બ્લોગ (Class 10 EdTech Hub)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    આરસી એજ્યુકેશન બોર્ડ તજજ્ઞો અને શિક્ષકો દ્વારા શેર કરવામાં આવેલી આધુનિક વ્યવસ્થાત્મક ચાવીઓ અને માર્ગદર્શન.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsAuthorConsoleOpen(!isAuthorConsoleOpen);
                      setReadingArticle(null);
                    }}
                    className={`px-4 py-2 border-2 border-slate-900 rounded-xl text-xs font-black shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#fff] transition-all duration-200 cursor-pointer ${
                      isAuthorConsoleOpen
                        ? "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
                        : "bg-[#d4a843] text-slate-950 hover:bg-[#c59a35]"
                    }`}
                  >
                    {isAuthorConsoleOpen ? "← આપેલા આર્ટિકલ્સ" : "✍️ નવો લેખ લખો (Author Room)"}
                  </button>
                </div>
              </div>

              {/* Success alert toast */}
              {authorSuccessAlert && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 p-4 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 animate-pulse flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  {authorSuccessAlert}
                </div>
              )}

              {/* 1. Author Studio Form Console */}
              {isAuthorConsoleOpen ? (
                <div className="bg-[#fdfbf6] dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md relative">
                  <div>
                    <h4 className="font-sans text-lg font-black text-slate-900 dark:text-white mb-1">
                      તજજ્ઞ લેખક સાચું કેન્દ્ર (Publish Board Education Article)
                    </h4>
                    <p className="text-xs text-slate-400">
                      અત્યાધુનિક વહીવટી અનુભવો અથવા ગણિત ભણાવવાની સરળ પ્રયુક્તિઓ અહીં સબમિટ કરો. તમે AI સહાયકનો ઉપયોગ પણ કરી શકો છો.
                    </p>
                  </div>

                  <form onSubmit={handlePublishCustomArticle} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
                      
                      {/* Left: Input parameters */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="space-y-1">
                          <label className="font-black text-slate-700 dark:text-slate-300 block">લેખનું શીર્ષક (Gujarati Title) *</label>
                          <input
                            type="text"
                            required
                            placeholder="દા.ત. બોર્ડ પરીક્ષામાં ગણિતના પ્રમેય યાદ રાખવાની ૫ જાદુઈ ટિપ્સ..."
                            value={authorTitle}
                            onChange={(e) => setAuthorTitle(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border-2 border-slate-900 rounded-lg py-2 px-3 font-sans focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-black text-slate-700 dark:text-slate-300 block">ટૂંકો સારાંશ (Short Excerpt) *</label>
                          <input
                            type="text"
                            required
                            placeholder="વાચકોને આકર્ષવા માટે એક લાઈનનો આર્થિક સારાંશ..."
                            value={authorExcerpt}
                            onChange={(e) => setAuthorExcerpt(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border-2 border-slate-900 rounded-lg py-2 px-3 font-sans focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-black text-slate-700 dark:text-slate-300 block">શ્રેણી (Category) *</label>
                            <select
                              value={authorCategory}
                              onChange={(e) => setAuthorCategory(e.target.value)}
                              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-900 rounded-lg py-2 px-2 font-sans text-slate-900 dark:text-white"
                            >
                              <option value="GSEB Solutions">GSEB Solutions</option>
                              <option value="AI For Teachers">AI For Teachers</option>
                              <option value="School ERP Solutions">School ERP Solutions</option>
                              <option value="Exam Tips">Exam Tips</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-black text-slate-700 dark:text-slate-300 block">હેશટેગ્સ (Tags - અલ્પવિરામ સાથે) *</label>
                            <input
                              type="text"
                              required
                              placeholder="Maths, BoardTips, GSEB"
                              value={authorTagsText}
                              onChange={(e) => setAuthorTagsText(e.target.value)}
                              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-900 rounded-lg py-2 px-3 font-sans focus:outline-none text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-black text-slate-700 dark:text-slate-300 block">લેખકનું નામ (Author Name)</label>
                            <input
                              type="text"
                              value={authorNameText}
                              onChange={(e) => setAuthorNameText(e.target.value)}
                              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-900 rounded-lg py-2 px-3 focus:outline-none text-slate-900 dark:text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-black text-slate-700 dark:text-slate-300 block">લેખકનો હોદ્દો (Author Role)</label>
                            <input
                              type="text"
                              value={authorRoleText}
                              onChange={(e) => setAuthorRoleText(e.target.value)}
                              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-900 rounded-lg py-2 px-3 focus:outline-none text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="font-black text-slate-700 dark:text-slate-300 block">સંપૂર્ણ વિગત (Markdown Content) *</label>
                            <span className="text-[10px] text-slate-400 font-mono">લંબાઈ: {authorContent.length} અક્ષરો</span>
                          </div>
                          <textarea
                            required
                            rows={8}
                            placeholder="તમારા અનુભવો કે થીયરી સવિસ્તાર પેરેગ્રાફમાં લખો..."
                            value={authorContent}
                            onChange={(e) => setAuthorContent(e.target.value)}
                            className="w-full bg-[#fbfbfb] dark:bg-slate-955 border-2 border-slate-900 rounded-lg p-3 font-sans focus:outline-none text-slate-900 dark:text-white text-xs leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Right: Cover & AI Helper */}
                      <div className="lg:col-span-5 space-y-6">
                        {/* Cover image selection presets */}
                        <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-4 border-2 border-slate-900 rounded-2xl">
                          <label className="font-black text-slate-700 dark:text-slate-300 block">આર્ટિકલ કવર ફોટો (Cover Preset)</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: "ટેક્નોલોજી", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800" },
                              { label: "ગણિત પાઠ", url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800" },
                              { label: "પરિણામો", url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800" }
                            ].map((preset, pIdx) => (
                              <div
                                key={pIdx}
                                onClick={() => setAuthorImgPreset(preset.url)}
                                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all p-1 text-center bg-white dark:bg-slate-950 ${
                                  authorImgPreset === preset.url ? "border-amber-500 scale-[1.03]" : "border-transparent"
                                }`}
                              >
                                <img src={preset.url} alt={preset.label} className="w-full h-11 object-cover rounded" />
                                <span className="text-[9px] font-bold block mt-1">{preset.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* AI ASSIST GENERATOR BLOCK */}
                        <div className="bg-red-50/50 dark:bg-slate-800/80 border-2 border-dashed border-red-900 dark:border-slate-700 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center gap-1.5 text-[#b8442c] dark:text-rose-400 font-black">
                            <Sparkles className="w-4 h-4 animate-spin-slow" />
                            <span>Aarsi AI આર્ટિકલ રાઇટર (AI Assistant)</span>
                          </div>
                          
                          <p className="text-[10px] text-slate-500">
                            જો તમારી પાસે સામગ્રી નથી, તો માત્ર ઉપર ટાઇટલ લખીને નીચે હિન્ટ આપો અને AI પાવરથી આખો બ્લોગ રેડી કરો!
                          </p>

                          <div className="space-y-1">
                            <label className="font-bold text-[10px] text-slate-600 dark:text-slate-300">AI માટે મુદ્દાઓ / હિન્ટ</label>
                            <input
                              type="text"
                              placeholder="દા.ત. બોર્ડ પેપરમાં અઘરા દાખલાઓ પૂર્વે કરવાના ફાયદા અને ટાઈમ પેરિટી..."
                              value={authorAiOutline}
                              onChange={(e) => setAuthorAiOutline(e.target.value)}
                              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg py-1.5 px-3 text-[11px] focus:outline-none"
                            />
                          </div>

                          <button
                            type="button"
                            disabled={isAiAuthorGenerating}
                            onClick={handleAiAutoBlogGenerate}
                            className="w-full text-center py-2 bg-[#b8442c] text-white hover:bg-stone-900 font-bold rounded-lg transition text-[11px] disabled:bg-slate-300"
                          >
                            {isAiAuthorGenerating ? "AI લખી રહ્યું છે... કૃપા કરી ખામોશ રહો..." : "🤖 AI વડે ઓટો-આર્ટિકલ લખો"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsAuthorConsoleOpen(false)}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300"
                      >
                        રદ કરો
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs rounded-xl shadow border-2 border-slate-900"
                      >
                        પ્રકાશિત કરો (Publish Post) →
                      </button>
                    </div>
                  </form>
                </div>
              ) : readingArticle ? (
                /* 2. Detailed Reading View with Reactive likes and commenting feedback */
                <div className="bg-[#fdfbf6] dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 rounded-3xl p-5 sm:p-8 space-y-6 shadow-md animate-fade-in relative">
                  
                  {/* Breadcrumb path */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400 select-none">
                    <span className="cursor-pointer hover:text-[#b8442c] underline" onClick={() => setReadingArticle(null)}>બ્લોગ લિસ્ટ</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="bg-[#b8442c] text-white px-2.5 py-0.5 rounded-md text-[10px]">{readingArticle.category}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-850 dark:text-slate-300 font-mono">{readingArticle.readTime} સ્માર્ટ ગાઈડ</span>
                  </div>

                  {/* High Quality cover image with premium brutalist frame */}
                  <div className="h-4 sm:h-56 overflow-hidden rounded-2xl relative border-2 border-slate-900 bg-slate-50">
                    <img
                      src={readingArticle.image}
                      alt={readingArticle.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                      <h4 className="font-sans text-lg sm:text-2xl font-black text-white leading-tight">
                        {readingArticle.title}
                      </h4>
                    </div>
                  </div>

                  {/* Meta Authors Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-y-2 border-slate-900 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={readingArticle.author.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"}
                        alt={readingArticle.author.name}
                        className="w-12 h-12 rounded-full border-2 border-slate-900 object-cover"
                      />
                      <div>
                        <h5 className="font-black text-xs text-slate-900 dark:text-white">{readingArticle.author.name}</h5>
                        <span className="text-[10px] text-slate-400 block">{readingArticle.author.role}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5 text-xs font-bold font-mono">
                      <span className="text-slate-400">{readingArticle.date}</span>
                      <span className="text-slate-300">|</span>
                      
                      {/* Interactive Live Likes counter button */}
                      <button
                        onClick={() => handleLikeArticle(readingArticle.id)}
                        className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-[#b8442c] dark:text-rose-400 px-3 py-1.5 rounded-lg border border-red-200 transition active:scale-95 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 fill-[#b8442c]" />
                        <span>વાચકોને ગમ્યું: {blogLikes[readingArticle.id] || 0}</span>
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          alert("આ લેખની લિંક કોપી થઈ ગઈ છે! તમે સોશ્યલ મીડિયામાં શેર કરી શકો છો.");
                        }}
                        className="flex items-center gap-1 bg-white dark:bg-slate-800 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 transition"
                      >
                        <Share2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>શેર</span>
                      </button>
                    </div>
                  </div>

                  {/* Body Content of article parsed dynamically */}
                  <div className="prose prose-slate dark:prose-invert max-w-none text-xs leading-relaxed font-sans text-slate-750 dark:text-slate-300 space-y-4">
                    {readingArticle.content.split("\n\n").map((part: string, idx: number) => {
                      if (part.startsWith("## ")) {
                        return (
                          <h3 key={idx} className="font-sans text-base font-black text-slate-900 dark:text-white pt-4 mt-2 border-b-2 border-dashed border-slate-200 dark:border-slate-800 inline-block">
                            {part.replace("## ", "")}
                          </h3>
                        );
                      }
                      if (part.startsWith("### ")) {
                        return (
                          <h4 key={idx} className="font-sans text-xs font-black text-[#b8442c] dark:text-amber-400 pt-2">
                            {part.replace("### ", "")}
                          </h4>
                        );
                      }
                      return <p key={idx} className="whitespace-pre-line leading-relaxed">{part}</p>;
                    })}
                  </div>

                  {/* Interactive Section Checklist */}
                  <div className="bg-amber-50/50 dark:bg-slate-850/50 p-5 rounded-2xl border-2 border-slate-900 dark:border-slate-850 space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <h4 className="font-sans text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5 uppercase">
                        <BookOpen className="w-4 h-4 text-[#b8442c]" /> આર્ટિકલ સ્વાધ્યાય ચેકલિસ્ટ (Smart Read Tracker)
                      </h4>
                      <span className="bg-[#b8442c] text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                        {articleProgress[readingArticle.id] || 0}% પૂર્ણતા
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400">
                      આ લેખ શૈક્ષણિક જરૂરિયાત મુજબ અને બોર્ડના ધોરણો હેઠળ લખાયેલો છે. દરેક પ્રકરણ વિભાગ ધ્યાનથી વાંચીને નીચે ચેક કરો જેથી તમારી શૈક્ષણિક પ્રગતિ સેવ થાય:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      {[
                        { key: "intro", title: "પ્રસ્તાવના અને ખ્યાલ (Introduction)" },
                        { key: "core", title: "મુખ્ય શૈક્ષણિક વિભાવનાઓ (Core)" },
                        { key: "concl", title: "સ્વાધ્યાય અને પરીક્ષા ટિપ્સ (Summary)" }
                      ].map((sec) => {
                        const isChecked = (checkedSections[readingArticle.id] || []).includes(sec.key);
                        return (
                          <label
                            key={sec.key}
                            className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all select-none ${
                              isChecked 
                                ? "bg-white dark:bg-slate-900 border-slate-900 dark:border-slate-850 text-slate-800 dark:text-slate-100 shadow-[2px_2px_0px_#1a1f2e]" 
                                : "bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 text-slate-500 hover:bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleSection(readingArticle.id, sec.key)}
                              className="w-4 h-4 rounded text-[#b8442c] focus:ring-[#b8442c] border-2 border-slate-900 cursor-pointer"
                            />
                            <div className="flex-1">
                              <span className={`font-sans text-[11px] ${isChecked ? "line-through font-bold text-slate-400 dark:text-gray-500" : "font-semibold"}`}>
                                {sec.title}
                              </span>
                            </div>
                            {isChecked && (
                              <span className="text-[8px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-1 py-0.5 rounded font-bold font-mono">
                                OK ✓
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* INTERACTIVE COMMENTS & STAR FEEDBACK COMPONENT */}
                  <div className="border-t-2 border-slate-933 pt-6 space-y-6">
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-4 border-2 border-slate-900 rounded-xl">
                      <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1">
                        <MessageSquare className="w-4 h-4 text-[#b8442c]" /> ચર્ચા મંચ (Interactive Feedback & Ratings)
                      </h4>
                      <span className="bg-slate-900 text-white px-2.5 py-0.5 rounded-full text-[10px] font-mono">
                        {(blogComments[readingArticle.id] || []).length} ટિપ્પણીઓ
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-sans">
                      
                      {/* Left: Render Existing Comments */}
                      <div className="md:col-span-7 space-y-3.5">
                        <h5 className="font-bold text-slate-700 dark:text-slate-300">શિક્ષકો અને વિદ્યાર્થીઓના અભિપ્રાય:</h5>
                        
                        {(blogComments[readingArticle.id] || []).length > 0 ? (
                          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
                            {(blogComments[readingArticle.id] || []).map((cmt, cIdx) => (
                              <div key={cIdx} className="p-4 bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-850 shadow-sm space-y-2">
                                <div className="flex justify-between items-center font-bold">
                                  <span className="text-slate-800 dark:text-gray-100">{cmt.name}</span>
                                  <span className="text-[9px] text-gray-400">{cmt.date}</span>
                                </div>
                                
                                {/* Star metrics */}
                                <div className="flex gap-0.5">
                                  {Array.from({ length: 5 }).map((_, sIdx) => (
                                    <Star
                                      key={sIdx}
                                      className={`w-3 h-3 ${
                                        sIdx < cmt.stars ? "text-amber-400 fill-amber-400" : "text-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>

                                <p className="text-slate-600 dark:text-slate-300 font-sans text-xs">{cmt.text}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
                            <span className="text-slate-400 text-xs block">આ આર્ટિકલ પર હજી કોઈ ટિપ્પણી લખી નથી. નીચેના ફોર્મ વડે પ્રથમ પ્રતિભાવ આપો!</span>
                          </div>
                        )}
                      </div>

                      {/* Right: Submit New Comment */}
                      <div className="md:col-span-5 bg-[#faf8f4] dark:bg-slate-850 p-4 border-2 border-slate-900 rounded-2xl space-y-3">
                        <h5 className="font-bold text-slate-800 dark:text-white">તમારી સમીક્ષા ઉમેરો:</h5>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-bold block">તમારું નામ (Name) *</label>
                          <input
                            type="text"
                            placeholder="માનનીય શિક્ષક શ્રી..."
                            value={newCommentName}
                            onChange={(e) => setNewCommentName(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg py-1 px-3.5 focus:outline-none"
                          />
                        </div>

                        {/* Interactive Clickable Star Rating Selector */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-bold block">રેટિંગ બોર્ડ (Class Rating)</label>
                          <div className="flex items-center gap-1.5">
                            {Array.from({ length: 5 }).map((_, sIdx) => {
                              const value = sIdx + 1;
                              return (
                                <button
                                  type="button"
                                  key={sIdx}
                                  onClick={() => setNewCommentStars(value)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-5 h-5 transition-transform active:scale-125 hover:scale-110 ${
                                      value <= newCommentStars
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-gray-300 dark:text-gray-650"
                                    }`}
                                  />
                                </button>
                              );
                            })}
                            <span className="text-[10px] text-gray-400 font-mono font-bold ml-1">({newCommentStars}/૫)</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-bold block">પ્રતિભાવ / ટિપ્પણી (Your Comment) *</label>
                          <textarea
                            rows={3}
                            placeholder="આર્ટિકલ વાંચીને તમારા વિચારો અત્રે રજૂ કરો..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 focus:outline-none leading-relaxed text-xs"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSubmitComment(readingArticle.id)}
                          className="w-full text-center py-2 bg-slate-900 text-white font-black hover:bg-slate-800 rounded-lg text-[10px] transition cursor-pointer"
                        >
                          આર્ટિકલ રિવ્યુ પોસ્ટ કરો →
                        </button>
                      </div>

                    </div>

                    <div className="flex justify-start pt-4 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => setReadingArticle(null)}
                        className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition shadow active:scale-95"
                      >
                        ← પાછા બ્લોગ આર્ટિકલ્સ લિસ્ટ પર જાઓ
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                /* 3. Regular Grid view of Articles with Search, Filters, and interactive metrics preview */
                <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    
                    {/* Category Filter Chips dynamically adapted */}
                    <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
                      {["All", "GSEB Solutions", "AI For Teachers", "School ERP Solutions", "Exam Tips"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${
                            selectedCategory === cat
                              ? "bg-slate-900 text-white border-transparent shadow-sm dark:bg-slate-100 dark:text-slate-900"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-gray-300 border-transparent"
                          }`}
                        >
                          {cat === "All" ? "બધા આર્ટીકલ્સ" : cat}
                        </button>
                      ))}
                    </div>

                    {/* Search query field */}
                    <div className="relative w-full lg:w-72">
                      <input
                        type="text"
                        placeholder="લેખ, હોદ્દો કીવર્ડ અને ટૅગ્સ શોધો..."
                        value={blogSearchQuery}
                        onChange={(e) => setBlogSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-850 dark:text-white font-sans focus:outline-none"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  {/* Blog Cards Grid list and Sidebar Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left 3 columns: Articles Grid */}
                    <div className="lg:col-span-3 space-y-6">
                      {filteredArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {filteredArticles.map((art) => {
                            const likes = blogLikes[art.id] || 0;
                            const comments = blogComments[art.id] || [];
                            const artProgress = articleProgress[art.id] || 0;
                            return (
                              <article
                                key={art.id}
                                className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 rounded-2xl overflow-hidden shadow-[4px_4px_0px_#1a1f2e] dark:shadow-[4px_4px_0px_#475569] transform transition-all hover:scale-[1.01] flex flex-col justify-between"
                              >
                                <div>
                                  {/* Card image container */}
                                  <div className="h-44 overflow-hidden relative border-b-2 border-slate-900 dark:border-slate-800 bg-slate-50">
                                    <img
                                      src={art.image}
                                      alt={art.title}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300 select-none"
                                    />
                                    <span className="absolute top-3 left-3 bg-[#b8442c] text-white font-sans text-[9px] font-bold px-2.5 py-1 rounded-md tracking-wider">
                                      {art.category}
                                    </span>
                                  </div>

                                  {/* Card text and Author footer */}
                                  <div className="p-4 space-y-3">
                                    <div className="flex gap-2 text-[9px] text-slate-400 font-bold uppercase justify-between">
                                      <span>{art.date}</span>
                                      <span>વાંચન: {art.readTime}</span>
                                    </div>
                                    
                                    <h4 className="font-sans text-xs font-bold text-slate-900 dark:text-white leading-normal min-h-[36px]">
                                      {art.title}
                                    </h4>
                                    
                                    <p className="text-[11px] text-slate-500 leading-relaxed dark:text-gray-350 line-clamp-2">
                                      {art.excerpt}
                                    </p>

                                    {/* Read Progress Bar indicator */}
                                    <div className="space-y-1 bg-slate-50/80 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                                      <div className="flex justify-between items-center text-[9px] font-bold">
                                        <span className="text-slate-500 dark:text-gray-400 uppercase flex items-center gap-1 font-sans">
                                          <Clock className="w-3 h-3 text-amber-500" /> શૈક્ષણિક પ્રગતિ
                                        </span>
                                        <span className="text-slate-900 dark:text-white font-mono">
                                          {artProgress === 100 ? "✓ પૂર્ણ (૧૦૦%)" : `${artProgress}%`}
                                        </span>
                                      </div>
                                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full transition-all duration-500 rounded-full ${
                                            artProgress === 100 
                                              ? "bg-emerald-500" 
                                              : artProgress >= 60 
                                              ? "bg-amber-500" 
                                              : "bg-[#b8442c]"
                                          }`}
                                          style={{ width: `${artProgress}%` }}
                                        />
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1 pt-0.5">
                                      {art.tags.map((tg: string, tIdx: number) => (
                                        <span key={tIdx} className="bg-slate-100 dark:bg-slate-800 text-[9px] text-slate-600 dark:text-gray-300 px-2 py-0.5 rounded font-mono">
                                          #{tg}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Indicators & Read Button */}
                                <div className="p-4 pt-0 space-y-2">
                                  {/* Likes and comments counts */}
                                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 font-mono">
                                    <span className="flex items-center gap-1 text-slate-500">
                                      <Heart className="w-3.5 h-3.5 text-[#b8442c] fill-[#b8442c]" /> {likes} લાઈક્સ
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-500">
                                      <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> {comments.length} સમીક્ષાઓ
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => setReadingArticle(art)}
                                    className="w-full text-center py-2 bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700/85 border-2 border-slate-900 dark:border-slate-700 text-white text-xs font-black rounded-lg transition cursor-pointer"
                                  >
                                    આખો લેખ વાંચો અને પ્રતિસાદ લખો →
                                  </button>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center bg-white dark:bg-slate-900 border-2 border-dashed border-gray-200 dark:border-slate-800 p-12 rounded-3xl min-h-[300px] flex flex-col items-center justify-center space-y-3">
                          <Search className="w-12 h-12 text-slate-350 dark:text-slate-600 animate-spin" />
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white">કોઈ શૈક્ષણિક લેખ મળ્યો નથી</h5>
                          <p className="text-xs text-slate-500 max-w-sm">તમારી સર્ચ ક્વેરી ક્લિયર કરો અથવા ટોપિક બદલીને ફિલ્ટર લગાવો.</p>
                        </div>
                      )}
                    </div>

                    {/* Right 1 column: Featured Author & Completion Analytics sidebar widget */}
                    <div className="lg:col-span-1 space-y-6">
                      {/* Featured Author Widget */}
                      <div className="bg-[#fcfaf5] dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 rounded-3xl p-5 shadow-[4px_4px_0px_#1a1f2e] dark:shadow-[4px_4px_0px_#475569] space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b-2 border-dashed border-slate-200 dark:border-slate-800">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <h4 className="font-sans text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
                            આ મહિનાના શૈક્ષણિક લેખક
                          </h4>
                        </div>

                        <div className="flex items-start gap-3">
                          <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
                            alt="શાસ્ત્રી સર"
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-2xl border-2 border-slate-900 object-cover shadow-[2px_2px_0px_#1a1f2e]"
                          />
                          <div>
                            <h5 className="font-sans text-xs font-black text-slate-900 dark:text-white">શાસ્ત્રી સર (ગણિત નિષ્ણાત)</h5>
                            <span className="text-[10px] text-amber-650 dark:text-amber-400 font-bold block mt-0.5">Senior Coordinator</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                          છેલ્લા ૧૫ વર્ષથી ધોરણ ૧૦ ના સેંકડો વિદ્યાર્થીઓને ગણિતમાં ટોપર બનાવવાનો બહોળો અનુભવ ધરાવે છે. તેઓ બોર્ડ પ્રશ્નપત્ર નિર્માણ સમિતિના સભ્ય છે.
                        </p>

                        <div className="grid grid-cols-3 gap-2 py-2 bg-white dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-800 rounded-xl text-center select-none shadow-sm">
                          <div>
                            <span className="text-[8px] text-slate-400 block uppercase">લેખો</span>
                            <span className="text-xs font-black font-mono">૩+</span>
                          </div>
                          <div className="border-x border-slate-200 dark:border-slate-800">
                            <span className="text-[8px] text-slate-400 block uppercase">વાચકો</span>
                            <span className="text-xs font-black font-mono">૧.૨k+</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 block uppercase">રેટિંગ</span>
                            <span className="text-xs font-black text-amber-500 font-mono font-sans">૪.૯★</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setBlogSearchQuery("શાસ્ત્રી");
                              setSelectedCategory("All");
                            }}
                            className="w-full text-center py-2 bg-[#b8442c] hover:bg-[#a6301a] text-white text-[10px] font-black rounded-lg border-2 border-slate-950 shadow-[2px_2px_0px_#1a1f2e] transition active:translate-y-0.5 cursor-pointer"
                          >
                            📚 શાસ્ત્રી સરના લેખો ફિલ્ટર કરો
                          </button>
                          {blogSearchQuery === "શાસ્ત્રી" && (
                            <button
                              onClick={() => setBlogSearchQuery("")}
                              className="w-full text-center py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-gray-300 text-[9px] font-mono rounded cursor-pointer"
                            >
                              ક્લિયર ફિલ્ટર (Show All)
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Reading Progress Analytics Widget */}
                      <div className="bg-[#f3f7f6] dark:bg-slate-900/40 border-2 border-slate-900 dark:border-slate-800 rounded-3xl p-5 shadow-[4px_4px_0px_#1a1f2e] dark:shadow-[4px_4px_0px_#475569] space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b-2 border-dashed border-slate-200 dark:border-slate-800">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <h4 className="font-sans text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
                            અભ્યાસ પ્રગતિ રીપોર્ટ
                          </h4>
                        </div>

                        {/* Display earned badges with cute icons */}
                        <div className="space-y-3">
                          {(() => {
                            // Calculate global completion percent
                            const totalPossible = articles.length * 100;
                            const currentEarned = articles.reduce((sum, art) => sum + (articleProgress[art.id] || 0), 0);
                            const overallPercent = totalPossible > 0 ? Math.round((currentEarned / totalPossible) * 100) : 0;
                            
                            // badge evaluation
                            let badgeName = "ગણિત પ્રવાસી (Explorer)";
                            let badgeBg = "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-450 dark:border-amber-900";
                            if (overallPercent >= 75) {
                              badgeName = "ગણિત શિરોમણી (Scholar Master)";
                              badgeBg = "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-955 dark:text-rose-450 dark:border-rose-900";
                            } else if (overallPercent >= 40) {
                              badgeName = "પ્રમેય પ્રખર (Theorem Expert)";
                              badgeBg = "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-455 dark:border-indigo-900";
                            }

                            return (
                              <>
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                                    <span>સમગ્ર આર્ટિકલ પૂર્ણતા</span>
                                    <span className="font-mono text-slate-850 dark:text-white">{overallPercent}%</span>
                                  </div>
                                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 border border-slate-900 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-emerald-500 transition-all duration-500" 
                                      style={{ width: `${overallPercent}%` }}
                                    />
                                  </div>
                                </div>

                                <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                                  <span className="text-[9px] text-slate-400 block font-mono">લાયક પદક (Current Badge):</span>
                                  <div className={`inline-block mt-1.5 px-2.5 py-1 text-[9px] font-black rounded-lg border uppercase tracking-wider ${badgeBg}`}>
                                    🏆 {badgeName}
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>

                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-sans leading-tight">
                          તમામ બ્લોગ આર્ટિકલ્સ વાંચી સ્માર્ટ કીઓ પૂર્ણ કરવા પર તમારું શૈક્ષણિક રેટિંગ અપડેટ થાય છે.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ======================= SECTION 3: AI WORKSPACE DASHBOARD ======================= */}
          {activeTab === "ai-tools" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-200 dark:border-slate-800 pb-5">
                <h3 className="font-sans text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  શાહી AI લૅબ આયોજન (Aarsi Automation Suite)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  શિક્ષકો અને શૈક્ષણિક સંવાહકો માટે ખાસ ડિઝાઇન કરેલો સેકન્ડ-સેવિંગ AI સેટ જે જીબોર્ડ મુજબ ગુજરાતીમાં પરિણામો આપે છે.
                </p>
              </div>

              {/* Console Modular Component */}
              <AIToolsConsole />
            </div>
          )}

          {/* ======================= SECTION 4: STUDENT LEARNING HUB ======================= */}
          {activeTab === "student" && (
            <div className="space-y-8 animate-fade-in">
              
              <div className="border-b border-gray-200 dark:border-slate-800 pb-5">
                <h3 className="font-sans text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  વિદ્યાર્થી ગણિત અભ્યાસ ક્રાંતિ (Class 10 Student Hub)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  સમજો તમામ અઘરા વિષયો ઇન્ટરેક્ટિવ આલેખ અને કસ્ટમ એમસીક્યુ ટેસ્ટબોર્ડ દ્વારા. આત્મવિશ્વાસ સાથે ગણો પ્રકરણવાર દાખલા.
                </p>
              </div>

              {/* Polynomial Live Plotter Widget (CH 2 Polynomials requirement) */}
              <PolynomialPlotter />

              {/* Classroom Quiz MCQs Desk */}
              <QuizBoard />

            </div>
          )}

          {/* ======================= SECTION 5: TEACHER HUB / RESOURCES ======================= */}
          {activeTab === "teacher" && (
            <div className="space-y-8 animate-fade-in">
              
              <div className="border-b border-gray-200 dark:border-slate-800 pb-5">
                <h3 className="font-sans text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  શિક્ષક સંસાધન અને પત્રક હબ (Educators Desk)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  ડાઉનલોડ કરો પાઠ આયોજનના સરકારી ફોર્મેટ્સ, મહત્વના લિવિંગ સર્ટિફિકેટના ફાસ્ટ પીડીએફ અને વહીવટી પ્રવૃત્તિ નોંધપોથી.
                </p>
              </div>

              {/* List template files card grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TEACHER_RESOURCES.map((rsc) => (
                  <div
                    key={rsc.id}
                    className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-[3px_3px_0px_#0f172a]"
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="bg-red-50 text-red-600 dark:bg-purple-950/40 dark:text-purple-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          {rsc.fileType}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">ID: {rsc.id.toUpperCase()}</span>
                      </div>
                      <h4 className="font-sans text-xs font-bold text-slate-900 dark:text-white">
                        {rsc.gujTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed block max-w-sm">
                        {rsc.description}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        alert(`"${rsc.gujTitle}" ડાઉનલોડ પ્રક્રિયા સક્રિય છે! આ ટાસ્ક સુરક્ષિત રીતે ક્લિપબોર્ડ માં રેકોર્ડ થયું છે.`);
                      }}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-950 dark:border-slate-700 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> દસ્તાવેજ ફોર્મેટ સેવ કરો
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ======================= SECTION 6: SCHOOL ERP SHOWCASE ======================= */}
          {activeTab === "erp" && (
            <div className="space-y-6 animate-fade-in">
              {/* ERP Playground Sandbox component */}
              <ERPShowcase />
            </div>
          )}

        </div>
      </main>

      {/* Modern Newsletter Subscription popup/section with retro style */}
      <section className="bg-slate-950 text-white py-12 border-t-2 border-slate-900 select-none">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center justify-center p-2.5 bg-red-600 rounded-full mb-1">
            <Mail className="w-6 h-6 text-white" />
          </div>
          
          <h4 className="font-sans text-2xl font-black tracking-tight text-white leading-tight">
            આરસી સાપ્તાહિક AI પત્રકો અને વહીવટી ન્યૂઝલેટર
          </h4>
          
          <p className="text-xs text-gray-400 max-w-lg mx-auto">
            રોજના ૫,૦૦૦+ સબ્સ્ક્રાઇબર આચાર્યશ્રીઓ અને સ્માર્ટ શિક્ષકોની કમ્યુનિટીમાં જોડાઓ. લેટેસ્ટ સરકારી GR પૉલિસી અને બોર્ડ પેપરો મેળવો.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="તમારું ઇમેઇલ આઈડી લખો..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 bg-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:bg-white/15 transition font-sans border border-white/10"
              required
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl border-2 border-slate-950 font-bold px-6 py-2.5 text-xs tracking-wider transition-all shadow-[2px_2px_0px_rgba(255,255,255,0.8)]"
            >
              જોડાઓ (Join free)
            </button>
          </form>
        </div>
      </section>

      {/* Professional Branded Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            
            {/* Startup description */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-1.5 text-white font-sans text-sm font-black">
                <div className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold shadow-md">A</div>
                <span>AARSI AI EDUCATION</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed font-sans font-semibold max-w-sm">
                એજ્યુકેશન ટેક્નોલોજી ક્ષેત્રે ગુજરાત બોર્ડ (GSEB) શાળાઓના વહીવટને ઓટોમેટેડ અને ઉર્જામય બનાવવા તથા ગુણવત્તાયુક્ત ડિજિટલ સાક્ષરતા ફેલાવવાનું અનન્ય અભિયાન.
              </p>
            </div>

            {/* Sitemap section */}
            <div className="space-y-2">
              <span className="font-bold text-slate-300 text-[10px] uppercase tracking-wider block">સેવાઓ અને હબ</span>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button onClick={() => { setActiveTab("ai-tools"); setReadingArticle(null); }} className="hover:text-white transition">
                    AI Lesson Planner
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("student"); setReadingArticle(null); }} className="hover:text-white transition">
                    ગણિત આલેખ પ્લોટર
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("student"); setReadingArticle(null); }} className="hover:text-white transition">
                    એમ.સી.ક્યુ સ્કોરબોર્ડ
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("erp"); setReadingArticle(null); }} className="hover:text-white transition">
                    સ્કૂલ જી.આર. ઓટોમેશન
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources list sitemap */}
            <div className="space-y-2">
              <span className="font-bold text-slate-300 text-[10px] uppercase tracking-wider block">વિશેષ સંસાધન</span>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button onClick={() => { setActiveTab("blog"); setReadingArticle(null); }} className="hover:text-white transition">
                    શિક્ષણ લેખ બ્લોગ
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("teacher"); setReadingArticle(null); }} className="hover:text-white transition">
                    આદર્શ ડ્રાફ્ટ નમૂનાઓ
                  </button>
                </li>
                <li>
                  <span className="text-slate-600 cursor-not-allowed">NEP ૨૦૨૦ માર્ગદર્શિકા</span>
                </li>
              </ul>
            </div>

            {/* Legal / Contact details */}
            <div className="space-y-2">
              <span className="font-bold text-slate-300 text-[10px] uppercase tracking-wider block">સંપર્ક ડેસ્ક</span>
              <ul className="space-y-1.5 text-[11px] text-gray-500">
                <li>ઇમેઇલ: ravisir11@gmail.com</li>
                <li>હેલ્પલાઇન: +૯૧ અમદાવાદ, ગુજરાત</li>
                <li>મુખ્ય શાખા: આરસી એજ્યુકેશન હેડક્વાર્ટર</li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500">
            <p className="font-sans">
              © ૨૦૨૬ Aarsi AI Education Elite Systems. સર્વાધિકાર સુરક્ષિત.
            </p>
            <div className="flex items-center gap-1.5 select-none font-bold">
              <span>તૈયાર કરેલ સહ સ્નેહપૂર્વક</span>
              <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600 animate-pulse" />
              <span>ગુજરાતી એજ્યુકેશન આર્કિટેક્ટ્સ</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Interactive Chatbot side-panel */}
      <AIAssistant />

    </div>
  );
}
