const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");

let startTime = null;
let animationId = null;

let A, k, m, b;
let omega, omega_d;
let dampingEnabled;

let timeData = [];
let displacementData = [];
let chart;

// ------------------ DRAWING ------------------
function drawSystem(x) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Wall
  ctx.fillRect(10, 80, 10, 40);

  // Spring
  ctx.beginPath();
  ctx.moveTo(20, 100);
  ctx.lineTo(200 + x, 100);
  ctx.stroke();

  // Mass
  ctx.fillRect(200 + x, 80, 40, 40);
}

// ------------------ ANIMATION LOOP ------------------
function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  let t = (timestamp - startTime) / 1000;

  let x;
  if (dampingEnabled) {
    x = A * Math.exp(-b * t / (2 * m)) * Math.cos(omega_d * t);
  } else {
    x = A * Math.cos(omega * t);
  }

  drawSystem(x);

  timeData.push(t.toFixed(2));
  displacementData.push(x.toFixed(2));

  if (timeData.length > 150) {
    timeData.shift();
    displacementData.shift();
  }

  updateGraph();

  animationId = requestAnimationFrame(animate);
}

// ------------------ GRAPH ------------------
function initGraph() {
  const ctxG = document.getElementById("graphCanvas").getContext("2d");

  chart = new Chart(ctxG, {
    type: "line",
    data: {
      labels: timeData,
      datasets: [{
        label: "Displacement",
        data: displacementData,
        borderColor: "blue",
        fill: false
      }]
    },
    options: {
      animation: false,
      scales: {
        x: { title: { display: true, text: "Time (s)" } },
        y: { title: { display: true, text: "x" } }
      }
    }
  });
}

function updateGraph() {
  chart.data.labels = timeData;
  chart.data.datasets[0].data = displacementData;
  chart.update();
}

// ------------------ CONTROLS ------------------
function startSimulation() {
  stopSimulation();

  A = parseFloat(document.getElementById("A").value);
  k = parseFloat(document.getElementById("k").value);
  m = parseFloat(document.getElementById("m").value);
  b = parseFloat(document.getElementById("b").value);
  dampingEnabled = document.getElementById("dampingToggle").checked;

  omega = Math.sqrt(k / m);

  if (dampingEnabled) {
    omega_d = Math.sqrt(Math.max(0, k / m - (b * b) / (4 * m * m)));
  }

  startTime = null;
  timeData = [];
  displacementData = [];

  if (chart) chart.destroy();
  initGraph();

  animationId = requestAnimationFrame(animate);
}

function stopSimulation() {
  if (animationId) cancelAnimationFrame(animationId);
}
