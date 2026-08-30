const HARBOURS = [
  { name: "Thoothukudi Fishing Harbour", lat: 8.0883, lon: 77.5385 },
  { name: "Chennai Fishing Harbour", lat: 13.1245, lon: 80.2961 },
  { name: "Kamarajar / Ennore Port", lat: 13.255, lon: 80.332 },
  { name: "Cuddalore Fishing Harbour", lat: 11.748, lon: 79.78 },
  { name: "Nagapattinam Fishing Harbour", lat: 10.767, lon: 79.844 },
  { name: "Rameswaram Fishing Harbour", lat: 9.288, lon: 79.313 },
  { name: "Kanyakumari Fishing Harbour", lat: 8.087, lon: 77.538 },
];

const COPY = {
  en: {
    title: "Intelligent Fisheries Monitoring for Safer Seas and Sustainable Fishing",
    desc: "Connect fishing vessels, fishermen and marine authorities through one intelligent platform for real-time vessel tracking, catch monitoring, weather intelligence, fuel optimization, safety alerts and regulatory compliance.",
    fisherman: "Access Fisherman Portal",
    government: "Open Government Command Centre",
    demo: "Start Industry Demo",
    radar: "LIVE MARITIME RADAR",
    harbour: "SELECT HARBOUR",
  },
  ta: {
    title: "பாதுகாப்பான கடலும் நிலைத்த மீன்பிடிப்பும் பெற நுண்ணறிவு மீன்வள கண்காணிப்பு",
    desc: "மீன்பிடி படகுகள், மீனவர்கள் மற்றும் கடல் அதிகாரிகளை ஒரே நுண்ணறிவு தளத்தில் இணைத்து நேரடி கண்காணிப்பு, பிடிப்பு பதிவு, வானிலை நுண்ணறிவு, எரிபொருள் மேம்பாடு, பாதுகாப்பு எச்சரிக்கை மற்றும் விதிமுறை இணக்கத்தை வழங்குகிறது.",
    fisherman: "மீனவர் போர்டலை திறக்கவும்",
    government: "அரசு கட்டுப்பாட்டு மையம்",
    demo: "தொழில் டெமோ தொடங்கு",
    radar: "நேரடி கடல் ரேடார்",
    harbour: "துறைமுகத்தை தேர்ந்தெடுக்கவும்",
  },
  hi: {
    title: "सुरक्षित समुद्र और सतत मत्स्य पालन के लिए बुद्धिमान निगरानी",
    desc: "मछली पकड़ने वाली नौकाओं, मछुआरों और समुद्री अधिकारियों को एक बुद्धिमान प्लेटफ़ॉर्म पर जोड़ें—रियल-टाइम ट्रैकिंग, कैच मॉनिटरिंग, मौसम, ईंधन अनुकूलन, सुरक्षा अलर्ट और अनुपालन के लिए।",
    fisherman: "मछुआरा पोर्टल खोलें",
    government: "सरकारी कमांड सेंटर",
    demo: "इंडस्ट्री डेमो शुरू करें",
    radar: "लाइव समुद्री रडार",
    harbour: "हार्बर चुनें",
  },
  ml: {
    title: "സുരക്ഷിത സമുദ്രത്തിനും സുസ്ഥിര മത്സ്യബന്ധനത്തിനുമായി ബുദ്ധിമാനായ മത്സ്യ നിരീക്ഷണം",
    desc: "മത്സ്യബന്ധന കപ്പലുകൾ, മത്സ്യത്തൊഴിലാളികൾ, സമുദ്ര അധികാരികൾ എന്നിവരെ ഒരൊറ്റ ഇന്റലിജന്റ് പ്ലാറ്റ്ഫോമിൽ ബന്ധിപ്പിച്ച് റിയൽ-ടൈം ട്രാക്കിംഗ്, ക്യാച്ച് മോണിറ്ററിംഗ്, കാലാവസ്ഥ, ഇന്ധന കാര്യക്ഷമത, സുരക്ഷാ മുന്നറിയിപ്പുകൾ, നിയമാനുസൃതത എന്നിവ നൽകുന്നു.",
    fisherman: "മത്സ്യത്തൊഴിലാളി പോർട്ടൽ",
    government: "സർക്കാർ കമാൻഡ് സെന്റർ",
    demo: "ഇൻഡസ്ട്രി ഡെമോ ആരംഭിക്കുക",
    radar: "ലൈവ് മാരിടൈം റഡാർ",
    harbour: "ഹാർബർ തിരഞ്ഞെടുക്കുക",
  },
  te: {
    title: "సురక్షిత సముద్రాలు మరియు సుస్థిర మత్స్యకారానికి తెలివైన పర్యవేక్షణ",
    desc: "మత్స్యకార పడవలు, మత్స్యకారులు మరియు సముద్ర అధికారులను ఒక తెలివైన ప్లాట్‌ఫారమ్‌లో కలిపి రియల్-టైమ్ ట్రాకింగ్, క్యాచ్ మానిటరింగ్, వాతావరణం, ఇంధన ఆప్టిమైజేషన్, భద్రతా హెచ్చరికలు మరియు నియమ అనుసరణను అందిస్తుంది.",
    fisherman: "మత్స్యకారుల పోర్టల్",
    government: "ప్రభుత్వ కమాండ్ సెంటర్",
    demo: "ఇండస్ట్రీ డెమో ప్రారంభించండి",
    radar: "లైవ్ సముద్ర రాడార్",
    harbour: "హార్బర్ ఎంచుకోండి",
  },
};

function getHeroHeading() {
  return [...document.querySelectorAll("h1")].find((el) =>
    Object.values(COPY).some((x) => x.title === el.textContent) ||
    el.textContent.includes("Fisheries Monitoring")
  );
}

function getLanguageSelect() {
  return [...document.querySelectorAll("select")].find((s) =>
    [...s.options].some((o) => o.value === "ta") &&
    [...s.options].some((o) => o.value === "hi")
  );
}

function translateHero() {
  const select = getLanguageSelect();
  const heading = getHeroHeading();
  if (!select || !heading) return;
  const copy = COPY[select.value] || COPY.en;
  heading.textContent = copy.title;

  const content = heading.closest(".tw-fixed-hero-copy") || heading.parentElement;
  const paragraph = content?.querySelector("p");
  if (paragraph) paragraph.textContent = copy.desc;

  const buttons = content ? [...content.querySelectorAll("button")] : [];
  if (buttons[0]) buttons[0].lastChild.textContent = ` ${copy.fisherman}`;
  if (buttons[1]) buttons[1].lastChild.textContent = ` ${copy.government}`;
  if (buttons[2]) buttons[2].lastChild.textContent = ` ${copy.demo}`;

  const radarTitle = document.querySelector("[data-fixed-radar-title]");
  const harbourLabel = document.querySelector("[data-fixed-harbour-label]");
  if (radarTitle) radarTitle.textContent = copy.radar;
  if (harbourLabel) harbourLabel.textContent = copy.harbour;
}

function buildRadarCard() {
  const card = document.createElement("div");
  card.id = "tw-fixed-radar-card";
  card.innerHTML = `
    <div class="tw-radar-topline">
      <div>
        <div class="tw-radar-title" data-fixed-radar-title>LIVE MARITIME RADAR</div>
        <div class="tw-radar-sub" data-fixed-radar-sub>Operational picture around Thoothukudi Fishing Harbour</div>
      </div>
      <span class="tw-live-pill">● LIVE</span>
    </div>
    <div class="tw-harbour-row">
      <label data-fixed-harbour-label>SELECT HARBOUR</label>
      <select id="tw-fixed-harbour-select"></select>
    </div>
    <div class="tw-radar-disc" aria-label="Maritime radar display">
      <i class="tw-sweep"></i>
      <b class="tw-dot d1"></b>
      <b class="tw-dot d2"></b>
      <b class="tw-dot d3"></b>
      <b class="tw-dot d4"></b>
      <span class="tw-radar-center"></span>
    </div>
    <div class="tw-radar-note">AIS / GPS vessel contacts · patrol assets · risk status</div>
  `;

  const select = card.querySelector("#tw-fixed-harbour-select");
  HARBOURS.forEach((h) => {
    const option = document.createElement("option");
    option.value = h.name;
    option.textContent = h.name;
    select.appendChild(option);
  });
  select.value = localStorage.getItem("tidewatch_harbour") || HARBOURS[0].name;
  card.querySelector("[data-fixed-radar-sub]").textContent = `Operational picture around ${select.value}`;
  select.addEventListener("change", () => {
    localStorage.setItem("tidewatch_harbour", select.value);
    card.querySelector("[data-fixed-radar-sub]").textContent = `Operational picture around ${select.value}`;
  });
  return card;
}

function fixHeroLayout() {
  if (document.getElementById("tw-fixed-radar-card")) return;
  const heading = getHeroHeading();
  if (!heading) return;

  const content = heading.parentElement;
  const heroRoot = content?.parentElement;
  if (!content || !heroRoot) return;

  content.classList.add("tw-fixed-hero-copy");

  const grid = document.createElement("div");
  grid.className = "tw-fixed-hero-grid";
  heroRoot.insertBefore(grid, content);
  grid.appendChild(content);
  grid.appendChild(buildRadarCard());

  heroRoot.classList.add("tw-fixed-hero-root");
  translateHero();
}

function bindLanguage() {
  const select = getLanguageSelect();
  if (!select || select.dataset.fixedHeroLang === "1") return;
  select.dataset.fixedHeroLang = "1";
  select.addEventListener("change", () => setTimeout(translateHero, 0));
}

const style = document.createElement("style");
style.textContent = `
  .tw-fixed-hero-root {
    min-height: 0 !important;
    height: auto !important;
    padding-top: 0 !important;
  }
  .tw-fixed-hero-grid {
    position: relative !important;
    z-index: 3 !important;
    max-width: 1220px !important;
    margin: 0 auto !important;
    padding: 44px 32px 46px !important;
    display: grid !important;
    grid-template-columns: minmax(0, 1.08fr) minmax(380px, .92fr) !important;
    gap: 34px !important;
    align-items: center !important;
  }
  .tw-fixed-hero-copy {
    position: relative !important;
    z-index: 2 !important;
    max-width: none !important;
    width: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    transform: none !important;
  }
  .tw-fixed-hero-copy h1 {
    margin-top: 0 !important;
    font-size: clamp(38px, 4.6vw, 66px) !important;
    line-height: 1.04 !important;
  }
  #tw-fixed-radar-card {
    position: relative;
    z-index: 4;
    border: 1px solid #1D3B52;
    border-radius: 10px;
    padding: 18px;
    background: rgba(11, 28, 43, .94);
    box-shadow: 0 18px 50px rgba(0, 0, 0, .24);
    backdrop-filter: blur(8px);
  }
  .tw-radar-topline { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; }
  .tw-radar-title { color:#33D6C0; font:11px 'JetBrains Mono', monospace; letter-spacing:.13em; }
  .tw-radar-sub { margin-top:5px; color:#E7EEF3; font-size:16px; }
  .tw-live-pill { color:#33D6C0; border:1px solid rgba(51,214,192,.35); padding:5px 8px; border-radius:999px; font:9px monospace; white-space:nowrap; }
  .tw-harbour-row { margin:16px 0; padding:10px 12px; border:1px solid #1D3B52; border-radius:6px; display:grid; grid-template-columns:110px 1fr; align-items:center; gap:10px; }
  .tw-harbour-row label { color:#7F9CB0; font:10px 'JetBrains Mono', monospace; letter-spacing:.11em; }
  #tw-fixed-harbour-select { width:100%; min-height:42px; background:#102A3D; color:#E7EEF3; border:1px solid #28506B; border-radius:5px; padding:0 12px; font-weight:600; }
  .tw-radar-disc { width:min(100%, 330px); aspect-ratio:1; margin:8px auto 0; border-radius:50%; position:relative; overflow:hidden; border:1px solid #28506B; background:repeating-radial-gradient(circle,#0D2436 0 2px,#081420 3px 24%,#1D3B52 25%,#081420 26% 49%,#1D3B52 50%,#081420 51%); }
  .tw-radar-disc:before,.tw-radar-disc:after { content:""; position:absolute; background:#1D3B52; }
  .tw-radar-disc:before { width:1px; height:100%; left:50%; }
  .tw-radar-disc:after { height:1px; width:100%; top:50%; }
  .tw-sweep { position:absolute; inset:0; border-radius:50%; background:conic-gradient(from 0deg,transparent 0 300deg,rgba(51,214,192,.18) 340deg,rgba(51,214,192,.65) 360deg); animation:twFixedSweep 3.8s linear infinite; }
  .tw-dot { position:absolute; width:8px; height:8px; border-radius:50%; background:#33D6C0; box-shadow:0 0 10px #33D6C0; z-index:2; }
  .tw-dot.d1 { left:28%; top:31%; }
  .tw-dot.d2 { left:66%; top:24%; background:#E8A33D; box-shadow:0 0 10px #E8A33D; }
  .tw-dot.d3 { left:72%; top:61%; }
  .tw-dot.d4 { left:39%; top:72%; background:#E8604C; box-shadow:0 0 10px #E8604C; }
  .tw-radar-center { position:absolute; width:7px; height:7px; border-radius:50%; background:#E8A33D; left:50%; top:50%; transform:translate(-50%,-50%); z-index:3; }
  .tw-radar-note { margin-top:10px; text-align:center; color:#7F9CB0; font:10px 'JetBrains Mono', monospace; }
  @keyframes twFixedSweep { to { transform:rotate(360deg); } }
  body.tw-light #tw-fixed-radar-card { background:rgba(255,255,255,.94); border-color:#C8D9E3; box-shadow:0 18px 40px rgba(29,59,82,.12); }
  body.tw-light .tw-radar-sub { color:#102738; }
  body.tw-light .tw-harbour-row { border-color:#C8D9E3; }
  body.tw-light #tw-fixed-harbour-select { background:#FFFFFF; color:#102738; border-color:#C8D9E3; }
  @media (max-width: 1000px) {
    .tw-fixed-hero-grid { grid-template-columns:1fr !important; padding-top:32px !important; }
    #tw-fixed-radar-card { max-width:620px; width:100%; }
  }
  @media (max-width: 680px) {
    .tw-fixed-hero-grid { padding:28px 18px 34px !important; gap:24px !important; }
    .tw-harbour-row { grid-template-columns:1fr; }
    .tw-fixed-hero-copy h1 { font-size:clamp(34px,11vw,48px) !important; }
  }
`;
document.head.appendChild(style);

function run() {
  bindLanguage();
  fixHeroLayout();
}

new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener("load", run);
setTimeout(run, 100);
