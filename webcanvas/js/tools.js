const sizeInput = document.getElementById('size-input');
const colorPicker = document.getElementById('color-picker');

const updateBrush = (type) => {
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
    document.getElementById(`${type}-tool`).classList.add('active');

    const color = colorPicker.value;
    const size = parseInt(sizeInput.value);

    canvas.isDrawingMode = true;
    
    if (type === 'eraser') {
        // Use the built-in PencilBrush but set it to "erase" mode
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = size;
        canvas.freeDrawingBrush.color = 'rgba(0,0,0,1)';
        canvas.freeDrawingBrush.globalCompositeOperation = 'destination-out';
    } else {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.globalCompositeOperation = 'source-over';
        
        if (type === 'pen') {
            canvas.freeDrawingBrush.width = size;
            canvas.freeDrawingBrush.color = color;
            canvas.freeDrawingBrush.strokeLineCap = 'round';
        } else if (type === 'pencil') {
            canvas.freeDrawingBrush.width = size * 0.5; // Thinner for pencil
            canvas.freeDrawingBrush.color = convertHexToRGBA(color, 0.5);
            canvas.freeDrawingBrush.strokeLineCap = 'round';
        } else if (type === 'marker') {
            canvas.freeDrawingBrush.width = size * 3; // Significantly wider
            canvas.freeDrawingBrush.color = convertHexToRGBA(color, 0.3);
            canvas.freeDrawingBrush.strokeLineCap = 'square'; // Marker feel
        }
    }
};

function convertHexToRGBA(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
}

// Re-initialize listeners on boot
window.addEventListener('DOMContentLoaded', () => {
    const ids = ['pen-tool', 'pencil-tool', 'marker-tool', 'eraser-tool'];
    ids.forEach(id => {
        document.getElementById(id).addEventListener('click', () => updateBrush(id.split('-')[0]));
    });
    updateBrush('pen');
});
