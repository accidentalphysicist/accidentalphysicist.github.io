const sizeInput = document.getElementById('size-input');
const colorPicker = document.getElementById('color-picker');

function convertHexToRGBA(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
}

const updateBrush = (type) => {
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
    document.getElementById(`${type}-tool`).classList.add('active');

    const color = colorPicker.value;
    const size = parseInt(sizeInput.value);

    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

    if (type === 'eraser') {
        // Fix: Use 'destination-out' to cut through the ink
        canvas.freeDrawingBrush.width = size * 2;
        canvas.freeDrawingBrush.globalCompositeOperation = 'destination-out';
    } else {
        canvas.freeDrawingBrush.globalCompositeOperation = 'source-over';
        
        if (type === 'pen') {
            canvas.freeDrawingBrush.width = size;
            canvas.freeDrawingBrush.color = color;
        } else if (type === 'pencil') {
            canvas.freeDrawingBrush.width = size * 0.5;
            canvas.freeDrawingBrush.color = convertHexToRGBA(color, 0.4);
        } else if (type === 'marker') {
            // Elongate marker effect
            canvas.freeDrawingBrush.width = size * 4;
            canvas.freeDrawingBrush.color = convertHexToRGBA(color, 0.3);
            canvas.freeDrawingBrush.strokeLineCap = 'square';
            canvas.freeDrawingBrush.shadow = new fabric.Shadow({
                blur: 2, offsetY: 6, color: convertHexToRGBA(color, 0.2)
            });
        }
    }
};

window.addEventListener('DOMContentLoaded', () => {
    const tools = ['pen', 'pencil', 'marker', 'eraser'];
    tools.forEach(t => {
        document.getElementById(`${t}-tool`).onclick = () => updateBrush(t);
    });
    updateBrush('pen');
});
