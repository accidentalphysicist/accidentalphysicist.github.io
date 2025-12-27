let chart;
let functionRows = [];
const defaultColors = ['#4A90E2', '#e74c3c', '#27ae60', '#f1c40f', '#9b59b6', '#e67e22'];

function toggleGraphWidget() {
    const widget = document.getElementById('graph-widget');
    const isHidden = widget.style.display === 'none' || widget.style.display === '';
    widget.style.display = isHidden ? 'flex' : 'none';
    if (isHidden && !chart) {
        initChart();
        if (functionRows.length === 0) addFunctionRow();
    }
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
                x: { type: 'linear', position: 'bottom', title: { display: true, text: 'x', font: { size: 16 } } },
                y: { type: 'linear', title: { display: true, text: 'y', font: { size: 16 } } }
            },
            plugins: {
                zoom: {
                    zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy' },
                    pan: { enabled: true, mode: 'xy' }
                },
                legend: { position: 'top' },
                title: { display: true, font: { size: 20 } }
            }
        }
    });
}

function addFunctionRow() {
    const id = Date.now();
    const container = document.getElementById('function-list');
    const row = document.createElement('div');
    row.className = 'function-row';
    row.id = `row-${id}`;
    row.innerHTML = `
        <div style="background: #fff; border: 1px solid #ddd; padding: 12px; border-radius: 8px; margin-bottom: 10px;">
            <input type="text" placeholder="e.g., sin(x) * x" class="f-exp" oninput="syncGraph()">
            <div style="display:flex; gap:8px; margin-top:8px; align-items:center;">
                <input type="color" class="f-color" value="${defaultColors[functionRows.length % 6]}" onchange="syncGraph()" style="width:40px; height:40px; padding:2px; border:none;">
                <select class="f-style" onchange="syncGraph()" style="flex:1;">
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                </select>
                <button onclick="removeRow(${id})" style="background:#ff4d4d; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash"></i></button>
            </div>
            <input type="text" placeholder="Legend Label" class="f-label" oninput="syncGraph()" style="margin-top:8px;">
        </div>
    `;
    container.appendChild(row);
    functionRows.push({ id, element: row });
}

function syncGraph() {
    if (!chart) return;
    const xMin = parseFloat(document.getElementById('xMin').value) || -10;
    const xMax = parseFloat(document.getElementById('xMax').value) || 10;
    const deltaX = parseFloat(document.getElementById('deltaX').value) || 0.5;

    chart.options.plugins.title.text = document.getElementById('graphTitle').value;
    chart.options.scales.x.title.text = document.getElementById('xLabel').value;
    chart.options.scales.y.title.text = document.getElementById('yLabel').value;

    chart.data.datasets = [];
    const fullTableData = {};

    functionRows.forEach(rowObj => {
        const exp = rowObj.element.querySelector('.f-exp').value;
        const color = rowObj.element.querySelector('.f-color').value;
        const style = rowObj.element.querySelector('.f-style').value;
        const label = rowObj.element.querySelector('.f-label').value || exp;

        if (!exp) return;

        try {
            const compiled = math.compile(exp);
            const pts = [];
            for (let x = xMin; x <= xMax; x = +(x + deltaX).toFixed(10)) {
                let y = compiled.evaluate({ x: x });
                if (typeof y === 'number' && isFinite(y)) {
                    pts.push({ x: x, y: y });
                    if (!fullTableData[x]) fullTableData[x] = {};
                    fullTableData[x][label] = y.toFixed(2);
                }
            }

            chart.data.datasets.push({
                label: label,
                data: pts,
                borderColor: color,
                borderDash: style === 'dashed' ? [10, 5] : (style === 'dotted' ? [2, 5] : []),
                pointRadius: 0,
                fill: false,
                tension: 0.2
            });
        } catch (e) { console.error(e); }
    });

    chart.update();
    renderTable(fullTableData);
}

function renderTable(data) {
    const table = document.getElementById('valTable');
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');
    
    thead.innerHTML = '<th>x</th>';
    const labels = chart.data.datasets.map(d => d.label);
    labels.forEach(l => thead.innerHTML += `<th>${l}</th>`);

    tbody.innerHTML = '';
    Object.keys(data).sort((a,b)=>a-b).slice(0, 50).forEach(x => {
        let rows = `<td>${x}</td>`;
        labels.forEach(l => rows += `<td>${data[x][l] || '-'}</td>`);
        tbody.innerHTML += `<tr>${rows}</tr>`;
    });
}

/**
 * NEW: Export Table as PNG
 */
function exportTableToCanvas() {
    const table = document.getElementById('valTable');
    // Using html2canvas or manual draw for a clean backgroundless PNG
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    tempCanvas.width = 450;
    tempCanvas.height = 600;

    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText(document.getElementById('graphTitle').value || "Data Table", 20, 40);
    
    ctx.font = "14px Arial";
    let y = 80;
    const labels = chart.data.datasets.map(d => d.label);
    
    // Draw Headers
    ctx.fillText("x | " + labels.join(" | "), 20, y);
    ctx.fillRect(20, y+5, 400, 1);
    
    // Draw first 15 rows
    const datasets = chart.data.datasets;
    if(datasets.length > 0) {
        datasets[0].data.slice(0, 15).forEach((pt, i) => {
            y += 30;
            let rowText = `${pt.x.toFixed(1)} | `;
            datasets.forEach(ds => rowText += `${ds.data[i]?.y.toFixed(2) || '-'} | `);
            ctx.fillText(rowText, 20, y);
        });
    }

    fabric.Image.fromURL(tempCanvas.toDataURL(), function(img) {
        img.set({ left: 300, top: container.scrollTop + 50 });
        canvas.add(img);
        toggleGraphWidget();
    });
}

/**
 * NEW: Download Table as CSV
 */
function exportCSV() {
    const datasets = chart.data.datasets;
    if (datasets.length === 0) return;

    let csv = "x," + datasets.map(d => d.label).join(",") + "\n";
    const masterX = datasets[0].data;

    masterX.forEach((pt, i) => {
        let row = pt.x + "," + datasets.map(ds => ds.data[i]?.y || "").join(",");
        csv += row + "\n";
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph_data.csv';
    a.click();
}

function copyGraph() {
    const dataURL = chart.toBase64Image();
    fabric.Image.fromURL(dataURL, function(img) {
        img.scale(0.8).set({ left: 100, top: container.scrollTop + 50 });
        canvas.add(img);
        toggleGraphWidget();
    });
}
