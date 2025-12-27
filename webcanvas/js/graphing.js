let chart;
const defaultColors = ['#4A90E2', '#e74c3c', '#27ae60', '#f1c40f', '#9b59b6', '#8e44ad'];
let plotConfigs = []; // Stores individual function settings

function toggleGraphWidget() {
    const widget = document.getElementById('graph-widget');
    const isHidden = widget.style.display === 'none' || widget.style.display === '';
    widget.style.display = isHidden ? 'flex' : 'none';
    if (isHidden && !chart) initChart();
}

function initChart() {
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: { datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { type: 'linear', position: 'bottom', title: { display: true, text: '' } },
                y: { type: 'linear', title: { display: true, text: '' } }
            },
            plugins: {
                title: { display: true, text: '' },
                legend: { display: true }
            }
        }
    });
}

/**
 * Core Plotting Logic
 */
function addFunction() {
    const exp = document.getElementById('funcInput').value;
    if (!exp) return;

    const xMin = parseFloat(document.getElementById('xMin').value) || -10;
    const xMax = parseFloat(document.getElementById('xMax').value) || 10;
    const deltaX = parseFloat(document.getElementById('deltaX')?.value) || 0.1;
    const color = defaultColors[chart.data.datasets.length % defaultColors.length];

    try {
        const node = math.parse(exp);
        const code = node.compile();
        const dataPoints = [];

        // Generate Data
        for (let x = xMin; x <= xMax; x += deltaX) {
            let y = code.evaluate({ x: x });
            if (typeof y === 'number' && isFinite(y)) {
                dataPoints.push({ x: x, y: y });
            }
        }

        // Add to Chart
        chart.data.datasets.push({
            label: exp,
            data: dataPoints,
            borderColor: color,
            borderDash: [], // Can be changed to [5, 5] for dashed
            backgroundColor: 'transparent',
            fill: false,
            borderWidth: 2,
            pointRadius: 0
        });

        // Update Global Labels
        chart.options.plugins.title.text = document.getElementById('graphTitle')?.value || "";
        chart.options.scales.x.title.text = document.getElementById('xLabel')?.value || "x";
        chart.options.scales.y.title.text = document.getElementById('yLabel')?.value || "y";

        chart.update();
        updateTable();
    } catch (e) {
        alert("Invalid math expression. Use 'x' as variable.");
    }
}

/**
 * Table Management
 */
function updateTable() {
    const tableBody = document.querySelector('#valTable tbody');
    tableBody.innerHTML = '';
    
    // We show values for the last added function
    if (chart.data.datasets.length === 0) return;
    const lastData = chart.data.datasets[chart.data.datasets.length - 1].data;
    
    // Limit table display to avoid crashing browser (first 50 points)
    lastData.slice(0, 50).forEach(pt => {
        tableBody.innerHTML += `<tr><td>${pt.x.toFixed(2)}</td><td>${pt.y.toFixed(2)}</td></tr>`;
    });
}

function exportTableToCanvas() {
    // Create a temporary HTML/Canvas to draw the table text
    const canvasTemp = document.createElement('canvas');
    const ctx = canvasTemp.getContext('2d');
    canvasTemp.width = 300;
    canvasTemp.height = 500;
    
    ctx.fillStyle = document.getElementById('colorPicker').value || 'black';
    ctx.font = "16px Arial";
    ctx.fillText("Table of Values", 10, 30);
    
    let yPos = 60;
    const lastData = chart.data.datasets[chart.data.datasets.length - 1].data.slice(0, 15);
    lastData.forEach(pt => {
        ctx.fillText(`x: ${pt.x.toFixed(2)} | y: ${pt.y.toFixed(2)}`, 10, yPos);
        yPos += 25;
    });

    const dataURL = canvasTemp.toDataURL();
    fabric.Image.fromURL(dataURL, function(img) {
        img.set({ left: 400, top: container.scrollTop + 100 });
        canvas.add(img);
        toggleGraphWidget();
    });
}

function exportCSV() {
    if (chart.data.datasets.length === 0) return;
    const data = chart.data.datasets[chart.data.datasets.length - 1].data;
    let csvContent = "data:text/csv;charset=utf-8,x,y\n" + data.map(e => `${e.x},${e.y}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "graph_data.csv");
    document.body.appendChild(link);
    link.click();
}

function clearGraphs() {
    chart.data.datasets = [];
    chart.update();
    updateTable();
}

function copyGraph() {
    const dataURL = chart.toBase64Image();
    fabric.Image.fromURL(dataURL, function(img) {
        img.scale(0.8).set({ left: 150, top: container.scrollTop + 100 });
        canvas.add(img);
        toggleGraphWidget();
    });
}
