
// Selecciona elementos del DOM y los asigna a variables
const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
saveImg2 = document.querySelector(".save-img2"),
ctx = canvas.getContext("2d");


// Variables globales con valores predeterminados
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";



// Función para establecer el fondo del canvas
const setCanvasBackground = () => 
{
    // Establece el fondo del canvas en blanco, para que el fondo de la imagen descargada sea blanco
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // Establece fillStyle de nuevo en selectedColor, será el color del pincel
}


// Evento que se dispara cuando se carga la página
window.addEventListener("load", () => 
{
    // Establece el ancho y alto del canvas. offsetWidth/Height devuelve el ancho/alto visible de un elemento
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});



// Función para dibujar un rectángulo
const drawRect = (e) => 
{
    // Si fillColor no está marcado, dibuja un rectángulo con borde, de lo contrario dibuja un rectángulo con fondo
    if(!fillColor.checked) 
    {
        // Crea un rectángulo según el puntero del mouse
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

// Función para dibujar un círculo
const drawCircle = (e) => 
{
    ctx.beginPath(); // Crea un nuevo camino para dibujar el círculo
    // Obtiene el radio para el círculo según el puntero del mouse
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // Crea un círculo según el puntero del mouse
    fillColor.checked ? ctx.fill() : ctx.stroke(); // Si fillColor está marcado, rellena el círculo, de lo contrario dibuja un círculo con borde
}


// Función para dibujar un triángulo
const drawTriangle = (e) => {
    ctx.beginPath(); // Crea un nuevo camino para dibujar el triángulo
    ctx.moveTo(prevMouseX, prevMouseY); // Mueve el triángulo al puntero del mouse
    ctx.lineTo(e.offsetX, e.offsetY); // Crea la primera línea según el puntero del mouse
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // Crea la línea inferior del triángulo
    ctx.closePath(); // Cierra el camino del triángulo para que la tercera línea se dibuje automáticamente
    fillColor.checked ? ctx.fill() : ctx.stroke(); // Si fillColor está marcado, rellena el triángulo, de lo contrario dibuja un triángulo con borde
}

// Función que se llama cuando comienza a dibujar
const startDraw = (e) => 
{
    isDrawing = true;
    prevMouseX = e.offsetX; // Asigna la posición actual de mouseX como valor de prevMouseX
    prevMouseY = e.offsetY; // Asigna la posición actual de mouseY como valor de prevMouseY
    ctx.beginPath(); // Crea un nuevo camino para dibujar
    ctx.lineWidth = brushWidth; // Asigna brushSize como ancho de línea
    ctx.strokeStyle = selectedColor; // Asigna selectedColor como estilo de trazo
    ctx.fillStyle = selectedColor; // Asigna selectedColor como estilo de relleno
    // Copia los datos del canvas y los asigna como valor de snapshot. Esto evita arrastrar la imagen
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}


// Función que se llama mientras se está dibujando
const drawing = (e) => 
{
    if(!isDrawing) return; // Si isDrawing es falso, retorna desde aquí
    ctx.putImageData(snapshot, 0, 0); // Agrega los datos copiados del canvas en este canvas

    if(selectedTool === "brush" || selectedTool === "eraser") 
    {
        // Si la herramienta seleccionada es el borrador, establece el estilo de trazo en blanco
        // para pintar de blanco sobre el contenido existente del canvas, de lo contrario establece el color de trazo en el color seleccionado
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // Crea una línea según el puntero del mouse
        ctx.stroke(); // Dibuja/llena la línea con color
    } 
    else if(selectedTool === "rectangle")
    {
        drawRect(e);
    } 
    else if(selectedTool === "circle")
    {
        drawCircle(e);
    } 
    else 
    {
        drawTriangle(e);
    }
}


// Agrega un evento de clic a todas las opciones de herramientas
toolBtns.forEach(btn => 
{
    btn.addEventListener("click", () => 
    {
        // Elimina la clase active de la opción anterior y la agrega a la opción actualmente seleccionada
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});


// Asigna el valor del control deslizante como tamaño del pincel
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);



// Agrega un evento de clic a todos los botones de color
colorBtns.forEach(btn => 
{
    btn.addEventListener("click", () => 
    {
        // Elimina la clase selected de la opción anterior y la agrega a la opción actualmente seleccionada
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // Asigna el color de fondo del botón seleccionado como valor de selectedColor
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});



// Agrega un evento de cambio al selector de color
colorPicker.addEventListener("change", () => 
{
    // Asigna el valor del selector de color al fondo del último botón de color
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});



// Agrega un evento de clic al botón "Limpiar Lienzo"
clearCanvas.addEventListener("click", () => 
{
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia todo el canvas
    setCanvasBackground();
});



// Agrega un evento de clic al botón "Guardar en JPG"
saveImg.addEventListener("click", () => 
{
    const link = document.createElement("a"); // Crea un elemento <a>
    link.download = `${Date.now()}.jpg`; //Se asigna el formato de la imagen y la fecha actual como valor de descarga del enlace
    link.href = canvas.toDataURL(); // Asigna los datos del canvas como valor href del enlace
    link.click(); // Hace clic en el enlace para descargar la imagen
});



// Agrega un evento de clic al botón "Guardar en PNG"
saveImg2.addEventListener("click", () => 
{
    const link = document.createElement("a"); // Crea un elemento <a>
    link.download = `${Date.now()}.png`; //Se asigna el formato de la imagen y la fecha actual como valor de descarga del enlace
    link.href = canvas.toDataURL(); // Asigna los datos del canvas como valor href del enlace
    link.click(); // Hace clic en el enlace para descargar la imagen
});



// Agrega eventos al canvas para dibujar
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
