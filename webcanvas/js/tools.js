const sizeInput = document.getElementById('size-input');
const colorPicker = document.getElementById('color-picker');
const fontFamily = document.getElementById('font-family');
let currentMode = 'pen';

function hexToRgba(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16), 
          g = parseInt(hex.slice(3, 5), 16), 
          b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
}

const applySettings = () => {
    // If in text mode, do not turn on the drawing brush
    canvas.isDrawingMode = (currentMode !== 'text');
    if (!canvas.isDrawingMode) return;

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    const color = colorPicker.value;
    const size = parseInt(sizeInput.value);

    if (currentMode === 'pen') {
        canvas.freeDrawingBrush.color = color;
        canvas.freeDrawingBrush.width = size;
    } else if (currentMode === 'pencil') {
        canvas.freeDrawingBrush.color = hexToRgba(color, 0.4);
        canvas.freeDrawingBrush.width = size * 0.7;
    } else if (currentMode === 'marker') {
        canvas.freeDrawingBrush.color = hexToRgba(color, 0.3);
        canvas.freeDrawingBrush.width = size * 4;
        canvas.freeDrawingBrush.strokeLineCap = 'square';
    } else if (currentMode === 'eraser') {
        // Paints over the dots and ink
        canvas.freeDrawingBrush.color = '#f8f8f8'; 
        canvas.freeDrawingBrush.width = size * 8;
    }
};

const selectTool = (type, elId) => {
    currentMode = type;
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
    document.getElementById(elId).classList.add('active');
    
    if (type === 'text') {
        canvas.isDrawingMode = false; // Disable drawing to allow text interaction
        const text = new fabric.Textbox('Type...', {
            left: 100,
            top: container.scrollTop + 100, // Places text in visible area
            fontFamily: fontFamily.value,
            fill: colorPicker.value,
            fontSize: 40
        });
        canvas.add(text);
        canvas.setActiveObject(text);
    }
    applySettings();
};

// Event Listeners
document.getElementById('pen-tool').onclick = () => selectTool('pen', 'pen-tool');
document.getElementById('pencil-tool').onclick = () => selectTool('pencil', 'pencil-tool');
document.getElementById('marker-tool').onclick = () => selectTool('marker', 'marker-tool');
document.getElementById('eraser-tool').onclick = () => selectTool('eraser', 'eraser-tool');
document.getElementById('text-tool').onclick = () => selectTool('text', 'text-tool');

colorPicker.oninput = applySettings;
sizeInput.oninput = applySettings;

// Fix for Deletion: Handles both single and multiple selections
window.addEventListener('keydown', (e) => {
    if (e.key === "Delete" || e.key === "Backspace") {
        const activeObjects = canvas.getActiveObjects();
        // Prevent deletion while actually editing text
        const isEditing = activeObjects.some(obj => obj.isEditing);
        
        if (activeObjects.length > 0 && !isEditing) {
            canvas.remove(...activeObjects);
            canvas.discardActiveObject().renderAll();
        }
    }
});

document.getElementById('clear-btn').onclick = () => {
    if(confirm("Clear Everything?")) {
        canvas.clear();
        applySettings();
    }
};

applySettings();
