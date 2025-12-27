const sizeInput = document.getElementById('size-input');
const colorPicker = document.getElementById('color-picker');
let currentTool = 'pen';

const updateBrush = (type) => {
    currentTool = type;
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
    document.getElementById(`${type}-tool`).classList.add('active');

    canvas.isDrawingMode = true;
    applyCurrentSettings();
};

const applyCurrentSettings = () => {
    const color = colorPicker.value;
    const size = parseInt(sizeInput.value);

    // Reset Brush
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.globalCompositeOperation = 'source-over';
    canvas.freeDrawingBrush.shadow = null;

    if (currentTool === 'pen') {
        canvas.freeDrawingBrush.width = size;
        canvas.freeDrawingBrush.color = color;
    } else if (currentTool === 'pencil') {
        canvas.freeDrawingBrush.width = size * 0.5;
        canvas.freeDrawingBrush.color = convertHexToRGBA(color, 0.5);
    } else if (currentTool === 'marker') {
        canvas.freeDrawingBrush.width = size * 3;
        canvas.freeDrawingBrush.color = convertHexToRGBA(color, 0.3);
        canvas.freeDrawingBrush.strokeLineCap = 'square';
        // Marker shadow to make it feel "longer"
        canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            blur: 1, offsetY: 4, color: convertHexToRGBA(color, 0.2)
        });
    } else if (currentTool === 'eraser') {
        // NEW ERASER: Painted White
        canvas.freeDrawingBrush.width = size * 2;
        canvas.freeDrawingBrush.color = '#f8f8f8'; // Matches background-color
    }
};

// LIVE LISTENERS: Update without re-clicking tool
sizeInput.addEventListener('input', applyCurrentSettings);
colorPicker.addEventListener('input', applyCurrentSettings);

function convertHexToRGBA(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
}

window.addEventListener('DOMContentLoaded', () => {
    ['pen', 'pencil', 'marker', 'eraser'].forEach(t => {
        document.getElementById(`${t}-tool`).onclick = () => updateBrush(t);
    });
    updateBrush('pen');
});
