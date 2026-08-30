import React, { useState, useEffect } from "react";
import {
  Anchor, Radar as RadarIcon, Fish, CloudRain, ShieldCheck, ShieldAlert,
  AlertTriangle, Navigation, Battery, Thermometer, Fuel, Wind, Waves,
  MapPin, Activity, CheckCircle2, XCircle, Signal, Gauge, ChevronRight,
  Compass, FileCheck2, TrendingUp, Bell, Cpu, Landmark, User, Lock,
  ArrowLeft, LogOut, Plus, KeyRound, Upload, Clock, UserPlus, Ship,
  ArrowUpCircle, ArrowDownCircle, ArrowLeftCircle, ArrowRightCircle,
  Hourglass, Send, ShieldQuestion, MessageSquareWarning, Users, Phone,
  LifeBuoy, Radio, HeartPulse, Flame, Satellite, Target, Square, CheckSquare,
  Globe, Play, Volume2, ArrowRight, ArrowDown, Cloud, Network, Pencil, Trash2, Save
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  RadialBarChart, RadialBar, PolarAngleAxis, CartesianGrid, AreaChart, Area
} from "recharts";
import { api } from "./api/client";
/* ---------------------------------------------------------------
   FONTS
---------------------------------------------------------------- */
function FontLoader() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
}

/* ---------------------------------------------------------------
   DESIGN TOKENS
---------------------------------------------------------------- */
const C = {
  bg: "#081420",
  panel: "#0E2233",
  panelAlt: "#0B1C2B",
  border: "#1D3B52",
  fog: "#E7EEF3",
  fogDim: "#7F9CB0",
  amber: "#E8A33D",
  amberDim: "#8A6528",
  teal: "#33D6C0",
  coral: "#E8604C",
  brass: "#C08552",
};
const FONT_DISPLAY = "'Oswald', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

/* ---------------------------------------------------------------
   MOCK DATA
---------------------------------------------------------------- */
const HOME_PORT = { lat: 8.0883, lon: 77.5385, name: "Thoothukudi Harbor" };
const SPECIES = ["Indian Mackerel", "Sardine", "Pomfret", "Tuna (Skipjack)", "Prawn"];

const initialFleet = [
  { id: "TV-104", name: "Kadal Rani", captain: "R. Murugan", mmsi: "419008104", lat: 8.21, lon: 77.71, heading: 42, speed: 8.4, fuel: 74, engineTemp: 82, battery: 91, catchKg: 340, quotaKg: 500, species: "Indian Mackerel", sustainability: 88, geofence: "inside", compliance: "compliant", password: "kadal123" },
  { id: "TV-217", name: "Meen Kadal", captain: "S. Antony", mmsi: "419008217", lat: 8.34, lon: 77.88, heading: 118, speed: 6.1, fuel: 38, engineTemp: 89, battery: 67, catchKg: 512, quotaKg: 500, species: "Sardine", sustainability: 61, geofence: "inside", compliance: "review", password: "meen123" },
  { id: "TV-330", name: "Vela Veeran", captain: "K. Joseph", mmsi: "419008330", lat: 7.95, lon: 77.62, heading: 275, speed: 9.9, fuel: 91, engineTemp: 78, battery: 95, catchKg: 210, quotaKg: 450, species: "Tuna (Skipjack)", sustainability: 94, geofence: "inside", compliance: "compliant", password: "vela123" },
  { id: "TV-441", name: "Kadal Kanni", captain: "P. Selvam", mmsi: "419008441", lat: 8.42, lon: 77.45, heading: 5, speed: 2.3, fuel: 15, engineTemp: 94, battery: 40, catchKg: 480, quotaKg: 480, species: "Prawn", sustainability: 52, geofence: "breach", compliance: "violation", password: "kanni123" },
  { id: "TV-552", name: "Then Thendral", captain: "A. Regan", mmsi: "419008552", lat: 8.05, lon: 77.98, heading: 200, speed: 7.2, fuel: 63, engineTemp: 80, battery: 82, catchKg: 275, quotaKg: 500, species: "Pomfret", sustainability: 79, geofence: "inside", compliance: "compliant", password: "then123" },
];

const GOV_OFFICERS = [
  { id: "DFO-0021", name: "V. Lakshmi", department: "Dept. of Fisheries", password: "gov123" },
  { id: "DFO-0045", name: "T. Kumaresan", department: "Coastal Regulation Authority", password: "gov123" },
];

const waveHistory = Array.from({ length: 12 }, (_, i) => ({
  t: `${(i * 2).toString().padStart(2, "0")}:00`,
  waveM: +(0.6 + Math.sin(i / 2) * 0.3 + Math.random() * 0.15).toFixed(2),
  windKn: Math.round(9 + Math.sin(i / 3) * 4 + Math.random() * 2),
}));

// Government-issued sea conditions advisory shown to fishermen before they
// request approval to sail. Flip `level` to 'restricted' to demo a hard block.
const SEA_ADVISORY = {
  level: "caution", // 'clear' | 'caution' | 'restricted'
  message: "Moderate swell advisory: 1.2–1.5m waves expected after 18:00. Small craft should exercise caution beyond 8nm.",
  issuedBy: "Regional Meteorological Centre, Chennai",
};

const DENY_REASONS = [
  "Weather restriction — sea conditions unsafe",
  "Vessel compliance violation on file",
  "Fishing license expired or under review",
  "Restricted zone / seasonal trawl ban in effect",
];

/* ---------------------------------------------------------------
   I18N — fisherman portal supports English, Tamil, and Hindi.
   tr(lang, key) looks up a string, falling back to English, then the key itself.
---------------------------------------------------------------- */
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ta", label: "தமிழ்" },
  { code: "hi", label: "हिन्दी" },
  { code: "ml", label: "മലയാളം" },
  { code: "te", label: "తెలుగు" },
];

const STRINGS = {
  en: {
    signOut: "Sign out", back: "Back", required: "Required", requiredApproval: "Required for approval",
    sampleLogin: "Sample login", newVessel: "New vessel? Register here",
    fishermanPortal: "Fisherman Portal", fishermanSubtitle: "Sign in with your vessel account",
    vesselIdOrUsername: "Vessel ID or Username", password: "Password", signIn: "Sign In",
    registerVessel: "Register Your Vessel", registerSubtitle: "Create your vessel account to access the fisherman portal",
    backToSignIn: "Back to sign in", vesselDetails: "Vessel Details", vesselName: "Vessel Name", vesselId: "Vessel ID",
    captainName: "Captain / Owner Name", fishingLicense: "Fishing License", previousTripDetails: "Previous Trip Details (optional)",
    tripDate: "Trip Date", tripDuration: "Trip Duration", speciesCaught: "Species Caught", catchWeightKg: "Catch Weight (kg)",
    accountLogin: "Account Login", username: "Username", confirmPassword: "Confirm Password", registerContinue: "Register & Continue",
    startOfTrip: "Start of Trip", stepTripDetails: "1. Trip Details", stepGovApproval: "2. Government Approval",
    tripIntro: "Log today's trip before heading out. This information is reviewed by the Fisheries Department before you're cleared to sail.",
    fishingZoneDirection: "Fishing Zone Direction", north: "North", south: "South", east: "East", west: "West",
    tripTiming: "Trip Timing", seaEntryTime: "Sea Entry Time", expectedReturnTime: "Expected Return Time",
    fuelLevelDeparture: "Fuel Level at Departure", fishingPlan: "Fishing Plan", targetSpecies: "Target Species",
    distanceFromShore: "Distance from Shore (nm)", crewEmergencyContact: "Crew & Emergency Contact",
    crewMembersAboard: "Crew Members Aboard", contactNameShore: "Contact Name (shore)", emergencyContactPhone: "Emergency Contact Phone",
    safetyEquipmentOnboard: "Safety Equipment Onboard", confirmedOnboard: "confirmed onboard", tripSummary: "Trip Summary",
    heading: "Heading", crew: "Crew", entry: "Entry", returnLabel: "Return", fuel: "Fuel", safety: "Safety", contact: "Contact",
    continueToApproval: "Continue to Approval Request",
    requestApprovalToSail: "Request Approval to Sail", govSeaAdvisory: "Government Sea Advisory", vesselClearanceStatus: "Vessel Clearance Status",
    clear: "Clear", flagged: "Flagged", tripBeingRequested: "Trip Being Requested", submitRequest: "Submit Approval Request to Government",
    pendingMsg: "Request submitted — awaiting government review.", approvedMsg: "Approved — cleared to sail.", deniedMsg: "Request denied.",
    resubmitRequest: "Resubmit Request", continueToDashboard: "Continue to Dashboard",
    overview: "Overview", catchLogTab: "Catch Log", documentsTrip: "Documents & Trip", alertsWeather: "Alerts & Weather",
    myVessel: "My Vessel", engineFuel: "Engine & Fuel", mySustainabilityScore: "My Sustainability Score", currentTrip: "Current Trip",
    logACatch: "Log a Catch", species: "Species", weightKg: "Weight (kg)", addToTripLog: "Add to Trip Log", tripQuotaProgress: "Trip quota progress",
    myTripCatchLog: "My Trip Catch Log", noCatchesYet: "No catches logged this trip yet.",
    vesselRegistration: "Vessel Registration", previousTripOnFile: "Previous Trip on File", noTripDetailsOnFile: "No previous trip details on file.",
    currentTripDetails: "Current Trip Details", noTripLoggedToday: "No trip logged yet today.",
    alertsForVessel: "Alerts For My Vessel", seaConditions: "Sea Conditions",
    sustainability: "Sustainability", ofQuota: "of quota", cleared: "Cleared to sail by", denied: "Sailing denied", awaitingApproval: "Awaiting government approval to sail",
    safeToSail: "Safe to Sail", cautionStatus: "Caution", doNotSail: "Do Not Sail", tripSafetyScore: "Trip Safety Score",
  },
  ta: {
    signOut: "வெளியேறு", back: "பின்செல்", required: "தேவை", requiredApproval: "ஒப்புதலுக்கு தேவை",
    sampleLogin: "மாதிரி உள்நுழைவு", newVessel: "புதிய படகா? இங்கே பதிவு செய்யவும்",
    fishermanPortal: "மீனவர் போர்டல்", fishermanSubtitle: "உங்கள் படகு கணக்கில் உள்நுழையவும்",
    vesselIdOrUsername: "படகு ஐடி / பயனர்பெயர்", password: "கடவுச்சொல்", signIn: "உள்நுழை",
    registerVessel: "உங்கள் படகைப் பதிவு செய்யவும்", registerSubtitle: "மீனவர் போர்டலை அணுக உங்கள் படகு கணக்கை உருவாக்கவும்",
    backToSignIn: "உள்நுழைவுக்குத் திரும்பு", vesselDetails: "படகு விவரங்கள்", vesselName: "படகு பெயர்", vesselId: "படகு ஐடி",
    captainName: "கேப்டன் / உரிமையாளர் பெயர்", fishingLicense: "மீன்பிடி உரிமம்", previousTripDetails: "முந்தைய பயண விவரங்கள் (விருப்பம்)",
    tripDate: "பயண தேதி", tripDuration: "பயண கால அளவு", speciesCaught: "பிடிக்கப்பட்ட வகை", catchWeightKg: "எடை (கிலோ)",
    accountLogin: "கணக்கு உள்நுழைவு", username: "பயனர்பெயர்", confirmPassword: "கடவுச்சொல்லை உறுதிசெய்", registerContinue: "பதிவு செய்து தொடரவும்",
    startOfTrip: "பயணத்தின் தொடக்கம்", stepTripDetails: "1. பயண விவரங்கள்", stepGovApproval: "2. அரசு ஒப்புதல்",
    tripIntro: "கடலுக்குச் செல்வதற்கு முன் இன்றைய பயணத்தை பதிவு செய்யவும். இந்த தகவல் மீன்வளத் துறையால் ஆய்வு செய்யப்பட்ட பின் உங்களுக்கு அனுமதி வழங்கப்படும்.",
    fishingZoneDirection: "மீன்பிடி மண்டல திசை", north: "வடக்கு", south: "தெற்கு", east: "கிழக்கு", west: "மேற்கு",
    tripTiming: "பயண நேரம்", seaEntryTime: "கடல் நுழை நேரம்", expectedReturnTime: "எதிர்பார்க்கும் திரும்பும் நேரம்",
    fuelLevelDeparture: "புறப்படும் போது எரிபொருள் அளவு", fishingPlan: "மீன்பிடி திட்டம்", targetSpecies: "இலக்கு வகை",
    distanceFromShore: "கரையிலிருந்து தூரம் (நா.மை)", crewEmergencyContact: "பணியாளர்கள் & அவசர தொடர்பு",
    crewMembersAboard: "படகில் உள்ள பணியாளர்கள்", contactNameShore: "தொடர்பு பெயர் (கரை)", emergencyContactPhone: "அவசர தொடர்பு எண்",
    safetyEquipmentOnboard: "படகில் உள்ள பாதுகாப்பு கருவிகள்", confirmedOnboard: "உறுதிசெய்யப்பட்டது", tripSummary: "பயண சுருக்கம்",
    heading: "திசை", crew: "பணியாளர்கள்", entry: "நுழைவு", returnLabel: "திரும்புதல்", fuel: "எரிபொருள்", safety: "பாதுகாப்பு", contact: "தொடர்பு",
    continueToApproval: "ஒப்புதல் கோரிக்கைக்குத் தொடரவும்",
    requestApprovalToSail: "கடலுக்குச் செல்ல ஒப்புதல் கோரவும்", govSeaAdvisory: "அரசு கடல் ஆலோசனை", vesselClearanceStatus: "படகு அனுமதி நிலை",
    clear: "தெளிவு", flagged: "கவனிக்கப்பட்டது", tripBeingRequested: "கோரப்படும் பயணம்", submitRequest: "அரசுக்கு ஒப்புதல் கோரிக்கையை சமர்ப்பிக்கவும்",
    pendingMsg: "கோரிக்கை சமர்ப்பிக்கப்பட்டது — அரசு மறுஆய்வுக்காக காத்திருக்கிறது.", approvedMsg: "ஒப்புதல் அளிக்கப்பட்டது — கடலுக்குச் செல்லலாம்.", deniedMsg: "கோரிக்கை நிராகரிக்கப்பட்டது.",
    resubmitRequest: "மீண்டும் சமர்ப்பிக்கவும்", continueToDashboard: "டாஷ்போர்டுக்குத் தொடரவும்",
    overview: "மேலோட்டம்", catchLogTab: "பிடிப்பு பதிவு", documentsTrip: "ஆவணங்கள் & பயணம்", alertsWeather: "எச்சரிக்கைகள் & வானிலை",
    myVessel: "என் படகு", engineFuel: "இயந்திரம் & எரிபொருள்", mySustainabilityScore: "என் நிலைத்தன்மை மதிப்பெண்", currentTrip: "தற்போதைய பயணம்",
    logACatch: "பிடிப்பைப் பதிவு செய்", species: "வகை", weightKg: "எடை (கிலோ)", addToTripLog: "பயண பதிவில் சேர்", tripQuotaProgress: "பயண ஒதுக்கீடு முன்னேற்றம்",
    myTripCatchLog: "என் பயண பிடிப்பு பதிவு", noCatchesYet: "இந்த பயணத்தில் இன்னும் பிடிப்புகள் பதிவு செய்யப்படவில்லை.",
    vesselRegistration: "படகு பதிவு", previousTripOnFile: "பதிவில் உள்ள முந்தைய பயணம்", noTripDetailsOnFile: "முந்தைய பயண விவரங்கள் இல்லை.",
    currentTripDetails: "தற்போதைய பயண விவரங்கள்", noTripLoggedToday: "இன்று இன்னும் பயணம் பதிவு செய்யப்படவில்லை.",
    alertsForVessel: "என் படகுக்கான எச்சரிக்கைகள்", seaConditions: "கடல் நிலைமைகள்",
    sustainability: "நிலைத்தன்மை", ofQuota: "ஒதுக்கீட்டில்", cleared: "இவரால் அனுமதி:", denied: "செல்ல மறுக்கப்பட்டது", awaitingApproval: "அரசு ஒப்புதலுக்காக காத்திருக்கிறது",
    safeToSail: "செல்லலாம்", cautionStatus: "எச்சரிக்கை", doNotSail: "செல்ல வேண்டாம்", tripSafetyScore: "பயண பாதுகாப்பு மதிப்பெண்",
  },
  hi: {
    signOut: "साइन आउट", back: "वापस", required: "आवश्यक", requiredApproval: "अनुमोदन के लिए आवश्यक",
    sampleLogin: "नमूना लॉगिन", newVessel: "नई नाव? यहाँ पंजीकरण करें",
    fishermanPortal: "मछुआरा पोर्टल", fishermanSubtitle: "अपने नाव खाते से साइन इन करें",
    vesselIdOrUsername: "नाव आईडी / उपयोगकर्ता नाम", password: "पासवर्ड", signIn: "साइन इन करें",
    registerVessel: "अपनी नाव पंजीकृत करें", registerSubtitle: "मछुआरा पोर्टल तक पहुँचने के लिए अपना नाव खाता बनाएं",
    backToSignIn: "साइन इन पर वापस जाएं", vesselDetails: "नाव विवरण", vesselName: "नाव का नाम", vesselId: "नाव आईडी",
    captainName: "कप्तान / मालिक का नाम", fishingLicense: "मछली पकड़ने का लाइसेंस", previousTripDetails: "पिछली यात्रा का विवरण (वैकल्पिक)",
    tripDate: "यात्रा तिथि", tripDuration: "यात्रा अवधि", speciesCaught: "पकड़ी गई प्रजाति", catchWeightKg: "वजन (किग्रा)",
    accountLogin: "खाता लॉगिन", username: "उपयोगकर्ता नाम", confirmPassword: "पासवर्ड की पुष्टि करें", registerContinue: "पंजीकरण करें और जारी रखें",
    startOfTrip: "यात्रा की शुरुआत", stepTripDetails: "1. यात्रा विवरण", stepGovApproval: "2. सरकारी अनुमोदन",
    tripIntro: "समुद्र में जाने से पहले आज की यात्रा दर्ज करें। रवाना होने की अनुमति देने से पहले मत्स्य विभाग द्वारा इस जानकारी की समीक्षा की जाती है।",
    fishingZoneDirection: "मछली पकड़ने की दिशा", north: "उत्तर", south: "दक्षिण", east: "पूर्व", west: "पश्चिम",
    tripTiming: "यात्रा का समय", seaEntryTime: "समुद्र प्रवेश समय", expectedReturnTime: "अपेक्षित वापसी समय",
    fuelLevelDeparture: "प्रस्थान पर ईंधन स्तर", fishingPlan: "मछली पकड़ने की योजना", targetSpecies: "लक्षित प्रजाति",
    distanceFromShore: "तट से दूरी (नॉ.मील)", crewEmergencyContact: "चालक दल और आपातकालीन संपर्क",
    crewMembersAboard: "नाव पर चालक दल के सदस्य", contactNameShore: "संपर्क नाम (तट पर)", emergencyContactPhone: "आपातकालीन संपर्क फ़ोन",
    safetyEquipmentOnboard: "नाव पर सुरक्षा उपकरण", confirmedOnboard: "पुष्टि की गई", tripSummary: "यात्रा सारांश",
    heading: "दिशा", crew: "चालक दल", entry: "प्रवेश", returnLabel: "वापसी", fuel: "ईंधन", safety: "सुरक्षा", contact: "संपर्क",
    continueToApproval: "अनुमोदन अनुरोध पर जारी रखें",
    requestApprovalToSail: "रवाना होने की अनुमति का अनुरोध करें", govSeaAdvisory: "सरकारी समुद्र सलाह", vesselClearanceStatus: "नाव मंज़ूरी स्थिति",
    clear: "स्पष्ट", flagged: "चिह्नित", tripBeingRequested: "अनुरोधित यात्रा", submitRequest: "सरकार को अनुमोदन अनुरोध भेजें",
    pendingMsg: "अनुरोध भेजा गया — सरकारी समीक्षा की प्रतीक्षा है।", approvedMsg: "स्वीकृत — रवाना होने की अनुमति मिली।", deniedMsg: "अनुरोध अस्वीकृत।",
    resubmitRequest: "फिर से भेजें", continueToDashboard: "डैशबोर्ड पर जारी रखें",
    overview: "अवलोकन", catchLogTab: "पकड़ लॉग", documentsTrip: "दस्तावेज़ और यात्रा", alertsWeather: "अलर्ट और मौसम",
    myVessel: "मेरी नाव", engineFuel: "इंजन और ईंधन", mySustainabilityScore: "मेरा स्थिरता स्कोर", currentTrip: "वर्तमान यात्रा",
    logACatch: "पकड़ दर्ज करें", species: "प्रजाति", weightKg: "वजन (किग्रा)", addToTripLog: "यात्रा लॉग में जोड़ें", tripQuotaProgress: "यात्रा कोटा प्रगति",
    myTripCatchLog: "मेरी यात्रा पकड़ लॉग", noCatchesYet: "इस यात्रा में अभी तक कोई पकड़ दर्ज नहीं हुई।",
    vesselRegistration: "नाव पंजीकरण", previousTripOnFile: "फ़ाइल में पिछली यात्रा", noTripDetailsOnFile: "कोई पिछली यात्रा विवरण फ़ाइल में नहीं है।",
    currentTripDetails: "वर्तमान यात्रा विवरण", noTripLoggedToday: "आज तक कोई यात्रा दर्ज नहीं हुई।",
    alertsForVessel: "मेरी नाव के लिए अलर्ट", seaConditions: "समुद्री स्थितियाँ",
    sustainability: "स्थिरता", ofQuota: "कोटा का", cleared: "इनके द्वारा रवाना होने की अनुमति:", denied: "रवाना होने से इनकार", awaitingApproval: "सरकारी अनुमोदन की प्रतीक्षा में",
    safeToSail: "रवाना होना सुरक्षित", cautionStatus: "सावधानी", doNotSail: "रवाना न हों", tripSafetyScore: "यात्रा सुरक्षा स्कोर",
  },
  ml: {
    signOut: "സൈൻ ഔട്ട്", back: "തിരികെ", required: "ആവശ്യമാണ്", requiredApproval: "അംഗീകാരത്തിന് ആവശ്യമാണ്",
    sampleLogin: "സാമ്പിൾ ലോഗിൻ", newVessel: "പുതിയ വള്ളമോ? ഇവിടെ രജിസ്റ്റർ ചെയ്യുക",
    fishermanPortal: "മത്സ്യത്തൊഴിലാളി പോർട്ടൽ", fishermanSubtitle: "നിങ്ങളുടെ വള്ളം അക്കൗണ്ട് ഉപയോഗിച്ച് സൈൻ ഇൻ ചെയ്യുക",
    vesselIdOrUsername: "വള്ളം ഐഡി / ഉപയോക്തൃനാമം", password: "പാസ്‌വേഡ്", signIn: "സൈൻ ഇൻ",
    registerVessel: "നിങ്ങളുടെ വള്ളം രജിസ്റ്റർ ചെയ്യുക", registerSubtitle: "മത്സ്യത്തൊഴിലാളി പോർട്ടൽ ഉപയോഗിക്കാൻ നിങ്ങളുടെ വള്ളം അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    backToSignIn: "സൈൻ ഇന്നിലേക്ക് മടങ്ങുക", vesselDetails: "വള്ളത്തിന്റെ വിവരങ്ങൾ", vesselName: "വള്ളത്തിന്റെ പേര്", vesselId: "വള്ളം ഐഡി",
    captainName: "ക്യാപ്റ്റൻ / ഉടമയുടെ പേര്", fishingLicense: "മത്സ്യബന്ധന ലൈസൻസ്", previousTripDetails: "മുൻ യാത്രാ വിവരങ്ങൾ (ഐച്ഛികം)",
    tripDate: "യാത്രാ തീയതി", tripDuration: "യാത്രാ ദൈർഘ്യം", speciesCaught: "പിടിച്ച ഇനം", catchWeightKg: "ഭാരം (കിലോ)",
    accountLogin: "അക്കൗണ്ട് ലോഗിൻ", username: "ഉപയോക്തൃനാമം", confirmPassword: "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക", registerContinue: "രജിസ്റ്റർ ചെയ്ത് തുടരുക",
    startOfTrip: "യാത്രയുടെ തുടക്കം", stepTripDetails: "1. യാത്രാ വിവരങ്ങൾ", stepGovApproval: "2. സർക്കാർ അനുമതി",
    tripIntro: "കടലിലേക്ക് പോകുന്നതിന് മുമ്പ് ഇന്നത്തെ യാത്ര രേഖപ്പെടുത്തുക. യാത്ര അനുവദിക്കുന്നതിന് മുമ്പ് ഈ വിവരം ഫിഷറീസ് വകുപ്പ് പരിശോധിക്കും.",
    fishingZoneDirection: "മത്സ്യബന്ധന മേഖല ദിശ", north: "വടക്ക്", south: "തെക്ക്", east: "കിഴക്ക്", west: "പടിഞ്ഞാറ്",
    tripTiming: "യാത്രാ സമയം", seaEntryTime: "കടലിൽ പ്രവേശിക്കുന്ന സമയം", expectedReturnTime: "മടങ്ങിവരുമെന്ന് പ്രതീക്ഷിക്കുന്ന സമയം",
    fuelLevelDeparture: "പുറപ്പെടുമ്പോഴുള്ള ഇന്ധന നില", fishingPlan: "മത്സ്യബന്ധന പദ്ധതി", targetSpecies: "ലക്ഷ്യമിടുന്ന ഇനം",
    distanceFromShore: "കരയിൽ നിന്നുള്ള ദൂരം (നോ.മൈൽ)", crewEmergencyContact: "ജീവനക്കാരും അടിയന്തര ബന്ധപ്പെടലും",
    crewMembersAboard: "വള്ളത്തിലുള്ള ജീവനക്കാർ", contactNameShore: "ബന്ധപ്പെടേണ്ട പേര് (കരയിൽ)", emergencyContactPhone: "അടിയന്തര ഫോൺ നമ്പർ",
    safetyEquipmentOnboard: "വള്ളത്തിലെ സുരക്ഷാ ഉപകരണങ്ങൾ", confirmedOnboard: "സ്ഥിരീകരിച്ചു", tripSummary: "യാത്രാ സംഗ്രഹം",
    heading: "ദിശ", crew: "ജീവനക്കാർ", entry: "പ്രവേശനം", returnLabel: "മടക്കം", fuel: "ഇന്ധനം", safety: "സുരക്ഷ", contact: "ബന്ധപ്പെടൽ",
    continueToApproval: "അനുമതി അഭ്യർത്ഥനയിലേക്ക് തുടരുക",
    requestApprovalToSail: "കടലിൽ പോകാൻ അനുമതി അഭ്യർത്ഥിക്കുക", govSeaAdvisory: "സർക്കാർ കടൽ ഉപദേശം", vesselClearanceStatus: "വള്ളത്തിന്റെ അനുമതി നില",
    clear: "വ്യക്തം", flagged: "അടയാളപ്പെടുത്തി", tripBeingRequested: "അഭ്യർത്ഥിക്കുന്ന യാത്ര", submitRequest: "സർക്കാരിന് അനുമതി അഭ്യർത്ഥന അയയ്ക്കുക",
    pendingMsg: "അഭ്യർത്ഥന സമർപ്പിച്ചു — സർക്കാർ പരിശോധനയ്ക്കായി കാത്തിരിക്കുന്നു.", approvedMsg: "അംഗീകരിച്ചു — കടലിൽ പോകാം.", deniedMsg: "അഭ്യർത്ഥന നിരസിച്ചു.",
    resubmitRequest: "വീണ്ടും അയയ്ക്കുക", continueToDashboard: "ഡാഷ്ബോർഡിലേക്ക് തുടരുക",
    overview: "അവലോകനം", catchLogTab: "പിടിത്ത രേഖ", documentsTrip: "രേഖകളും യാത്രയും", alertsWeather: "അലേർട്ടുകളും കാലാവസ്ഥയും",
    myVessel: "എന്റെ വള്ളം", engineFuel: "എഞ്ചിനും ഇന്ധനവും", mySustainabilityScore: "എന്റെ സുസ്ഥിരത സ്കോർ", currentTrip: "ഇപ്പോഴത്തെ യാത്ര",
    logACatch: "പിടിത്തം രേഖപ്പെടുത്തുക", species: "ഇനം", weightKg: "ഭാരം (കിലോ)", addToTripLog: "യാത്രാ രേഖയിൽ ചേർക്കുക", tripQuotaProgress: "യാത്രാ ക്വാട്ട പുരോഗതി",
    myTripCatchLog: "എന്റെ യാത്രാ പിടിത്ത രേഖ", noCatchesYet: "ഈ യാത്രയിൽ ഇതുവരെ പിടിത്തങ്ങളൊന്നും രേഖപ്പെടുത്തിയിട്ടില്ല.",
    vesselRegistration: "വള്ളം രജിസ്ട്രേഷൻ", previousTripOnFile: "രേഖയിലുള്ള മുൻ യാത്ര", noTripDetailsOnFile: "മുൻ യാത്രാ വിവരങ്ങളൊന്നും രേഖയിലില്ല.",
    currentTripDetails: "ഇപ്പോഴത്തെ യാത്രാ വിവരങ്ങൾ", noTripLoggedToday: "ഇന്ന് ഇതുവരെ യാത്ര രേഖപ്പെടുത്തിയിട്ടില്ല.",
    alertsForVessel: "എന്റെ വള്ളത്തിനുള്ള അലേർട്ടുകൾ", seaConditions: "കടൽ സാഹചര്യങ്ങൾ",
    sustainability: "സുസ്ഥിരത", ofQuota: "ക്വാട്ടയുടെ", cleared: "ഇവർ അനുമതി നൽകി:", denied: "പോകാൻ അനുമതി നിഷേധിച്ചു", awaitingApproval: "സർക്കാർ അനുമതിക്കായി കാത്തിരിക്കുന്നു",
    safeToSail: "കടലിൽ പോകാൻ സുരക്ഷിതം", cautionStatus: "ജാഗ്രത", doNotSail: "പോകരുത്", tripSafetyScore: "യാത്രാ സുരക്ഷാ സ്കോർ",
  },
  te: {
    signOut: "సైన్ అవుట్", back: "వెనుకకు", required: "అవసరం", requiredApproval: "అనుమతికి అవసరం",
    sampleLogin: "నమూనా లాగిన్", newVessel: "కొత్త పడవా? ఇక్కడ నమోదు చేయండి",
    fishermanPortal: "మత్స్యకారుల పోర్టల్", fishermanSubtitle: "మీ పడవ ఖాతాతో సైన్ ఇన్ చేయండి",
    vesselIdOrUsername: "పడవ ఐడి / వినియోగదారు పేరు", password: "పాస్‌వర్డ్", signIn: "సైన్ ఇన్",
    registerVessel: "మీ పడవను నమోదు చేయండి", registerSubtitle: "మత్స్యకారుల పోర్టల్ ఉపయోగించడానికి మీ పడవ ఖాతాను సృష్టించండి",
    backToSignIn: "సైన్ ఇన్‌కు తిరిగి వెళ్ళండి", vesselDetails: "పడవ వివరాలు", vesselName: "పడవ పేరు", vesselId: "పడవ ఐడి",
    captainName: "కెప్టెన్ / యజమాని పేరు", fishingLicense: "మత్స్య లైసెన్స్", previousTripDetails: "మునుపటి యాత్ర వివరాలు (ఐచ్ఛికం)",
    tripDate: "యాత్ర తేదీ", tripDuration: "యాత్ర వ్యవధి", speciesCaught: "పట్టిన జాతి", catchWeightKg: "బరువు (కిలో)",
    accountLogin: "ఖాతా లాగిన్", username: "వినియోగదారు పేరు", confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి", registerContinue: "నమోదు చేసి కొనసాగించండి",
    startOfTrip: "యాత్ర ప్రారంభం", stepTripDetails: "1. యాత్ర వివరాలు", stepGovApproval: "2. ప్రభుత్వ అనుమతి",
    tripIntro: "సముద్రంలోకి వెళ్లే ముందు నేటి యాత్రను నమోదు చేయండి. మీకు అనుమతి ఇచ్చే ముందు ఈ సమాచారాన్ని మత్స్య శాఖ సమీక్షిస్తుంది.",
    fishingZoneDirection: "మత్స్య మండల దిశ", north: "ఉత్తరం", south: "దక్షిణం", east: "తూర్పు", west: "పడమర",
    tripTiming: "యాత్ర సమయం", seaEntryTime: "సముద్ర ప్రవేశ సమయం", expectedReturnTime: "తిరిగి వచ్చే అంచనా సమయం",
    fuelLevelDeparture: "బయలుదేరేటప్పుడు ఇంధన స్థాయి", fishingPlan: "మత్స్య ప్రణాళిక", targetSpecies: "లక్ష్య జాతి",
    distanceFromShore: "తీరం నుండి దూరం (నా.మై)", crewEmergencyContact: "సిబ్బంది & అత్యవసర సంప్రదింపు",
    crewMembersAboard: "పడవలో ఉన్న సిబ్బంది", contactNameShore: "సంప్రదింపు పేరు (ఒడ్డున)", emergencyContactPhone: "అత్యవసర ఫోన్ నంబర్",
    safetyEquipmentOnboard: "పడవలోని భద్రతా పరికరాలు", confirmedOnboard: "నిర్ధారించబడింది", tripSummary: "యాత్ర సారాంశం",
    heading: "దిశ", crew: "సిబ్బంది", entry: "ప్రవేశం", returnLabel: "తిరిగి రాక", fuel: "ఇంధనం", safety: "భద్రత", contact: "సంప్రదింపు",
    continueToApproval: "అనుమతి అభ్యర్థనకు కొనసాగండి",
    requestApprovalToSail: "సముద్రంలోకి వెళ్లడానికి అనుమతి కోరండి", govSeaAdvisory: "ప్రభుత్వ సముద్ర సలహా", vesselClearanceStatus: "పడవ అనుమతి స్థితి",
    clear: "స్పష్టం", flagged: "గుర్తించబడింది", tripBeingRequested: "అభ్యర్థించిన యాత్ర", submitRequest: "ప్రభుత్వానికి అనుమతి అభ్యర్థన పంపండి",
    pendingMsg: "అభ్యర్థన సమర్పించబడింది — ప్రభుత్వ సమీక్ష కోసం వేచి ఉంది.", approvedMsg: "ఆమోదించబడింది — సముద్రంలోకి వెళ్లవచ్చు.", deniedMsg: "అభ్యర్థన తిరస్కరించబడింది.",
    resubmitRequest: "మళ్లీ పంపండి", continueToDashboard: "డాష్‌బోర్డ్‌కు కొనసాగండి",
    overview: "అవలోకనం", catchLogTab: "పట్టిన లాగ్", documentsTrip: "పత్రాలు & యాత్ర", alertsWeather: "హెచ్చరికలు & వాతావరణం",
    myVessel: "నా పడవ", engineFuel: "ఇంజిన్ & ఇంధనం", mySustainabilityScore: "నా సుస్థిరత స్కోర్", currentTrip: "ప్రస్తుత యాత్ర",
    logACatch: "పట్టినది నమోదు చేయండి", species: "జాతి", weightKg: "బరువు (కిలో)", addToTripLog: "యాత్ర లాగ్‌కు జోడించండి", tripQuotaProgress: "యాత్ర కోటా పురోగతి",
    myTripCatchLog: "నా యాత్ర పట్టిన లాగ్", noCatchesYet: "ఈ యాత్రలో ఇంకా పట్టినవి నమోదు కాలేదు.",
    vesselRegistration: "పడవ నమోదు", previousTripOnFile: "ఫైల్‌లో మునుపటి యాత్ర", noTripDetailsOnFile: "మునుపటి యాత్ర వివరాలు ఫైల్‌లో లేవు.",
    currentTripDetails: "ప్రస్తుత యాత్ర వివరాలు", noTripLoggedToday: "ఈ రోజు ఇంకా యాత్ర నమోదు కాలేదు.",
    alertsForVessel: "నా పడవ కోసం హెచ్చరికలు", seaConditions: "సముద్ర పరిస్థితులు",
    sustainability: "సుస్థిరత", ofQuota: "కోటాలో", cleared: "వీరిచే అనుమతి:", denied: "వెళ్లడానికి నిరాకరించారు", awaitingApproval: "ప్రభుత్వ అనుమతి కోసం వేచి ఉంది",
    safeToSail: "వెళ్లడం సురక్షితం", cautionStatus: "జాగ్రత్త", doNotSail: "వెళ్లవద్దు", tripSafetyScore: "యాత్ర భద్రతా స్కోర్",
  },
};

/* ---------------------------------------------------------------
   PRE-TRIP SAFETY CHECK — computes a 0-100 trip safety score and a
   SAFE / CAUTION / DO NOT SAIL verdict from vessel + advisory + trip signals.
   Used by both the Trip Entry summary and the fisherman dashboard home.
---------------------------------------------------------------- */
function computeSafetyCheck({ vessel, request, safetyCount = SAFETY_EQUIPMENT.length, contactOk = true }) {
  const reasons = [];
  let score = 100;

  // license / registration
  const licenseOk = true; // demo vessels are pre-licensed
  if (!licenseOk) { score -= 25; reasons.push({ ok: false, label: "Fishing license not on file" }); }
  else reasons.push({ ok: true, label: "Fishing license valid" });

  // weather
  if (SEA_ADVISORY.level === "restricted") { score -= 40; reasons.push({ ok: false, label: "Severe weather restriction in effect" }); }
  else if (SEA_ADVISORY.level === "caution") { score -= 12; reasons.push({ ok: false, label: "Weather caution advisory active" }); }
  else reasons.push({ ok: true, label: "Weather conditions acceptable" });

  // vessel health / fuel
  if (vessel.fuel < 15) { score -= 30; reasons.push({ ok: false, label: `Fuel critically low (${vessel.fuel}%)` }); }
  else if (vessel.fuel < 30) { score -= 12; reasons.push({ ok: false, label: `Fuel running low (${vessel.fuel}%)` }); }
  else reasons.push({ ok: true, label: "Fuel sufficient for trip" });

  if (vessel.engineTemp > 95) { score -= 15; reasons.push({ ok: false, label: "Engine temperature above safe range" }); }
  else reasons.push({ ok: true, label: "Engine condition normal" });

  // compliance / zone
  if (vessel.compliance === "violation") { score -= 30; reasons.push({ ok: false, label: "Open compliance violation on file" }); }
  else reasons.push({ ok: true, label: "No active compliance violations" });

  if (vessel.geofence === "breach") { score -= 20; reasons.push({ ok: false, label: "Vessel in a restricted zone" }); }

  // safety equipment / emergency contact (only relevant once trip form is in progress)
  if (safetyCount != null) {
    if (safetyCount < SAFETY_EQUIPMENT.length) { score -= (SAFETY_EQUIPMENT.length - safetyCount) * 4; reasons.push({ ok: false, label: `${safetyCount}/${SAFETY_EQUIPMENT.length} safety equipment items confirmed` }); }
    else reasons.push({ ok: true, label: "All safety equipment confirmed" });
  }
  if (contactOk === false) { score -= 10; reasons.push({ ok: false, label: "Emergency contact missing" }); }

  // prior government decision overrides toward the safe side once approved, or flags once denied
  if (request?.status === "denied") { score = Math.min(score, 35); reasons.unshift({ ok: false, label: `Government denied last request${request.reason ? `: ${request.reason}` : ""}` }); }
  if (request?.status === "approved") { reasons.unshift({ ok: true, label: "Government has cleared this vessel to sail" }); }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const verdict = score >= 75 ? "safe" : score >= 45 ? "caution" : "unsafe";
  return { score, verdict, reasons };
}

/* ---------------------------------------------------------------
   VOICE-ASSISTED ACCESSIBILITY — text-to-speech via the browser's
   Web Speech API, using the fisherman's selected language when a
   matching voice is available. Silently no-ops if unsupported.
---------------------------------------------------------------- */
const SPEECH_LOCALE = { en: "en-IN", ta: "ta-IN", hi: "hi-IN", ml: "ml-IN", te: "te-IN" };

function speak(text, lang) {
  try {
    if (typeof window === "undefined" || !window.speechSynthesis) return false;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = SPEECH_LOCALE[lang] || "en-IN";
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
    return true;
  } catch {
    return false;
  }
}

function SpeakButton({ text, lang }) {
  return (
    <button
      onClick={() => speak(text, lang)}
      title="Listen"
      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 99, border: `1px solid currentColor`, background: "transparent", color: "inherit", cursor: "pointer", flexShrink: 0 }}
    >
      <Volume2 size={13} />
    </button>
  );
}

const VERDICT_STYLE = {
  safe: { color: C.teal, bg: "rgba(51,214,192,0.10)", border: C.teal, icon: CheckCircle2 },
  caution: { color: C.amber, bg: "rgba(232,163,61,0.10)", border: C.amber, icon: AlertTriangle },
  unsafe: { color: C.coral, bg: "rgba(232,96,76,0.10)", border: C.coral, icon: ShieldAlert },
};

// The prominent "Is it safe to go fishing?" status — the fisherman home screen's
// primary signal, per the pre-trip safety check.
function SafetyVerdictBanner({ check, lang, title }) {
  const [expanded, setExpanded] = useState(false);
  const t = (k) => tr(lang, k);
  const verdictLabel = check.verdict === "safe" ? t("safeToSail") : check.verdict === "caution" ? t("cautionStatus") : t("doNotSail");
  const style = VERDICT_STYLE[check.verdict];
  const Icon = style.icon;
  const speechText = `${verdictLabel}. ${t("tripSafetyScore")}: ${check.score} out of 100. ` + check.reasons.filter((r) => !r.ok).map((r) => r.label).join(". ");

  return (
    <div style={{ background: style.bg, border: `1px solid ${style.border}66`, borderRadius: 8, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 99, background: `${style.color}22`, border: `2px solid ${style.color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon size={24} color={style.color} />
          </div>
          <div>
            {title && <div style={{ fontSize: 10.5, color: C.fogDim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{title}</div>}
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: style.color, letterSpacing: "0.02em" }}>{verdictLabel.toUpperCase()}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700, color: style.color }}>{check.score}<span style={{ fontSize: 12, color: C.fogDim }}>/100</span></div>
            <div style={{ fontSize: 9.5, color: C.fogDim, textTransform: "uppercase", letterSpacing: "0.04em" }}>{t("tripSafetyScore")}</div>
          </div>
          <SpeakButton text={speechText} lang={lang} />
        </div>
      </div>

      <button onClick={() => setExpanded((e) => !e)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: style.color, fontSize: 11.5, cursor: "pointer", padding: 0, alignSelf: "flex-start" }}>
        {expanded ? "Hide details" : "Why this status"} <ChevronRight size={12} style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
      </button>

      {expanded && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {check.reasons.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 12 }}>
              {r.ok ? <CheckCircle2 size={13} color={C.teal} style={{ marginTop: 1, flexShrink: 0 }} /> : <AlertTriangle size={13} color={C.coral} style={{ marginTop: 1, flexShrink: 0 }} />}
              <span style={{ color: r.ok ? C.fogDim : C.fog }}>{r.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTime12(hhmm) {
  if (!hhmm) return "—";
  const [hh, mm] = hhmm.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return hhmm;
  const period = hh >= 12 ? "PM" : "AM";
  let h12 = hh % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${String(mm).padStart(2, "0")} ${period}`;
}

function tr(lang, key) {
  return STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
}

function LanguageSwitcher({ lang, setLang, dark }) {
  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      style={{
        background: dark ? C.panelAlt : C.panel, border: `1px solid ${C.border}`, borderRadius: 4,
        padding: "6px 10px", color: C.fog, fontFamily: FONT_BODY, fontSize: 12, outline: "none", cursor: "pointer",
      }}
    >
      {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
    </select>
  );
}

function jitter(v, spread, min, max) {
  const next = v + (Math.random() - 0.5) * spread;
  return Math.min(max, Math.max(min, next));
}

/* ---------------------------------------------------------------
   SHARED UI PRIMITIVES
---------------------------------------------------------------- */
function Panel({ title, icon: Icon, right, children, style }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 4, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12, ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {Icon && <Icon size={15} color={C.amber} strokeWidth={2} />}
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 12.5, letterSpacing: "0.12em", textTransform: "uppercase", color: C.fogDim, fontWeight: 500 }}>
            {title}
          </span>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function StatusPill({ tone = "ok", children }) {
  const map = {
    ok: { bg: "rgba(51,214,192,0.12)", fg: C.teal },
    warn: { bg: "rgba(232,163,61,0.12)", fg: C.amber },
    bad: { bg: "rgba(232,96,76,0.14)", fg: C.coral },
  };
  const s = map[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: FONT_MONO, fontSize: 10.5, letterSpacing: "0.04em", color: s.fg, background: s.bg, border: `1px solid ${s.fg}33`, borderRadius: 3, padding: "3px 8px", textTransform: "uppercase" }}>
      <span style={{ width: 5, height: 5, borderRadius: 99, background: s.fg }} />
      {children}
    </span>
  );
}

function MiniStat({ icon: Icon, label, value, unit, tone }) {
  const color = tone === "bad" ? C.coral : tone === "warn" ? C.amber : C.fog;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Icon size={14} color={C.fogDim} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 13, color, fontWeight: 500 }}>
          {value}<span style={{ color: C.fogDim, fontSize: 10.5, marginLeft: 2 }}>{unit}</span>
        </span>
        <span style={{ fontFamily: FONT_BODY, fontSize: 9.5, color: C.fogDim, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
      </div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px dashed ${C.border}`, paddingBottom: 8 }}>
      <span style={{ fontSize: 11.5, color: C.fogDim }}>{label}</span>
      <span style={{ fontFamily: mono ? FONT_MONO : FONT_BODY, fontSize: 12.5, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function Gauge90({ value, max = 100, label, unit, color, size = 108 }) {
  const data = [{ name: "v", value, fill: color }];
  return (
    <div style={{ width: size, textAlign: "center" }}>
      <ResponsiveContainer width="100%" height={size}>
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270} barSize={8}>
          <PolarAngleAxis type="number" domain={[0, max]} angleAxisId={0} tick={false} />
          <RadialBar background={{ fill: C.panelAlt }} dataKey="value" cornerRadius={4} angleAxisId={0} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div style={{ marginTop: -size / 2 - 6, marginBottom: size / 2 - 18 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 19, color: C.fog, fontWeight: 600 }}>
          {value}<span style={{ fontSize: 11, color: C.fogDim }}>{unit}</span>
        </div>
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 9.5, color: C.fogDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
    </div>
  );
}

function RadarMap({ fleet, selectedId, onSelect }) {
  const size = 300;
  const cx = size / 2, cy = size / 2, R = size / 2 - 12;
  const toXY = (v) => {
    const dx = (v.lon - HOME_PORT.lon) * 900;
    const dy = (v.lat - HOME_PORT.lat) * -900;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), R - 14);
    const ang = Math.atan2(dy, dx);
    return { x: cx + Math.cos(ang) * dist, y: cy + Math.sin(ang) * dist };
  };
  const rings = [0.33, 0.66, 1];
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size}>
        <defs>
          <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0D2436" /><stop offset="100%" stopColor="#081420" />
          </radialGradient>
          <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.teal} stopOpacity="0" /><stop offset="100%" stopColor={C.teal} stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={R} fill="url(#radarBg)" stroke={C.border} strokeWidth="1" />
        {rings.map((r, i) => <circle key={i} cx={cx} cy={cy} r={R * r} fill="none" stroke={C.border} strokeWidth="1" strokeDasharray="2 4" />)}
        <line x1={cx} y1={cy - R} x2={cx} y2={cy + R} stroke={C.border} strokeWidth="1" />
        <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke={C.border} strokeWidth="1" />
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "spin 4s linear infinite" }}>
          <path d={`M ${cx} ${cy} L ${cx} ${cy - R} A ${R} ${R} 0 0 1 ${cx + R * Math.sin(0.6)} ${cy - R * Math.cos(0.6)} Z`} fill="url(#sweepGrad)" />
        </g>
        <g><circle cx={cx} cy={cy} r={4} fill={C.amber} /><circle cx={cx} cy={cy} r={8} fill="none" stroke={C.amber} strokeWidth="1" opacity="0.5" /></g>
        {fleet.map((v) => {
          const { x, y } = toXY(v);
          const active = v.id === selectedId;
          const color = v.geofence === "breach" ? C.coral : v.compliance === "review" ? C.amber : C.teal;
          return (
            <g key={v.id} onClick={() => onSelect && onSelect(v.id)} style={{ cursor: onSelect ? "pointer" : "default" }}>
              {active && <circle cx={x} cy={y} r={10} fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />}
              <circle cx={x} cy={y} r={active ? 5 : 3.5} fill={color} />
              {active && <text x={x + 9} y={y + 3} fontFamily={FONT_MONO} fontSize="9" fill={C.fog}>{v.id}</text>}
            </g>
          );
        })}
      </svg>
      <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
    </div>
  );
}

/* ---------------------------------------------------------------
   HERO / LANDING PAGE
---------------------------------------------------------------- */
/* ---------------------------------------------------------------
   HERO — cinematic maritime operations landing page
---------------------------------------------------------------- */
const NAV_LINKS = [
  { label: "Platform", href: "#solutions" },
  { label: "Fisher Safety", href: "#safety" },
  { label: "Sustainability", href: "#solutions" },
  { label: "AI Intelligence", href: "#workflow" },
  { label: "Government Monitoring", href: "#outcomes" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const SOLUTIONS = [
  { icon: RadarIcon, title: "Live Vessel Intelligence", desc: "Continuous GPS/AIS tracking of every registered vessel, so no boat disappears from view once it leaves the harbour." },
  { icon: Fish, title: "AI Catch & Sustainability Analytics", desc: "Digital catch manifests scored against quota and bycatch patterns, turning raw logs into an evidence-based sustainability picture." },
  { icon: MapPin, title: "Fishing-Zone Compliance", desc: "Automatic geofence detection flags restricted-zone entry and seasonal-ban violations the moment they happen, not after the fact." },
  { icon: CloudRain, title: "Weather & Fisher Safety", desc: "Forecast intelligence and risk scoring built into every sailing decision, from pre-departure checks to mid-trip alerts." },
  { icon: Fuel, title: "Fuel & Engine Intelligence", desc: "Telemetry-based fuel prediction that flags return-to-shore risk before a vessel is stranded, not after." },
  { icon: Landmark, title: "Digital Marine Governance", desc: "One command centre for approvals, compliance, and audit trails — replacing paper logbooks and radio check-ins." },
];

const PROBLEM_MAP = [
  { challenge: "Authorities lack continuous visibility of fishing vessels.", tech: "GPS/AIS monitoring + geofencing + anomaly detection.", outcome: "Faster detection of restricted-zone entry and better regulatory enforcement." },
  { challenge: "Catch records are paper-based and easy to misreport.", tech: "Digital catch manifest + anomaly detection.", outcome: "Better quota management across the fleet." },
  { challenge: "Dangerous weather catches fishermen mid-trip.", tech: "Forecast intelligence + risk scoring.", outcome: "Safer trip decisions, made before departure." },
  { challenge: "Fuel wastage inflates operating cost with no visibility.", tech: "Telemetry + fuel prediction.", outcome: "Reduced operating cost per trip." },
  { challenge: "Illegal fishing goes undetected until it's reported.", tech: "Geofence + behaviour anomaly detection.", outcome: "Faster regulatory intervention." },
  { challenge: "Sustainability data is anecdotal, not measured.", tech: "Catch analytics + sustainability scoring.", outcome: "Evidence-based fisheries management." },
];

const WORKFLOW_STEPS = [
  { label: "Fisherman / Vessel", icon: Anchor },
  { label: "GPS + AIS + IoT Sensors", icon: Satellite },
  { label: "TideWatch Data Platform", icon: Network },
  { label: "AI / ML Intelligence Engine", icon: Activity },
  { label: "Safety, Sustainability & Compliance Decisions", icon: ShieldCheck },
  { label: "Government Command Centre", icon: Landmark },
  { label: "Alerts, Approvals & Regulations", icon: Bell },
];


const PATROL_VESSELS = [
  { id: "TN-FISH-P03", name: "Blue Sentinel", lat: 8.31, lon: 77.63, speedKn: 18 },
  { id: "TN-FISH-P07", name: "Coastal Guardian", lat: 8.12, lon: 77.84, speedKn: 21 },
  { id: "TN-FISH-P11", name: "Sea Watch", lat: 7.91, lon: 77.58, speedKn: 16 },
];

function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function useNetworkStatus() {
  const [online, setOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}

function loadCssOnce(id, href) {
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function loadScriptOnce(id, src) {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id);
    if (existing) {
      if (window.L) return resolve();
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function LiveOperationsMap({ fleet = [], selectedId, onSelect, routeHistory = [], sosId, compact = false }) {
  const mapEl = React.useRef(null);
  const mapRef = React.useRef(null);
  const layerRef = React.useRef(null);
  const [ready, setReady] = useState(false);
  const [mapError, setMapError] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadCssOnce("leaflet-css", "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
    loadScriptOnce("leaflet-js", "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js")
      .then(() => {
        if (cancelled || !mapEl.current || mapRef.current) return;
        const L = window.L;
        const map = L.map(mapEl.current, { zoomControl: true, attributionControl: true }).setView([HOME_PORT.lat, HOME_PORT.lon], 9);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        L.circleMarker([HOME_PORT.lat, HOME_PORT.lon], {
          radius: 7, color: C.amber, fillColor: C.amber, fillOpacity: 0.9, weight: 2,
        }).addTo(map).bindTooltip(`Home Port · ${HOME_PORT.name}`);

        L.polygon([
          [8.31, 77.40], [8.52, 77.46], [8.46, 77.68], [8.28, 77.63]
        ], { color: C.coral, weight: 2, dashArray: "6 6", fillColor: C.coral, fillOpacity: 0.08 })
          .addTo(map).bindTooltip("Restricted Zone R-3");

        L.polygon([
          [7.92, 77.56], [8.15, 77.56], [8.17, 77.82], [7.96, 77.84]
        ], { color: C.teal, weight: 1.5, dashArray: "4 6", fillColor: C.teal, fillOpacity: 0.05 })
          .addTo(map).bindTooltip("Approved Fishing Zone");

        L.circle([8.37, 77.88], {
          radius: 11000, color: C.amber, weight: 1, dashArray: "5 6", fillColor: C.amber, fillOpacity: 0.05
        }).addTo(map).bindTooltip("Weather Caution Area");

        mapRef.current = map;
        layerRef.current = L.layerGroup().addTo(map);
        setReady(true);
        setTimeout(() => map.invalidateSize(), 100);
      })
      .catch(() => setMapError("Map tiles could not be loaded. Internet access is required for OpenStreetMap."));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current || !layerRef.current || !window.L) return;
    const L = window.L;
    layerRef.current.clearLayers();

    fleet.forEach((v) => {
      const selected = v.id === selectedId;
      const risk = v.geofence === "breach" || v.fuel < 20;
      const sos = v.id === sosId;
      const color = sos ? C.coral : risk ? C.amber : C.teal;
      const marker = L.circleMarker([v.lat, v.lon], {
        radius: sos ? 11 : selected ? 9 : 7,
        color,
        fillColor: color,
        fillOpacity: sos ? 0.95 : 0.75,
        weight: sos ? 4 : selected ? 3 : 2,
      }).addTo(layerRef.current);
      marker.bindTooltip(`${v.id} · ${v.name}<br/>${v.speed} kn · Fuel ${v.fuel}%<br/>Last signal: now`);
      marker.on("click", () => onSelect && onSelect(v.id));
      if (sos) {
        L.circle([v.lat, v.lon], { radius: 5000, color: C.coral, weight: 2, dashArray: "4 7", fillOpacity: 0 })
          .addTo(layerRef.current);
      }
    });

    PATROL_VESSELS.forEach((p) => {
      L.circleMarker([p.lat, p.lon], {
        radius: 6, color: "#7CA9FF", fillColor: "#7CA9FF", fillOpacity: 0.85, weight: 2,
      }).addTo(layerRef.current).bindTooltip(`${p.id} · Patrol · ${p.speedKn} kn`);
    });

    if (routeHistory.length > 1) {
      L.polyline(routeHistory.map((p) => [p.lat, p.lon]), { color: C.teal, weight: 3, opacity: 0.85 })
        .addTo(layerRef.current);
    }
  }, [fleet, selectedId, routeHistory, sosId, ready, onSelect]);

  return (
    <div>
      <div ref={mapEl} style={{ height: compact ? 290 : 390, width: "100%", borderRadius: 5, overflow: "hidden", border: `1px solid ${C.border}`, background: C.panelAlt }} />
      {mapError && <div style={{ color: C.amber, fontSize: 10.5, marginTop: 7 }}>{mapError}</div>}
    </div>
  );
}

function DigitalSeaPass({ request, vessel, tripInfo }) {
  const [qr, setQr] = useState("");
  if (!request || request.status !== "approved") return null;

  const passId = `TW-${new Date().getFullYear()}-${String(request.id).slice(-5).padStart(5, "0")}`;
  const payload = JSON.stringify({
    passId,
    vesselId: vessel.id,
    vessel: vessel.name,
    captain: vessel.captain,
    zone: tripInfo?.direction,
    departure: tripInfo?.entryTime,
    returnTime: tripInfo?.returnTime,
    approvedBy: request.officerId || "Fisheries Department",
    status: "VALID",
  });

  useEffect(() => {
    let mounted = true;
    import(/* @vite-ignore */ "https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm")
      .then((mod) => mod.toDataURL(payload, { width: 180, margin: 1 }))
      .then((url) => mounted && setQr(url))
      .catch(() => {});
    return () => { mounted = false; };
  }, [payload]);

  return (
    <Panel title="TideWatch Digital Sea Pass" icon={FileCheck2} right={<StatusPill tone="ok">VALID</StatusPill>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 18, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Row label="Pass ID" value={passId} mono />
          <Row label="Vessel" value={`${vessel.id} · ${vessel.name}`} />
          <Row label="Captain" value={vessel.captain} />
          <Row label="Approved Zone" value={`${tripInfo?.direction || "—"} Zone`} />
          <Row label="Departure" value={formatTime12(tripInfo?.entryTime)} mono />
          <Row label="Expected Return" value={formatTime12(tripInfo?.returnTime)} mono />
          <Row label="Approved By" value={request.officerId || "Fisheries Department"} mono />
        </div>
        <div style={{ width: 190, minHeight: 190, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", borderRadius: 4, padding: 5 }}>
          {qr ? <img src={qr} alt="Sea Pass QR code" style={{ width: 180, height: 180 }} /> : <div style={{ color: "#333", fontSize: 11, textAlign: "center" }}>Generating verification QR…</div>}
        </div>
      </div>
      <div style={{ fontSize: 9.5, color: C.fogDim }}>Scan the QR to verify the encoded pass details. QR generation uses a browser-loaded QR library.</div>
    </Panel>
  );
}

const INDUSTRY_DEMO_STEPS = [
  "Fisherman checks SAFE / CAUTION / DO NOT SAIL status",
  "Trip details and emergency information are submitted",
  "AI evaluates fuel, engine and sustainability signals",
  "Government reviews and approves the sailing request",
  "Digital Sea Pass is issued",
  "Vessel begins the monitored trip",
  "Catch is logged and quota pressure updates",
  "Restricted-zone movement triggers a command alert",
  "Fuel risk produces a return-to-port recommendation",
  "Trip closes with an audit-ready operational record",
];

function LiveDemoOverlay({ step, onClose }) {
  if (step < 0) return null;
  const pct = Math.round(((step + 1) / INDUSTRY_DEMO_STEPS.length) * 100);
  return (
    <div style={{ position: "fixed", right: 22, bottom: 22, zIndex: 1000, width: 390, maxWidth: "calc(100vw - 44px)", background: "rgba(11,28,43,0.97)", border: `1px solid ${C.teal}66`, borderRadius: 8, padding: 16, boxShadow: "0 20px 60px rgba(0,0,0,.45)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: C.teal, letterSpacing: ".12em" }}>INDUSTRY DEMO · {step + 1}/{INDUSTRY_DEMO_STEPS.length}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, marginTop: 6 }}>{INDUSTRY_DEMO_STEPS[step]}</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.fogDim, cursor: "pointer" }}><XCircle size={18}/></button>
      </div>
      <div style={{ height: 6, background: C.bg, borderRadius: 99, overflow: "hidden", marginTop: 14 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: C.teal, transition: "width .4s ease" }} />
      </div>
    </div>
  );
}

function GovernmentAnalytics({ fleet }) {
  const quotaRisk = fleet.filter(v => v.catchKg / v.quotaKg >= 0.8).length;
  const fuelRisk = fleet.filter(v => v.fuel < 30).length;
  const weatherRisk = fleet.filter(v => v.engineTemp > 90 || v.fuel < 20).length;
  const repeatWarnings = fleet.filter(v => v.compliance !== "compliant").length;
  const zonePressure = [
    { zone: "East", value: 88 },
    { zone: "North", value: 72 },
    { zone: "South", value: 54 },
    { zone: "West", value: 39 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        <Panel title="Fuel Risk" icon={Fuel}><div style={{ fontFamily: FONT_MONO, fontSize: 26, color: fuelRisk ? C.amber : C.teal }}>{fuelRisk}</div><div style={{ fontSize: 10.5, color: C.fogDim }}>vessels below 30% fuel</div></Panel>
        <Panel title="Quota Pressure" icon={Fish}><div style={{ fontFamily: FONT_MONO, fontSize: 26, color: quotaRisk ? C.amber : C.teal }}>{quotaRisk}</div><div style={{ fontSize: 10.5, color: C.fogDim }}>vessels at ≥80% quota</div></Panel>
        <Panel title="Repeated Warnings" icon={ShieldAlert}><div style={{ fontFamily: FONT_MONO, fontSize: 26, color: repeatWarnings ? C.coral : C.teal }}>{repeatWarnings}</div><div style={{ fontSize: 10.5, color: C.fogDim }}>vessels needing compliance review</div></Panel>
        <Panel title="Weather / Safety Risk" icon={CloudRain}><div style={{ fontFamily: FONT_MONO, fontSize: 26, color: weatherRisk ? C.amber : C.teal }}>{weatherRisk}</div><div style={{ fontSize: 10.5, color: C.fogDim }}>vessels with elevated operating risk</div></Panel>
      </div>
      <Panel title="Which zones have the highest fishing pressure?" icon={MapPin}>
        {zonePressure.map(z => <div key={z.zone} style={{ display: "grid", gridTemplateColumns: "70px 1fr 45px", gap: 10, alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 11.5 }}>{z.zone}</span>
          <div style={{ height: 7, background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${z.value}%`, height: "100%", background: z.value > 80 ? C.coral : z.value > 60 ? C.amber : C.teal }} /></div>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: C.fogDim }}>{z.value}%</span>
        </div>)}
      </Panel>
    </div>
  );
}

function DocumentExpiryIntelligence({ fleet }) {
  const rows = fleet.map((v, i) => ({ ...v, days: [12, 6, 28, 3, 19][i % 5] }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        <Panel title="Expires ≤7 days" icon={AlertTriangle}><div style={{ fontFamily: FONT_MONO, fontSize: 28, color: C.coral }}>{rows.filter(r => r.days <= 7).length}</div></Panel>
        <Panel title="Expires ≤15 days" icon={Clock}><div style={{ fontFamily: FONT_MONO, fontSize: 28, color: C.amber }}>{rows.filter(r => r.days <= 15).length}</div></Panel>
        <Panel title="Expires ≤30 days" icon={FileCheck2}><div style={{ fontFamily: FONT_MONO, fontSize: 28, color: C.teal }}>{rows.filter(r => r.days <= 30).length}</div></Panel>
      </div>
      <Panel title="Fishing License Expiry Intelligence" icon={FileCheck2}>
        {rows.sort((a,b)=>a.days-b.days).map(r => <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr .8fr", gap: 12, padding: "9px 10px", borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
          <div><div style={{ fontSize: 12.5 }}>{r.name}</div><div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: C.fogDim }}>{r.id}</div></div>
          <span style={{ fontSize: 11.5 }}>Fishing License</span>
          <StatusPill tone={r.days <= 7 ? "bad" : r.days <= 15 ? "warn" : "ok"}>Expires in {r.days} days</StatusPill>
        </div>)}
      </Panel>
    </div>
  );
}

function TripReplaySection({ fleet }) {
  const [selectedId, setSelectedId] = useState(fleet[0]?.id);
  const v = fleet.find(x => x.id === selectedId) || fleet[0];
  const routeHistory = v ? [
    { lat: HOME_PORT.lat, lon: HOME_PORT.lon },
    { lat: (HOME_PORT.lat + v.lat) / 2 - 0.04, lon: (HOME_PORT.lon + v.lon) / 2 + 0.03 },
    { lat: (HOME_PORT.lat + v.lat) / 2 + 0.02, lon: (HOME_PORT.lon + v.lon) / 2 - 0.02 },
    { lat: v.lat, lon: v.lon },
  ] : [];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel title="Trip Replay" icon={Play} right={<StatusPill tone="ok">Historical Route</StatusPill>}>
        <div style={{ display: "flex", gap: 7, marginBottom: 12, flexWrap: "wrap" }}>
          {fleet.map(x => <button key={x.id} onClick={()=>setSelectedId(x.id)} style={{ padding: "6px 11px", borderRadius: 3, border: `1px solid ${selectedId === x.id ? C.teal : C.border}`, background: selectedId === x.id ? `${C.teal}12` : C.panelAlt, color: selectedId === x.id ? C.teal : C.fogDim, fontFamily: FONT_MONO, fontSize: 10.5, cursor: "pointer" }}>{x.id}</button>)}
        </div>
        <LiveOperationsMap fleet={v ? [v] : []} selectedId={selectedId} routeHistory={routeHistory} />
        <div style={{ marginTop: 10, fontSize: 10.5, color: C.fogDim }}>Replay route · GPS/AIS positions shown for compliance and post-trip review.</div>
      </Panel>
    </div>
  );
}

function CooperativeNetworkSection({ fleet }) {
  const totalCatch = Math.round(fleet.reduce((a,v)=>a+v.catchKg,0));
  const avgFuel = Math.round(fleet.reduce((a,v)=>a+v.fuel,0)/fleet.length);
  const compliance = Math.round((fleet.filter(v=>v.compliance==="compliant").length/fleet.length)*100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        <Panel title="Members" icon={Users}><div style={{ fontFamily: FONT_MONO, fontSize: 26 }}>{fleet.length * 4}</div></Panel>
        <Panel title="Vessels" icon={Ship}><div style={{ fontFamily: FONT_MONO, fontSize: 26 }}>{fleet.length}</div></Panel>
        <Panel title="Total Catch" icon={Fish}><div style={{ fontFamily: FONT_MONO, fontSize: 26 }}>{totalCatch}<span style={{fontSize:11,color:C.fogDim}}> kg</span></div></Panel>
        <Panel title="Compliance" icon={ShieldCheck}><div style={{ fontFamily: FONT_MONO, fontSize: 26, color: compliance >= 80 ? C.teal : C.amber }}>{compliance}%</div></Panel>
      </div>
      <Panel title="Fishing Cooperative Operations" icon={Users}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          <MiniStat icon={Fuel} label="Average Fuel Reserve" value={avgFuel} unit="%" />
          <MiniStat icon={TrendingUp} label="Sustainability" value={Math.round(fleet.reduce((a,v)=>a+v.sustainability,0)/fleet.length)} unit="/100" />
          <MiniStat icon={AlertTriangle} label="Safety Alerts" value={fleet.filter(v=>v.fuel<20||v.geofence==="breach").length} unit="" />
        </div>
      </Panel>
    </div>
  );
}

function HeroPage({ onSelectPortal, fleet, lang, setLang }) {
  const t = lang && setLang ? (k) => tr(lang, k) : (k) => STRINGS.en[k] || k;
  const [demoStep, setDemoStep] = useState(-1);
  useEffect(() => {
    if (demoStep < 0) return;
    if (demoStep >= INDUSTRY_DEMO_STEPS.length - 1) return;
    const timer = setTimeout(() => setDemoStep((s) => s + 1), 1800);
    return () => clearTimeout(timer);
  }, [demoStep]);
  const activeVessels = fleet?.length ?? initialFleet.length;
  const fishermenProtected = activeVessels * 4;
  const complianceRate = Math.round(
    ((fleet ?? initialFleet).filter((v) => v.compliance === "compliant").length / (fleet ?? initialFleet).length) * 100
  );
  const activeAlerts = (fleet ?? initialFleet).filter((v) => v.geofence === "breach" || v.fuel < 20).length;

  const STATS = [
    { label: "Active Vessels", value: activeVessels, icon: Anchor },
    { label: "Fishermen Protected", value: fishermenProtected, icon: Users },
    { label: "Fishing Zones Monitored", value: 12, icon: MapPin },
    { label: "Compliance Rate", value: `${complianceRate}%`, icon: ShieldCheck },
    { label: "Active Safety Alerts", value: activeAlerts, icon: AlertTriangle },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.fog, fontFamily: FONT_BODY }}>
      <FontLoader />

      {/* NAVBAR */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: "rgba(8,20,32,0.92)", backdropFilter: "blur(6px)", zIndex: 10, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 4, background: "linear-gradient(135deg,#123349,#0B2033)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Compass size={17} color={C.amber} />
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, letterSpacing: "0.06em" }}>TIDEWATCH</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} style={{ color: C.fogDim, fontSize: 12.5, textDecoration: "none" }}>{l.label}</a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {lang && setLang && <LanguageSwitcher lang={lang} setLang={setLang} />}
          <button onClick={() => onSelectPortal("fisherman")} style={{ padding: "8px 14px", borderRadius: 4, border: `1px solid ${C.teal}`, background: "transparent", color: C.teal, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
            Fisherman Login
          </button>
          <button onClick={() => onSelectPortal("government")} style={{ padding: "8px 14px", borderRadius: 4, border: `1px solid ${C.amber}`, background: "transparent", color: C.amber, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
            Government Login
          </button>
        </div>
      </div>

      {/* CINEMATIC HERO */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <MaritimeHeroArt />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, rgba(8,20,32,0.94) 0%, rgba(8,20,32,0.75) 38%, rgba(8,20,32,0.25) 65%, rgba(8,20,32,0.55) 100%)",
        }} />
        <div style={{ position: "relative", zIndex: 1, padding: "72px 32px 56px", maxWidth: 720 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.teal, letterSpacing: "0.16em", marginBottom: 16, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: C.teal }} /> Live GPS · AI · Fishermen + Government, Connected
          </div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "clamp(30px, 4.2vw, 48px)", lineHeight: 1.18, margin: 0 }}>
            Intelligent Fisheries Monitoring for Safer Seas and Sustainable Fishing
          </h1>
          <p style={{ color: C.fogDim, fontSize: 14.5, lineHeight: 1.7, marginTop: 18, maxWidth: 620 }}>
            Connect fishing vessels, fishermen and marine authorities through one intelligent platform for
            real-time vessel tracking, catch monitoring, weather intelligence, fuel optimization, safety
            alerts and regulatory compliance.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 30 }}>
            <button onClick={() => onSelectPortal("fisherman")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 20px", borderRadius: 4, border: "none", background: C.teal, color: "#081420", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
              <Anchor size={15} /> Access Fisherman Portal
            </button>
            <button onClick={() => onSelectPortal("government")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 20px", borderRadius: 4, border: `1px solid ${C.amber}`, background: "rgba(232,163,61,0.08)", color: C.amber, fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
              <Landmark size={15} /> Open Government Command Centre
            </button>
            <button onClick={() => setDemoStep(0)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 20px", borderRadius: 4, border: `1px solid ${C.border}`, background: "rgba(255,255,255,.02)", color: C.fogDim, fontSize: 13.5, cursor: "pointer" }}>
              <Play size={15} /> Start Industry Demo
            </button>
          </div>

          <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginTop: 44 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <s.icon size={15} color={C.teal} />
                <div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 17, fontWeight: 600 }}>{s.value}</div>
                  <div style={{ fontSize: 9.5, color: C.fogDim, letterSpacing: "0.03em" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 9.5, color: C.fogDim, marginTop: 10, fontStyle: "italic" }}>Demo data — for illustration only</div>
        </div>
      </div>


      <LiveDemoOverlay step={demoStep} onClose={() => setDemoStep(-1)} />

      <div style={{ padding: "34px 32px 52px", borderTop: `1px solid ${C.border}`, background: C.panelAlt }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-end", marginBottom: 14, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: C.teal, letterSpacing: ".13em" }}>LIVE OPERATIONS MAP</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, marginTop: 5 }}>Fishing vessels, patrol assets and risk zones on one real map.</div>
            </div>
            <StatusPill tone="ok">OpenStreetMap + Leaflet</StatusPill>
          </div>
          <LiveOperationsMap fleet={fleet || initialFleet} selectedId={(fleet || initialFleet)[0]?.id} />
        </div>
      </div>

      {/* SOLUTIONS */}
      <div id="solutions" style={{ padding: "64px 32px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: C.amber, letterSpacing: "0.14em", textTransform: "uppercase" }}>One Platform</div>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 28, margin: "8px 0 32px" }}>Complete Fisheries Visibility.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {SOLUTIONS.map((s) => (
              <div key={s.title} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: "22px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 6, background: `${C.teal}18`, border: `1px solid ${C.teal}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <s.icon size={18} color={C.teal} />
                </div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15.5 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: C.fogDim, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROBLEM -> TECHNOLOGY -> OUTCOME */}
      <div id="outcomes" style={{ padding: "64px 32px", borderTop: `1px solid ${C.border}`, background: C.panelAlt }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: C.amber, letterSpacing: "0.14em", textTransform: "uppercase" }}>Why It Matters</div>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 28, margin: "8px 0 32px" }}>Industry Challenge → TideWatch Intelligence → Outcome</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px", padding: "0 4px 10px", fontFamily: FONT_DISPLAY, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.fogDim, borderBottom: `1px solid ${C.border}` }}>
            <span>Industry Challenge</span><span>TideWatch Intelligence</span><span>Outcome</span>
          </div>
          {PROBLEM_MAP.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, padding: "16px 4px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 12.5, color: C.fog, lineHeight: 1.6 }}>{row.challenge}</div>
              <div style={{ fontSize: 12.5, color: C.teal, lineHeight: 1.6 }}>{row.tech}</div>
              <div style={{ fontSize: 12.5, color: C.fogDim, lineHeight: 1.6 }}>{row.outcome}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WORKFLOW */}
      <div id="workflow" style={{ padding: "64px 32px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: C.amber, letterSpacing: "0.14em", textTransform: "uppercase", textAlign: "center" }}>System Workflow</div>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, margin: "8px 0 8px", textAlign: "center" }}>Information Flows Both Ways</h2>
          <p style={{ fontSize: 12.5, color: C.fogDim, textAlign: "center", marginBottom: 36 }}>
            Data flows up from the boat to the command centre; decisions and alerts flow back down to the fisherman.
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {WORKFLOW_STEPS.map((s, i) => (
              <React.Fragment key={s.label}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", maxWidth: 420, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: "12px 16px" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: `${C.teal}18`, border: `1px solid ${C.teal}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <s.icon size={15} color={C.teal} />
                  </div>
                  <span style={{ fontSize: 12.5 }}>{s.label}</span>
                </div>
                {i < WORKFLOW_STEPS.length - 1 && <ArrowDown size={16} color={C.fogDim} style={{ margin: "6px 0" }} />}
              </React.Fragment>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, color: C.amber, fontSize: 11.5 }}>
              <ArrowUpCircle size={14} /> Fisherman receives the action — the loop closes.
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div id="about" style={{ padding: "40px 32px", borderTop: `1px solid ${C.border}`, background: C.panelAlt }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div style={{ maxWidth: 380 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, marginBottom: 8 }}>TIDEWATCH</div>
            <div style={{ fontSize: 12, color: C.fogDim, lineHeight: 1.6 }}>
              A maritime operations platform connecting fishing crews and fisheries regulators through
              real-time vessel intelligence, safety alerts, and digital governance.
            </div>
          </div>
          <div id="contact" style={{ fontSize: 12, color: C.fogDim, lineHeight: 2 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, color: C.fog, marginBottom: 6 }}>Contact</div>
            <div>Fisheries Department Liaison Desk</div>
            <div>Thoothukudi Coastal Region</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Cinematic maritime scene — stylized (not photorealistic) illustration
   of a fishing vessel and a government patrol vessel with a live
   monitoring overlay: GPS pins, route lines, geofence, radar, signal link.
---------------------------------------------------------------- */
function MaritimeHeroArt() {
  return (
    <svg viewBox="0 0 1400 560" width="100%" height="480" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A1B2C" />
          <stop offset="100%" stopColor="#0E2C40" />
        </linearGradient>
        <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0C2739" />
          <stop offset="100%" stopColor="#071522" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1400" height="330" fill="url(#skyGrad)" />
      <rect x="0" y="330" width="1400" height="230" fill="url(#seaGrad)" />

      {/* weather cloud + wind indicator, top right */}
      <g opacity="0.5">
        <circle cx="1180" cy="90" r="22" fill="#1C3A50" />
        <circle cx="1205" cy="100" r="28" fill="#1C3A50" />
        <circle cx="1150" cy="100" r="18" fill="#1C3A50" />
        <path d="M1120 130 h60 M1120 142 h44" stroke="#3A5A70" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* radar sweep behind patrol vessel */}
      <g opacity="0.35">
        <circle cx="1080" cy="360" r="130" fill="none" stroke={C.teal} strokeWidth="1" strokeDasharray="3 5" />
        <circle cx="1080" cy="360" r="80" fill="none" stroke={C.teal} strokeWidth="1" strokeDasharray="3 5" />
      </g>

      {/* geofence boundary */}
      <polygon points="520,470 620,430 740,440 760,500 660,530 540,520" fill="none" stroke={C.amber} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.55" />
      <text x="640" y="405" fontFamily={FONT_MONO} fontSize="10" fill={C.amber} opacity="0.7">RESTRICTED ZONE R-3</text>

      {/* waves */}
      {[380, 420, 460, 500].map((y, i) => (
        <path key={y} d={`M0 ${y} Q 60 ${y - 8} 120 ${y} T 240 ${y} T 360 ${y} T 480 ${y} T 600 ${y} T 720 ${y} T 840 ${y} T 960 ${y} T 1080 ${y} T 1200 ${y} T 1320 ${y} T 1400 ${y}`}
          fill="none" stroke="#173650" strokeWidth="1.5" opacity={0.5 - i * 0.08} />
      ))}

      {/* GPS route line connecting the two vessels */}
      <path d="M330 400 C 550 340, 780 340, 1020 380" fill="none" stroke={C.teal} strokeWidth="1.5" strokeDasharray="2 6" opacity="0.7" />
      <g opacity="0.9">
        <circle cx="330" cy="400" r="4" fill={C.teal} />
        <circle cx="1020" cy="380" r="4" fill={C.amber} />
        <g transform="translate(668,352)">
          <circle r="14" fill="#0E2233" stroke={C.teal} strokeWidth="1.5" />
          <path d="M-5 -1 L0 -6 L5 -1 M0 -6 V6" stroke={C.teal} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* ===== FISHING VESSEL (left/foreground) ===== */}
      <g transform="translate(180,300)">
        {/* hull */}
        <path d="M0 90 L20 130 L200 130 L230 90 Z" fill="#1B3A52" stroke="#2E5470" strokeWidth="2" />
        <path d="M0 90 L230 90" stroke="#3A6B87" strokeWidth="2" />
        {/* cabin */}
        <rect x="40" y="55" width="55" height="38" rx="3" fill="#234A63" stroke="#3A6B87" strokeWidth="1.5" />
        <rect x="50" y="63" width="14" height="12" fill={C.teal} opacity="0.5" />
        <rect x="70" y="63" width="14" height="12" fill={C.teal} opacity="0.5" />
        {/* mast + rigging */}
        <line x1="115" y1="90" x2="115" y2="10" stroke="#3A6B87" strokeWidth="3" />
        <line x1="115" y1="20" x2="180" y2="55" stroke="#3A6B87" strokeWidth="1.5" />
        <line x1="115" y1="35" x2="185" y2="60" stroke="#3A6B87" strokeWidth="1.5" />
        <line x1="115" y1="15" x2="55" y2="55" stroke="#3A6B87" strokeWidth="1.5" />
        {/* AIS antenna + pulse */}
        <circle cx="115" cy="10" r="3" fill={C.teal} />
        <circle cx="115" cy="10" r="9" fill="none" stroke={C.teal} strokeWidth="1" opacity="0.6" />
        {/* net lines trailing */}
        <path d="M200 120 Q 260 140 300 120 Q 320 150 360 130" fill="none" stroke="#3A6B87" strokeWidth="1.5" opacity="0.6" />
        {/* two crew silhouettes on deck */}
        <g fill="#0E2233" stroke="#3A6B87" strokeWidth="1">
          <circle cx="35" cy="78" r="6" />
          <rect x="30" y="83" width="10" height="16" rx="3" />
          <circle cx="150" cy="80" r="6" />
          <rect x="145" y="85" width="10" height="16" rx="3" />
        </g>
        {/* vessel label */}
        <text x="20" y="150" fontFamily={FONT_MONO} fontSize="10" fill={C.fogDim}>TV-104 · FISHING VESSEL</text>
      </g>

      {/* ===== GOVERNMENT PATROL VESSEL (right/background) ===== */}
      <g transform="translate(950,270)" opacity="0.92">
        <path d="M0 70 L15 100 L170 100 L190 70 Z" fill="#2A2416" stroke="#5A4B26" strokeWidth="2" />
        <rect x="45" y="35" width="65" height="35" rx="3" fill="#3A3018" stroke="#5A4B26" strokeWidth="1.5" />
        <rect x="52" y="42" width="12" height="10" fill={C.amber} opacity="0.5" />
        <rect x="70" y="42" width="12" height="10" fill={C.amber} opacity="0.5" />
        <line x1="130" y1="70" x2="130" y2="5" stroke="#5A4B26" strokeWidth="3" />
        {/* radar dish */}
        <ellipse cx="130" cy="5" rx="10" ry="4" fill="#5A4B26" />
        <text x="10" y="120" fontFamily={FONT_MONO} fontSize="10" fill={C.fogDim}>TN-FISH-P03 · PATROL</text>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------
   LOGIN PAGE (shared shell, two variants)
---------------------------------------------------------------- */
function LoginPage({ portal, registeredUsers, onLogin, onBack, onGoRegister, lang, setLang }) {
  const isFisherman = portal === "fisherman";
  const accent = isFisherman ? C.teal : C.amber;
  const t = (k) => tr(lang, k);
  const [username, setUsername] = useState("");
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError("");
    if (isFisherman) {
      const user = registeredUsers.find(
        (u) => u.username.toLowerCase() === username.trim().toLowerCase() || u.vesselId.toLowerCase() === username.trim().toLowerCase()
      );
      if (!user) return setError("No vessel account found with that ID / username.");
      if (password !== user.password) return setError("Incorrect password.");
      onLogin({ role: "fisherman", vesselId: user.vesselId, username: user.username });
    } else {
      const officer = GOV_OFFICERS.find((o) => o.id.toLowerCase() === officerId.trim().toLowerCase());
      if (!officer) return setError("Officer ID not recognized.");
      if (password !== officer.password) return setError("Incorrect password.");
      onLogin({ role: "government", officerId: officer.id });
    }
  };
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(e); };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.fog, fontFamily: FONT_BODY, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <FontLoader />
      <div style={{ width: 380, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.fogDim, fontSize: 12, cursor: "pointer", padding: 0 }}>
            <ArrowLeft size={14} /> {isFisherman ? t("back") : "Back"}
          </button>
          {isFisherman && <LanguageSwitcher lang={lang} setLang={setLang} />}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 6, background: `${accent}18`, border: `1px solid ${accent}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isFisherman ? <Anchor size={18} color={accent} /> : <Landmark size={18} color={accent} />}
          </div>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 19 }}>{isFisherman ? t("fishermanPortal") : "Government Portal"}</div>
            <div style={{ fontSize: 10.5, color: C.fogDim }}>{isFisherman ? t("fishermanSubtitle") : "Fisheries authority sign-in"}</div>
          </div>
        </div>

        <div onKeyDown={handleKeyDown} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
          {isFisherman ? (
            <Field label={t("vesselIdOrUsername")} icon={User}>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. TV-104" style={inputStyle} />
            </Field>
          ) : (
            <Field label="Officer ID" icon={User}>
              <input value={officerId} onChange={(e) => setOfficerId(e.target.value)} placeholder="DFO-0021" style={inputStyle} />
            </Field>
          )}

          <Field label={isFisherman ? t("password") : "Password"} icon={Lock}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
          </Field>

          {error && <div style={{ fontSize: 11.5, color: C.coral }}>{error}</div>}

          <button onClick={handleSubmit} style={{ marginTop: 4, padding: "11px 16px", borderRadius: 4, border: "none", background: accent, color: "#081420", fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <KeyRound size={14} /> {isFisherman ? t("signIn") : "Sign In"}
          </button>

          <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: C.fogDim, textAlign: "center" }}>
            {isFisherman ? `${t("sampleLogin")}: TV-104 / kadal123` : "Sample login: DFO-0021 / gov123"}
          </div>
        </div>

        {isFisherman && (
          <button
            onClick={onGoRegister}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "none", border: `1px dashed ${C.border}`, borderRadius: 6, padding: "12px 16px", color: C.fogDim, fontSize: 12.5, cursor: "pointer" }}
          >
            <UserPlus size={14} /> {t("newVessel")}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 10.5, color: C.fogDim, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6 }}>
        {Icon && <Icon size={11} />} {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle = {
  background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 4, padding: "10px 12px",
  color: C.fog, fontFamily: FONT_MONO, fontSize: 13, outline: "none",
};
const selectStyle = { ...inputStyle, fontFamily: FONT_BODY };

/* ---------------------------------------------------------------
   FISHERMAN REGISTRATION — vessel + license + previous trip + own credentials
---------------------------------------------------------------- */
function RegisterPage({ existingUsers, onRegistered, onBack, lang, setLang }) {
  const t = (k) => tr(lang, k);
  const [form, setForm] = useState({
    vesselName: "",
    vesselId: "",
    captainName: "",
    username: "",
    password: "",
    confirmPassword: "",
    licenseFile: null,
    prevTripDate: "",
    prevTripSpecies: SPECIES[0],
    prevTripCatchKg: "",
    prevTripDuration: "",
  });
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    setForm((f) => ({ ...f, licenseFile: file || null }));
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError("");
    if (!form.vesselName || !form.vesselId || !form.captainName || !form.username || !form.password) {
      return setError("Please fill in all required fields.");
    }
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (existingUsers.some((u) => u.vesselId.toLowerCase() === form.vesselId.toLowerCase())) {
      return setError("A vessel with this ID is already registered.");
    }
    if (existingUsers.some((u) => u.username.toLowerCase() === form.username.toLowerCase())) {
      return setError("That username is taken. Choose another.");
    }
    if (!form.licenseFile) return setError("Please upload your fishing license.");

    onRegistered({
      vesselName: form.vesselName,
      vesselId: form.vesselId.toUpperCase(),
      captainName: form.captainName,
      username: form.username,
      password: form.password,
      licenseFileName: form.licenseFile.name,
      previousTrip: form.prevTripDate
        ? { date: form.prevTripDate, species: form.prevTripSpecies, catchKg: form.prevTripCatchKg || "0", duration: form.prevTripDuration || "—" }
        : null,
    });
  };
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(e); };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.fog, fontFamily: FONT_BODY, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <FontLoader />
      <div style={{ width: 460, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.fogDim, fontSize: 12, cursor: "pointer", padding: 0 }}>
            <ArrowLeft size={14} /> {t("backToSignIn")}
          </button>
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 6, background: `${C.teal}18`, border: `1px solid ${C.teal}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ship size={18} color={C.teal} />
          </div>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 19 }}>{t("registerVessel")}</div>
            <div style={{ fontSize: 10.5, color: C.fogDim }}>{t("registerSubtitle")}</div>
          </div>
        </div>

        <div onKeyDown={handleKeyDown} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: 22, display: "flex", flexDirection: "column", gap: 14, maxHeight: "72vh", overflowY: "auto" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12, letterSpacing: "0.08em", color: C.fogDim, textTransform: "uppercase" }}>{t("vesselDetails")}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label={t("vesselName")}>
              <input value={form.vesselName} onChange={set("vesselName")} placeholder="e.g. Kadal Rani" style={inputStyle} />
            </Field>
            <Field label={t("vesselId")}>
              <input value={form.vesselId} onChange={set("vesselId")} placeholder="e.g. TV-601" style={inputStyle} />
            </Field>
          </div>
          <Field label={t("captainName")}>
            <input value={form.captainName} onChange={set("captainName")} placeholder="Your full name" style={inputStyle} />
          </Field>

          <Field label={t("fishingLicense")} icon={Upload}>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} style={{ ...inputStyle, fontFamily: FONT_BODY, padding: "8px 10px" }} />
          </Field>

          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12, letterSpacing: "0.08em", color: C.fogDim, textTransform: "uppercase", marginTop: 6 }}>{t("previousTripDetails")}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label={t("tripDate")}>
              <input type="date" value={form.prevTripDate} onChange={set("prevTripDate")} style={inputStyle} />
            </Field>
            <Field label={t("tripDuration")}>
              <input value={form.prevTripDuration} onChange={set("prevTripDuration")} placeholder="e.g. 18 hrs" style={inputStyle} />
            </Field>
            <Field label={t("speciesCaught")}>
              <select value={form.prevTripSpecies} onChange={set("prevTripSpecies")} style={selectStyle}>
                {SPECIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label={t("catchWeightKg")}>
              <input type="number" min="0" value={form.prevTripCatchKg} onChange={set("prevTripCatchKg")} placeholder="e.g. 240" style={inputStyle} />
            </Field>
          </div>

          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12, letterSpacing: "0.08em", color: C.fogDim, textTransform: "uppercase", marginTop: 6 }}>{t("accountLogin")}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label={t("username")} icon={User}>
              <input value={form.username} onChange={set("username")} placeholder="Choose a username" style={inputStyle} />
            </Field>
            <Field label={t("password")} icon={Lock}>
              <input type="password" value={form.password} onChange={set("password")} placeholder="••••••••" style={inputStyle} />
            </Field>
          </div>
          <Field label={t("confirmPassword")} icon={Lock}>
            <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="••••••••" style={inputStyle} />
          </Field>

          {error && <div style={{ fontSize: 11.5, color: C.coral }}>{error}</div>}

          <button onClick={handleSubmit} style={{ marginTop: 4, padding: "12px 16px", borderRadius: 4, border: "none", background: C.teal, color: "#081420", fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <UserPlus size={14} /> {t("registerContinue")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   TRIP ENTRY — shown right after fisherman login, before the dashboard
---------------------------------------------------------------- */
const DIRECTIONS = [
  { id: "N", label: "North", icon: ArrowUpCircle },
  { id: "S", label: "South", icon: ArrowDownCircle },
  { id: "E", label: "East", icon: ArrowRightCircle },
  { id: "W", label: "West", icon: ArrowLeftCircle },
];

// Safety equipment checklist required by the Fisheries Department before
// clearing a vessel to sail.
const SAFETY_EQUIPMENT = [
  { id: "lifejackets", label: "Life Jackets", icon: LifeBuoy },
  { id: "liferaft", label: "Life Raft", icon: LifeBuoy },
  { id: "firstaid", label: "First Aid Kit", icon: HeartPulse },
  { id: "extinguisher", label: "Fire Extinguisher", icon: Flame },
  { id: "radio", label: "VHF Radio", icon: Radio },
  { id: "gps", label: "GPS Device", icon: Satellite },
];

function TripEntryPage({ vessel, onSubmitTrip, onLogout, lang, setLang }) {
  const t = (k) => tr(lang, k);
  const [direction, setDirection] = useState("N");
  const [entryTime, setEntryTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [fuelLevel, setFuelLevel] = useState(vessel.fuel);
  const [crewCount, setCrewCount] = useState(3);
  const [targetSpecies, setTargetSpecies] = useState(SPECIES[0]);
  const [distanceNm, setDistanceNm] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [safety, setSafety] = useState({});
  const [touched, setTouched] = useState(false);

  const entryValid = !!entryTime;
  const returnValid = !!returnTime;
  const contactValid = !!contactPhone.trim();
  const formValid = entryValid && returnValid && contactValid;

  const toggleSafety = (id) => setSafety((s) => ({ ...s, [id]: !s[id] }));
  const safetyCount = SAFETY_EQUIPMENT.filter((s) => safety[s.id]).length;

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setTouched(true);
    if (!formValid) return;
    onSubmitTrip({
      direction, entryTime, returnTime, fuelLevel: Number(fuelLevel),
      crewCount: Number(crewCount) || 0,
      targetSpecies,
      distanceNm: distanceNm || "—",
      emergencyContact: { name: contactName.trim() || "—", phone: contactPhone.trim() },
      safetyEquipment: SAFETY_EQUIPMENT.filter((s) => safety[s.id]).map((s) => s.label),
    });
  };
  const handleKeyDown = (e) => { if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") handleSubmit(e); };

  const directionLabelMap = { N: t("north"), S: t("south"), E: t("east"), W: t("west") };
  const directionLabel = directionLabelMap[direction];
  const fuelColor = fuelLevel < 20 ? C.coral : fuelLevel < 45 ? C.amber : C.teal;
  const textInputStyle = (invalid) => ({ ...inputStyle, fontFamily: FONT_BODY, border: `1px solid ${invalid ? C.coral : C.border}` });

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.fog, fontFamily: FONT_BODY, padding: "36px 24px" }}>
      <FontLoader />
      <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 6, background: `${C.teal}18`, border: `1px solid ${C.teal}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Anchor size={16} color={C.teal} />
            </div>
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 19, lineHeight: 1.15 }}>{vessel.name}</div>
              <div style={{ fontSize: 10.5, color: C.fogDim, fontFamily: FONT_MONO }}>{vessel.id} · Capt. {vessel.captain}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LanguageSwitcher lang={lang} setLang={setLang} />
            <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: `1px solid ${C.border}`, color: C.fogDim, borderRadius: 4, padding: "6px 11px", fontSize: 11.5, cursor: "pointer" }}>
              <LogOut size={12} /> {t("signOut")}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <StepDot active label={t("stepTripDetails")} />
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <StepDot label={t("stepGovApproval")} />
        </div>

        <div onKeyDown={handleKeyDown} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: "28px 30px", display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 12, color: C.fogDim, lineHeight: 1.5, maxWidth: 640 }}>
            {t("tripIntro")}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            {/* LEFT COLUMN — route, timing, fuel, fishing plan */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SectionLabel icon={Navigation}>{t("fishingZoneDirection")}</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {DIRECTIONS.map((d) => {
                    const active = direction === d.id;
                    return (
                      <button
                        type="button"
                        key={d.id}
                        onClick={() => setDirection(d.id)}
                        style={{
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 6px",
                          borderRadius: 5, border: `1px solid ${active ? C.teal : C.border}`,
                          background: active ? "rgba(51,214,192,0.10)" : C.panelAlt,
                          color: active ? C.teal : C.fogDim, cursor: "pointer", transition: "all 0.15s",
                        }}
                      >
                        <d.icon size={18} />
                        <span style={{ fontSize: 11, fontWeight: active ? 600 : 400 }}>{directionLabelMap[d.id]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SectionLabel icon={Clock}>{t("tripTiming")}</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label={t("seaEntryTime")}>
                    <Time12Input value={entryTime} onChange={setEntryTime} invalid={touched && !entryValid} />
                    {touched && !entryValid && <FieldError>{t("required")}</FieldError>}
                  </Field>
                  <Field label={t("expectedReturnTime")}>
                    <Time12Input value={returnTime} onChange={setReturnTime} invalid={touched && !returnValid} />
                    {touched && !returnValid && <FieldError>{t("required")}</FieldError>}
                  </Field>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SectionLabel icon={Fuel}>{t("fuelLevelDeparture")}</SectionLabel>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input type="range" min="0" max="100" value={fuelLevel} onChange={(e) => setFuelLevel(e.target.value)} style={{ accentColor: fuelColor, flex: 1 }} />
                  <span style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 600, color: fuelColor, width: 46, textAlign: "right" }}>{fuelLevel}%</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SectionLabel icon={Target}>{t("fishingPlan")}</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label={t("targetSpecies")}>
                    <select value={targetSpecies} onChange={(e) => setTargetSpecies(e.target.value)} style={selectStyle}>
                      {SPECIES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label={t("distanceFromShore")}>
                    <input type="number" min="0" value={distanceNm} onChange={(e) => setDistanceNm(e.target.value)} placeholder="e.g. 12" style={inputStyle} />
                  </Field>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — crew, emergency contact, safety equipment */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SectionLabel icon={Users}>{t("crewEmergencyContact")}</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label={t("crewMembersAboard")}>
                    <input type="number" min="1" max="30" value={crewCount} onChange={(e) => setCrewCount(e.target.value)} style={inputStyle} />
                  </Field>
                  <Field label={t("contactNameShore")}>
                    <input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="e.g. spouse, agent" style={{ ...inputStyle, fontFamily: FONT_BODY }} />
                  </Field>
                </div>
                <Field label={t("emergencyContactPhone")}>
                  <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="e.g. 98765 43210" style={textInputStyle(touched && !contactValid)} />
                  {touched && !contactValid && <FieldError>{t("requiredApproval")}</FieldError>}
                </Field>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SectionLabel icon={LifeBuoy}>{t("safetyEquipmentOnboard")}</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {SAFETY_EQUIPMENT.map((item) => {
                    const checked = !!safety[item.id];
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => toggleSafety(item.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 7, padding: "8px 10px",
                          borderRadius: 4, border: `1px solid ${checked ? C.teal : C.border}`,
                          background: checked ? "rgba(51,214,192,0.08)" : C.panelAlt,
                          color: checked ? C.teal : C.fogDim, cursor: "pointer", fontSize: 11, textAlign: "left",
                        }}
                      >
                        {checked ? <CheckSquare size={14} /> : <Square size={14} />}
                        {item.label}
                      </button>
                    );
                  })}
                </div>
                <div style={{ fontSize: 10.5, color: safetyCount === SAFETY_EQUIPMENT.length ? C.teal : C.fogDim }}>
                  {safetyCount}/{SAFETY_EQUIPMENT.length} {t("confirmedOnboard")}
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: C.border }} />

          <div style={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 5, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            <SectionLabel icon={FileCheck2}>{t("tripSummary")}</SectionLabel>
            <div style={{ fontSize: 12, color: C.fogDim, lineHeight: 1.8 }}>
              {t("heading")} <span style={{ color: C.fog, fontWeight: 600 }}>{directionLabel}</span> · <span style={{ color: C.fog, fontWeight: 600 }}>{targetSpecies}</span>, {distanceNm || "—"}nm ·
              {" "}{t("crew")} <span style={{ color: C.fog, fontFamily: FONT_MONO }}>{crewCount}</span> ·
              {" "}{t("entry")} <span style={{ color: entryValid ? C.fog : C.coral, fontFamily: FONT_MONO }}>{formatTime12(entryTime)}</span> ·
              {" "}{t("returnLabel")} <span style={{ color: returnValid ? C.fog : C.coral, fontFamily: FONT_MONO }}>{formatTime12(returnTime)}</span> ·
              {" "}{t("fuel")} <span style={{ color: fuelColor, fontFamily: FONT_MONO }}>{fuelLevel}%</span> ·
              {" "}{t("safety")} <span style={{ color: C.fog, fontFamily: FONT_MONO }}>{safetyCount}/{SAFETY_EQUIPMENT.length}</span> ·
              {" "}{t("contact")} <span style={{ color: contactValid ? C.fog : C.coral, fontFamily: FONT_MONO }}>{contactPhone || "—"}</span>
            </div>
          </div>

          <SafetyVerdictBanner
            check={computeSafetyCheck({ vessel: { ...vessel, fuel: Number(fuelLevel) }, request: null, safetyCount, contactOk: contactValid })}
            lang={lang}
          />

          <button
            onClick={handleSubmit}
            style={{ padding: "13px 16px", borderRadius: 4, border: "none", background: C.teal, color: "#081420", fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            {t("continueToApproval")} <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StepDot({ active, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: 99, background: active ? C.teal : C.border, border: active ? "none" : `1px solid ${C.fogDim}` }} />
      <span style={{ fontSize: 10.5, color: active ? C.teal : C.fogDim, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
}

function SectionLabel({ icon: Icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: FONT_DISPLAY, fontSize: 11.5, letterSpacing: "0.06em", textTransform: "uppercase", color: C.fogDim }}>
      <Icon size={13} color={C.amber} /> {children}
    </div>
  );
}

function FieldError({ children }) {
  return <span style={{ fontSize: 10.5, color: C.coral }}>{children}</span>;
}

// 12-hour time picker (hour / minute / AM-PM dropdowns). Stores and emits
// value as a 24-hour "HH:MM" string so the rest of the app is unaffected.
function Time12Input({ value, onChange, invalid }) {
  const parsed = (() => {
    if (!value) return { h: "", m: "", p: "AM" };
    const [hh, mm] = value.split(":").map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return { h: "", m: "", p: "AM" };
    const p = hh >= 12 ? "PM" : "AM";
    let h12 = hh % 12;
    if (h12 === 0) h12 = 12;
    return { h: String(h12).padStart(2, "0"), m: String(mm).padStart(2, "0"), p };
  })();

  const emit = (h, m, p) => {
    if (!h || m === "") return onChange("");
    let hh = parseInt(h, 10) % 12;
    if (p === "PM") hh += 12;
    onChange(`${String(hh).padStart(2, "0")}:${m}`);
  };

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
  const boxStyle = { ...selectStyle, flex: 1, border: `1px solid ${invalid ? C.coral : C.border}`, textAlign: "center" };

  return (
    <div style={{ display: "flex", gap: 6 }}>
      <select value={parsed.h} onChange={(e) => emit(e.target.value, parsed.m || "00", parsed.p)} style={boxStyle}>
        <option value="">--</option>
        {hours.map((h) => <option key={h} value={h}>{h}</option>)}
      </select>
      <select value={parsed.m} onChange={(e) => emit(parsed.h || "12", e.target.value, parsed.p)} style={boxStyle}>
        <option value="">--</option>
        {minutes.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={parsed.p} onChange={(e) => emit(parsed.h || "12", parsed.m || "00", e.target.value)} style={{ ...boxStyle, flex: 0.7 }}>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}

/* ---------------------------------------------------------------
   APPROVAL REQUEST — fisherman requests government clearance to sail,
   shown after trip entry. Surfaces weather advisory + vessel ban status.
---------------------------------------------------------------- */
function ApprovalRequestPage({ vessel, tripInfo, request, onSubmitRequest, onContinue, onLogout, lang, setLang }) {
  const t = (k) => tr(lang, k);
  const directionLabelMap = { N: t("north"), S: t("south"), E: t("east"), W: t("west") };
  const isBanned = vessel.compliance === "violation";
  const advisoryTone = SEA_ADVISORY.level === "restricted" ? "bad" : SEA_ADVISORY.level === "caution" ? "warn" : "ok";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.fog, fontFamily: FONT_BODY, padding: "36px 24px" }}>
      <FontLoader />
      <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20 }}>{t("requestApprovalToSail")}</div>
            <div style={{ fontSize: 10.5, color: C.fogDim, fontFamily: FONT_MONO }}>{vessel.id} · {vessel.name}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LanguageSwitcher lang={lang} setLang={setLang} />
            <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: `1px solid ${C.border}`, color: C.fogDim, borderRadius: 4, padding: "6px 11px", fontSize: 11.5, cursor: "pointer" }}>
              <LogOut size={12} /> {t("signOut")}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <StepDot label={t("stepTripDetails")} />
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <StepDot active label={t("stepGovApproval")} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Panel title={t("govSeaAdvisory")} icon={ShieldQuestion} right={<StatusPill tone={advisoryTone}>{SEA_ADVISORY.level}</StatusPill>}>
            <div style={{ fontSize: 12, color: C.fogDim, lineHeight: 1.6 }}>{SEA_ADVISORY.message}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: C.fogDim, marginTop: 2 }}>— {SEA_ADVISORY.issuedBy}</div>
          </Panel>

          <Panel title={t("vesselClearanceStatus")} icon={isBanned ? ShieldAlert : ShieldCheck} right={isBanned ? <StatusPill tone="bad">{t("flagged")}</StatusPill> : <StatusPill tone="ok">{t("clear")}</StatusPill>}>
            <div style={{ fontSize: 12, color: C.fogDim, lineHeight: 1.6 }}>
              {isBanned
                ? "This vessel has an open compliance violation and is restricted from sailing until the Fisheries Department clears it. You may still submit a request for review."
                : "No outstanding violations or license issues on file for this vessel."}
            </div>
          </Panel>
        </div>

        <Panel title={t("tripBeingRequested")} icon={Navigation}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Row label={t("heading")} value={directionLabelMap[tripInfo.direction] || tripInfo.direction} />
              <Row label={t("entry")} value={formatTime12(tripInfo.entryTime)} mono />
              <Row label={t("returnLabel")} value={formatTime12(tripInfo.returnTime)} mono />
              <Row label={t("fuelLevelDeparture")} value={`${tripInfo.fuelLevel}%`} mono />
              {tripInfo.targetSpecies && <Row label={t("targetSpecies")} value={tripInfo.targetSpecies} />}
              {tripInfo.distanceNm && <Row label={t("distanceFromShore")} value={`${tripInfo.distanceNm} nm`} mono />}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {tripInfo.crewCount != null && <Row label={t("crew")} value={tripInfo.crewCount} mono />}
              {tripInfo.emergencyContact && (
                <>
                  <Row label={t("contact")} value={tripInfo.emergencyContact.name} />
                  <Row label={t("emergencyContactPhone")} value={tripInfo.emergencyContact.phone} mono />
                </>
              )}
              {tripInfo.safetyEquipment && (
                <Row
                  label={t("safety")}
                  value={tripInfo.safetyEquipment.length ? <StatusPill tone={tripInfo.safetyEquipment.length >= SAFETY_EQUIPMENT.length ? "ok" : "warn"}>{tripInfo.safetyEquipment.length}/{SAFETY_EQUIPMENT.length}</StatusPill> : <StatusPill tone="bad">None confirmed</StatusPill>}
                />
              )}
            </div>
          </div>
        </Panel>

        {!request && (
          <button onClick={onSubmitRequest} style={{ padding: "13px 16px", borderRadius: 4, border: "none", background: C.teal, color: "#081420", fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Send size={14} /> {t("submitRequest")}
          </button>
        )}

        {request && request.status === "pending" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "13px 16px", borderRadius: 4, border: `1px solid ${C.amberDim}`, background: "rgba(232,163,61,0.08)", color: C.amber, fontSize: 12.5 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Hourglass size={16} /> {t("pendingMsg")}</span>
            <SpeakButton text={t("pendingMsg")} lang={lang} />
          </div>
        )}
        {request && request.status === "approved" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "13px 16px", borderRadius: 4, border: `1px solid ${C.teal}66`, background: "rgba(51,214,192,0.08)", color: C.teal, fontSize: 12.5 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}><CheckCircle2 size={16} /> {t("approvedMsg")}</span>
            <SpeakButton text={t("approvedMsg")} lang={lang} />
          </div>
        )}
        {request && request.status === "approved" && (
          <DigitalSeaPass request={request} vessel={vessel} tripInfo={tripInfo} />
        )}

        {request && request.status === "denied" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "13px 16px", borderRadius: 4, border: `1px solid ${C.coral}66`, background: "rgba(232,96,76,0.08)", color: C.coral, fontSize: 12.5 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}><XCircle size={16} /> {t("deniedMsg")}</span>
              <SpeakButton text={`${t("deniedMsg")}${request.reason ? `. ${request.reason}` : ""}`} lang={lang} />
            </div>
            {request.reason && <div style={{ fontSize: 11, color: C.fogDim, marginLeft: 26 }}>{request.reason}</div>}
          </div>
        )}

        <button onClick={onContinue} style={{ padding: "11px 16px", borderRadius: 4, border: `1px solid ${C.border}`, background: "none", color: C.fogDim, fontFamily: FONT_BODY, fontSize: 12.5, cursor: "pointer" }}>
          {t("continueToDashboard")}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   FISHERMAN DASHBOARD
---------------------------------------------------------------- */
const FISHERMAN_TABS = [
  { id: "overview", key: "overview", icon: Compass },
  { id: "catch", key: "catchLogTab", icon: Fish },
  { id: "docs", key: "documentsTrip", icon: FileCheck2 },
  { id: "alerts", key: "alertsWeather", icon: Bell },
];

function FishermanDashboard({ vessel, fleet, tripInfo, userMeta, request, onResubmitRequest, onLogCatch, onLogout, lang, setLang, mlData, onSOS }) {
  const t = (k) => tr(lang, k);
  const directionLabelMap = { N: t("north"), S: t("south"), E: t("east"), W: t("west") };
  const [tab, setTab] = useState("overview");
  const [species, setSpecies] = useState(SPECIES[0]);
  const [weight, setWeight] = useState("");
  const [tripLog, setTripLog] = useState([]);
  const [clock, setClock] = useState(new Date());
  const [editingId, setEditingId] = useState(null);
  const [editSpecies, setEditSpecies] = useState(SPECIES[0]);
  const [editWeight, setEditWeight] = useState("");
  const online = useNetworkStatus();
  const [pendingOffline, setPendingOffline] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tidewatch_offline_queue") || "[]").length; } catch { return 0; }
  });

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const submitCatch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const kg = parseFloat(weight);
    if (!kg || kg <= 0) return;
    const entry = { id: Date.now(), species, kg, time: new Date().toLocaleTimeString() };
    setTripLog((l) => [entry, ...l]);
    onLogCatch(vessel.id, kg);
    if (!online) {
      try {
        const queue = JSON.parse(localStorage.getItem("tidewatch_offline_queue") || "[]");
        queue.push({ type: "catch", vesselId: vessel.id, ...entry });
        localStorage.setItem("tidewatch_offline_queue", JSON.stringify(queue));
        setPendingOffline(queue.length);
      } catch {}
    }
    setWeight("");
  };
  const catchKeyDown = (e) => { if (e.key === "Enter") submitCatch(e); };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditSpecies(entry.species);
    setEditWeight(String(entry.kg));
  };
  const cancelEdit = () => setEditingId(null);
  const saveEdit = (id) => {
    const newKg = parseFloat(editWeight);
    if (!newKg || newKg <= 0) return;
    setTripLog((l) => l.map((c) => {
      if (c.id !== id) return c;
      const delta = newKg - c.kg;
      if (delta !== 0) onLogCatch(vessel.id, delta);
      return { ...c, species: editSpecies, kg: newKg };
    }));
    setEditingId(null);
  };
  const removeCatch = (entry) => {
    setTripLog((l) => l.filter((c) => c.id !== entry.id));
    onLogCatch(vessel.id, -entry.kg);
    if (editingId === entry.id) setEditingId(null);
  };

  const myAlerts = [];
  if (vessel.fuel < 20) myAlerts.push({ sev: "warn", text: `Fuel low: ${vessel.fuel}% remaining. Consider heading back to port.` });
  if (vessel.geofence === "breach") myAlerts.push({ sev: "bad", text: "You have entered a restricted fishing zone (R-3)." });
  if (vessel.catchKg >= vessel.quotaKg) myAlerts.push({ sev: "bad", text: `Trip quota reached for ${vessel.species} (${vessel.catchKg}/${vessel.quotaKg}kg).` });
  if (!myAlerts.length) myAlerts.push({ sev: "ok", text: "All systems normal. Good conditions for fishing." });

  const quotaPct = Math.min(100, Math.round((vessel.catchKg / vessel.quotaKg) * 100));
  const safetyCheck = computeSafetyCheck({
    vessel,
    request,
    safetyCount: tripInfo?.safetyEquipment?.length ?? SAFETY_EQUIPMENT.length,
    contactOk: !!tripInfo?.emergencyContact?.phone || !tripInfo,
  });

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.bg, color: C.fog, minHeight: "100vh" }}>
      <FontLoader />

      {/* top bar — mirrors the government console for a consistent, professional feel */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 22px", borderBottom: `1px solid ${C.border}`, background: C.panelAlt, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 5, background: `${C.teal}18`, border: `1px solid ${C.teal}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Anchor size={16} color={C.teal} />
          </div>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, letterSpacing: "0.04em", lineHeight: 1.1 }}>{vessel.name}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: C.fogDim }}>{vessel.id} · Capt. {vessel.captain}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <MiniStat icon={Fuel} label={t("fuel")} value={vessel.fuel} unit="%" tone={vessel.fuel < 20 ? "bad" : vessel.fuel < 45 ? "warn" : "ok"} />
          <MiniStat icon={TrendingUp} label={t("sustainability")} value={vessel.sustainability} unit="/100" tone={vessel.sustainability < 60 ? "bad" : vessel.sustainability < 80 ? "warn" : "ok"} />
          <MiniStat icon={Fish} label="Catch" value={`${quotaPct}%`} unit={t("ofQuota")} tone={quotaPct >= 100 ? "bad" : quotaPct >= 80 ? "warn" : "ok"} />
          <div style={{ fontFamily: FONT_MONO, fontSize: 11.5, color: C.fogDim, borderLeft: `1px solid ${C.border}`, paddingLeft: 16 }}>
            {clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <StatusPill tone={online ? "ok" : "warn"}>{online ? "Online" : `Offline · ${pendingOffline} queued`}</StatusPill>
          <LanguageSwitcher lang={lang} setLang={setLang} dark />
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: `1px solid ${C.border}`, color: C.fogDim, borderRadius: 4, padding: "7px 12px", fontSize: 12, cursor: "pointer" }}>
            <LogOut size={13} /> {t("signOut")}
          </button>
        </div>
      </div>

      {/* persistent sail-approval banner — visible regardless of active tab */}
      {request && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap",
          padding: "9px 16px",
          borderBottom: `1px solid ${request.status === "approved" ? C.teal + "44" : request.status === "denied" ? C.coral + "44" : C.amberDim}`,
          background: request.status === "approved" ? "rgba(51,214,192,0.06)" : request.status === "denied" ? "rgba(232,96,76,0.06)" : "rgba(232,163,61,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: request.status === "approved" ? C.teal : request.status === "denied" ? C.coral : C.amber, fontSize: 12 }}>
            {request.status === "approved" && <><CheckCircle2 size={14} /> {t("cleared")} {request.officerId || "Fisheries Dept."}</>}
            {request.status === "denied" && <><XCircle size={14} /> {t("denied")}{request.reason ? `: ${request.reason}` : ""}</>}
            {request.status === "pending" && <><Hourglass size={14} /> {t("awaitingApproval")}</>}
            <SpeakButton
              text={
                request.status === "approved" ? `${t("cleared")} ${request.officerId || "Fisheries Department"}` :
                request.status === "denied" ? `${t("denied")}${request.reason ? `. ${request.reason}` : ""}` :
                t("awaitingApproval")
              }
              lang={lang}
            />
          </div>
          {request.status === "denied" && (
            <button onClick={onResubmitRequest} style={{ padding: "5px 12px", borderRadius: 4, border: `1px solid ${C.coral}`, background: "none", color: C.coral, fontSize: 11, cursor: "pointer" }}>
              {t("resubmitRequest")}
            </button>
          )}
        </div>
      )}

      {/* tab navigation */}
      <div style={{ display: "flex", gap: 4, padding: "10px 22px 0", borderBottom: `1px solid ${C.border}`, background: C.panelAlt, flexWrap: "wrap" }}>
        {FISHERMAN_TABS.map((tabItem) => {
          const active = tab === tabItem.id;
          return (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              style={{
                display: "flex", alignItems: "center", gap: 7, padding: "10px 16px", border: "none", cursor: "pointer",
                background: "transparent", color: active ? C.amber : C.fogDim, fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500,
                borderBottom: active ? `2px solid ${C.amber}` : "2px solid transparent", marginBottom: -1,
              }}
            >
              <tabItem.icon size={14} /> {t(tabItem.key)}
            </button>
          );
        })}
      </div>

      <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16, maxWidth: 1100, margin: "0 auto" }}>
        {tab === "overview" && (
          <>
            <SafetyVerdictBanner check={safetyCheck} lang={lang} title="CAN I SAFELY GO TO SEA?" />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
              <button onClick={() => setTab("overview")} style={{ padding: "14px 12px", border: `1px solid ${C.teal}55`, background: `${C.teal}10`, color: C.teal, borderRadius: 5, fontWeight: 700, cursor: "pointer" }}><Navigation size={15} style={{verticalAlign:"middle",marginRight:6}}/>TRIP STATUS</button>
              <button onClick={() => setTab("catch")} style={{ padding: "14px 12px", border: `1px solid ${C.border}`, background: C.panel, color: C.fog, borderRadius: 5, fontWeight: 700, cursor: "pointer" }}><Fish size={15} style={{verticalAlign:"middle",marginRight:6}}/>LOG CATCH</button>
              <button onClick={() => onSOS && onSOS(vessel)} style={{ padding: "14px 12px", border: `1px solid ${C.coral}`, background: `${C.coral}12`, color: C.coral, borderRadius: 5, fontWeight: 800, cursor: "pointer" }}><LifeBuoy size={15} style={{verticalAlign:"middle",marginRight:6}}/>SOS</button>
              <button onClick={() => speak(myAlerts[0]?.text || "All systems normal", lang)} style={{ padding: "14px 12px", border: `1px solid ${C.amber}66`, background: `${C.amber}10`, color: C.amber, borderRadius: 5, fontWeight: 700, cursor: "pointer" }}><Volume2 size={15} style={{verticalAlign:"middle",marginRight:6}}/>LISTEN TO ALERT</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <Panel title={t("myVessel")} icon={Compass}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Row label="GPS Position" value={`${vessel.lat.toFixed(4)}°N, ${vessel.lon.toFixed(4)}°E`} mono />
                  <Row label="Speed" value={`${vessel.speed} kn`} mono />
                  <Row label={t("heading")} value={`${vessel.heading}°`} mono />
                  <Row label="Zone Status" value={vessel.geofence === "breach" ? <StatusPill tone="bad">Restricted Zone</StatusPill> : <StatusPill tone="ok">Within Bounds</StatusPill>} />
                </div>
              </Panel>

              <Panel title={t("engineFuel")} icon={Cpu}>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  <Gauge90 value={vessel.fuel} label={t("fuel")} unit="%" color={vessel.fuel < 20 ? C.coral : C.teal} size={100} />
                  <Gauge90 value={vessel.engineTemp} max={120} label="Engine °C" unit="" color={vessel.engineTemp > 90 ? C.coral : C.amber} size={100} />
                </div>
              </Panel>

              <Panel title={t("mySustainabilityScore")} icon={TrendingUp}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Gauge90 value={vessel.sustainability} label="Score" unit="/100" color={vessel.sustainability < 60 ? C.coral : vessel.sustainability < 80 ? C.amber : C.teal} size={100} />
                </div>
              </Panel>
            </div>

            <Panel
              title="Live TideWatch AI / ML Intelligence"
              icon={Cpu}
              right={
                mlData?.loading
                  ? <StatusPill tone="warn">Analyzing</StatusPill>
                  : mlData?.error
                  ? <StatusPill tone="bad">API Error</StatusPill>
                  : <StatusPill tone="ok">Backend ML Live</StatusPill>
              }
            >
              {mlData?.error ? (
                <div style={{ color: C.coral, fontSize: 12 }}>{mlData.error}</div>
              ) : mlData?.loading ? (
                <div style={{ color: C.fogDim, fontSize: 12 }}>Running TideWatch ML models...</div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
                  <div style={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 4, padding: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <Fuel size={16} color={C.teal} />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>Fuel Prediction</span>
                    </div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 24, color: C.teal, fontWeight: 700 }}>
                      {mlData?.fuel?.predictedFuelConsumedPct ?? "—"}%
                    </div>
                    <div style={{ fontSize: 10.5, color: C.fogDim, marginTop: 4 }}>Predicted fuel consumption</div>
                    <div style={{ fontSize: 11.5, color: C.fog, lineHeight: 1.5, marginTop: 10 }}>
                      Remaining after trip: <b>{mlData?.fuel?.expectedRemainingFuelPct ?? "—"}%</b>
                    </div>
                    <div style={{ fontSize: 10.5, color: C.fogDim, lineHeight: 1.45, marginTop: 8 }}>
                      {mlData?.fuel?.returnToPortRecommendation || "Waiting for prediction."}
                    </div>
                  </div>

                  <div style={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 4, padding: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <Thermometer size={16} color={mlData?.engine?.engineRisk === "HIGH" ? C.coral : C.amber} />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>Engine Risk</span>
                    </div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 24, color: mlData?.engine?.engineRisk === "HIGH" ? C.coral : mlData?.engine?.engineRisk === "MEDIUM" ? C.amber : C.teal, fontWeight: 700 }}>
                      {mlData?.engine?.engineRisk || "—"}
                    </div>
                    <div style={{ fontSize: 10.5, color: C.fogDim, marginTop: 4 }}>
                      Confidence: {mlData?.engine?.confidence != null ? `${Math.round(mlData.engine.confidence * 100)}%` : "—"}
                    </div>
                    <div style={{ fontSize: 10.5, color: C.fogDim, lineHeight: 1.45, marginTop: 10 }}>
                      {(mlData?.engine?.contributingFactors || []).slice(0, 2).join(" · ") || "No elevated factors."}
                    </div>
                  </div>

                  <div style={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 4, padding: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <TrendingUp size={16} color={C.teal} />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>Sustainability</span>
                    </div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 24, color: (mlData?.sustainability?.total ?? 0) >= 80 ? C.teal : C.amber, fontWeight: 700 }}>
                      {mlData?.sustainability?.total ?? "—"}<span style={{ fontSize: 12, color: C.fogDim }}>/100</span>
                    </div>
                    <div style={{ fontSize: 10.5, color: C.fogDim, marginTop: 4 }}>Explainable sustainability score</div>
                    <div style={{ fontSize: 10.5, color: C.fogDim, lineHeight: 1.45, marginTop: 10 }}>
                      {mlData?.sustainability?.summaryLine || "Waiting for score."}
                    </div>
                  </div>
                </div>
              )}
              <div style={{ marginTop: 10, fontSize: 9.5, color: C.fogDim }}>
                Decision support only · predictions are returned live from the TideWatch backend ML endpoints.
              </div>
            </Panel>

            <Panel title="Live GPS / Fishing Zone Map" icon={MapPin} right={<StatusPill tone={vessel.geofence === "breach" ? "bad" : "ok"}>{vessel.geofence === "breach" ? "Zone Alert" : "Tracking"}</StatusPill>}>
              <LiveOperationsMap fleet={[vessel]} selectedId={vessel.id} sosId={null} compact />
            </Panel>

            <Panel title={t("currentTrip")} icon={Navigation}>
              {tripInfo ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                  <MiniStat icon={Navigation} label={t("heading")} value={directionLabelMap[tripInfo.direction] || tripInfo.direction} unit="" />
                  <MiniStat icon={Clock} label={t("entry")} value={formatTime12(tripInfo.entryTime)} unit="" />
                  <MiniStat icon={Clock} label={t("returnLabel")} value={formatTime12(tripInfo.returnTime)} unit="" />
                  <MiniStat icon={Fuel} label={t("fuel")} value={tripInfo.fuelLevel} unit="%" />
                </div>
              ) : (
                <div style={{ fontSize: 12, color: C.fogDim }}>{t("noTripLoggedToday")}</div>
              )}
            </Panel>
          </>
        )}

        {tab === "catch" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
            <Panel title={t("logACatch")} icon={Plus}>
              <div onKeyDown={catchKeyDown} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Field label={t("species")}>
                  <select value={species} onChange={(e) => setSpecies(e.target.value)} style={selectStyle}>
                    {SPECIES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label={t("weightKg")}>
                  <input type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 12.5" style={inputStyle} />
                </Field>
                <button onClick={submitCatch} style={{ padding: "10px 16px", borderRadius: 4, border: "none", background: C.teal, color: "#081420", fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  {t("addToTripLog")}
                </button>

                <div style={{ marginTop: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: C.fogDim }}>{t("tripQuotaProgress")}</span>
                    <span style={{ fontFamily: FONT_MONO, color: C.fogDim }}>{vessel.catchKg}/{vessel.quotaKg} kg</span>
                  </div>
                  <div style={{ height: 7, background: C.panelAlt, borderRadius: 99, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                    <div style={{ width: `${quotaPct}%`, height: "100%", background: vessel.catchKg >= vessel.quotaKg ? C.coral : C.teal }} />
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title={t("myTripCatchLog")} icon={Fish}>
              {tripLog.length === 0 ? (
                <div style={{ fontSize: 12, color: C.fogDim }}>{t("noCatchesYet")}</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto" }}>
                  {tripLog.map((c) => (
                    editingId === c.id ? (
                      <div key={c.id} style={{ display: "flex", flexDirection: "column", gap: 8, padding: "10px", background: C.panelAlt, borderRadius: 3, border: `1px solid ${C.teal}` }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <select value={editSpecies} onChange={(e) => setEditSpecies(e.target.value)} style={{ ...selectStyle, flex: 1.2, fontSize: 12 }}>
                            {SPECIES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <input
                            type="number" min="0" step="0.1" value={editWeight}
                            onChange={(e) => setEditWeight(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") saveEdit(c.id); if (e.key === "Escape") cancelEdit(); }}
                            style={{ ...inputStyle, width: 90, fontSize: 12 }}
                          />
                        </div>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          <button onClick={() => saveEdit(c.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 3, border: "none", background: C.teal, color: "#081420", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                            <Save size={12} /> Save
                          </button>
                          <button onClick={cancelEdit} style={{ padding: "6px 12px", borderRadius: 3, border: `1px solid ${C.border}`, background: "none", color: C.fogDim, fontSize: 11, cursor: "pointer" }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: C.panelAlt, borderRadius: 3, border: `1px solid ${C.border}`, fontSize: 12 }}>
                        <span>{c.species}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontFamily: FONT_MONO, color: C.fogDim }}>{c.kg} kg · {c.time}</span>
                          <button onClick={() => startEdit(c)} title="Edit" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 3, border: `1px solid ${C.border}`, background: "none", color: C.fogDim, cursor: "pointer" }}>
                            <Pencil size={11} />
                          </button>
                          <button onClick={() => removeCatch(c)} title="Remove" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 3, border: `1px solid ${C.coral}55`, background: "none", color: C.coral, cursor: "pointer" }}>
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </Panel>
          </div>
        )}

        {tab === "docs" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Panel title={t("vesselRegistration")} icon={FileCheck2}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Row label={t("fishingLicense")} value={userMeta?.licenseFileName ? <StatusPill tone="ok">{userMeta.licenseFileName}</StatusPill> : <StatusPill tone="warn">Not uploaded</StatusPill>} />
                <Row label={t("vesselId")} value={vessel.id} mono />
                <Row label="MMSI / AIS ID" value={vessel.mmsi} mono />
              </div>
            </Panel>

            <Panel title={t("previousTripOnFile")} icon={Fish}>
              {userMeta?.previousTrip ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Row label={t("tripDate")} value={userMeta.previousTrip.date} mono />
                  <Row label="Species & Catch" value={`${userMeta.previousTrip.species} · ${userMeta.previousTrip.catchKg}kg`} />
                  <Row label={t("tripDuration")} value={userMeta.previousTrip.duration} />
                </div>
              ) : (
                <div style={{ fontSize: 12, color: C.fogDim }}>{t("noTripDetailsOnFile")}</div>
              )}
            </Panel>

            <Panel title={t("currentTripDetails")} icon={Navigation} style={{ gridColumn: "1 / -1" }}>
              {tripInfo ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Row label={t("fishingZoneDirection")} value={directionLabelMap[tripInfo.direction] || tripInfo.direction} />
                  <Row label={t("seaEntryTime")} value={formatTime12(tripInfo.entryTime)} mono />
                  <Row label={t("expectedReturnTime")} value={formatTime12(tripInfo.returnTime)} mono />
                  <Row label={t("fuelLevelDeparture")} value={`${tripInfo.fuelLevel}%`} mono />
                </div>
              ) : (
                <div style={{ fontSize: 12, color: C.fogDim }}>{t("noTripLoggedToday")}</div>
              )}
            </Panel>
          </div>
        )}

        {tab === "alerts" && (
          <>
            <Panel title={t("alertsForVessel")} icon={Bell}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {myAlerts.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "9px 10px", background: C.panelAlt, borderRadius: 3, border: `1px solid ${C.border}`, alignItems: "center" }}>
                    {a.sev === "bad" ? <AlertTriangle size={15} color={C.coral} /> : a.sev === "warn" ? <AlertTriangle size={15} color={C.amber} /> : <CheckCircle2 size={15} color={C.teal} />}
                    <span style={{ fontSize: 12, flex: 1 }}>{a.text}</span>
                    <SpeakButton text={a.text} lang={lang} />
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title={t("seaConditions")} icon={Waves}>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <MiniStat icon={Waves} label="Wave Height" value="0.9" unit="m" />
                <MiniStat icon={Wind} label="Wind Speed" value="13" unit="kn" />
                <MiniStat icon={CloudRain} label="Visibility" value="8.2" unit="km" />
              </div>
            </Panel>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   GOVERNMENT DASHBOARD (full fleet ops console)
---------------------------------------------------------------- */
const SECTIONS = [
  { id: "fleet", label: "Live Map & Fleet", icon: RadarIcon },
  { id: "vessel", label: "Vessel Console", icon: Anchor },
  { id: "approvals", label: "Approval Requests", icon: ShieldQuestion },
  { id: "weather", label: "Weather & Safety", icon: CloudRain },
  { id: "ai", label: "AI Intelligence", icon: Cpu },
  { id: "catch", label: "Catch & Sustainability", icon: Fish },
  { id: "compliance", label: "Compliance", icon: ShieldCheck },
  { id: "analytics", label: "Decision Analytics", icon: TrendingUp },
  { id: "replay", label: "Trip Replay", icon: Play },
  { id: "documents", label: "Document Expiry", icon: FileCheck2 },
  { id: "cooperative", label: "Cooperative Network", icon: Users },
];

function GovernmentDashboard({ fleet, setFleet, officer, approvalRequests, onDecideRequest, onLogout, mlData, sosEvents = [], onDispatchSOS }) {
  const [selectedId, setSelectedId] = useState(fleet[0].id);
  const [section, setSection] = useState("fleet");
  const [clock, setClock] = useState(new Date());
  const [alerts, setAlerts] = useState([
    { id: 1, sev: "bad", text: "TV-441 crossed geofence boundary — restricted zone R-3", time: "2 min ago" },
    { id: 2, sev: "warn", text: "TV-217 approaching catch quota limit (102%)", time: "9 min ago" },
    { id: 3, sev: "warn", text: "TV-441 fuel below 20% reserve threshold", time: "14 min ago" },
    { id: 4, sev: "ok", text: "TV-330 catch log synced — Tuna 210kg logged", time: "22 min ago" },
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      setFleet((prev) => prev.map((v) => ({
        ...v,
        lat: jitter(v.lat, 0.004, 7.6, 8.7),
        lon: jitter(v.lon, 0.004, 77.2, 78.2),
        speed: +jitter(v.speed, 0.6, 0, 14).toFixed(1),
        heading: Math.round(jitter(v.heading, 6, 0, 359)),
        fuel: +jitter(v.fuel, 0.4, 4, 100).toFixed(0),
        engineTemp: Math.round(jitter(v.engineTemp, 1, 70, 99)),
        battery: Math.round(jitter(v.battery, 0.5, 10, 100)),
      })));
    }, 3000);
    const clockT = setInterval(() => setClock(new Date()), 1000);
    return () => { clearInterval(t); clearInterval(clockT); };
  }, [setFleet]);

  const selected = fleet.find((v) => v.id === selectedId) || fleet[0];
  const fleetAvgSustain = Math.round(fleet.reduce((a, v) => a + v.sustainability, 0) / fleet.length);
  const breaches = fleet.filter((v) => v.geofence === "breach").length;
  const violations = fleet.filter((v) => v.compliance === "violation").length;

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.bg, color: C.fog, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <FontLoader />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 22px", borderBottom: `1px solid ${C.border}`, background: C.panelAlt, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 4, background: "linear-gradient(135deg,#123349,#0B2033)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Compass size={16} color={C.amber} />
          </div>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, letterSpacing: "0.06em", lineHeight: 1 }}>TIDEWATCH</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 9.5, color: C.fogDim, letterSpacing: "0.08em" }}>GOVERNMENT / REGULATORY CONSOLE</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
          <MiniStat icon={Signal} label="Vessels Online" value={fleet.length} unit="" />
          <MiniStat icon={ShieldAlert} label="Geofence Breaches" value={breaches} unit="" tone={breaches ? "bad" : "ok"} />
          <MiniStat icon={TrendingUp} label="Fleet Sustainability" value={fleetAvgSustain} unit="/100" tone={fleetAvgSustain < 60 ? "bad" : fleetAvgSustain < 80 ? "warn" : "ok"} />
          <div style={{ fontFamily: FONT_MONO, fontSize: 12.5, color: C.fogDim, borderLeft: `1px solid ${C.border}`, paddingLeft: 18 }}>
            {clock.toUTCString().slice(17, 25)} UTC
          </div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.fogDim }}>{officer.officerId}</div>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: `1px solid ${C.border}`, color: C.fogDim, borderRadius: 4, padding: "6px 11px", fontSize: 12, cursor: "pointer" }}>
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </div>


      <div style={{ padding: "10px 20px", borderBottom: `1px solid ${C.border}`, background: "rgba(232,96,76,.035)", display: "flex", gap: 10, overflowX: "auto" }}>
        {[
          { sev: "bad", title: "CRITICAL", vessel: "TV-441", text: "Restricted zone violation · Fuel 15% · Engine 94°C" },
          { sev: "warn", title: "WARNING", vessel: "TV-217", text: "Quota exceeded · manual catch review required" },
          ...(sosEvents.length ? [{ sev: "bad", title: "SOS RECEIVED", vessel: sosEvents[0].vesselId, text: `${sosEvents[0].nearestPatrol.id} recommended · ETA ${sosEvents[0].etaMin} min` }] : [])
        ].map((a,i)=><div key={`${a.title}-${i}`} style={{ minWidth: 300, padding: "9px 11px", borderRadius: 4, border: `1px solid ${a.sev==="bad"?C.coral+"55":C.amber+"55"}`, background: a.sev==="bad"?"rgba(232,96,76,.07)":"rgba(232,163,61,.06)" }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: a.sev==="bad"?C.coral:C.amber }}>{a.title} · {a.vessel}</div>
          <div style={{ fontSize: 11.5, marginTop: 3 }}>{a.text}</div>
        </div>)}
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ width: 208, borderRight: `1px solid ${C.border}`, background: C.panelAlt, padding: "18px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
          {SECTIONS.map((s) => {
            const active = section === s.id;
            const pendingCount = s.id === "approvals" ? approvalRequests.filter((r) => r.status === "pending").length : 0;
            return (
              <button key={s.id} onClick={() => setSection(s.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 3, border: "none", cursor: "pointer", background: active ? "rgba(232,163,61,0.10)" : "transparent", color: active ? C.amber : C.fogDim, fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500, textAlign: "left", borderLeft: active ? `2px solid ${C.amber}` : "2px solid transparent" }}>
                <s.icon size={15} />
                {s.label}
                {pendingCount > 0 && (
                  <span style={{ marginLeft: "auto", fontFamily: FONT_MONO, fontSize: 10, background: C.coral, color: "#081420", borderRadius: 99, padding: "1px 6px", fontWeight: 700 }}>{pendingCount}</span>
                )}
                {active && pendingCount === 0 && <ChevronRight size={13} style={{ marginLeft: "auto" }} />}
              </button>
            );
          })}
          <div style={{ marginTop: 20, padding: "12px", borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 9.5, color: C.fogDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Active Alerts</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {alerts.slice(0, 3).map((a) => (
                <div key={a.id} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <div style={{ marginTop: 3, width: 5, height: 5, borderRadius: 99, background: a.sev === "bad" ? C.coral : a.sev === "warn" ? C.amber : C.teal, flexShrink: 0 }} />
                  <div style={{ fontSize: 10.5, lineHeight: 1.4, color: C.fogDim }}>{a.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {sosEvents.length > 0 && (
            <Panel title="Smart Patrol Dispatch" icon={LifeBuoy} right={<StatusPill tone="bad">CRITICAL SOS</StatusPill>}>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr auto", gap: 16, alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18 }}>{sosEvents[0].vesselId} · SOS RECEIVED</div>
                  <div style={{ fontSize: 11, color: C.fogDim, marginTop: 4 }}>Emergency position {sosEvents[0].lat.toFixed(4)}°N, {sosEvents[0].lon.toFixed(4)}°E</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.fogDim }}>Nearest patrol</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.teal }}>{sosEvents[0].nearestPatrol.id}</div>
                  <div style={{ fontSize: 10.5, color: C.fogDim }}>{sosEvents[0].distanceKm.toFixed(1)} km · ETA {sosEvents[0].etaMin} min</div>
                </div>
                <button onClick={() => onDispatchSOS && onDispatchSOS(sosEvents[0].id)} style={{ padding: "10px 14px", borderRadius: 4, border: "none", background: C.coral, color: "#fff", fontWeight: 800, cursor: "pointer" }}>Dispatch Patrol Vessel</button>
              </div>
            </Panel>
          )}
          {section === "fleet" && <FleetSection fleet={fleet} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setSection("vessel"); }} />}
          {section === "vessel" && <VesselSection fleet={fleet} selected={selected} onSelect={setSelectedId} />}
          {section === "approvals" && <ApprovalRequestsSection requests={approvalRequests} onDecide={onDecideRequest} />}
          {section === "weather" && <WeatherSection alerts={alerts} />}
          {section === "ai" && <AIIntelligenceSection mlData={mlData} />}
          {section === "catch" && <CatchSection fleet={fleet} />}
          {section === "compliance" && <ComplianceSection fleet={fleet} violations={violations} />}
          {section === "analytics" && <GovernmentAnalytics fleet={fleet} />}
          {section === "replay" && <TripReplaySection fleet={fleet} />}
          {section === "documents" && <DocumentExpiryIntelligence fleet={fleet} />}
          {section === "cooperative" && <CooperativeNetworkSection fleet={fleet} />}
        </div>
      </div>
    </div>
  );
}

function AIIntelligenceSection({ mlData }) {
  const anomalyFindings = mlData?.vesselAnomaly?.findings || [];
  const catchFindings = mlData?.catchAnomaly?.findings || [];

  const findingList = (items) => {
    if (!items.length) {
      return <div style={{ fontSize: 11.5, color: C.fogDim }}>No elevated findings returned.</div>;
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "9px 10px", background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 3 }}>
            <AlertTriangle size={14} color={f.severity === "high" ? C.coral : f.severity === "medium" ? C.amber : C.fogDim} style={{ marginTop: 1, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11.5, color: C.fog, lineHeight: 1.45 }}>{f.message}</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: C.fogDim, marginTop: 3 }}>
                {String(f.type || "finding").replaceAll("_", " ")}{f.zScore != null ? ` · z-score ${f.zScore}` : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        <Panel title="Fuel Forecast" icon={Fuel}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: C.teal }}>
            {mlData?.fuel?.predictedFuelConsumedPct ?? "—"}%
          </div>
          <div style={{ fontSize: 10.5, color: C.fogDim }}>Predicted consumption</div>
          <div style={{ fontSize: 11, color: C.fog, marginTop: 8 }}>
            Remaining: {mlData?.fuel?.expectedRemainingFuelPct ?? "—"}%
          </div>
        </Panel>

        <Panel title="Engine Risk" icon={Thermometer}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: mlData?.engine?.engineRisk === "HIGH" ? C.coral : mlData?.engine?.engineRisk === "MEDIUM" ? C.amber : C.teal }}>
            {mlData?.engine?.engineRisk || "—"}
          </div>
          <div style={{ fontSize: 10.5, color: C.fogDim }}>
            Confidence {mlData?.engine?.confidence != null ? `${Math.round(mlData.engine.confidence * 100)}%` : "—"}
          </div>
        </Panel>

        <Panel title="Vessel Anomaly" icon={RadarIcon}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700, color: mlData?.vesselAnomaly?.anomalous ? C.coral : C.teal }}>
            {mlData?.vesselAnomaly ? (mlData.vesselAnomaly.anomalous ? "REVIEW" : "NORMAL") : "—"}
          </div>
          <div style={{ fontSize: 10.5, color: C.fogDim, lineHeight: 1.4 }}>
            {mlData?.vesselAnomaly?.label || "Waiting for model result."}
          </div>
        </Panel>

        <Panel title="Catch Anomaly" icon={Fish}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700, color: mlData?.catchAnomaly?.requiresReview ? C.amber : C.teal }}>
            {mlData?.catchAnomaly ? (mlData.catchAnomaly.requiresReview ? "REVIEW" : "CLEAR") : "—"}
          </div>
          <div style={{ fontSize: 10.5, color: C.fogDim, lineHeight: 1.4 }}>
            {mlData?.catchAnomaly?.label || "Waiting for model result."}
          </div>
        </Panel>
      </div>

      {mlData?.error ? (
        <Panel title="ML Service Status" icon={ShieldAlert}>
          <div style={{ color: C.coral, fontSize: 12 }}>{mlData.error}</div>
        </Panel>
      ) : mlData?.loading ? (
        <Panel title="ML Service Status" icon={Activity}>
          <div style={{ color: C.fogDim, fontSize: 12 }}>Running backend ML inference...</div>
        </Panel>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Panel
            title="Movement Anomaly Findings"
            icon={Navigation}
            right={<StatusPill tone={mlData?.vesselAnomaly?.anomalous ? "bad" : "ok"}>{mlData?.vesselAnomaly?.anomalous ? "Human Review" : "No Alert"}</StatusPill>}
          >
            {findingList(anomalyFindings)}
            <div style={{ marginTop: 10, fontSize: 9.5, color: C.fogDim }}>
              Algorithm: {mlData?.vesselAnomaly?.algorithm || "—"}
            </div>
          </Panel>

          <Panel
            title="Catch / Quota Anomaly Findings"
            icon={Fish}
            right={<StatusPill tone={mlData?.catchAnomaly?.requiresReview ? "warn" : "ok"}>{mlData?.catchAnomaly?.requiresReview ? "Manual Review" : "Clear"}</StatusPill>}
          >
            {findingList(catchFindings)}
            <div style={{ marginTop: 10, fontSize: 9.5, color: C.fogDim }}>
              Algorithm: {mlData?.catchAnomaly?.algorithm || "—"}
            </div>
          </Panel>
        </div>
      )}

      <Panel title="Explainable AI Policy" icon={ShieldCheck}>
        <div style={{ fontSize: 11.5, color: C.fogDim, lineHeight: 1.6 }}>
          TideWatch ML outputs are decision-support signals. They surface fuel risk, equipment risk,
          movement anomalies, catch anomalies and sustainability indicators for human review.
          Regulatory or enforcement actions remain with authorized government officers.
        </div>
      </Panel>
    </div>
  );
}

function ApprovalRequestsSection({ requests, onDecide }) {
  const [denyingId, setDenyingId] = useState(null);
  const [reason, setReason] = useState("");

  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status !== "pending");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel title="Pending Sail Approval Requests" icon={ShieldQuestion} right={<StatusPill tone={pending.length ? "warn" : "ok"}>{pending.length} Pending</StatusPill>}>
        {pending.length === 0 ? (
          <div style={{ fontSize: 12, color: C.fogDim }}>No pending requests. All caught up.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pending.map((r) => (
              <div key={r.id} style={{ padding: "12px 14px", background: C.panelAlt, borderRadius: 3, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{r.vesselName} <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: C.fogDim }}>· {r.vesselId}</span></div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: C.fogDim, marginTop: 3 }}>
                      Dir {r.direction} · Entry {formatTime12(r.entryTime)} · Return {formatTime12(r.returnTime)} · Fuel {r.fuelLevel}%
                      {r.crewCount != null && <> · Crew {r.crewCount}</>}
                      {r.targetSpecies && <> · Target {r.targetSpecies}</>}
                    </div>
                    {(r.safetyEquipment || r.emergencyContact) && (
                      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.fogDim, marginTop: 4, display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {r.safetyEquipment && (
                          <span style={{ color: r.safetyEquipment.length >= SAFETY_EQUIPMENT.length ? C.teal : C.amber }}>
                            Safety {r.safetyEquipment.length}/{SAFETY_EQUIPMENT.length}
                          </span>
                        )}
                        {r.emergencyContact?.phone && <span>Contact {r.emergencyContact.name} · {r.emergencyContact.phone}</span>}
                      </div>
                    )}
                  </div>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: C.fogDim }}>Requested {r.requestedAt}</span>
                </div>

                {denyingId === r.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {DENY_REASONS.map((d) => (
                        <button
                          key={d}
                          onClick={() => setReason(d)}
                          style={{ padding: "4px 9px", borderRadius: 99, border: `1px solid ${C.border}`, background: reason === d ? "rgba(232,163,61,0.14)" : C.panel, color: reason === d ? C.amber : C.fogDim, fontSize: 10, cursor: "pointer" }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      <input
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Type the reason for denial..."
                        style={{ ...inputStyle, flex: 1, minWidth: 220, fontFamily: FONT_BODY }}
                      />
                      <button
                        onClick={() => { if (!reason.trim()) return; onDecide(r.id, "denied", reason.trim()); setDenyingId(null); setReason(""); }}
                        disabled={!reason.trim()}
                        style={{ padding: "8px 12px", borderRadius: 3, border: `1px solid ${C.coral}`, background: "rgba(232,96,76,0.12)", color: C.coral, fontSize: 11.5, cursor: reason.trim() ? "pointer" : "not-allowed", opacity: reason.trim() ? 1 : 0.5 }}
                      >
                        Confirm Deny
                      </button>
                      <button onClick={() => { setDenyingId(null); setReason(""); }} style={{ padding: "8px 12px", borderRadius: 3, border: `1px solid ${C.border}`, background: "none", color: C.fogDim, fontSize: 11.5, cursor: "pointer" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => onDecide(r.id, "approved")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 3, border: `1px solid ${C.teal}`, background: "rgba(51,214,192,0.12)", color: C.teal, fontSize: 11.5, cursor: "pointer" }}>
                      <CheckCircle2 size={13} /> Approve
                    </button>
                    <button onClick={() => { setDenyingId(r.id); setReason(""); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 3, border: `1px solid ${C.coral}`, background: "rgba(232,96,76,0.12)", color: C.coral, fontSize: 11.5, cursor: "pointer" }}>
                      <XCircle size={13} /> Deny
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Decision History" icon={FileCheck2}>
        {resolved.length === 0 ? (
          <div style={{ fontSize: 12, color: C.fogDim }}>No decisions recorded yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {resolved.map((r) => (
              <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: C.panelAlt, borderRadius: 3, border: `1px solid ${C.border}`, flexWrap: "wrap", gap: 6 }}>
                <div>
                  <span style={{ fontSize: 12 }}>{r.vesselName} <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.fogDim }}>· {r.vesselId}</span></span>
                  {r.reason && <div style={{ fontSize: 10.5, color: C.fogDim, marginTop: 2 }}>{r.reason}</div>}
                </div>
                {r.status === "approved" ? <StatusPill tone="ok">Approved</StatusPill> : <StatusPill tone="bad">Denied</StatusPill>}
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

function FleetSection({ fleet, selectedId, onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 16 }}>
      <Panel title="Live Maritime Operations Map" icon={MapPin} right={<StatusPill tone="ok">GPS / AIS Live</StatusPill>}>
        <LiveOperationsMap fleet={fleet} selectedId={selectedId} onSelect={onSelect} />
      </Panel>

      <Panel title="Fleet Roster" icon={Anchor}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.8fr 0.8fr 0.8fr 1fr 1fr", padding: "0 10px 6px", fontFamily: FONT_BODY, fontSize: 9.5, color: C.fogDim, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1px solid ${C.border}` }}>
            <span>Vessel</span><span>MMSI</span><span>Speed</span><span>Fuel</span><span>Sustain.</span><span>Geofence</span><span>Compliance</span>
          </div>
          {fleet.map((v) => (
            <div key={v.id} onClick={() => onSelect(v.id)} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.8fr 0.8fr 0.8fr 1fr 1fr", alignItems: "center", padding: "9px 10px", borderRadius: 3, cursor: "pointer", background: v.id === selectedId ? "rgba(232,163,61,0.08)" : "transparent", border: `1px solid ${v.id === selectedId ? C.amberDim : "transparent"}` }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{v.name}</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: C.fogDim }}>{v.id}</div>
              </div>
              <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.fogDim }}>{v.mmsi}</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 11.5 }}>{v.speed} kn</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 11.5, color: v.fuel < 20 ? C.coral : C.fog }}>{v.fuel}%</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 11.5, color: v.sustainability < 60 ? C.coral : v.sustainability < 80 ? C.amber : C.teal }}>{v.sustainability}</span>
              <span>{v.geofence === "breach" ? <StatusPill tone="bad">Breach</StatusPill> : <StatusPill tone="ok">Inside</StatusPill>}</span>
              <span>{v.compliance === "violation" ? <StatusPill tone="bad">Violation</StatusPill> : v.compliance === "review" ? <StatusPill tone="warn">Review</StatusPill> : <StatusPill tone="ok">Compliant</StatusPill>}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function VesselSection({ fleet, selected, onSelect }) {
  const v = selected;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {fleet.map((f) => (
          <button key={f.id} onClick={() => onSelect(f.id)} style={{ padding: "7px 14px", borderRadius: 3, border: `1px solid ${f.id === v.id ? C.amber : C.border}`, background: f.id === v.id ? "rgba(232,163,61,0.10)" : C.panel, color: f.id === v.id ? C.amber : C.fogDim, fontFamily: FONT_MONO, fontSize: 11, cursor: "pointer" }}>
            {f.id}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: 16 }}>
        <Panel title={`${v.name} — Vessel Identity`} icon={Anchor}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Row label="Captain" value={v.captain} />
            <Row label="MMSI / AIS ID" value={v.mmsi} mono />
            <Row label="GPS Position" value={`${v.lat.toFixed(4)}°N, ${v.lon.toFixed(4)}°E`} mono />
            <Row label="Heading" value={`${v.heading}°`} mono />
            <Row label="Speed Over Ground" value={`${v.speed} kn`} mono />
            <Row label="Geofence Status" value={v.geofence === "breach" ? <StatusPill tone="bad">Restricted Zone R-3</StatusPill> : <StatusPill tone="ok">Within Bounds</StatusPill>} />
          </div>
        </Panel>

        <Panel title="IoT Engine & Fuel Telemetry" icon={Cpu}>
          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 10 }}>
            <Gauge90 value={v.fuel} label="Fuel Level" unit="%" color={v.fuel < 20 ? C.coral : C.teal} />
            <Gauge90 value={v.engineTemp} max={120} label="Engine Temp" unit="°C" color={v.engineTemp > 90 ? C.coral : C.amber} />
            <Gauge90 value={v.battery} label="Battery" unit="%" color={C.teal} />
          </div>
        </Panel>

        <Panel title="Predictive AI Insight" icon={Activity}>
          <AIInsight v={v} />
        </Panel>
      </div>

      <Panel title="Catch Manifest — Current Trip" icon={Fish}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <MiniStat icon={Fish} label="Species" value={v.species} unit="" />
          <MiniStat icon={Gauge} label="Catch Weight" value={v.catchKg} unit="kg" tone={v.catchKg >= v.quotaKg ? "bad" : "ok"} />
          <MiniStat icon={ShieldCheck} label="Trip Quota" value={v.quotaKg} unit="kg" />
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ height: 8, background: C.panelAlt, borderRadius: 99, overflow: "hidden", border: `1px solid ${C.border}` }}>
              <div style={{ width: `${Math.min(100, (v.catchKg / v.quotaKg) * 100)}%`, height: "100%", background: v.catchKg >= v.quotaKg ? C.coral : C.teal }} />
            </div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.fogDim, marginTop: 4 }}>
              {Math.round((v.catchKg / v.quotaKg) * 100)}% OF QUOTA LOGGED
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function AIInsight({ v }) {
  const lines = [];
  if (v.fuel < 20) lines.push(`Fuel reserve critical — recommend return-to-port routing within 2.5 hrs at current burn rate.`);
  if (v.geofence === "breach") lines.push(`Vessel entered restricted zone R-3. Auto-flagged for fisheries authority review.`);
  if (v.catchKg >= v.quotaKg) lines.push(`Trip quota reached for ${v.species}. Continued catch may trigger compliance violation.`);
  if (v.sustainability < 65) lines.push(`Sustainability score trending down — species mix suggests high juvenile bycatch ratio this trip.`);
  if (lines.length === 0) lines.push(`All systems nominal. Catch composition and route are within sustainable operating parameters.`);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {lines.map((l, i) => (
        <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, lineHeight: 1.5, color: C.fogDim }}>
          <span style={{ color: C.amber }}>▸</span><span>{l}</span>
        </div>
      ))}
    </div>
  );
}

function WeatherSection({ alerts }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
      <Panel title="Sea State — Last 24 Hours" icon={Waves}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={waveHistory}>
            <defs>
              <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.teal} stopOpacity={0.35} /><stop offset="100%" stopColor={C.teal} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={C.border} strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="t" tick={{ fill: C.fogDim, fontSize: 10, fontFamily: FONT_MONO }} axisLine={{ stroke: C.border }} tickLine={false} />
            <YAxis tick={{ fill: C.fogDim, fontSize: 10, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={{ background: C.panelAlt, border: `1px solid ${C.border}`, fontFamily: FONT_MONO, fontSize: 11 }} labelStyle={{ color: C.fogDim }} />
            <Area type="monotone" dataKey="waveM" stroke={C.teal} fill="url(#waveFill)" strokeWidth={2} name="Wave height (m)" />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 24, marginTop: 6 }}>
          <MiniStat icon={Waves} label="Wave Height" value="0.9" unit="m" />
          <MiniStat icon={Wind} label="Wind Speed" value="13" unit="kn" />
          <MiniStat icon={CloudRain} label="Visibility" value="8.2" unit="km" />
        </div>
      </Panel>

      <Panel title="Safety Alert Feed" icon={Bell}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {alerts.map((a) => (
            <div key={a.id} style={{ display: "flex", gap: 10, padding: "9px 10px", background: C.panelAlt, borderRadius: 3, border: `1px solid ${C.border}` }}>
              {a.sev === "bad" ? <AlertTriangle size={15} color={C.coral} style={{ flexShrink: 0, marginTop: 1 }} /> : a.sev === "warn" ? <AlertTriangle size={15} color={C.amber} style={{ flexShrink: 0, marginTop: 1 }} /> : <CheckCircle2 size={15} color={C.teal} style={{ flexShrink: 0, marginTop: 1 }} />}
              <div>
                <div style={{ fontSize: 12, lineHeight: 1.4 }}>{a.text}</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: C.fogDim, marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function CatchSection({ fleet }) {
  const speciesTotals = SPECIES.map((sp) => ({ species: sp, kg: fleet.filter((v) => v.species === sp).reduce((a, v) => a + v.catchKg, 0) }));
  const avgScore = Math.round(fleet.reduce((a, v) => a + v.sustainability, 0) / fleet.length);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 16 }}>
      <Panel title="Fleet Sustainability Score" icon={TrendingUp}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
          <Gauge90 value={avgScore} label="Composite Score" unit="/100" color={avgScore < 60 ? C.coral : avgScore < 80 ? C.amber : C.teal} size={150} />
        </div>
        <div style={{ fontSize: 11.5, color: C.fogDim, lineHeight: 1.6 }}>
          Score weighs bycatch ratio, quota adherence, gear selectivity, and protected-zone compliance across the fleet's last 10 trips.
        </div>
      </Panel>

      <Panel title="Catch Log by Species" icon={Fish}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {speciesTotals.map((s) => (
            <div key={s.species}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 4 }}>
                <span>{s.species}</span><span style={{ fontFamily: FONT_MONO, color: C.fogDim }}>{s.kg} kg</span>
              </div>
              <div style={{ height: 6, background: C.panelAlt, borderRadius: 99, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (s.kg / 600) * 100)}%`, height: "100%", background: C.brass }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Vessel Sustainability Ranking" icon={ShieldCheck} style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {[...fleet].sort((a, b) => b.sustainability - a.sustainability).map((v) => (
            <div key={v.id} style={{ textAlign: "center", padding: "12px 8px", background: C.panelAlt, borderRadius: 3, border: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 600, color: v.sustainability < 60 ? C.coral : v.sustainability < 80 ? C.amber : C.teal }}>{v.sustainability}</div>
              <div style={{ fontSize: 11, marginTop: 2 }}>{v.name}</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: C.fogDim }}>{v.id}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ComplianceSection({ fleet, violations }) {
  const checklist = [
    { label: "Fishing license current", key: "license" },
    { label: "Catch quota within limits", key: "quota" },
    { label: "No restricted-zone entries (30d)", key: "zone" },
    { label: "AIS transponder active", key: "ais" },
    { label: "Catch log submitted (last trip)", key: "log" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
      <Panel title="Fleet Regulatory Compliance" icon={FileCheck2} right={violations > 0 ? <StatusPill tone="bad">{violations} Vessel{violations > 1 ? "s" : ""} Flagged</StatusPill> : <StatusPill tone="ok">Fleet Compliant</StatusPill>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(5, 1fr)", padding: "0 10px 6px", fontFamily: FONT_BODY, fontSize: 9.5, color: C.fogDim, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1px solid ${C.border}` }}>
            <span>Vessel</span>{checklist.map((c) => <span key={c.key}>{c.label}</span>)}
          </div>
          {fleet.map((v) => {
            const cells = [true, v.catchKg < v.quotaKg, v.geofence !== "breach", true, v.compliance !== "review"];
            return (
              <div key={v.id} style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(5, 1fr)", alignItems: "center", padding: "10px", borderRadius: 3, background: C.panelAlt, border: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>{v.name}</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: C.fogDim }}>{v.id}</div>
                </div>
                {cells.map((ok, i) => <span key={i}>{ok ? <CheckCircle2 size={16} color={C.teal} /> : <XCircle size={16} color={C.coral} />}</span>)}
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="Regulatory Notes" icon={ShieldAlert}>
        <div style={{ fontSize: 12, lineHeight: 1.7, color: C.fogDim }}>
          Compliance is evaluated against Tamil Nadu Marine Fisheries Regulation zoning, seasonal trawl bans, and species-level
          minimum legal size and quota rules. Flagged vessels are automatically queued for Fisheries Department review, and
          repeated violations affect the vessel's sustainability score and license renewal standing.
        </div>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   TOP-LEVEL APP — routes between hero, login, and the two portals
---------------------------------------------------------------- */
export default function TideWatchApp() {
  const [route, setRoute] = useState({ page: "hero" });
  const [fleet, setFleet] = useState(initialFleet);
  const [registeredUsers, setRegisteredUsers] = useState(
    initialFleet.map((v) => ({ vesselId: v.id, vesselName: v.name, captainName: v.captain, username: v.id, password: v.password, licenseFileName: null, previousTrip: null }))
  );
  const [tripInfos, setTripInfos] = useState({}); // { [vesselId]: { direction, entryTime, returnTime, fuelLevel } }
  const [approvalRequests, setApprovalRequests] = useState([]); // [{ id, vesselId, vesselName, direction, entryTime, returnTime, fuelLevel, status, reason, requestedAt, officerId }]
  const [session, setSession] = useState(null); // { role, vesselId, username } | { role, officerId }
  const [lang, setLang] = useState("en");

  // Real ML results returned by the TideWatch backend.
  const [mlData, setMlData] = useState({
    fuel: null,
    engine: null,
    sustainability: null,
    vesselAnomaly: null,
    catchAnomaly: null,
    loading: false,
    error: null,
  });

  const [sosEvents, setSosEvents] = useState([]);

  const handleSOS = (vessel) => {
    const nearest = PATROL_VESSELS
      .map((p) => ({ ...p, distanceKm: haversineKm({ lat: vessel.lat, lon: vessel.lon }, p) }))
      .sort((a, b) => a.distanceKm - b.distanceKm)[0];
    const etaMin = Math.max(4, Math.round((nearest.distanceKm / (nearest.speedKn * 1.852)) * 60));
    const event = {
      id: Date.now(),
      vesselId: vessel.id,
      vesselName: vessel.name,
      lat: vessel.lat,
      lon: vessel.lon,
      nearestPatrol: nearest,
      distanceKm: nearest.distanceKm,
      etaMin,
      status: "open",
    };
    setSosEvents((prev) => [event, ...prev]);
    alert(`SOS sent to Government Command Centre. Nearest patrol: ${nearest.id} · ETA ${etaMin} min`);
  };

  const handleDispatchSOS = (id) => {
    setSosEvents((prev) => prev.map((e) => e.id === id ? { ...e, status: "dispatched" } : e));
  };

  const runMlDemo = async () => {
    setMlData((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const [
        fuel,
        engine,
        sustainability,
        vesselAnomaly,
        catchAnomaly,
      ] = await Promise.all([
        api.fuelPrediction({
          distanceNm: 25,
          avgSpeedKn: 8,
          payloadKg: 300,
          waveHeightM: 1.2,
          windKn: 14,
          currentFuelPct: 70,
        }),
        api.engineRisk({
          engineTempC: 92,
          batteryPct: 45,
          fuelBurnRate: 12,
          vibrationIndex: 0.4,
        }),
        api.sustainabilityScore({
          catchKg: 320,
          quotaKg: 500,
          geofenceBreachesLast30d: 0,
          juvenileCatchRatio: 0.05,
          bycatchRatio: 0.08,
          gearSelectivityOk: true,
        }),
        api.vesselAnomaly({
          history: [
            { speedKn: 7.8, headingDeltaDeg: 4, hourOfDay: 6, distanceFromRouteNm: 0.1, minutesStopped: 0 },
            { speedKn: 8.0, headingDeltaDeg: 5, hourOfDay: 7, distanceFromRouteNm: 0.2, minutesStopped: 0 },
            { speedKn: 7.9, headingDeltaDeg: 6, hourOfDay: 8, distanceFromRouteNm: 0.1, minutesStopped: 0 },
            { speedKn: 8.1, headingDeltaDeg: 5, hourOfDay: 9, distanceFromRouteNm: 0.2, minutesStopped: 0 },
            { speedKn: 7.7, headingDeltaDeg: 4, hourOfDay: 10, distanceFromRouteNm: 0.2, minutesStopped: 0 },
          ],
          current: {
            speedKn: 0.4,
            headingDeltaDeg: 160,
            hourOfDay: 16,
            distanceFromRouteNm: 8.5,
            minutesStopped: 120,
          },
          context: {
            restrictedZoneNearbyNm: 0.2,
            tripPlanExists: true,
          },
        }),
        api.catchAnomaly({
          species: "Sardine",
          weightKg: 620,
          zoneDirection: "East",
          recentRecords: [
            { species: "Sardine", weightKg: 280 },
            { species: "Sardine", weightKg: 310 },
            { species: "Sardine", weightKg: 295 },
            { species: "Sardine", weightKg: 305 },
          ],
        }),
      ]);

      const results = {
        fuel,
        engine,
        sustainability,
        vesselAnomaly,
        catchAnomaly,
      };

      setMlData({
        ...results,
        loading: false,
        error: null,
      });

      console.log("TideWatch ML results:", results);
    } catch (err) {
      console.error("ML API error:", err);

      setMlData((prev) => ({
        ...prev,
        loading: false,
        error: err?.message || "Unable to load TideWatch ML results",
      }));
    }
  };

  // Verify backend connectivity and then verify the ML endpoints.
  useEffect(() => {
    const initializeBackend = async () => {
      try {
        const health = await api.health();
        console.log("Backend connected:", health);
        await runMlDemo();
      } catch (err) {
        console.error("Backend initialization failed:", err);
      }
    };

    initializeBackend();
  }, []);

  const handleLogin = (auth) => {
    setSession(auth);
    if (auth.role === "fisherman") {
      setRoute({ page: "tripEntry" });
    } else {
      setRoute({ page: "government" });
    }
  };

  const handleLogout = () => {
    setSession(null);
    setRoute({ page: "hero" });
  };

  const handleLogCatch = (vesselId, kg) => {
    setFleet((prev) => prev.map((v) => (v.id === vesselId ? { ...v, catchKg: Math.max(0, +(v.catchKg + kg).toFixed(1)) } : v)));
  };

  const handleRegistered = (newUser) => {
    // create the vessel record so it shows up fleet-wide, and the login credentials
    setFleet((prev) => [
      ...prev,
      {
        id: newUser.vesselId, name: newUser.vesselName, captain: newUser.captainName, mmsi: `4190${Math.floor(Math.random() * 90000 + 10000)}`,
        lat: HOME_PORT.lat, lon: HOME_PORT.lon, heading: 0, speed: 0,
        fuel: 100, engineTemp: 75, battery: 100,
        catchKg: 0, quotaKg: 500, species: newUser.previousTrip?.species || SPECIES[0],
        sustainability: 75, geofence: "inside", compliance: "compliant", password: newUser.password,
      },
    ]);
    setRegisteredUsers((prev) => [...prev, newUser]);
    setSession({ role: "fisherman", vesselId: newUser.vesselId, username: newUser.username });
    setRoute({ page: "tripEntry" });
  };

  const handleSubmitTrip = (trip) => {
    setTripInfos((prev) => ({ ...prev, [session.vesselId]: trip }));
    setFleet((prev) => prev.map((v) => (v.id === session.vesselId ? { ...v, fuel: trip.fuelLevel } : v)));
    setRoute({ page: "approval" });
  };

  const handleSubmitApprovalRequest = () => {
    const vessel = fleet.find((v) => v.id === session.vesselId);
    const trip = tripInfos[session.vesselId];
    setApprovalRequests((prev) => [
      ...prev,
      {
        id: Date.now(),
        vesselId: vessel.id,
        vesselName: vessel.name,
        direction: trip.direction,
        entryTime: trip.entryTime,
        returnTime: trip.returnTime,
        fuelLevel: trip.fuelLevel,
        crewCount: trip.crewCount,
        targetSpecies: trip.targetSpecies,
        distanceNm: trip.distanceNm,
        emergencyContact: trip.emergencyContact,
        safetyEquipment: trip.safetyEquipment,
        status: "pending",
        reason: null,
        officerId: null,
        requestedAt: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleResubmitRequest = () => {
    setApprovalRequests((prev) =>
      prev.map((r) => (r.vesselId === session.vesselId && r.status === "denied" ? { ...r, status: "pending", reason: null, officerId: null, requestedAt: new Date().toLocaleTimeString() } : r))
    );
  };

  const handleDecideRequest = (requestId, decision, reason) => {
    setApprovalRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: decision, reason: reason || null, officerId: session?.officerId } : r))
    );
  };

  const latestRequestFor = (vesselId) => {
    const mine = approvalRequests.filter((r) => r.vesselId === vesselId);
    return mine.length ? mine[mine.length - 1] : null;
  };

  if (route.page === "hero") {
    return <HeroPage onSelectPortal={(portal) => setRoute({ page: "login", portal })} fleet={fleet} lang={lang} setLang={setLang} />;
  }

  if (route.page === "login") {
    return (
      <LoginPage
        portal={route.portal}
        registeredUsers={registeredUsers}
        onLogin={handleLogin}
        onBack={() => setRoute({ page: "hero" })}
        onGoRegister={() => setRoute({ page: "register" })}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  if (route.page === "register") {
    return (
      <RegisterPage
        existingUsers={registeredUsers}
        onRegistered={handleRegistered}
        onBack={() => setRoute({ page: "login", portal: "fisherman" })}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  if (route.page === "tripEntry" && session) {
    const vessel = fleet.find((v) => v.id === session.vesselId) || fleet[0];
    return <TripEntryPage vessel={vessel} onSubmitTrip={handleSubmitTrip} onLogout={handleLogout} lang={lang} setLang={setLang} />;
  }

  if (route.page === "approval" && session) {
    const vessel = fleet.find((v) => v.id === session.vesselId) || fleet[0];
    return (
      <ApprovalRequestPage
        vessel={vessel}
        tripInfo={tripInfos[session.vesselId]}
        request={latestRequestFor(session.vesselId)}
        onSubmitRequest={handleSubmitApprovalRequest}
        onContinue={() => setRoute({ page: "fisherman" })}
        onLogout={handleLogout}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  if (route.page === "fisherman" && session) {
    const vessel = fleet.find((v) => v.id === session.vesselId) || fleet[0];
    const userMeta = registeredUsers.find((u) => u.vesselId === session.vesselId);
    return (
      <FishermanDashboard
        vessel={vessel}
        fleet={fleet}
        tripInfo={tripInfos[session.vesselId]}
        userMeta={userMeta}
        request={latestRequestFor(session.vesselId)}
        onResubmitRequest={handleResubmitRequest}
        onLogCatch={handleLogCatch}
        onLogout={handleLogout}
        lang={lang}
        setLang={setLang}
        mlData={mlData}
        onSOS={handleSOS}
      />
    );
  }

  if (route.page === "government" && session) {
    return (
      <GovernmentDashboard
        fleet={fleet}
        setFleet={setFleet}
        officer={session}
        approvalRequests={approvalRequests}
        onDecideRequest={handleDecideRequest}
        onLogout={handleLogout}
        mlData={mlData}
        sosEvents={sosEvents}
        onDispatchSOS={handleDispatchSOS}
      />
    );
  }

  // fallback
  return <HeroPage onSelectPortal={(portal) => setRoute({ page: "login", portal })} fleet={fleet} lang={lang} setLang={setLang} />;
}
