const sizeInput = document.getElementById('size-input');
const colorPicker = document.getElementById('color-picker');

const updateBrush = (type) => {
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
    document.getElementById(`${type}-tool`).classList.add('active');

    const color = colorPicker.value;
    const size = parseInt(sizeInput.value);

    canvas.isDrawingMode = true;
    
    // Crucial: Clear the brush before creating a new one
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

    if (type === 'eraser') {
        // Fix: Use 'destination-out' to make pixels transparent
        canvas.freeDrawingBrush.color = 'rgba(0,0,0,1)'; 
        canvas.freeDrawingBrush.width = size * 2;
        canvas.freeDrawingBrush.globalCompositeOperation = 'destination-out';
    } else {
        canvas.freeDrawingBrush.globalCompositeOperation = 'source-over';
        
        if (type === 'pen') {
            canvas.freeDrawingBrush.width = size;
            canvas.freeDrawingBrush.color = color;
            canvas.freeDrawingBrush.strokeLineCap = 'round';
        } else if (type === 'pencil') {
            canvas.freeDrawingBrush.width = size * 0.5;
            canvas.freeDrawingBrush.color = convertHexToRGBA(color, 0.4);
            canvas.freeDrawingBrush.strokeLineCap = 'round';
        } else if (type === 'marker') {
            // Marker Improvement: Larger size and slight transparency
            canvas.freeDrawingBrush.width = size * 4; 
            canvas.freeDrawingBrush.color = convertHexToRGBA(color, 0.3);
            canvas.freeDrawingBrush.strokeLineCap = 'square';
            
            // Simulating a "longer" marker tip with a slight shadow offset
            canvas.freeDrawingBrush.shadow = new fabric.Shadow({
                blur: 2,
                offsetX: 0,
                offsetY: 4, // Elongates the stroke vertically
                color: convertHexToRGBA(color, 0.2)
            });
        }
    }
};

function convertHexToRGBA(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
}

window.addEventListener('DOMContentLoaded', () => {
    updateBrush('pen');
});
