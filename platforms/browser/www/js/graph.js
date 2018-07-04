// Set up!
var a_canvas;
var context;

function mapSetup(){
    a_canvas = document.getElementById("a");
    context = a_canvas.getContext("2d");
    context.beginPath();
    
}


function limpiarMapa(){
    //mapSetup();
    clearCanvas(context, a_canvas)
}

function clearCanvas(context, canvas) {
   // mapSetup();
    context.clearRect(0, 0, canvas.width, canvas.height);
    var w = canvas.width;
    canvas.width = 1;
    canvas.width = w;
  }

function dibujarRadioPosicion(posX, posY, radio){
    //Radio de señal
    context.fillStyle = "rgba(90, 255, 255, 0.5)";
    //context.fillStyle = "yellow";
    context.beginPath();
    context.arc(posX, posY, radio, 0, 2*Math.PI);
    context.closePath();
    context.fill();
    context.lineWidth = 1;
    context.stroke();
    context.fillStyle = "blue";
  
}

function dibujarBeacon(beacon){
   
    //Posición del Beacon
    context.beginPath();
    context.arc(beacon.posX, beacon.posY, 10, 0, 2*Math.PI);
    context.closePath();
    context.fill();
  
    // Id del Beacon
    context.font = "8px Garamond";
    context.fillText(beacon.idBeacon,beacon.posX-35, beacon.posY+20);
}
