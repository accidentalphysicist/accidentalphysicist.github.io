/* ===========================
   CANVAS: SPRING SIMULATION
   =========================== */

const simCanvas = document.getElementById("simCanvas");
const simCtx = simCanvas.getContext("2d");

/* ===========================
   GRAPH
   =========================== */

const graphCtx = document.getElementById("graphCanvas").getContext("2d");
let chart;

/* ===========================
   STATE VARIABLES
   =========================== */

let animationId = null;
let startTime = null;
let pausedTime = 0;
let isPaused = false;

let A, k, m, b;
let omega, omega_d;
let isDamped = false;

let timeData = [];
let displacementData = [];

/* ===========================
   DRAW SPRING SYSTEM
   =========================== */

function drawSpring(x) {
  simCtx.clearRect(0, 0, simCanvas.width, simCanvas.height);

  // Wall
  simCtx.fillStyle = "#ffffff";
  simCtx.fillRect(10, 80, 10, 60);

  // Spring
  simCtx.beginPath();
  simCtx.moveTo(20, 110);
  simCtx.lineTo(200 + x, 110);
  simCtx.strokeStyle = "#5bc0eb";
  simCtx.lineWidth = 2;
  simCtx.stroke();

  // Mass
  simCtx.fillStyle = "#4caf50";
  simCtx.fillRect(200 + x, 85, 40, 50);
}

/* ===========================
   ANIMATION LOOP
   =========================== */

function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const t = (timestamp - startTime - pausedTime) / 1000;

  let x;
  if (isDamped) {
    x = A * Math.exp(-b * t / (2 * m)) * Math.cos(omega_d * t);
  } else {
    x = A * Math.cos(omega * t);
  }

  drawSpring(x);

  timeData.push(t);
  displacementData.push(x);

  updateGraph();

  animationId = requestAnimationFrame(animate);
}

/* ===========================
   GRAPH INITIALIZATION
   =========================== */

function initGraph() {
  const yMax = A + A / 5;
  const yMin = -A - A / 5;

  chart = new Chart(graphCtx, {
    type: "line",
    data: {
      labels: timeData,
      datasets: [{
        label: "Displacement (x)",
        data: displacementData,
        borderColor: "#e63946",
        borderWidth: 2,
        pointRadius: 0
      }]
    },
    options: {
      animation: false,
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: "Time (s)" }
        },
        y: {
          title: { display: true, text: "Displacement" },
          min: yMin,
          max: yMax
        }
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: "x"
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
  chart.data.labels = timeData;
  chart.data.datasets[0].data = displacementData;
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
    omega_d = Math.sqrt(
      Math.max(0, k / m - (b * b) / (4 * m * m))
    );
  }

  timeData = [];
  displacementData = [];

  startTime = null;
  pausedTime = 0;
  isPaused = false;

  if (chart) chart.destroy();
  initGraph();

  animationId = requestAnimationFrame(animate);
}

function pauseSimulation() {
  if (!animationId) return;

  if (!isPaused) {
    cancelAnimationFrame(animationId);
    pausedTime += performance.now() - startTime - pausedTime;
    isPaused = true;
  } else {
    startTime = performance.now();
    animationId = requestAnimationFrame(animate);
    isPaused = false;
  }
}

function stopSimulation() {
  if (animationId) cancelAnimationFrame(animationId);
  animationId = null;
  isPaused = false;
  startTime = null;
}

/* ===========================
   EXPORT FUNCTIONS
   =========================== */

function exportGraphPNG() {
  const link = document.createElement("a");
  link.href = graphCtx.canvas.toDataURL("image/png");
  link.download = "shm_graph.png";
  link.click();
}

function exportCSV() {
  let csv = "Time,Displacement\n";
  for (let i = 0; i < timeData.length; i++) {
    csv += `${timeData[i]},${displacementData[i]}\n`;
  }

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "shm_data.csv";
  link.click();
}
