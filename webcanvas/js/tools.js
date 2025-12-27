// Global access to tool updates
const sizeInput = document.getElementById('size-input');
const colorPicker = document.getElementById('color-picker');

function convertHexToRGBA(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
}

const updateBrush = (type) => {
    // UI Update
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
    document.getElementById(`${type}-tool`).classList.add('active');

    const color = colorPicker.value;
    const size = parseInt(sizeInput.value);

    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = size;

    if (type === 'pen') {
        canvas.freeDrawingBrush.color = color;
    } else if (type === 'pencil') {
        canvas.freeDrawingBrush.color = convertHexToRGBA(color, 0.5);
    } else if (type === 'marker') {
        canvas.freeDrawingBrush.color = convertHexToRGBA(color, 0.3);
    } else if (type === 'eraser') {
        canvas.freeDrawingBrush.color = 'rgba(0,0,0,1)';
        canvas.freeDrawingBrush.globalCompositeOperation = 'destination-out';
    }
};

// Initialize listeners after DOM loads
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('pen-tool').addEventListener('click', () => updateBrush('pen'));
    document.getElementById('pencil-tool').addEventListener('click', () => updateBrush('pencil'));
    document.getElementById('marker-tool').addEventListener('click', () => updateBrush('marker'));
    document.getElementById('eraser-tool').addEventListener('click', () => updateBrush('eraser'));

    sizeInput.addEventListener('input', () => {
        if (canvas.freeDrawingBrush) canvas.freeDrawingBrush.width = parseInt(sizeInput.value) || 1;
    });

    colorPicker.addEventListener('input', () => {
        if (canvas.freeDrawingBrush && canvas.freeDrawingBrush.globalCompositeOperation !== 'destination-out') {
            canvas.freeDrawingBrush.color = colorPicker.value;
        }
    });

    updateBrush('pen'); // Set default
});
