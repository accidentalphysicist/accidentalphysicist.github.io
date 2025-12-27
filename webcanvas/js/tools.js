const sizeInput = document.getElementById('size-input');
const colorPicker = document.getElementById('color-picker');
const tools = document.querySelectorAll('.tool');

function updateActiveUI(id) {
    tools.forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

const setTool = (type) => {
    updateActiveUI(`${type}-tool`);
    const size = parseInt(sizeInput.value);
    const color = colorPicker.value;

    canvas.isDrawingMode = true;
    // Standard Pencil Brush for all tools
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = size;

    if (type === 'pen') {
        canvas.freeDrawingBrush.color = color;
    } else if (type === 'pencil') {
        canvas.freeDrawingBrush.color = convertHexToRGBA(color, 0.5);
    } else if (type === 'marker') {
        canvas.freeDrawingBrush.color = convertHexToRGBA(color, 0.3);
    } else if (type === 'eraser') {
        // Destination-out cuts through the drawing to show the CSS grid
        canvas.freeDrawingBrush.color = 'rgba(0,0,0,1)';
        canvas.freeDrawingBrush.globalCompositeOperation = 'destination-out';
    }
};

// Listeners
document.getElementById('pen-tool').onclick = () => setTool('pen');
document.getElementById('pencil-tool').onclick = () => setTool('pencil');
document.getElementById('marker-tool').onclick = () => setTool('marker');
document.getElementById('eraser-tool').onclick = () => setTool('eraser');

sizeInput.oninput = () => { canvas.freeDrawingBrush.width = parseInt(sizeInput.value) || 1; };
colorPicker.oninput = () => { if(canvas.freeDrawingBrush.globalCompositeOperation !== 'destination-out') canvas.freeDrawingBrush.color = colorPicker.value; };

function convertHexToRGBA(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
}

// Default Start
setTool('pen');
