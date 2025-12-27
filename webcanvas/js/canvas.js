const container = document.getElementById('canvas-container');
const canvasElement = document.getElementById('teachingCanvas');

// Initialize with a transparent background
const canvas = new fabric.Canvas('teachingCanvas', {
    width: window.innerWidth,
    height: window.innerHeight + 1000,
    isDrawingMode: true,
    backgroundColor: null // Important: Ensures eraser doesn't show a solid color
});

// Infinite Scroll
container.addEventListener('scroll', () => {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 200) {
        const currentHeight = canvas.getHeight();
        canvas.setHeight(currentHeight + 1000);
    }
});

window.addEventListener('resize', () => {
    canvas.setWidth(window.innerWidth);
});
