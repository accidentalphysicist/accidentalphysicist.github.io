let chart;
const colors = ['#4A90E2', '#e74c3c', '#27ae60', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#34495e', '#d35400', '#c0392b'];
let functions = [];

function toggleGraphWidget() {
    const widget = document.getElementById('graph-widget');
    widget.style.display = (widget.style.display === 'flex') ? 'none' : 'flex';
    if(widget.style.display === 'flex') initChart();
}

document.getElementById('graph-launcher').onclick = toggleGraphWidget;

function initChart() {
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    if (chart) return; // Prevent re-initialization

    chart = new Chart(ctx, {
        type: 'line',
        data: { datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { type: 'linear', position: 'bottom', title: { display: true, text: 'X Axis' } },
                y: { title: { display: true, text: 'Y Axis' } }
            },
            plugins: { zoom: { zoom: { wheel: { enabled: true }, mode: 'xy' } } }
        }
    });
}

function addFunction() {
    const exp = document.getElementById('funcInput').value;
    if (!exp) return;

    const xMin = parseFloat(document.getElementById('xMin').value);
    const xMax = parseFloat(document.getElementById('xMax').value);
    const shade = document.getElementById('shadeArea').checked;
    
    const data = [];
    const step = (xMax - xMin) / 100;
    
    for (let x = xMin; x <= xMax; x += step) {
        try {
            const y = math.evaluate(exp, { x: x });
            data.push({ x: x, y: y });
        } catch (e) { console.error("Math Error", e); }
    }

    const color = colors[functions.length % colors.length];
    chart.data.datasets.push({
        label: exp,
        data: data,
        borderColor: color,
        backgroundColor: shade ? hexToRgba(color, 0.2) : 'transparent',
        fill: shade,
        borderWidth: 2,
        pointRadius: 0
    });
    
    functions.push(exp);
    chart.update();
    updateFunctionList();
}

// COPY GRAPH TO MAIN CANVAS
function copyGraph() {
    const dataURL = chart.toBase64Image(); // Get graph without background
    fabric.Image.fromURL(dataURL, function(img) {
        img.scale(0.8).set({ left: 300, top: 300 });
        canvas.add(img);
        canvas.setActiveObject(img);
        toggleGraphWidget(); // Return to canvas
    });
}

function updateFunctionList() {
    const list = document.getElementById('function-list');
    list.innerHTML = functions.map((f, i) => `<div class="func-item"><span style="color:${colors[i % colors.length]}">●</span> ${f}</div>`).join('');
}

function clearGraphs() {
    chart.data.datasets = [];
    functions = [];
    chart.update();
    updateFunctionList();
}
