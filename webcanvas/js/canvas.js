// Initialize the Fabric Canvas
const canvas = new fabric.Canvas('teachingCanvas', {
    width: window.innerWidth,
    height: window.innerHeight,
    selection: true // Enables click-and-drag box selection
});

// Make sure canvas resizes if the window does
window.addEventListener('resize', () => {
    canvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
    });
});

// TEST OBJECT: Let's add one rectangle to test selection/deselection
const testRect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: '#4A90E2',
    width: 100,
    height: 100,
    cornerColor: 'white',
    cornerStrokeColor: '#4A90E2',
    transparentCorners: false
});

canvas.add(testRect);
