/* ===========================
   CANVAS: SPRING SIMULATION
   =========================== */

const simCanvas = document.getElementById("simCanvas");
const simCtx = simCanvas.getContext("2d");

const graphCtx = document.getElementById("graphCanvas").getContext("2d");
let chart;

/* ===========================
   STATE VARIABLES
   =========================== */

let animationId = null;
let startTime = null;
let pausedTime = 0;
let isPaused = false;
let isRunning = false;

let A, k, m, b;
let omega, omega_d;
let isDamped = false;

let timeData = [];
let displacementData = [];

/* ===========================
   DRAWING HELPERS
   =========================== */

const FLOOR_Y = 140;
const MEAN_X = 220;

function drawSpring(x) {
  simCtx.clearRect(0, 0, simCanvas.width, simCanvas.height);

  simCtx.strokeStyle = "#ffffff";
  simCtx.fillStyle = "#ffffff";
  simCtx.lineWidth = 2;

  /* Floor */
  simCtx.beginPath();
  simCtx.moveTo(0, FLOOR_Y + 25);
  simCtx.lineTo(simCanvas.width, FLOOR_Y + 25);
  simCtx.stroke();

  /* Mean position */
  simCtx.setLineDash([5, 5]);
  simCtx.beginPath();
  simCtx.moveTo(MEAN_X, 0);
  simCtx.lineTo(MEAN_X, simCanvas.height);
  simCtx.stroke();
  simCtx.setLineDash([]);

  /* Extreme positions */
  drawExtreme(MEAN_X + A, "+A");
  drawExtreme(MEAN_X - A, "-A");

  /* Spring (zig-zag) */
  drawZigZagSpring(40, MEAN_X + x - 20, FLOOR_Y);

  /* Mass */
  simCtx.fillRect(MEAN_X + x - 20, FLOOR_Y - 20, 40, 40);
}

function drawExtreme(x, label) {
  simCtx.beginPath();
  simCtx.moveTo(x, FLOOR_Y + 10);
  simCtx.lineTo(x, FLOOR_Y - 30);
  simCtx.stroke();
  simCtx.fillText(label, x - 8, FLOOR_Y - 35);
}

function drawZigZagSpring(x1, x2, y) {
  const coils = 12;
  const dx = (x2 - x1) / coils;

  simCtx.beginPath();
  simCtx.moveTo(x1, y);

  for (let i = 1; i < coils; i++) {
    simCtx.lineTo(
      x1 + i * dx,
      y + (i % 2 === 0 ? -10 : 10)
    );
  }
  simCtx.lineTo(x2, y);
  simCtx.stroke();
}

/* ===========================
   ANIMATION LOOP
   =========================== */

function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const t = (timestamp - startTime - pausedTime) / 1000;

  let x = 0;
  if (isRunning) {
    if (isDamped) {
      x = A * Math.exp(-b * t / (2 * m)) * Math.cos(omega_d * t);
    } else {
      x = A * Math.cos(omega * t);
    }

    timeData.push(t);
    displacementData.push(x);
    updateGraph();
  }

  drawSpring(x);
  animationId = requestAnimationFrame(animate);
}

/* ===========================
   GRAPH
   =========================== */

function initGraph() {
  const yMax = A + A / 5;
  const yMin = -A - A / 5;

  chart = new Chart(graphCtx, {
    type: "line",
    data: {
      labels: timeData,
      datasets: [{
        data: displacementData,
        borderColor: "#ffffff",
        borderWidth: 2,
        pointRadius: 0
      }]
    },
    options: {
      animation: false,
      scales: {
        x: {
          title: { display: true, text: "Time (s)", color: "#ffffff" },
          ticks: { color: "#ffffff" }
        },
        y: {
          title: { display: true, text: "Displacement (cm)", color: "#ffffff" },
          ticks: { color: "#ffffff" },
          min: yMin,
          max: yMax
        }
      },
      plugins: {
        legend: { display: false },
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
            modifierKey: null   // 🔑 FIX: allows drag without ctrl
          },
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: "x"
          }
        }
      }
    }
  });
}

function updateGraph() {
  chart.update();
}

/* ===========================
   CONTROLS
   =========================== */

function startSimulation() {
  stopSimulation();

  A = parseFloat(document.getElementById("A").value);
  k = parseFloat(document.getElementById("k").value);
  m = parseFloat(document.getElementById("m").value);
  b = parseFloat(document.getElementById("b").value);
  isDamped = document.getElementById("dampingToggle").checked;

  omega = Math.sqrt(k / m);
  if (isDamped) {
    omega_d = Math.sqrt(Math.max(0, k / m - (b * b) / (4 * m * m)));
  }

  timeData = [];
  displacementData = [];

  isRunning = true;
  startTime = null;
  pausedTime = 0;

  if (chart) chart.destroy();
  initGraph();

  animationId = requestAnimationFrame(animate);
}

function pauseSimulation() {
  if (!isRunning) return;

  if (!isPaused) {
    pausedTime += performance.now() - startTime - pausedTime;
    isPaused = true;
    isRunning = false;
  } else {
    startTime = performance.now();
    isPaused = false;
    isRunning = true;
  }
}

function stopSimulation() {
  isRunning = false;
  isPaused = false;
  startTime = null;
}
