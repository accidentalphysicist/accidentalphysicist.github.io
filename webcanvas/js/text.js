const textToolBtn = document.getElementById('text-tool');

textToolBtn.addEventListener('click', () => {
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
    textToolBtn.classList.add('active');

    canvas.isDrawingMode = false; // Allow interaction with text

    const text = new fabric.Textbox('New Text', {
        left: 100,
        top: 100,
        width: 250,
        fontSize: 30,
        fill: colorPicker.value,
        fontFamily: document.getElementById('font-family').value
    });

    canvas.add(text);
    canvas.setActiveObject(text);
});

// Key listener to delete text objects
window.addEventListener('keydown', (e) => {
    if (e.key === "Delete" || e.key === "Backspace") {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
            // Confirm we aren't currently typing inside a textbox
            const activeObject = canvas.getActiveObject();
            if (activeObject && !activeObject.isEditing) {
                canvas.remove(...activeObjects);
                canvas.discardActiveObject();
                canvas.renderAll();
            }
        }
    }
});
