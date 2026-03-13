import { withPluginApi } from "discourse/lib/plugin-api";

const PITCH_SVG = `
<svg class="pitch-lines" viewBox="0 0 100 154" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="3" width="92" height="148" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.7"/>
  <line x1="4" y1="77" x2="96" y2="77" stroke="rgba(255,255,255,0.35)" stroke-width="0.7"/>
  <circle cx="50" cy="77" r="13" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.7"/>
  <circle cx="50" cy="77" r="0.9" fill="rgba(255,255,255,0.5)"/>
  <rect x="24" y="3" width="52" height="19" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.7"/>
  <rect x="36" y="3" width="28" height="9" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.7"/>
  <rect x="24" y="132" width="52" height="19" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.7"/>
  <rect x="36" y="142" width="28" height="9" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.7"/>
  <circle cx="50" cy="19" r="0.9" fill="rgba(255,255,255,0.5)"/>
  <circle cx="50" cy="135" r="0.9" fill="rgba(255,255,255,0.5)"/>
  <line x1="43" y1="3" x2="57" y2="3" stroke="rgba(255,255,255,0.6)" stroke-width="1.2"/>
  <line x1="43" y1="151" x2="57" y2="151" stroke="rgba(255,255,255,0.6)" stroke-width="1.2"/>
</svg>`;

// Row positions per formation: y% from top, xs% array per row (GK first = bottom of pitch)
const FORMATIONS = {
  "4-3-3": [
    { y: 88, xs: [50] },
    { y: 70, xs: [10, 32, 68, 90] },
    { y: 47, xs: [22, 50, 78] },
    { y: 18, xs: [15, 50, 85] },
  ],
  "4-4-2": [
    { y: 88, xs: [50] },
    { y: 70, xs: [10, 32, 68, 90] },
    { y: 47, xs: [10, 35, 65, 90] },
    { y: 20, xs: [30, 70] },
  ],
  "4-2-3-1": [
    { y: 88, xs: [50] },
    { y: 72, xs: [10, 32, 68, 90] },
    { y: 56, xs: [33, 67] },
    { y: 36, xs: [15, 50, 85] },
    { y: 16, xs: [50] },
  ],
  "4-3-2-1": [
    { y: 88, xs: [50] },
    { y: 72, xs: [10, 32, 68, 90] },
    { y: 55, xs: [22, 50, 78] },
    { y: 36, xs: [30, 70] },
    { y: 16, xs: [50] },
  ],
  "3-4-3": [
    { y: 88, xs: [50] },
    { y: 70, xs: [20, 50, 80] },
    { y: 49, xs: [10, 35, 65, 90] },
    { y: 20, xs: [15, 50, 85] },
  ],
  "3-5-2": [
    { y: 88, xs: [50] },
    { y: 70, xs: [20, 50, 80] },
    { y: 47, xs: [10, 28, 50, 72, 90] },
    { y: 18, xs: [30, 70] },
  ],
  "5-3-2": [
    { y: 88, xs: [50] },
    { y: 72, xs: [8, 24, 50, 76, 92] },
    { y: 47, xs: [22, 50, 78] },
    { y: 18, xs: [30, 70] },
  ],
  "4-5-1": [
    { y: 88, xs: [50] },
    { y: 72, xs: [10, 32, 68, 90] },
    { y: 47, xs: [10, 28, 50, 72, 90] },
    { y: 16, xs: [50] },
  ],
};

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderFormation(formation, lines) {
  const rows = FORMATIONS[formation];
  if (!rows) return null;

  // Flatten all names from lines
  const allNames = lines
    .map((l) => l.split(/\s*-\s*/))
    .flat()
    .map((n) => n.trim())
    .filter(Boolean);

  let playerIndex = 0;
  let playersHtml = "";

  rows.forEach((row) => {
    row.xs.forEach((x) => {
      const name = escapeHtml(allNames[playerIndex] || "");
      playersHtml += `
        <div class="football-player" style="left:${x}%;top:${row.y}%">
          <div class="football-player-dot"></div>
          <div class="football-player-name">${name}</div>
        </div>`;
      playerIndex++;
    });
  });

  return `
    <div class="football-formation-wrap">
      <div class="football-pitch">
        ${PITCH_SVG}
        ${playersHtml}
      </div>
      <div class="football-formation-label">${escapeHtml(formation)}</div>
    </div>`;
}

function processFormationTags(html) {
  // Match [formation=4-3-3]...[/formation] blocks in rendered HTML
  return html.replace(
    /\[formation=([^\]]+)\]([\s\S]*?)\[\/formation\]/gi,
    (match, formation, content) => {
      const lines = content
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      const rendered = renderFormation(formation.trim(), lines);
      return rendered || match;
    }
  );
}

export default {
  name: "football-formation",
  initialize() {
    withPluginApi("0.8.31", (api) => {
      api.decorateCooked(
        (elem) => {
          const html = elem.innerHTML;
          const processed = processFormationTags(html);
          if (processed !== html) {
            elem.innerHTML = processed;
          }
        },
        { id: "football-formation" }
      );
    });
  },
};
