const textToolBtn = document.getElementById('text-tool');
const fontFamilySelect = document.getElementById('font-family');

textToolBtn.addEventListener('click', () => {
    // UI Update
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
    textToolBtn.classList.add('active');

    // Turn off drawing mode so we can click/edit text
    canvas.isDrawingMode = false;

    // Create a new textbox
    const text = new fabric.Textbox('Type here...', {
        left: 100,
        top: 100,
        width: 200,
        fontSize: parseInt(sizeInput.value) * 5, // Scaling for text
        fill: colorPicker.value,
        fontFamily: fontFamilySelect.value
    });

    canvas.add(text);
    canvas.setActiveObject(text);
});

// Update selected text properties live
fontFamilySelect.addEventListener('change', () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
        activeObject.set('fontFamily', fontFamilySelect.value);
        canvas.renderAll();
    }
});

colorPicker.addEventListener('input', () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
        activeObject.set('fill', colorPicker.value);
        canvas.renderAll();
    }
});
