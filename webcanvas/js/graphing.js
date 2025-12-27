// js/graphing.js

let chart;
const graphColors = ['#4A90E2', '#e74c3c', '#27ae60', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#34495e', '#d35400', '#c0392b'];
let activeFunctions = [];

/**
 * Toggles the visibility of the Graphing Widget
 */
function toggleGraphWidget() {
    const widget = document.getElementById('graph-widget');
    const isHidden = widget.style.display === 'none' || widget.style.display === '';
    
    widget.style.display = isHidden ? 'flex' : 'none';
    
    // Initialize the chart only once when the widget is first opened
    if (isHidden && !chart) {
        initChart();
    }
}

/**
 * Initializes the Chart.js instance
 */
function initChart() {
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: { color: '#eee' },
                    title: { display: true, text: 'x' }
                },
                y: {
                    grid: { color: '#eee' },
                    title: { display: true, text: 'f(x)' }
                }
            },
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            }
        }
    });
}

/**
 * Plots the function entered in the input field
 */
function addFunction() {
    const exp = document.getElementById('funcInput').value;
    if (!exp) return;

    const xMin = parseFloat(document.getElementById('xMin').value) || -10;
    const xMax = parseFloat(document.getElementById('xMax').value) || 10;
    const shade = document.getElementById('shadeArea').checked;
    
    const dataPoints = [];
    const tableBody = document.querySelector('#valTable tbody');
    
    // We'll calculate 200 points for a smooth curve
    const step = (xMax - xMin) / 200;

    try {
        // Compile the expression once for performance
        const node = math.parse(exp);
        const code = node.compile();

        for (let x = xMin; x <= xMax; x += step) {
            let scope = { x: x };
            let y = code.evaluate(scope);
            
            // Filter out non-numeric results (like imaginary numbers)
            if (typeof y === 'number' && isFinite(y)) {
                dataPoints.push({ x: x, y: y });
            }
        }

        const color = graphColors[chart.data.datasets.length % graphColors.length];
        
        chart.data.datasets.push({
            label: exp,
            data: dataPoints,
            borderColor: color,
            backgroundColor: shade ? color + '33' : 'transparent', // '33' is approx 20% opacity
            fill: shade,
            borderWidth: 2,
            pointRadius: 0, // Keeps the line clean
            tension: 0.2    // Slight smoothing
        });

        chart.update();
        updateTable(exp, code, xMin, xMax);
        document.getElementById('funcInput').value = ''; // Clear input
        
    } catch (error) {
        alert("Invalid Function: Use standard math notation (e.g., x^2, sin(x), 2*x + 5)");
        console.error(error);
    }
}

/**
 * Updates the table of values with a subset of points
 */
function updateTable(exp, code, min, max) {
    const tableBody = document.querySelector('#valTable tbody');
    // Clear previous table content
    tableBody.innerHTML = ''; 

    // Add 10 sample points to the table
    const tableStep = (max - min) / 10;
    for (let x = min; x <= max; x += tableStep) {
        try {
            let y = code.evaluate({ x: x });
            if (typeof y === 'number') {
                const row = `<tr><td>${x.toFixed(1)}</td><td>${y.toFixed(2)}</td></tr>`;
                tableBody.innerHTML += row;
            }
        } catch (e) {}
    }
}

/**
 * Captures the current graph and pastes it onto the Fabric.js canvas
 */
function copyGraph() {
    if (!chart || chart.data.datasets.length === 0) {
        alert("Plot a function first!");
        return;
    }

    // Get the chart image as a Base64 string (PNG)
    const dataURL = chart.toBase64Image();
    
    // Use the global 'canvas' and 'container' variables from index.html
    fabric.Image.fromURL(dataURL, function(img) {
        img.scale(0.8).set({
            left: 150,
            top: (container.scrollTop || 0) + 100
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        
        // Auto-close widget and switch to selection mode
        toggleGraphWidget();
        setMode('select'); 
    });
}

/**
 * Downloads the graph as a standalone PNG
 */
function downloadGraph() {
    const link = document.createElement('a');
    link.download = 'my-graph.png';
    link.href = chart.toBase64Image();
    link.click();
}

/**
 * Clears the graph and the table
 */
function clearGraphs() {
    if (chart) {
        chart.data.datasets = [];
        chart.update();
    }
    document.querySelector('#valTable tbody').innerHTML = '';
}
