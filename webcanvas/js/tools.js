const sizeInput = document.getElementById('size-input');
const colorPicker = document.getElementById('color-picker');
const fontFamily = document.getElementById('font-family');
let currentMode = 'pen';

function hexToRgba(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
}

// Function to Apply Brush Settings
const applySettings = () => {
    canvas.isDrawingMode = (currentMode !== 'text');
    if (!canvas.isDrawingMode) return;

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    const color = colorPicker.value;
    const size = parseInt(sizeInput.value);

    if (currentMode === 'pen') {
        canvas.freeDrawingBrush.color = color;
        canvas.freeDrawingBrush.width = size;
    } else if (currentMode === 'pencil') {
        canvas.freeDrawingBrush.color = hexToRgba(color, 0.5);
        canvas.freeDrawingBrush.width = size * 0.6;
    } else if (currentMode === 'marker') {
        canvas.freeDrawingBrush.color = hexToRgba(color, 0.3);
        canvas.freeDrawingBrush.width = size * 5;
        canvas.freeDrawingBrush.strokeLineCap = 'square';
    } else if (currentMode === 'eraser') {
        canvas.freeDrawingBrush.color = '#f8f8f8'; // Reverted to White Paint
        canvas.freeDrawingBrush.width = size * 10; // Extra thick eraser
    }
};

// UI Tool Selection
const selectTool = (type, elId) => {
    currentMode = type;
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
    document.getElementById(elId).classList.add('active');
    
    if (type === 'text') {
        canvas.isDrawingMode = false;
        const text = new fabric.Textbox('Edit me', {
            left: 100,
            top: container.scrollTop + 100,
            fontFamily: fontFamily.value,
            fill: colorPicker.value,
            fontSize: 30
        });
        canvas.add(text);
        canvas.setActiveObject(text);
    }
    applySettings();
};

// Listeners
document.getElementById('pen-tool').onclick = () => selectTool('pen', 'pen-tool');
document.getElementById('pencil-tool').onclick = () => selectTool('pencil', 'pencil-tool');
document.getElementById('marker-tool').onclick = () => selectTool('marker', 'marker-tool');
document.getElementById('eraser-tool').onclick = () => selectTool('eraser', 'eraser-tool');
document.getElementById('text-tool').onclick = () => selectTool('text', 'text-tool');

colorPicker.oninput = applySettings;
sizeInput.oninput = applySettings;

// Delete Selected Objects Logic
window.addEventListener('keydown', (e) => {
    if (e.key === "Delete" || e.key === "Backspace") {
        const activeObject = canvas.getActiveObject();
        // Don't delete while user is typing inside the textbox
        if (activeObject && !activeObject.isEditing) {
            canvas.remove(activeObject);
            canvas.discardActiveObject().renderAll();
        }
    }
});

// Clear All
document.getElementById('clear-btn').onclick = () => {
    if(confirm("Clear Everything?")) canvas.clear(); canvas.backgroundColor = '#f8f8f8';
};

applySettings();
