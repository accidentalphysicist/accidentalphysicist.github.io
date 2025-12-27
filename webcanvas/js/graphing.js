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
                x: { type: 'linear', position: 'bottom', title: { display: true, text: 'x' } },
                y: { type: 'linear', title: { display: true, text: 'y' } }
            },
            plugins: {
                zoom: {
                    zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy' },
                    pan: { enabled: true, mode: 'xy' }
                },
                legend: { position: 'top' },
                title: { display: true }
            }
        }
    });
}

function addFunctionRow() {
    const id = Date.now();
    const container = document.getElementById('function-list');
    const row = document.createElement('div');
    row.style = "background: #fff; border: 1px solid #ddd; padding: 12px; border-radius: 8px; margin-bottom: 15px; border-left: 5px solid " + defaultColors[functionRows.length % 6];
    row.id = `row-${id}`;
    row.innerHTML = `
        <input type="text" placeholder="e.g., x^2" class="f-exp" oninput="syncGraph()" style="width:100%; padding:8px; box-sizing:border-box;">
        <div style="display:flex; gap:8px; margin-top:8px; align-items:center;">
            <input type="color" class="f-color" value="${defaultColors[functionRows.length % 6]}" onchange="syncGraph()" style="width:35px; height:35px; border:none; padding:0; cursor:pointer;">
            <select class="f-style" onchange="syncGraph()" style="flex:1; padding:5px;">
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
            </select>
            <button onclick="removeRow(${id})" style="background:#ff4d4d; color:white; border:none; padding:8px 10px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash"></i></button>
        </div>
        <input type="text" placeholder="Label" class="f-label" oninput="syncGraph()" style="margin-top:8px; width:100%; padding:5px; box-sizing:border-box;">
    `;
    container.appendChild(row);
    functionRows.push({ id, element: row });
    syncGraph();
}

function removeRow(id) {
    document.getElementById(`row-${id}`).remove();
    functionRows = functionRows.filter(r => r.id !== id);
    syncGraph();
}

function syncGraph() {
    if (!chart) return;
    const xMin = parseFloat(document.getElementById('xMin').value) || -10;
    const xMax = parseFloat(document.getElementById('xMax').value) || 10;
    const yMin = document.getElementById('yMin').value;
    const yMax = document.getElementById('yMax').value;
    const deltaX = parseFloat(document.getElementById('deltaX').value) || 0.5;

    chart.options.plugins.title.text = document.getElementById('graphTitle').value;
    chart.options.scales.x.title.text = document.getElementById('xLabel').value || 'x';
    chart.options.scales.y.title.text = document.getElementById('yLabel').value || 'y';

    // Manual Y limits if provided
    chart.options.scales.y.min = yMin !== "" ? parseFloat(yMin) : undefined;
    chart.options.scales.y.max = yMax !== "" ? parseFloat(yMax) : undefined;

    chart.data.datasets = [];
    const tableData = {};

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
                    if (!tableData[x]) tableData[x] = {};
                    tableData[x][label] = y.toFixed(2);
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
    renderTable(tableData);
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

function copyGraph() {
    const dataURL = chart.toBase64Image();
    fabric.Image.fromURL(dataURL, function(img) {
        img.scale(0.8).set({ left: 100, top: container.scrollTop + 50 });
        canvas.add(img);
        toggleGraphWidget();
    });
}

function downloadGraph() {
    const a = document.createElement('a');
    a.href = chart.toBase64Image();
    a.download = 'graph.png';
    a.click();
}

function exportCSV() {
    const datasets = chart.data.datasets;
    if (datasets.length === 0) return;
    let csv = "x," + datasets.map(d => d.label).join(",") + "\n";
    const xValues = Object.keys(datasets[0].data.reduce((acc, curr) => { acc[curr.x] = true; return acc; }, {}));
    
    xValues.forEach(x => {
        let row = x + "," + datasets.map(ds => {
            const pt = ds.data.find(p => p.x == x);
            return pt ? pt.y : "";
        }).join(",");
        csv += row + "\n";
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph_data.csv';
    a.click();
}

function exportTableToCanvas() {
    const tempCanvas = document.createElement('canvas');
    const tCtx = tempCanvas.getContext('2d');
    tempCanvas.width = 500;
    tempCanvas.height = 700;
    tCtx.fillStyle = "white";
    tCtx.fillRect(0,0,500,700);
    tCtx.fillStyle = "black";
    tCtx.font = "bold 16px Arial";
    
    const labels = chart.data.datasets.map(d => d.label);
    let y = 30;
    tCtx.fillText("x | " + labels.join(" | "), 20, y);
    y += 25;

    chart.data.datasets[0].data.slice(0, 20).forEach((pt, i) => {
        let row = pt.x.toFixed(1) + " | ";
        chart.data.datasets.forEach(ds => row += (ds.data[i]?.y.toFixed(2) || "-") + " | ");
        tCtx.fillText(row, 20, y);
        y += 20;
    });

    fabric.Image.fromURL(tempCanvas.toDataURL(), function(img) {
        img.scale(0.8).set({ left: 300, top: container.scrollTop + 50 });
        canvas.add(img);
        toggleGraphWidget();
    });
}

function clearGraphs() {
    document.getElementById('function-list').innerHTML = '';
    functionRows = [];
    addFunctionRow();
}
