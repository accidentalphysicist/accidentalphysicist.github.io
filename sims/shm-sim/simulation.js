// ---------- Canvas ----------
const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");

// ---------- Inputs ----------
const massIn = document.getElementById("massIn");
const kIn = document.getElementById("kIn");
const cIn = document.getElementById("cIn");
const dampingEnable = document.getElementById("dampingEnable");

// ---------- Buttons ----------
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");

// ---------- Scene Config ----------
const scene = {
  wallWidth: 10,
  fixedHandle: 25,
  groundY: 230,
  blockSize: 50,
  equilibriumX: 250
};

// ---------- Simulation State ----------
const state = {
  x: 0,
  v: 0,
  running: false,
  paused: false,
  animationId: null
};

// ---------- Physics Update ----------
function updatePhysics() {
  if (!state.running || state.paused) return;

  const m = parseFloat(massIn.value) || 1;
  const k = parseFloat(kIn.value) || 0.1;
  const c = parseFloat(cIn.value) || 0;
  const damping = dampingEnable.checked;

  let force = -k * state.x;
  if (damping) force -= c * state.v;

  const a = force / m;
  state.v += a;
  state.x += state.v;

  drawScene();
  state.animationId = requestAnimationFrame(updatePhysics);
}

// ---------- Drawing ----------
function drawHelicalSpring(startX, endX, centerY) {
  const coils = 12;
  const steps = coils * 40;
  const length = endX - startX;
  const amplitude = 18;

  ctx.beginPath();
  ctx.strokeStyle = "#ff8c42";
  ctx.lineWidth = 3;

  ctx.moveTo(scene.wallWidth, centerY);
  ctx.lineTo(startX, centerY);

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI * 2 * coils;
    const x = startX + t * length + Math.cos(angle) * 3;
    const y = centerY + Math.sin(angle) * amplitude;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(endX, centerY);
  ctx.stroke();
}

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Floor
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, scene.groundY);
  ctx.lineTo(canvas.width, scene.groundY);
  ctx.stroke();

  // Wall
  ctx.fillStyle = "#aaa";
  ctx.fillRect(0, 50, scene.wallWidth, scene.groundY - 50);

  const blockX = scene.equilibriumX + state.x;
  const centerY = scene.groundY - scene.blockSize / 2;

  drawHelicalSpring(scene.wallWidth + scene.fixedHandle, blockX, centerY);

  // Mass
  ctx.fillStyle = "#5dade2";
  ctx.strokeStyle = "#ff8c42";
  ctx.lineWidth = 2;
  ctx.fillRect(blockX, scene.groundY - scene.blockSize, scene.blockSize, scene.blockSize);
  ctx.strokeRect(blockX, scene.groundY - scene.blockSize, scene.blockSize, scene.blockSize);
}

// ---------- Controls ----------
startBtn.onclick = () => {
  cancelAnimationFrame(state.animationId);
  state.x = 180;
  state.v = 0;
  state.running = true;
  state.paused = false;
  pauseBtn.textContent = "Pause";
  updatePhysics();
};

pauseBtn.onclick = () => {
  if (!state.running) return;
  state.paused = !state.paused;
  pauseBtn.textContent = state.paused ? "Resume" : "Pause";
  if (!state.paused) updatePhysics();
};

stopBtn.onclick = () => {
  state.running = false;
  state.paused = false;
  cancelAnimationFrame(state.animationId);
  state.x = 0;
  state.v = 0;
  pauseBtn.textContent = "Pause";
  drawScene();
};

// Initial render
drawScene();
