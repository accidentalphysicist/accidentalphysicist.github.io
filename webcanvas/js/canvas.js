const container = document.getElementById('canvas-container');
const canvasElement = document.getElementById('teachingCanvas');

const canvas = new fabric.Canvas('teachingCanvas', {
    width: window.innerWidth,
    height: window.innerHeight + 1000, // Start with extra height
    isDrawingMode: true
});

// Infinite Scroll Logic
container.addEventListener('scroll', () => {
    // If user is within 200px of the bottom
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 200) {
        const currentHeight = canvas.getHeight();
        canvas.setHeight(currentHeight + 1000); // Add more space
    }
});

// Sync width on resize
window.addEventListener('resize', () => {
    canvas.setWidth(window.innerWidth);
});
