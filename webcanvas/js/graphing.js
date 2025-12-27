let chart;
let functionRows = [];
const defaultColors = ['#4A90E2', '#e74c3c', '#27ae60', '#f1c40f', '#9b59b6', '#e67e22'];

/**
 * Toggles the Widget and initializes the first function row
 */
function toggleGraphWidget() {
    const widget = document.getElementById('graph-widget');
    const isHidden = widget.style.display === 'none' || widget.style.display === '';
    widget.style.display = isHidden ? 'flex' : 'none';
    if (isHidden && !chart) {
        initChart();
        if (functionRows.length === 0) addFunctionRow(); // Start with one row
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
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: { type: 'linear', position: 'bottom', title: { display: true, text: 'x' } },
                y: { type: 'linear', title: { display: true, text: 'y' } }
            },
            plugins: {
                zoom: { // Enabling interactivity
                    zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy' },
                    pan: { enabled: true, mode: 'xy' }
                },
                legend: { display: true },
                title: { display: true, text: 'Graph' }
            }
        }
    });
}

/**
 * Adds a new UI section for a function
 */
function addFunctionRow() {
    const id = Date.now();
    const container = document.getElementById('function-list');
    const row = document.createElement('div');
    row.className = 'function-row';
    row.id = `row-${id}`;
    row.innerHTML = `
        <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 8px; background: #fff;">
            <input type="text" placeholder="f(x) expression" class="f-exp" oninput="syncGraph()">
            <div style="display:flex; gap:5px; margin-top:5px;">
                <input type="color" class="f-color" value="${defaultColors[functionRows.length % 6]}" onchange="syncGraph()" style="width:30px">
                <select class="f-style" onchange="syncGraph()">
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                </select>
                <input type="text" placeholder="Label" class="f-label" oninput="syncGraph()" style="width:60px">
                <button onclick="removeRow(${id})" style="background:#ff4d4d; color:white; border:none; border-radius:4px; cursor:pointer;">&times;</button>
            </div>
        </div>
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

/**
 * Core Sync Logic: Reads all UI inputs and updates Chart and Table
 */
function syncGraph() {
    if (!chart) return;

    const xMin = parseFloat(document.getElementById('xMin').value) || -10;
    const xMax = parseFloat(document.getElementById('xMax').value) || 10;
    const yMin = document.getElementById('yMin').value;
    const yMax = document.getElementById('yMax').value;
    const deltaX = parseFloat(document.getElementById('deltaX').value) || 0.5;

    // Update Scales & Title
    chart.options.plugins.title.text = document.getElementById('graphTitle').value;
    chart.options.scales.x.title.text = document.getElementById('xLabel').value;
    chart.options.scales.y.title.text = document.getElementById('yLabel').value;
    
    if (yMin !== "") chart.options.scales.y.min = parseFloat(yMin);
    if (yMax !== "") chart.options.scales.y.max = parseFloat(yMax);

    chart.data.datasets = [];
    const tableData = {}; // To store x: [y1, y2...] for the table

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
                    if (!tableData[x]) tableData[x] = [];
                    tableData[x].push(y.toFixed(2));
                }
            }

            let dash = [];
            if (style === 'dashed') dash = [10, 5];
            else if (style === 'dotted') dash = [2, 5];

            chart.data.datasets.push({
                label: label,
                data: pts,
                borderColor: color,
                borderDash: dash,
                pointRadius: 0,
                fill: false,
                tension: 0.2
            });
        } catch (e) { console.error("Math error", e); }
    });

    chart.update();
    renderMultiColumnTable(tableData);
}

/**
 * Generates a table where each function is a new column
 */
function renderMultiColumnTable(tableData) {
    const table = document.getElementById('valTable');
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    // Reset Table Headers
    thead.innerHTML = '<th>x</th>';
    chart.data.datasets.forEach(ds => {
        thead.innerHTML += `<th>${ds.label}</th>`;
    });

    tbody.innerHTML = '';
    const sortedX = Object.keys(tableData).sort((a, b) => a - b);
    
    sortedX.slice(0, 30).forEach(x => { // Show first 30 rows
        let rowHtml = `<td>${x}</td>`;
        tableData[x].forEach(y => {
            rowHtml += `<td>${y}</td>`;
        });
        tbody.innerHTML += `<tr>${rowHtml}</tr>`
    });
}

function clearGraphs() {
    document.getElementById('function-list').innerHTML = '';
    functionRows = [];
    addFunctionRow();
}

function copyGraph() {
    const dataURL = chart.toBase64Image();
    fabric.Image.fromURL(dataURL, function(img) {
        img.scale(0.8).set({ left: 100, top: container.scrollTop + 50 });
        canvas.add(img);
        toggleGraphWidget();
    });
}
