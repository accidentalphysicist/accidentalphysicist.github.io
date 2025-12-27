const sizeInput = document.getElementById('size-input');
const colorPicker = document.getElementById('color-picker');
<script src="https://unpkg.com/fabric-eraser-brush"></script>
// 1. Fix: Eraser that doesn't hide the grid
// We use Fabric's built-in EraserBrush (if available) or a "destination-out" mode
// For standard Fabric 5.x, we'll use the EraserBrush module:
canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

const updateBrush = (type) => {
    canvas.isDrawingMode = true;
    const color = colorPicker.value;
    const size = parseInt(sizeInput.value);

    if (type === 'pen') {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = color;
        canvas.freeDrawingBrush.shadow = null;
    } 
    else if (type === 'pencil') {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = convertHexToRGBA(color, 0.6); // Grainy look
        // Adding a tiny blur to simulate graphite
        canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            blur: 2,
            offsetX: 0,
            offsetY: 0,
            color: color
        });
    } 
    else if (type === 'marker') {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = convertHexToRGBA(color, 0.4);
        canvas.freeDrawingBrush.shadow = null;
    } 
    else if (type === 'eraser') {
        // ACTUAL ERASER: This removes pixels instead of painting white
        canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
    }
    
    canvas.freeDrawingBrush.width = size;
};

// Size controls
document.getElementById('increase-size').onclick = () => {
    sizeInput.value = parseInt(sizeInput.value) + 2;
    canvas.freeDrawingBrush.width = parseInt(sizeInput.value);
};

document.getElementById('decrease-size').onclick = () => {
    if(sizeInput.value > 1) {
        sizeInput.value = parseInt(sizeInput.value) - 2;
        canvas.freeDrawingBrush.width = parseInt(sizeInput.value);
    }
};

sizeInput.onchange = () => {
    canvas.freeDrawingBrush.width = parseInt(sizeInput.value);
};

// Event Listeners
document.getElementById('pen-tool').onclick = () => updateBrush('pen');
document.getElementById('pencil-tool').onclick = () => updateBrush('pencil');
document.getElementById('marker-tool').onclick = () => updateBrush('marker');
document.getElementById('eraser-tool').onclick = () => updateBrush('eraser');

function convertHexToRGBA(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
}
