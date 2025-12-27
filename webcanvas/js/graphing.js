// js/graphing.js
let chart;
const graphColors = ['#4A90E2', '#e74c3c', '#27ae60', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#34495e', '#d35400', '#c0392b'];

function toggleGraphWidget() {
    const widget = document.getElementById('graph-widget');
    const isHidden = widget.style.display === 'none' || widget.style.display === '';
    widget.style.display = isHidden ? 'flex' : 'none';
    if (isHidden && !chart) initChart();
}

// Link the launcher icon to the toggle function
document.getElementById('graph-launcher').onclick = toggleGraphWidget;

function initChart() {
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: { datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { type: 'linear', position: 'bottom', title: { display: true, text: 'X Axis' } },
                y: { type: 'linear', title: { display: true, text: 'Y Axis' } }
            },
            plugins: {
                legend: { display: true }
            }
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
    const tableBody = document.querySelector('#valTable tbody');
    if (chart.data.datasets.length === 0) tableBody.innerHTML = ''; // Clear table for new session

    // Calculate points using math.js
    for (let x = xMin; x <= xMax; x += 0.5) {
        try {
            const y = math.evaluate(exp, { x: x });
            data.push({ x: x, y: y });
            
            // Populate table with first few values
            if (x <= xMin + 5) {
                const row = `<tr><td>${x}</td><td>${y.toFixed(2)}</td></tr>`;
                tableBody.innerHTML += row;
            }
        } catch (e) {
            console.error("Plotting error", e);
        }
    }

    const color = graphColors[chart.data.datasets.length % graphColors.length];
    
    chart.data.datasets.push({
        label: exp,
        data: data,
        borderColor: color,
        backgroundColor: shade ? color + '4D' : 'transparent', // 30% opacity for shading
        fill: shade,
        tension: 0.3,
        pointRadius: 0
    });

    chart.update();
}

function copyGraph() {
    // Capture chart as high-res transparent PNG
    const dataURL = chart.toBase64Image();
    
    fabric.Image.fromURL(dataURL, function(img) {
        img.scale(0.7).set({
            left: 200,
            top: container.scrollTop + 100
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        toggleGraphWidget(); // Collapse widget
    });
}

function downloadGraph() {
    const link = document.createElement('a');
    link.download = 'graph.png';
    link.href = chart.toBase64Image();
    link.click();
}

function clearGraphs() {
    chart.data.datasets = [];
    chart.update();
    document.querySelector('#valTable tbody').innerHTML = '';
}
