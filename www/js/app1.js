
//$(document).ready(function () {

//Inicializamos variables globales
var myDB;
sessionStorage.clickcount = 1;
var baseDeDatos = [];
var beaconsEncontrados = [];
var beaconsEnDBLocal = [];
var escala = 17;
var actualizarPlano = false;
var scanInterval = false;



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////                            Llamados al cargar página                           ////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function scanSetup() {



    //Open Database Connection
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        myDB = window.sqlitePlugin.openDatabase({ name: "sigmaDb.db", location: 'default' });
        crearTabla();
        preCargaSQL();
        pasarBeaconsSQLArray();
        dibujarBeaconsEnDb(false);


    }

    //PreCarga de datos
    function preCargaSQL() {
        dbInsertBeacon("SG000001AAAA0001", 1310, 1280, "SS", "Beacon 1");
        dbInsertBeacon("SG000001AAAA0002", 1280, 1560, "SS", "Beacon 2");
        dbInsertBeacon("SG000001AAAA0003", 1395, 1740, "SS", "Beacon 3");
        dbInsertBeacon("Bermudez", 1390, 1575, "SS", "Beacon 4");
        dbInsertBeacon("Wifi-ORT", 1280, 1835, "SS", "Beacon 5");
        dbInsertBeacon("Ceibal", 1300, 1670, "SS", "Beacon 6");



    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////                              Botones                                           ////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    /*
        $('#scan').click(function () {
            try {
                WifiWizard.isWifiEnabled(win, fail);
            }
            catch (err) {
                ons.notification.alert({
                    title: 'Atención!',
                    message: "Plugin Error - " + err.message
                });
    
            }
    
        });
        
        $('#scan2').click(function () {
            try {
                scanOK();
    
            }
            catch (err) {
                ons.notification.alert({
                    title: 'Atención!',
                    message: "Plugin Error - " + err.message
                });
            }
    
        });
    
    */

    $('#crear').click(crearTabla);

    $('#preCarga').click(preCargaSQL);


    $('#data').click(mostrarDatosSQL);

    $('#borrar').click(borrarTabla);

    $('#limpiarMapa').click(limpiarMapa);

    $('#counter').click(clickCounter);



    /*
        <button onclick="myVar = setInterval(myFunction, 1000)">Try it</button>
    
    <button onclick="clearTimeout(myVar)">Stop it</button>
    */


}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////                        FIN - Llamados al cargar página                         ////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////                                  Win - Fail                                    ////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function fail(e) {
    alertarOns("Atención", "Error checking Wifi status");
}

function scanFail(e) {
    alertarOns("Atención", "Error al iniciar el scan, compruebe que el WIFI esté encendido");

}

function winEnable(e) {
    alertarOns("Atención", "Wifi enabled successfully");

}


function failEnable(e) {
    alertarOns("Atención", "No se pudo activar el WIFI del dispositivo");
}

function win(e) {
    if (e) {
        try {
            WifiWizard.startScan(scanOK, scanFail);

        }
        catch (err) {
            alertarOns('Atención!', "Plugin Error - " + err.message);

        }
    }
    else {
        WifiWizard.setWifiEnabled(true, winEnable, failEnable);
    }
}

function scanOK(e) {
    if (e) {

        funcExterna(e);

    }

    else {
        alertarOns("Atención", "No se inició el scan");
    }

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////                              Funciones generales                               ////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function alertarOns(title, msg) {
    try {
        ons.notification.toast(title + " - " + msg, { timeout: 1000, animation: 'fade' });
    }
    catch{
        alert("Error de alert");
    }

    /*
    ons.notification.alert({
        title: title,
        message: msg
    });
    */
}

function redondeo(valor) {
    return ((Math.round(valor * 100)) / 100);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////                              Base de Datos                                     ////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Evitando SQLite
//creamos una variable para generar los nuevos beacons
var beaconDeDB = {
    init: function (idBeacon, posX, posY, piso, tipo) {
        this.idBeacon = idBeacon;
        this.posX = posX;
        this.posY = posY;
        this.piso = piso;
        this.tipo = tipo;
    }
};


//creamos la tabla si no existe
function crearTabla() {

    //Evitando SQLite
    //No hacemos nada en este metodo, se usará un array en lugar de la base de datos


    
    myDB.transaction(function (transaction) {
        transaction.executeSql('CREATE TABLE IF NOT EXISTS beacons (ID INTEGER PRIMARY KEY AUTOINCREMENT, idBeacon text UNIQUE, posX integer, posY integer, piso text, tipo text)', [],
            function (tx, result) {
                console.log("Table created successfully");
            },
            function (error) {
                console.log("Error occurred while creating the table.");
            });
    });
   
}


//Insertar Beacon

function dbInsertBeacon(idBeacon, posX, posY, piso, tipo) {
    //Evitando SQLite
    /*
    if (!buscarBeaconPorIdArray(idBeacon, baseDeDatos)) {

        var beaconCreado = Object.create(beaconDeDB);
        beaconCreado.init(idBeacon, posX, posY, piso, tipo);
        baseDeDatos.push(beaconCreado);

    } else {
        console.log('dbInsertBeacon: Error occurred');
    }

*/
    
        myDB.transaction(function (transaction) {
            var executeQuery = "INSERT INTO beacons (idBeacon, posX, posY, piso, tipo) VALUES (?,?,?,?,?)";
            transaction.executeSql(executeQuery, [idBeacon, posX, posY, piso, tipo]
                , function (tx, result) {
                    console.log('dbInsertBeacon: Inserted');
                },
                function (error) {
                    console.log('dbInsertBeacon: Error occurred');
                });
        });
        
}

//Actualizar Beacon

function dbUpdateBeacon(idBeacon, posX, posY, piso, tipo) {
    /*
    var bandera = false;
    var _beacon;
    var i = 0;

    while (i < baseDeDatos.length && !bandera) {
        _beacon = baseDeDatos[i].idBeacon;

        if (baseDeDatos[i].idBeacon === idBeacon) {

            baseDeDatos[i].idBeacon = idBeacon;
            baseDeDatos[i].posX = posX;
            baseDeDatos[i].posY = posY;
            baseDeDatos[i].piso = piso;
            baseDeDatos[i].tipo = tipo;


            dibujarBeaconsEnDb(false);
            alertarOns('dbUpdateBeacon: Updated:', idBeacon + " - " + posX + " - " + posY + " - " + piso + " - " + tipo);

            bandera = true;
        }
        i++;
    }

*/



    
    myDB.transaction(function (transaction) {

        transaction.executeSql("UPDATE beacons set posX =" + posX + ", posY =" + posY + ", piso = '" + piso + "', tipo = '" + tipo + "' where idBeacon = '" + idBeacon + "'", []
            , function (tx, result) {
                dibujarBeaconsEnDb(false);
                alertarOns('dbUpdateBeacon: Updated:', idBeacon + " - " + posX + " - " + posY + " - " + piso + " - " + tipo);
            },
            function (error) {
                alertarOns('dbUpdateBeacon:', 'Error occurred');
            });
    });
    
}




//Buscar Beacon en SQL Local por id
function buscarBeaconPorIdSQL(idBeacon, radio) {
/*
    baseDeDatos.forEach(function (_beacon) {
        var _beacon;

        try {
            if (_beacon.idBeacon === idBeacon) {
                //Añadimos el radio como atributo del objeto
                _beacon.radio = radio;
                //Lo agregamos al array

                beaconsEncontrados.push(_beacon);
            }

        }
        catch{
            //nada 
        }
    });
*/
    
        myDB.transaction(function (transaction) {
            transaction.executeSql("SELECT * FROM beacons where idBeacon ='" + idBeacon + "'", [], function (tx, results) {
    
                var len = results.rows.length;
                if (len > 0) {
                    //El beacon es válido y está contrastado en la báse de datos local, lo llamamos "b"
                    b = results.rows.item(0);
                    //Añadimos el radio como atributo del objeto
                    b.radio = radio;
                    //Lo agregamos al array
    
                    beaconsEncontrados.push(b);
    
    
    
                }
    
            }, null);
        });
    
}



//Buscar beacon en array local por Id

function buscarBeaconPorIdArray(idBeacon, _array) {

    var bandera = false;
    var b = null;
    var i = 0;
    while (i < _array.length && !bandera) {

        if (_array[i].idBeacon == idBeacon) {
            b = _array[i];
            bandera = true;
        }
        i++;
    }

    return b;

}


//Pasamos los beacons de la DB local a un array
function pasarBeaconsSQLArray() {
    //Purgamos el Array
    beaconsEnDBLocal.length = 0;

    //Evitando SQLite
/*
    baseDeDatos.forEach(function (_beacon) {
        var _beacon;

        try {
            //Pasamos cada beacon al Array

            beaconsEnDBLocal.push(_beacon);

        }
        catch{
            //nada 
        }
    });
*/


   
        myDB.transaction(function (transaction) {
            transaction.executeSql("SELECT * FROM beacons", [], function (tx, results) {
    
                var len = results.rows.length;
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        //Pasamos cada beacon al Array
                        var bE = results.rows.item(i);
                        beaconsEnDBLocal.push(bE);
    
                    }
    
    
                }
    
            }, null);
        });
    
}

//Dibujamos la posición de cada beacon en la DB
function dibujarBeaconsEnDb(editable) {
    if (actualizarPlano) {
        pasarBeaconsSQLArray();
        alertarOns("Atención", "Actualizando la base de datos");
        actualizarPlano = false;
    }


    for (var i = 0; i < beaconsEnDBLocal.length; i++) {
        //alert("dibujarBeaconsEnDb:"+i);
        dibujarBeacon2(beaconsEnDBLocal[i], i, editable);
    }
}



//Mostramos los datos
function mostrarDatosSQL() {
/*
    $("#aTableData").text("");
    baseDeDatos.forEach(function (_beacon) {
        var _beacon;

        try {

            $("#aTableData").append(_beacon.idBeacon + " - " + _beacon.posX + " - " + _beacon.posY + " - " + _beacon.piso + " - " + _beacon.tipo + "<br>");
        }
        catch{
            //nada 
        }
    });
*/
   
    
        myDB.transaction(function (transaction) {
    
    
            transaction.executeSql('SELECT * FROM beacons', [], function (tx, results) {
                $("#aTableData").text("");
                var len = results.rows.length, i;
                // $("#rowCount").append(len);
                for (i = 0; i < len; i++) {
    
                    var encontrado = results.rows.item(i);
    
                    $("#aTableData").append(encontrado.idBeacon + " - " + encontrado.posX + " - " + encontrado.posY + " - " + encontrado.piso + " - " + encontrado.tipo + "<br>");
                }
    
            }, null);
        });
    
       
}

function borrarTabla() {

    //baseDeDatos.length = 0;
    
    
        myDB.transaction(function (transaction) {
            var executeQuery = "DROP TABLE  IF EXISTS beacons";
            transaction.executeSql(executeQuery, [],
                function (tx, result) { console.log('Table deleted successfully.'); },
                function (error) { console.log('Error occurred while droping the table.'); }
            );
        });
    
        
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////                              Posicionamiento                                   ////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    $("#pResultado").append('Nivel: ' + result[i].level + '<br>');
    $("#pResultado").append('Freq: ' + result[i].frequency + '<br>');
    $("#pResultado").append('Distancia: ' + radio + ' metros<br>' + '<hr>');
*/
function mostrarBeacons() {

    var ret = "No se encontraron beacons<br>";

    if (beaconsEncontrados.length > 0) {
        ret = "<hr><br>";
        for (var i = 0; i < beaconsEncontrados.length; i++) {
            ret = ret + beaconsEncontrados[i].idBeacon + '<br>Piso: ' + beaconsEncontrados[i].piso + ' / Radio: ' + beaconsEncontrados[i].radio + ' metros<br><hr>';
        }
    }
    return ret;
}

function calcularDistancia(freq, level) {

    num = Math.pow(10.0, ((27.55 - (20 * Math.log10(freq)) + Math.abs(level)) / 20));

    if (num < 0) {
        num = 0;
    }
    //return Math.round(num * 100) / 100;
    return redondeo(num);

}




function funcExterna(e) {
    try {

        WifiWizard.getScanResults({ numLevels: false }, function (result) {
            var repetido = false;
            //Purgamos el array
            beaconsEncontrados.length = 0;
            //Limpiamos el mapa
            //limpiarMapa();
            //Dibujamos la posición de los beacons según la DB
            //dibujarBeaconsEnDb(false);

            $("#pResultado").text('');
            $("#pInfo").text('');


            for (i = 0; i < result.length; i++) {
                //alert(result[i].SSID);
                /*"level": signal_level, // raw RSSI value
                "SSID": ssid, // SSID as string, with escaped double quotes: "\"ssid name\""
                "BSSID": bssid // MAC address of WiFi router as string
                "frequency": frequency of the access point channel in MHz
                "capabilities": capabilities // Describes the authentication, key management, and encryption schemes supported by the access point.
               */
                var SSID = result[i].SSID;
                var BSSID = result[i].BSSID;
                var level = result[i].level;
                var frequency = result[i].frequency;
                var radio = 0;
                var UNICODE = '';
                var idBeacon = "";
                var encontrado = null;
                console.log("SSID: " + SSID + " - MAC: " + BSSID + " - Level: " + level + " - Freq: " + frequency);

                //Modificación para agregar un beacon "falso" para las demos
                //if (SSID.length == 21) {
                if (SSID.length == 21 || SSID == "Bermudez" || (SSID == "Wifi-ORT" && !repetido) || (SSID == "Ceibal" && !repetido)) {

                    if ((SSID.charCodeAt(0) == 83 && SSID.charCodeAt(1) == 71 && SSID.charCodeAt(20) == 0) || SSID == "Bermudez" || (SSID == "Wifi-ORT" && !repetido) || (SSID == "Ceibal" && !repetido)) {
                        //Buscamos el beacon en el array local
                        encontrado = buscarBeaconPorIdArray(SSID.substring(0, 16), beaconsEnDBLocal);

                        if (encontrado != null) {

                            radio = calcularDistancia(frequency, level);
                            encontrado.radio = radio;
                            //Lo agregamos al array
                            beaconsEncontrados.push(encontrado);
                            //dibujarRadioPosicion(encontrado.posX, encontrado.posY, radio * 15, encontrado.idBeacon);

                        }

                    }


                }
                if (SSID == "Wifi-ORT" || SSID == "Ceibal") repetido = true;

            }
            //Ordenamos el array de beacons de acuerdo al radio (De menor a mayor)
            beaconsEncontrados.sort(function (a, b) {
                return a.radio - b.radio;
            });

            $("#pResultado").append(mostrarBeacons());
            $("#pResultado").append("Beacons encontrados: " + beaconsEncontrados.length + "<br>AP's encontrados: " + result.length + '<br>');
            $("#pInfo").text('Posición obtenida');


            switch (beaconsEncontrados.length) {
                case 0:
                    //alertarOns("Atención", "No se puede determinar la posición");
                    $("#pInfo").text('No se pudo determinar la posición');
                case 1:
                    //console.log("En funcExterna: Case 1: " + beaconsEncontrados[0].posX + " - " + beaconsEncontrados[0].posY + " - " + beaconsEncontrados[0].radio);
                    dibujarRadioPosicion2(beaconsEncontrados[0].posX, beaconsEncontrados[0].posY, beaconsEncontrados[0].radio * escala, false);
                    break;
                case 2:
                    bilateracion();
                    break;
                default:
                    //alertarOns("Trilateración", "3 o más beacons");
                    trilateracion();
            }

        });



    }
    catch{
        alertarOns("Error", "Intentando obtener la posición")
    }


}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////                                 Bilateración                                   ////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bilateracion() {
    var a = beaconsEncontrados[0];
    var b = beaconsEncontrados[1];

    //Se dibujan los radios originales
    //dibujarRadioPosicion(a.posX, a.posY, redondeo((a.radio) * escala),true);
    //dibujarRadioPosicion(b.posX, b.posY, redondeo((b.radio) * escala),true);

    //No los llamamos, ya no es necesario mostrarlos
    /*
    dibujarRadioPosicion2(a.posX, a.posY, (a.radio * escala),true);
    dibujarRadioPosicion2(b.posX, b.posY, (b.radio * escala),true);
   */



    var disBeaconsAB = dist2puntos(a.posX, a.posY, b.posX, b.posY);
    try {
        if (a.radio > disBeaconsAB) {
            alertarOns("Atención", "los dos radios son mayores a la dist");
            refactorizarRadios(a, b, disBeaconsAB, 1);

        } else {
            if (b.radio > disBeaconsAB) {
                //radio B mayor a la dist
                console.log("En bilateracion: " + a.posX + " - " + a.posY + " - " + a.radio);
                dibujarRadioPosicion2(a.posX, a.posY, (a.radio) * escala, false);
            } else {
                if (a.radio + b.radio < disBeaconsAB) {
                    //los radios no se intersectan
                    refactorizarRadios(a, b, disBeaconsAB, 0);


                } else {
                    //Radios correctos
                    intersect2beacons(a, b, disBeaconsAB);
                }

            }
        }
    }
    catch{
        alertarOns("Error", "Bilateración");
    }

}

//Distancia entre dos puntos
function dist2puntos(aX, aY, bX, bY) {
    dX = aX - bX;
    dY = aY - bY;
    return Math.round(Math.sqrt((dY * dY) + (dX * dX))) / escala;
}

//Re factorizar radios
function refactorizarRadios(a, b, distancia, radioMayorADistancia) {
    var dif = 0;
    if (radioMayorADistancia == 0) {
        dif = difRadiosDist(a, b, distancia);
        //a.radio = a.radio + dif;
        //Sumamos la diferencia al radio más grande
        b.radio = b.radio + (dif * 2);


    } else {
        //Los radios ingresados son mayores a la distancia entre los dos puntos, se reducen proporcionalmente y se estima la posición

        var div = (a.radio + b.radio) / distancia;
        a.radio = Math.round(a.radio / div) + 1;
        b.radio = Math.round(b.radio / div) + 1;

    }


    //dibujarRadioPosicion(a.posX, a.posY, (a.radio) * escala);
    //dibujarRadioPosicion(b.posX, b.posY, (b.radio) * escala);
    console.log("En refactorizarRadios: a:" + a.posX + " - " + a.posY + " b:" + a.posX + " - " + a.posY + " - " + distancia);

    intersect2beacons(a, b, distancia);

}

//Diferencia entre los radios y la distancia entre los puntos
function difRadiosDist(a, b, distancia) {
    return Math.round(((distancia - (a.radio + b.radio)) + 1) / 2);
}

//Intersección de dos radios
function intersect2beacons(a, b, dist) {

    var p = ((a.radio * a.radio) - (b.radio * b.radio) + (dist * dist)) / (2.0 * dist);

    var dx = b.posX - a.posX;

    var dy = b.posY - a.posY;

    var pX = a.posX + (dx * p / dist);
    var pY = a.posY + (dy * p / dist);

    var radio2 = Math.abs(Math.sqrt((a.radio * a.radio) - (p * p)) * escala);
    if (isNaN(radio2)) {
        radio2 = (a.radio + b.radio) / 4;
        console.log("En intersect2beacons: Se estima radio 2 en" + radio2);

    }
    //var radio3 = redoneo(radio2);
    console.log("En intersect2beacons: " + pX + " - " + pY + " - " + radio2);
    dibujarRadioPosicion2(pX, pY, radio2, false);

}


//Trilateración
function trilateracion() {

    var a = beaconsEncontrados[0];
    var b = beaconsEncontrados[1];
    var c = beaconsEncontrados[2];
    //No Se dibujan los radios originales
    /*
        dibujarRadioPosicion2(a.posX, a.posY, (a.radio * escala), true);
        dibujarRadioPosicion2(b.posX, b.posY, (b.radio * escala), true);
        dibujarRadioPosicion2(c.posX, c.posY, (c.radio * escala), true);
    */
    //No se utilazará el posicionamiento 3D se asignan las posiciones del eje Z como 0
    a.posZ = 0;
    b.posZ = 0;
    c.posZ = 0;
    //Se respalda el valor original de los radios
    var aRadioOriginal = a.radio + 0;
    var bRadioOriginal = b.radio + 0;
    var cRadioOriginal = c.radio + 0;


    try {
        p4 = trilaterate(a, b, c);

        if (p4 !== null) {
            if (p4 instanceof Array) {
                alertarOns("Atención:", "Sin Refact");
                dibujarRadioPosicion2(p4[0].posX, p4[0].posY, ((a.radio / 2) * escala), false);
            } else {
                alertarOns("Atención:", "Sin Refact único");
                dibujarRadioPosicion2(p4.posX, p4.posY, ((a.radio / 2) * escala), false);
            }
        } else {
            //No se logró obtener la posición con los datos obtenidos, se intentará estimar los valores
            var dif, dif2 = 0;
            var disBeaconsAB = dist2puntos(a.posX, a.posY, b.posX, b.posY);
            var disBeaconsAC = dist2puntos(a.posX, a.posY, c.posX, c.posY);
            var disBeaconsBC = dist2puntos(b.posX, b.posY, c.posX, c.posY);

            if (a.radio + b.radio < disBeaconsAB) {
                dif = difRadiosDist(a, b, disBeaconsAB);
                dif2 = difRadiosDist(a, c, disBeaconsAC);


                a.radio = a.radio + dif;
                b.radio = b.radio + dif;
                c.radio = c.radio + dif2 * 2;

            } else {
                dif = a.radio / 2;
            }


            /*
            if (a.radio + c.radio < disBeaconsAC) {
                dif2 = difRadiosDist(a, c, disBeaconsAC);
                //a.radio = a.radio + dif;
                c.radio = c.radio + dif2;
    
            }
            */

            //console.log("R1 Dif:"+dif + ", Dif2:"+dif2);


            //Se lanza nuevamente la trilateración con los nuevos valores calculados
            p4 = trilaterate(a, b, c);
            if (p4 !== null) {
                if (p4 instanceof Array) {
                    alertarOns("Atención:", "Refact array");
                    dibujarRadioPosicion2(p4[0].posX, p4[0].posY, (((dif * 2 + dif2 * 2) / 2) * escala), false);
                    //console.log("R2 Dif:"+dif + ", Dif2:"+dif2);
                } else {
                    alertarOns("Atención:", "Refact único");
                    dibujarRadioPosicion2(p4.posX, p4.posY, (((dif * 2 + dif2 * 2) / 2) * escala), false);
                }
            } else {
                a.radio = aRadioOriginal;
                b.radio = bRadioOriginal;
                alertarOns("Fallo en trilat:", "Llamando a Bilateración");
                bilateracion();



            }
        }
    }
    catch{
        alertarOns("Error", "Trilateración");
    }


}





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////                                     Outlet                                     ////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function clickCounter() {
    if (typeof (Storage) !== "undefined") {
        if (sessionStorage.clickcount) {
            sessionStorage.clickcount = Number(sessionStorage.clickcount) + 1;
        } else {
            sessionStorage.clickcount = 1;
        }
        document.getElementById("result").innerHTML = "You have clicked the button " + sessionStorage.clickcount + " time(s).";
        var len = beaconsEncontrados.length;

        if (len > 0) {
            var msg = "";
            for (i = 0; i < len; i++) {
                msg += beaconsEncontrados[i].radio + " - ";
            }
            alert(msg);
        } else {
            alertarOns("Atención", "Aún no hay elementos para mostrar");

        }

    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
    }



}




//Restos


                    /*
                                                $("#pResultado").append('SSID: (' + SSID + ')<br>');
                                                $("#pResultado").append('Largo Real: ' + SSID.length + '<br>');
                                                //str.charCodeAt(0)
                                                $("#pResultado").append('Unicode: ');
                                                UNICODE = '';
                                                for (j = 0; j < SSID.length; j++) {
                                                    UNICODE += SSID.charCodeAt(j) + ' - ';
                                                }
                                                $("#pResultado").append(UNICODE + '<br>');
                                                $("#pResultado").append('Nivel: ' + result[i].level + '<br>');
                                                $("#pResultado").append('Freq: ' + result[i].frequency + '<br>');
                                                $("#pResultado").append('Distancia: ' + radio + ' metros<br>' + '<hr>');
                    */


