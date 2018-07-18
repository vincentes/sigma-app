// Set up!
var a_canvas;
var context;

function mapSetup() {
    a_canvas = document.getElementById("a");
    context = a_canvas.getContext("2d");
    context.beginPath();

}


function limpiarMapa() {
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

function dibujarRadioPosicion(posX, posY, radio2, esUnBeacon) {
    radio = redondeo(Math.abs(radio2));
    //Radio de señal
    if(esUnBeacon == true){
        context.strokeStyle = "gray";
        context.fillStyle = "rgba(90, 255, 255, 0.1)";
    }else{
        context.strokeStyle = "red";
        context.fillStyle = "rgba(255, 90, 90, 0.2)";
    }
    
    
    //context.fillStyle = "yellow";
    context.beginPath();
    context.arc(posX, posY, radio, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.lineWidth = 1;
    context.stroke();


    context.strokeStyle = "red";
    context.beginPath();
    context.arc(posX, posY, 5, 0, 2 * Math.PI);
    context.closePath();
    context.lineWidth = 1;
    context.stroke();

    // Radio del Beacon
    context.shadowBlur = 5;
    context.shadowOffsetX = 1;
    context.shadowColor = "black";
    context.fillStyle = "black";
    context.font = "12px Garamond";
    context.fillText(radio / escala + "mts", posX - 19, posY - 9);
    context.fillStyle = "white";
    context.font = "12px Garamond";
    context.fillText(radio / escala + "mts", posX - 20, posY - 10);

}

function dibujarBeacon(beacon) {

    //Posición del Beacon
    context.beginPath();
    context.arc(beacon.posX, beacon.posY, 10, 0, 2 * Math.PI);
    context.closePath();
    context.fill();

    // Id del Beacon
    context.font = "8px Garamond";
    context.fillText(beacon.idBeacon, beacon.posX - 35, beacon.posY + 20);
}


