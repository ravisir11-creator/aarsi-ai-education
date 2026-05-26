import { ERPFeature, ResourceHubItem } from "../types";

export const ERP_FEATURES: ERPFeature[] = [
  {
    id: "admission",
    title: "Admission ERP & Enquiries",
    gujTitle: "પ્રવેશ પ્રક્રિયા ડિજિટલાઇઝેશન",
    description: "નવા અરજી ફોર્મ્સ ભરવા, ડોક્યુમેન્ટ અપલોડ કરવા, ફી ભરવી અને ઇન્ટરવ્યુ શિડ્યુલ કરવા સુધીની સંપૂર્ણ પ્રોસેસ વાયરલેસ ૧૦ મિનિટમાં પૂરી કરો.",
    iconName: "UserCheck",
    metrics: [
      { label: "ટ્રાન્ઝેક્શન સચોટતા", value: "૧૦૦%" },
      { label: "વાલી રજીસ્ટ્રેશન સમય", value: "બે મિનિટ" }
    ]
  },
  {
    id: "general-register",
    title: "General Register (GR Book) Auto",
    gujTitle: "જનરલ રજીસ્ટર (GR) ઓટોમેશન",
    description: "શાળાના આરંભથી ૧૯૯૦ થી અત્યાર સુધીના લાખો રેકોર્ડ્સ ઓટોમેટિક સર્ચ કરી, માત્ર એક ક્લિકમાં દાખલો (L.C.) ડ્રાફ્ટ કરવા માટેનું દૈવી અસ્ત્ર.",
    iconName: "BookOpen",
    metrics: [
      { label: "રેકોર્ડ શોધવાનો સમય", value: "૩ સેકન્ડ" },
      { label: "ડાઉનલોડ પીડીએફ ફોર્મેટ", value: "SSC/HSC માન્ય" }
    ]
  },
  {
    id: "attendance-rfid",
    title: "RFID & Face Attendance Sync",
    gujTitle: "હાજરી સિસ્ટમ અને હોમ એલર્ટ",
    description: "વિદ્યાર્થી ગેટમાં પ્રવેશે એટલે એટેન્ડન્સ નોંધાય અને તાત્કાલિક સેકન્ડોમાં ગેરહાજર અથવા મોડા આવનારના વાલીઓને ગુજરાતી સ્માર્ટ વોટ્સએપ નોટિફિકેશન મોકલો.",
    iconName: "Clock",
    metrics: [
      { label: "ઓટો વોટ્સએપ ડિલિવરી", value: "૦.૫ સેકન્ડ" },
      { label: "પેપરવર્ક બચત", value: "૧૦૦%" }
    ]
  },
  {
    id: "report-cards",
    title: "Automated Report Cards & Analytics",
    gujTitle: "પ્રગતિ પત્રક (રેઝલ્ટ) જનરેટર",
    description: "શિક્ષકો આંકડાકીય ગુણ ભરે અને આલેખ, શૈક્ષણિક પ્રગતિ ચાર્ટ અને સુધારણા માપો સાથેનું સુંદર ગ્રાફિકલ પ્રોગ્રેસ કાર્ડ ઓટોમેટિક ડાઉનલોડ થાય.",
    iconName: "TrendingUp",
    metrics: [
      { label: "ચાર્ટ પ્રકારો", value: "૭+ વિવિધ" },
      { label: "વાલી સંતોષ રેટિંગ", value: "૧૦/૧૦" }
    ]
  }
];

export const TEACHER_RESOURCES: ResourceHubItem[] = [
  {
    id: "t1",
    title: "Lesson Plan Standard Format",
    gujTitle: "આદર્શ પાઠ આયોજન નમૂનો (GSEB)",
    description: "તમામ વિષયો માટે ઉપયોગી, બોર્ડના નવા પરીક્ષણ માધ્યમ આધારિત પાઠ આયોજન લેખિતી ફોર્મેટ (વર્ડ / પીડીએફ).",
    category: "teacher",
    fileType: "Template"
  },
  {
    id: "t2",
    title: "AI Prompts Sheet for Classroom Activities",
    gujTitle: "વર્ગખંડ રસપ્રદ રમતો માટે શ્રેષ્ઠ AI શૉટ્સ",
    description: "વિજ્ઞાન અને ગણિતના અઘરા દાખલાઓને વાર્તા દ્વારા બાળકોને સમજાવવા કમ્પ્યુટરને કયો પ્રોમ્પ્ટ આપવો તેનો સંગ્રહ.",
    category: "teacher",
    fileType: "Interactive"
  },
  {
    id: "t3",
    title: "School Leaving Certificate draft format",
    gujTitle: "શાળા લિવિંગ સર્ટિફિકેટ (L.C.) માન્ય નમૂનો",
    description: "શિક્ષણ વિભાગના લેટેસ્ટ નિયમો અનુસાર તૈયાર કરેલો ડિમાન્ડ શિપ્રિન્ટ ડ્રાફ્ટ નમૂનો.",
    category: "teacher",
    fileType: "Document"
  },
  {
    id: "t4",
    title: "Teacher Daily Goal tracker template",
    gujTitle: "ટીચર ડેઇલી ગોલ અને વહીવટી ડાયરી",
    description: "મહત્વની શૈક્ષણિક વિગતો, ગણતરી માર્ગ અને રોજની પ્રવૃત્તિ નોંધવાની સ્માર્ટ વૈયક્તિક શીટ.",
    category: "teacher",
    fileType: "PDF"
  }
];

export const YOUTUBE_VIDEOS = [
  {
    id: "y1",
    title: "શાળાના વહીવટી કામોમાં Gemini AI અને સ્માર્ટ ડોક્યુમેન્ટ્સનો કમાલ",
    duration: "૧૫:૪૫",
    views: "૫.૬K views",
    thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400",
    videoUrl: "https://www.youtube.com/watch?v=g91T_K7Xfco"
  },
  {
    id: "y2",
    title: "ધોરણ ૧૦ ગણિત: બહુપદીઓના આલેખ અને શૂન્યોની સમજ (ગુજરાતી માધ્યમ)",
    duration: "૨૪:૧૨",
    views: "૧૨K views",
    thumbnail: "https://images.unsplash.com/photo-1629019725648-825672971975?w=400",
    videoUrl: "https://www.youtube.com/watch?v=fXW9vG4C-Z4"
  },
  {
    id: "y3",
    title: "Aarsi Smart ERP: શાળાનું જનરલ રજીસ્ટર (GR Book) કેવી રીતે કમ્પ્યુટરાઈઝ્ડ કરવું?",
    duration: "૧૮:૩૦",
    views: "૨.૮K views",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    videoUrl: "https://www.youtube.com/watch?v=e_N9gsc3K_g"
  }
];

export const TESTIMONIALS = [
  {
    name: "પ્રિન્સિપાલ હરેશભાઈ પટેલ",
    school: "સરદાર વલ્લભભાઈ ટેક વિધાલય, મહેસાણા",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    text: "Aarsi AI ERP ના અમલ પછી અમારો GR શોધવાનો અને L.C. પ્રિન્ટ કરવાનો કલાકોનો લોડ સેકન્ડોમાં પતી જાય છે. અમારા સ્ટાફના રોજ ૨ થી ૩ કલાક બચે છે."
  },
  {
    name: "મેઘનાબેન સોની (શિક્ષિકાશ્રી)",
    school: "સ્માર્ટ ટાઉન ગર્લ્સ સ્કૂલ, રાજકોટ",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    text: "AI Lesson Planner અને Homework Generator થી મારા ગણિત અને વિજ્ઞાનના અઠવાડિક લેક્ચર્સ ખુબ જ સરસ અને વિવિધતાઓથી સભર બની ગયા છે. બાળકોને ખુબ મજા આવે છે!"
  },
  {
    name: "કેવલ પ્રજાપતિ (ધોરણ ૧૦ વિદ્યાર્થી)",
    school: "GSEB બોર્ડ બેચ, સુરત",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100",
    text: "ગણિતના નિત્યસમો અને બહુપદીઓના દાખલા મને ખુબ અઘરા લાગતા હતા. Aarsi Student Hub ની ફોર્મ્યુલા શીટ અને ઓટો-ટેસ્ટીંગથી હવે મને ગણિતમાં ખૂબ ઊંચા માર્ક્સ આવી રહ્યા છે."
  }
];
