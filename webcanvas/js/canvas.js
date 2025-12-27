const container = document.getElementById('canvas-container');

// Initialize with a null background so the eraser reveals the CSS grid
const canvas = new fabric.Canvas('teachingCanvas', {
    width: window.innerWidth,
    height: window.innerHeight + 1000,
    isDrawingMode: true,
    backgroundColor: null 
});

// Infinite Scroll
container.addEventListener('scroll', () => {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 200) {
        canvas.setHeight(canvas.getHeight() + 1000);
    }
});

window.addEventListener('resize', () => {
    canvas.setWidth(window.innerWidth);
});
