// Set up!
var a_canvas = document.getElementById("a");
var context = a_canvas.getContext("2d");
context.beginPath();

function limpiarMapa(){
    clearCanvas(context, a_canvas)
}

function clearCanvas(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    var w = canvas.width;
    canvas.width = 1;
    canvas.width = w;
  }

function dibujarBeacon(posX, posY, radio, id){
       
    // Dibujamos el beacon y su radio de señal detectada
    
    //Posición del Beacon
    context.beginPath();
    context.arc(posX, posY, 10, 0, 2*Math.PI);
    context.closePath();
    context.fill();
    
    //Radio de señal
    context.fillStyle = "rgba(90, 255, 255, 0.5)";
    //context.fillStyle = "yellow";
    context.beginPath();
    context.arc(posX, posY, radio, 0, 2*Math.PI);
    context.closePath();
    context.fill();
    context.lineWidth = 1;
    context.stroke();
    context.fillStyle = "black";
    
    
    // Id del Beacon
    context.font = "10px Garamond";
    context.fillText(id,posX-35, posY+20);
}
