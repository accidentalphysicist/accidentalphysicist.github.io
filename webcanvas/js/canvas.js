const container = document.getElementById('canvas-container');

// Initialize the Fabric Canvas
const canvas = new fabric.Canvas('teachingCanvas', {
    width: window.innerWidth,
    height: 3000, 
    isDrawingMode: true,
    backgroundColor: '#f8f8f8' // Solid background for white eraser to work
});

// Infinite Scroll Logic
container.addEventListener('scroll', () => {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 600) {
        canvas.setHeight(canvas.getHeight() + 1500);
    }
});

// Handle Window Resize
window.addEventListener('resize', () => {
    canvas.setWidth(window.innerWidth);
});
