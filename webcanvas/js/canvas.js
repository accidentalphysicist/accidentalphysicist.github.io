const container = document.getElementById('canvas-container');

const canvas = new fabric.Canvas('teachingCanvas', {
    width: window.innerWidth,
    height: window.innerHeight + 1000,
    isDrawingMode: true,
    backgroundColor: null // Keeps it transparent to see the CSS grid
});

container.addEventListener('scroll', () => {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 200) {
        canvas.setHeight(canvas.getHeight() + 1000);
    }
});

window.addEventListener('resize', () => {
    canvas.setWidth(window.innerWidth);
});
