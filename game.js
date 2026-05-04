// ========================= game.js =========================
// ---------------- DATA ----------------
const allQueens = [
  "Luna Star","Ruby Blaze","Velvet Noir","Crystal Edge",
  "Nova Lux","Scarlet Kiss","Opal Dream","Zara Vibe"
];

const challenges = ["Acting","Comedy","Ball","Rusical","Design"];

const formatRules = {
  normal: { elimination: true, type: "btm2" },
  allstars: { elimination: true, type: "top2" },
  nonelim: { elimination: false }
};

let selectedQueens = [];
let currentEpisode = 1;
let format = "normal";
let lipsyncPair = [];

// ---------------- INIT ----------------
function initQueenSelect(){
  const div = document.getElementById("queenSelect");
  div.innerHTML = "";
  allQueens.forEach(q => {
    div.innerHTML += `<label><input type="checkbox" value="${q}"> ${q}</label><br>`;
  });
}

function initChallenges(){
  const sel = document.getElementById("challengeSelect");
  sel.innerHTML = "";
  challenges.forEach(c => {
    sel.innerHTML += `<option>${c}</option>`;
  });
}

// ---------------- GAME START ----------------
function startGame(){
  format = document.getElementById("formatSelect").value;

  const checked = document.querySelectorAll("#queenSelect input:checked");

  selectedQueens = Array.from(checked).map(q => ({
    name: q.value,
    track: [],
    eliminated: false
  }));

  if(selectedQueens.length < 2){
    alert("Pick at least 2 queens");
    return;
  }

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("game").style.display = "block";

  currentEpisode = 1;
  document.getElementById("episodeTitle").innerText = `Episode ${currentEpisode}`;

  initChallenges();
  renderQueens();
}

// ---------------- RENDER ----------------
function renderQueens(){
  const div = document.getElementById("queenList");
  div.innerHTML = "";

  selectedQueens.forEach((q, i) => {
    if(q.eliminated) return;

    div.innerHTML += `
      <div class="queen">
        <strong>${q.name}</strong><br>
        <select id="place-${i}">
          <option>WIN</option>
          <option>HIGH</option>
          <option>SAFE</option>
          <option>LOW</option>
          <option>BTM2</option>
        </select>
        <div class="track">${q.track.join(" | ")}</div>
      </div>
    `;
  });
}

// ---------------- JUDGING ----------------
function confirmJudging(){
  const rule = formatRules[format];
  let btm = [];

  selectedQueens.forEach((q,i) => {
    if(q.eliminated) return;

    const placement = document.getElementById(`place-${i}`).value;
    q.track.push(placement);

    if(placement === "BTM2") btm.push(q);
  });

  if(rule.elimination && btm.length === 2){
    lipsyncPair = btm;
    showLipSync();
  } else {
    renderQueens();
  }
}

// ---------------- LIPSYNC ----------------
function showLipSync(){
  document.getElementById("lipsyncSection").style.display = "block";
  document.getElementById("lipsyncText").innerText =
    `${lipsyncPair[0].name} vs ${lipsyncPair[1].name}`;
}

function resolveLipSync(result){
  if(result === "doubleShantay"){
    // nobody eliminated
  } else if(result === "doubleSashay"){
    lipsyncPair[0].eliminated = true;
    lipsyncPair[1].eliminated = true;
  } else if(result === "queen1"){
    lipsyncPair[1].eliminated = true;
  } else if(result === "queen2"){
    lipsyncPair[0].eliminated = true;
  }

  document.getElementById("lipsyncSection").style.display = "none";
  renderQueens();
}

// ---------------- NEXT EP ----------------
function nextEpisode(){
  currentEpisode++;
  document.getElementById("episodeTitle").innerText = `Episode ${currentEpisode}`;
  renderQueens();
}

// ---------------- RUN ----------------
initQueenSelect();
