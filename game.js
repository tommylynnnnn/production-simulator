// ========================= game.js =========================
// ---------------- DATA ----------------
const allQueens = [
  { name:"Luna Star", stats:{comedy:7,dance:9,fashion:8,acting:6}},
  { name:"Ruby Blaze", stats:{comedy:9,dance:6,fashion:7,acting:8}},
  { name:"Velvet Noir", stats:{comedy:6,dance:7,fashion:9,acting:7}},
  { name:"Crystal Edge", stats:{comedy:5,dance:8,fashion:6,acting:9}}
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
  allQueens.forEach((q,i) => {
    div.innerHTML += `<label><input type="checkbox" value="${i}"> ${q.name}</label><br>`;
  });
}

function initChallenges(){
  const sel = document.getElementById("challengeSelect");
  sel.innerHTML = "";
  challenges.forEach(c => {
    sel.innerHTML += `<option>${c}</option>`;
  });
}

// ---------------- PERFORMANCE ----------------
function getPerformance(score){
  if(score >= 9) return "SLAYED";
  if(score >= 8) return "GREAT";
  if(score >= 7) return "GOOD";
  if(score >= 6) return "FINE";
  if(score >= 5) return "OK";
  if(score >= 4) return "BAD";
  return "FLOPPED";
}

function calculateScore(q, challenge){
  let key = challenge.toLowerCase();
  if(key === "rusical") key = "acting";
  if(key === "design" || key === "ball") key = "fashion";
  return q.stats[key] || 5;
}

// ---------------- GAME START ----------------
function startGame(){
  format = document.getElementById("formatSelect").value;

  const checked = document.querySelectorAll("#queenSelect input:checked");

  selectedQueens = Array.from(checked).map(input => {
    const base = allQueens[input.value];
    return {
      name: base.name,
      stats: base.stats,
      track: [],
      eliminated: false,
      performance: ""
    };
  });

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
  const challenge = document.getElementById("challengeSelect").value;

  div.innerHTML = "";

  selectedQueens.forEach((q, i) => {
    if(q.eliminated) return;

    const score = calculateScore(q, challenge);
    const perf = getPerformance(score);

    q.performance = perf;

    div.innerHTML += `
      <div class="queen">
        <strong>${q.name}</strong><br>
        <div class="performance">${perf}</div>
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
