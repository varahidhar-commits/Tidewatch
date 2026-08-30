const HARBOURS = [
  { id: "thoothukudi", name: "Thoothukudi Harbour", short: "Thoothukudi" },
  { id: "chennai", name: "Chennai Fishing Harbour", short: "Chennai" },
  { id: "kamarajar", name: "Kamarajar / Ennore Harbour", short: "Ennore" },
  { id: "cuddalore", name: "Cuddalore Fishing Harbour", short: "Cuddalore" },
  { id: "nagapattinam", name: "Nagapattinam Fishing Harbour", short: "Nagapattinam" },
  { id: "rameswaram", name: "Rameswaram Fishing Harbour", short: "Rameswaram" },
  { id: "kanyakumari", name: "Kanyakumari Fishing Harbour", short: "Kanyakumari" },
];

function textOf(el) {
  return (el?.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
}

function closestSectionLike(el) {
  let node = el;
  for (let i = 0; i < 6 && node; i += 1, node = node.parentElement) {
    const tag = node.tagName?.toLowerCase();
    if (tag === "section" || tag === "main") return node;
    if (node.children?.length >= 2 && node.getBoundingClientRect?.().height > 120) return node;
  }
  return el?.parentElement || null;
}

function removeDashboardPreviewGap() {
  const all = [...document.querySelectorAll("h1,h2,h3,h4,div,span,p")];
  const dashboardLabel = all.find((el) => /^dashboard$/.test(textOf(el)) || textOf(el).includes("dashboard"));
  const previewLabel = all.find((el) => textOf(el) === "app preview" || textOf(el).includes("app preview"));

  if (dashboardLabel && previewLabel) {
    const dashboardBlock = closestSectionLike(dashboardLabel);
    const previewBlock = closestSectionLike(previewLabel);
    if (dashboardBlock) {
      dashboardBlock.style.marginBottom = "0";
      dashboardBlock.style.paddingBottom = "0";
    }
    if (previewBlock) {
      previewBlock.style.marginTop = "0";
      previewBlock.style.paddingTop = "0";
    }
    const common = dashboardBlock?.parentElement === previewBlock?.parentElement ? dashboardBlock.parentElement : null;
    if (common) common.style.gap = "0";
  }

  document.querySelectorAll("[data-dashboard],[data-app-preview],.dashboard-section,.app-preview-section").forEach((el) => {
    el.style.marginBlock = "0";
  });
}

function selectedHarbour() {
  const saved = localStorage.getItem("tidewatch_harbour");
  return HARBOURS.find((h) => h.id === saved) || null;
}

function updateHarbourUI(harbour) {
  const radarSub = document.querySelector("[data-tw-radar-sub]");
  if (radarSub) {
    radarSub.textContent = harbour
      ? `Operational picture around ${harbour.name}`
      : "Select a harbour to initialise the operational picture";
  }

  const note = document.querySelector(".tw-radar-note");
  if (note) {
    note.textContent = harbour
      ? `${harbour.short} sector · AIS / GPS vessel contacts · patrol assets · risk status`
      : "Choose a harbour to begin monitoring";
  }

  const radar = document.querySelector(".tw-radar");
  if (radar) {
    radar.classList.toggle("tw-radar-awaiting", !harbour);
    radar.setAttribute("aria-label", harbour ? `Live radar for ${harbour.name}` : "Harbour not selected");
  }

  if (!harbour) return;

  // Keep visible harbour references consistent with the user's selection.
  document.querySelectorAll("#root *").forEach((el) => {
    if (el.children.length !== 0) return;
    const current = (el.textContent || "").trim();
    if (/^Thoothukudi Harbor$/i.test(current) || /^Thoothukudi Harbour$/i.test(current)) {
      el.textContent = harbour.name;
    }
  });
}

function installHarbourSelector() {
  const radarCard = document.getElementById("tw-radar-card");
  if (!radarCard || document.getElementById("tw-harbour-select")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "tw-harbour-picker";

  const label = document.createElement("label");
  label.htmlFor = "tw-harbour-select";
  label.textContent = "Select Harbour";

  const select = document.createElement("select");
  select.id = "tw-harbour-select";
  select.setAttribute("aria-label", "Select harbour for TideWatch monitoring");

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select Harbour";
  select.appendChild(placeholder);

  HARBOURS.forEach((harbour) => {
    const option = document.createElement("option");
    option.value = harbour.id;
    option.textContent = harbour.name;
    select.appendChild(option);
  });

  const current = selectedHarbour();
  select.value = current?.id || "";

  select.addEventListener("change", () => {
    const harbour = HARBOURS.find((h) => h.id === select.value) || null;
    if (harbour) localStorage.setItem("tidewatch_harbour", harbour.id);
    else localStorage.removeItem("tidewatch_harbour");
    updateHarbourUI(harbour);
  });

  wrapper.append(label, select);
  const subtitle = radarCard.querySelector("[data-tw-radar-sub]");
  if (subtitle) subtitle.insertAdjacentElement("afterend", wrapper);
  else radarCard.prepend(wrapper);

  updateHarbourUI(current);
}

function applyEnhancements() {
  removeDashboardPreviewGap();
  installHarbourSelector();
  updateHarbourUI(selectedHarbour());
}

const style = document.createElement("style");
style.textContent = `
  .tw-harbour-picker{display:grid;grid-template-columns:auto minmax(180px,1fr);gap:10px;align-items:center;margin:12px 0 14px;padding:10px 12px;border:1px solid #1d3b52;border-radius:7px;background:rgba(8,20,32,.34)}
  .tw-harbour-picker label{font:600 10px 'JetBrains Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#7f9cb0;white-space:nowrap}
  .tw-harbour-picker select{width:100%;min-height:38px;border:1px solid #1d3b52;border-radius:5px;background:#0e2233;color:#e7eef3;padding:7px 34px 7px 10px;font:500 12px Inter,sans-serif;outline:none;cursor:pointer}
  .tw-harbour-picker select:focus{border-color:#33d6c0;box-shadow:0 0 0 2px rgba(51,214,192,.12)}
  .tw-radar-awaiting{opacity:.48;filter:saturate(.45)}
  body.tw-light .tw-harbour-picker{background:rgba(255,255,255,.58);border-color:#c8d9e3}
  body.tw-light .tw-harbour-picker label{color:#587284}
  body.tw-light .tw-harbour-picker select{background:#fff;color:#102738;border-color:#c8d9e3}
  @media(max-width:620px){.tw-harbour-picker{grid-template-columns:1fr}.tw-harbour-picker label{white-space:normal}}
`;
document.head.appendChild(style);

let scheduled = false;
function scheduleApply() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    applyEnhancements();
  });
}

new MutationObserver(scheduleApply).observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener("load", scheduleApply);
setTimeout(scheduleApply, 200);
