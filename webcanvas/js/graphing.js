let chart;
const colors = ['#4A90E2', '#e74c3c', '#27ae60', '#f1c40f', '#9b59b6', '#e67e22'];

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
                legend: { display: true, labels: { boxWidth: 12 } }
            }
        }
    });
}

function addFunction() {
    const exp = document.getElementById('funcInput').value;
    if (!exp) return;

    const xMin = parseFloat(document.getElementById('xMin').value) || -10;
    const xMax = parseFloat(document.getElementById('xMax').value) || 10;
    const step = parseFloat(document.getElementById('deltaX').value) || 0.1;
    
    // Apply Global Labels
    chart.options.plugins.title.text = document.getElementById('graphTitle').value;
    chart.options.scales.x.title.text = document.getElementById('xLabel').value || 'x';
    chart.options.scales.y.title.text = document.getElementById('yLabel').value || 'y';

    try {
        const data = [];
        for (let x = xMin; x <= xMax; x += step) {
            const y = math.evaluate(exp, { x: x });
            if (typeof y === 'number' && isFinite(y)) {
                data.push({ x: x, y: y });
            }
        }

        const colorIndex = chart.data.datasets.length % colors.length;
        chart.data.datasets.push({
            label: exp,
            data: data,
            borderColor: colors[colorIndex],
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.1
        });

        chart.update();
        updateTable(data);
    } catch (e) {
        alert("Check your math syntax! Example: 2*x^2 + sin(x)");
    }
}

function updateTable(data) {
    const tbody = document.querySelector('#valTable tbody');
    tbody.innerHTML = '';
    // Display first 20 points to keep UI fast
    data.slice(0, 20).forEach(pt => {
        tbody.innerHTML += `<tr><td>${pt.x.toFixed(2)}</td><td>${pt.y.toFixed(2)}</td></tr>`;
    });
}

function exportCSV() {
    if (!chart.data.datasets.length) return;
    const lastData = chart.data.datasets[chart.data.datasets.length - 1].data;
    let csv = "x,y\n" + lastData.map(p => `${p.x},${p.y}`).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph_data.csv';
    a.click();
}

function copyGraph() {
    const dataURL = chart.toBase64Image();
    fabric.Image.fromURL(dataURL, function(img) {
        img.scale(0.8).set({ left: 100, top: container.scrollTop + 100 });
        canvas.add(img);
        toggleGraphWidget();
    });
}

function clearGraphs() {
    chart.data.datasets = [];
    chart.update();
    document.querySelector('#valTable tbody').innerHTML = '';
}
