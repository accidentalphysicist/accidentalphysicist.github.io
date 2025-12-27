const colorPicker = document.getElementById('color-picker');
const sizeSlider = document.getElementById('size-slider');

// Set initial brush
canvas.isDrawingMode = true;
canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
canvas.freeDrawingBrush.width = 5;
canvas.freeDrawingBrush.color = "#000000";

// Function to update brush properties
const updateBrush = (color, width, opacity = 1) => {
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = parseInt(width);
    // For markers, we can simulate transparency
    canvas.freeDrawingBrush.color = convertHexToRGBA(color, opacity);
};

// Tool Selection Logic
document.getElementById('pen-tool').onclick = () => updateBrush(colorPicker.value, sizeSlider.value, 1);
document.getElementById('pencil-tool').onclick = () => updateBrush(colorPicker.value, 2, 0.6);
document.getElementById('marker-tool').onclick = () => updateBrush(colorPicker.value, 20, 0.4);

// Eraser Logic
document.getElementById('eraser-tool').onclick = () => {
    // In Fabric.js, erasing is often handled by drawing with the background color
    updateBrush('#f8f8f8', sizeSlider.value, 1); 
};

// Listeners for Color and Size
colorPicker.oninput = () => canvas.freeDrawingBrush.color = colorPicker.value;
sizeSlider.oninput = () => canvas.freeDrawingBrush.width = parseInt(sizeSlider.value);

// Helper for Marker transparency
function convertHexToRGBA(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
}
