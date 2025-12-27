const container = document.getElementById('canvas-container');

const canvas = new fabric.Canvas('teachingCanvas', {
    width: window.innerWidth,
    height: 3000, 
    isDrawingMode: true,
    backgroundColor: 'transparent' // Allows the CSS background to show
});

// Improved Infinite Scroll detection
container.addEventListener('scroll', () => {
    const scrollPos = container.scrollTop + container.clientHeight;
    const threshold = canvas.getHeight() - 800;

    if (scrollPos > threshold) {
        // Add 1500px more height
        canvas.setHeight(canvas.getHeight() + 1500);
        canvas.renderAll();
    }
});

window.addEventListener('resize', () => {
    canvas.setWidth(window.innerWidth);
    canvas.renderAll();
});
