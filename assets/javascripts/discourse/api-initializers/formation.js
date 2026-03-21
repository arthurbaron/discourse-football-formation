import { apiInitializer } from "discourse/lib/api";

const PITCH_SVG = `<svg class="pitch-lines" viewBox="0 0 100 154" xmlns="http://www.w3.org/2000/svg">
  <!-- Grass stripes alternating light/dark -->
  <rect x="0" y="0" width="100" height="154" fill="#2d7a2d"/>
  <rect x="0" y="0"   width="100" height="14" fill="#2f822f"/>
  <rect x="0" y="14"  width="100" height="14" fill="#2a722a"/>
  <rect x="0" y="28"  width="100" height="14" fill="#2f822f"/>
  <rect x="0" y="42"  width="100" height="14" fill="#2a722a"/>
  <rect x="0" y="56"  width="100" height="14" fill="#2f822f"/>
  <rect x="0" y="70"  width="100" height="14" fill="#2a722a"/>
  <rect x="0" y="84"  width="100" height="14" fill="#2f822f"/>
  <rect x="0" y="98"  width="100" height="14" fill="#2a722a"/>
  <rect x="0" y="112" width="100" height="14" fill="#2f822f"/>
  <rect x="0" y="126" width="100" height="14" fill="#2a722a"/>
  <rect x="0" y="140" width="100" height="14" fill="#2f822f"/>

  <!-- Outer boundary -->
  <rect x="4" y="3" width="92" height="148" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="0.7"/>

  <!-- Halfway line -->
  <line x1="4" y1="77" x2="96" y2="77" stroke="rgba(255,255,255,0.85)" stroke-width="0.7"/>

  <!-- Centre circle -->
  <circle cx="50" cy="77" r="13" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="0.7"/>
  <!-- Centre spot -->
  <circle cx="50" cy="77" r="0.9" fill="rgba(255,255,255,0.8)"/>

  <!-- Top penalty area -->
  <rect x="24" y="3" width="52" height="19" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="0.7"/>
  <!-- Top 6-yard box -->
  <rect x="36" y="3" width="28" height="9" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="0.7"/>
  <!-- Top penalty spot -->
  <circle cx="50" cy="15" r="0.9" fill="rgba(255,255,255,0.8)"/>
  <!-- Top penalty arc -->
  <path d="M 36 22 A 13 13 0 0 0 64 22" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="0.7"/>


  <!-- Bottom penalty area -->
  <rect x="24" y="132" width="52" height="19" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="0.7"/>
  <!-- Bottom 6-yard box -->
  <rect x="36" y="142" width="28" height="9" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="0.7"/>
  <!-- Bottom penalty spot -->
  <circle cx="50" cy="139" r="0.9" fill="rgba(255,255,255,0.8)"/>
  <!-- Bottom penalty arc -->
  <path d="M 36 132 A 13 13 0 0 1 64 132" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="0.7"/>



</svg>`;

const FORMATIONS = {
  "4-3-3":   { rows: [{y:88,xs:[50]},{y:70,xs:[90,68,32,10]},{y:47,xs:[78,50,22]},{y:18,xs:[85,50,15]}],   labels: ["Goalkeeper","RB - CB - CB - LB","RM - CM - LM","RW - ST - LW"] },
  "4-4-2":   { rows: [{y:88,xs:[50]},{y:70,xs:[90,68,32,10]},{y:47,xs:[90,65,35,10]},{y:20,xs:[70,30]}],   labels: ["Goalkeeper","RB - CB - CB - LB","RM - CM - CM - LM","RS - LS"] },
  "4-2-3-1": { rows: [{y:88,xs:[50]},{y:72,xs:[90,68,32,10]},{y:56,xs:[67,33]},{y:36,xs:[85,50,15]},{y:16,xs:[50]}], labels: ["Goalkeeper","RB - CB - CB - LB","CDM - CDM","RAM - CAM - LAM","ST"] },
  "4-3-2-1": { rows: [{y:88,xs:[50]},{y:72,xs:[90,68,32,10]},{y:55,xs:[78,50,22]},{y:36,xs:[70,30]},{y:16,xs:[50]}], labels: ["Goalkeeper","RB - CB - CB - LB","RM - CM - LM","SS - SS","ST"] },
  "3-4-3":   { rows: [{y:88,xs:[50]},{y:70,xs:[80,50,20]},{y:49,xs:[90,65,35,10]},{y:20,xs:[85,50,15]}],   labels: ["Goalkeeper","CB - CB - CB","RM - CM - CM - LM","RW - ST - LW"] },
  "3-5-2":   { rows: [{y:88,xs:[50]},{y:70,xs:[80,50,20]},{y:47,xs:[90,72,50,28,10]},{y:18,xs:[70,30]}],   labels: ["Goalkeeper","CB - CB - CB","RM - CM - CM - CM - LM","RS - LS"] },
  "5-3-2":   { rows: [{y:88,xs:[50]},{y:72,xs:[92,76,50,24,8]},{y:47,xs:[78,50,22]},{y:18,xs:[70,30]}],    labels: ["Goalkeeper","RWB - RCB - CB - LCB - LWB","RM - CM - LM","RS - LS"] },
  "4-5-1":   { rows: [{y:88,xs:[50]},{y:72,xs:[90,68,32,10]},{y:47,xs:[90,72,50,28,10]},{y:16,xs:[50]}],   labels: ["Goalkeeper","RB - CB - CB - LB","RM - CM - CM - CM - LM","ST"] },
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function renderFormation(formation, lines) {
  const def = FORMATIONS[formation];
  if (!def) return null;
  const { rows } = def;
  const allNames = lines.flatMap(l => l.split(/\s+-\s+/)).map(n => n.trim()).filter(Boolean);
  let idx = 0, playersHtml = "";
  rows.forEach(row => {
    row.xs.forEach(x => {
      const name = escapeHtml(allNames[idx] || "");
      playersHtml += `<div class="football-player" style="left:${x}%;top:${row.y}%"><div class="football-player-dot"></div><div class="football-player-name">${name}</div></div>`;
      idx++;
    });
  });
  return `<div class="football-formation-wrap"><div class="football-pitch">${PITCH_SVG}${playersHtml}</div><div class="football-formation-label">${escapeHtml(formation)}</div></div>`;
}

function createModal(onInsert) {
  const overlay = document.createElement("div");
  overlay.className = "formation-modal-overlay";

  const modal = document.createElement("div");
  modal.className = "formation-modal";

  modal.innerHTML = `
    <div class="formation-modal-header">
      <h3>Insert formation</h3>
      <button class="formation-modal-close" aria-label="Close">&times;</button>
    </div>
    <div class="formation-modal-body">
      <div class="formation-modal-left">
        <label>Formation</label>
        <select class="formation-select">
          ${Object.keys(FORMATIONS).map(f => `<option value="${f}">${f}</option>`).join("")}
        </select>
        <div class="formation-rows"></div>
        <div class="formation-modal-actions">
          <button class="formation-cancel-btn">Cancel</button>
          <button class="formation-insert-btn">Insert</button>
        </div>
      </div>
      <div class="formation-modal-right">
        <label>Preview</label>
        <div class="formation-preview"></div>
      </div>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const select = modal.querySelector(".formation-select");
  const rowsContainer = modal.querySelector(".formation-rows");
  const preview = modal.querySelector(".formation-preview");

  function getInputs() {
    return Array.from(rowsContainer.querySelectorAll(".formation-row-input"));
  }

  function updatePreview() {
    const formation = select.value;
    const lines = getInputs().map(inp => inp.value.trim()).filter(Boolean);
    const html = renderFormation(formation, lines);
    preview.innerHTML = html || "";
  }

  function buildRows(formation) {
    const def = FORMATIONS[formation];
    rowsContainer.innerHTML = "";
    def.labels.forEach((label, i) => {
      const count = def.rows[i].xs.length;
      const div = document.createElement("div");
      div.className = "formation-row-field";
      div.innerHTML = `
        <label class="formation-row-label">${label} <span class="formation-row-count">(${count})</span></label>
        <input class="formation-row-input" type="text" placeholder="${label}" />
      `;
      rowsContainer.appendChild(div);
    });
    rowsContainer.querySelectorAll(".formation-row-input").forEach(inp => {
      inp.addEventListener("input", updatePreview);
    });
    updatePreview();
  }

  select.addEventListener("change", () => buildRows(select.value));
  buildRows(select.value);

  function close() { overlay.remove(); }
  modal.querySelector(".formation-modal-close").addEventListener("click", close);
  modal.querySelector(".formation-cancel-btn").addEventListener("click", close);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });

  modal.querySelector(".formation-insert-btn").addEventListener("click", () => {
    const formation = select.value;
    const lines = getInputs().map(inp => inp.value.trim());
    const bbcode = `[formation=${formation}]\n${lines.join("\n")}\n[/formation]`;
    onInsert(bbcode);
    close();
  });
}

export default apiInitializer("0.8", (api) => {
  api.onToolbarCreate((toolbar) => {
    toolbar.addButton({
      id: "football-formation",
      group: "extras",
      icon: "users",
      title: "Insert formation",
      perform: (e) => {
        createModal((bbcode) => {
          e.addText(bbcode);
        });
      },
    });
  });

  api.decorateCooked(
    (elem) => {
      const el = elem instanceof Element ? elem : elem[0];
      if (!el) return;

      el.querySelectorAll("p, div").forEach(node => {
        if (!node.innerHTML.includes("[formation=")) return;
        node.innerHTML = node.innerHTML.replace(
          /\[formation=([^\]]+)\]([\s\S]*?)\[\/formation\]/gi,
          (match, formation, content) => {
            const cleanContent = content.replace(/<br\s*\/?>/gi, "\n");
            const lines = cleanContent.split("\n").map(l => l.trim()).filter(Boolean);
            return renderFormation(formation.trim(), lines) || match;
          }
        );
      });
    },
    { id: "football-formation" }
  );
});
