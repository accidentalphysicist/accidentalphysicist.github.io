const container = document.getElementById('canvas-container');
const canvas = new fabric.Canvas('teachingCanvas', {
    width: window.innerWidth,
    height: window.innerHeight + 1000,
    isDrawingMode: true
});

// Infinite Scroll logic
container.addEventListener('scroll', () => {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 200) {
        const currentHeight = canvas.getHeight();
        canvas.setHeight(currentHeight + 1000); 
    }
});

window.addEventListener('resize', () => {
    canvas.setWidth(window.innerWidth);
});
