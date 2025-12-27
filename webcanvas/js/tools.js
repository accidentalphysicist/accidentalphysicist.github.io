const sizeInput = document.getElementById('size-input');
const colorPicker = document.getElementById('color-picker');
const tools = document.querySelectorAll('.tool');

function setActiveTool(element) {
    tools.forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}

const updateBrush = (type, clickedElement) => {
    setActiveTool(clickedElement);
    
    const color = colorPicker.value;
    const size = parseInt(sizeInput.value);
    
    // Reset to default pencil brush for all writing tools
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = size;

    if (type === 'pen') {
        canvas.freeDrawingBrush.color = color;
        canvas.contextTop.globalCompositeOperation = 'source-over';
    } 
    else if (type === 'pencil') {
        canvas.freeDrawingBrush.color = convertHexToRGBA(color, 0.5);
        canvas.contextTop.globalCompositeOperation = 'source-over';
    } 
    else if (type === 'marker') {
        canvas.freeDrawingBrush.color = convertHexToRGBA(color, 0.3);
        canvas.contextTop.globalCompositeOperation = 'source-over';
    } 
    else if (type === 'eraser') {
        // This is the fix: It tells the canvas to "cut out" pixels instead of painting
        canvas.freeDrawingBrush.color = '#000000'; // Color doesn't matter in this mode
        canvas.contextTop.globalCompositeOperation = 'destination-out';
    }
};

// Event Listeners
document.getElementById('pen-tool').onclick = (e) => updateBrush('pen', e.currentTarget);
document.getElementById('pencil-tool').onclick = (e) => updateBrush('pencil', e.currentTarget);
document.getElementById('marker-tool').onclick = (e) => updateBrush('marker', e.currentTarget);
document.getElementById('eraser-tool').onclick = (e) => updateBrush('eraser', e.currentTarget);

sizeInput.oninput = () => {
    canvas.freeDrawingBrush.width = parseInt(sizeInput.value) || 1;
};

colorPicker.oninput = () => {
    // Only update color if not in eraser mode
    if (canvas.contextTop.globalCompositeOperation !== 'destination-out') {
        canvas.freeDrawingBrush.color = colorPicker.value;
    }
};

function convertHexToRGBA(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
}

// Set initial state
updateBrush('pen', document.getElementById('pen-tool'));
