
//$(document).ready(function () {

//Inicializamos variables globales
var myDB;
sessionStorage.clickcount = 1;
var beaconsEncontrados = [];
var beaconsEnDBLocal = [];
var escala = 15;


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


    }

    //PreCarga de datos
    function preCargaSQL() {
        dbInsertBeacon("SG000001AAAA0001", 50, 60, "PB", "Salón 1");
        dbInsertBeacon("SG000001AAAA0002", 125, 190, "PB", "Salón 2");
        dbInsertBeacon("SG000001AAAA0003", 200, 60, "PB", "Salón 3");
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////                              Botones                                           ////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    $('#wifi').click(function () {
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
    //Scan Jquery
    $('#scan').click(function () {
        try {
            WifiWizard.startScan(scanOK, scanFail);

        }
        catch (err) {
            ons.notification.alert({
                title: 'Atención!',
                message: "Plugin Error - " + err.message
            });
        }

    });



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
//////////////////////                              Funciones generales                               ////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function alertarOns(title, msg) {
    ons.notification.alert({
        title: title,
        message: msg
    });
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////                              Base de Datos                                     ////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//creamos la tabla si no existe
function crearTabla() {
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




//Buscar Beacon en SQL Local por id
function buscarBeaconPorIdSQL(idBeacon, radio) {

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

function buscarBeaconPorIdArray(idBeacon) {
    var bandera = false;
    var b = null;
    var i = 0;
    while (i < beaconsEnDBLocal.length && !bandera) {

        if (beaconsEnDBLocal[i].idBeacon == idBeacon) {
            b = beaconsEnDBLocal[i];
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
function dibujarBeaconsEnDb() {
    for (var i = 0; i < beaconsEnDBLocal.length; i++) {
        dibujarBeacon(beaconsEnDBLocal[i]);
    }
}



//Mostramos los datos
function mostrarDatosSQL() {


    myDB.transaction(function (transaction) {


        transaction.executeSql('SELECT * FROM beacons', [], function (tx, results) {
            $("#aTableData").text("");
            var len = results.rows.length, i;
            // $("#rowCount").append(len);
            for (i = 0; i < len; i++) {

                var encontrado = results.rows.item(i);

                $("#aTableData").append(encontrado.idBeacon + " - " + encontrado.piso + " - " + encontrado.tipo + "<br>");
            }

        }, null);
    });
}

function borrarTabla() {
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
    return Math.round(num * 100) / 100;

}


function win(e) {
    if (e) {
        alertOns("Atención","Wifi enabled already");
    }
    else {
        WifiWizard.setWifiEnabled(true, winEnable, failEnable);
    }
}

function scanOK(e) {
    if (e) {
        //No funca el set interval
        //var scan = setInterval(funcExterna(e), 5000);
        funcExterna(e);

    }

    else {
        alertOns("Atención","No se inició el scan");
    }

}

function funcExterna(e) {

    WifiWizard.getScanResults({ numLevels: false }, function (result) {
        //Purgamos el array
        beaconsEncontrados.length = 0;
        //Limpiamos el mapa
        limpiarMapa();
        //Dibujamos los beacons en la DB
        dibujarBeaconsEnDb();

        $("#pResultado").text('');

        for (i = 0; i < result.length; i++) {
            //alert(result[i].SSID);
            /*"level": signal_level, // raw RSSI value
            "SSID": ssid, // SSID as string, with escaped double quotes: "\"ssid name\""
            "BSSID": bssid // MAC address of WiFi router as string
            "frequency": frequency of the access point channel in MHz
            "capabilities": capabilities // Describes the authentication, key management, and encryption schemes supported by the access point.
           */
            var SSID = result[i].SSID;
            var radio = 0;
            var UNICODE = '';
            var idBeacon = "";
            var encontrado = null;

            if (SSID.length == 21) {
                if (SSID.charCodeAt(0) == 83 && SSID.charCodeAt(1) == 71 && SSID.charCodeAt(20) == 0) {
                    //Buscamos el beacon en el array local
                    encontrado = buscarBeaconPorIdArray(SSID.substring(0, 16));

                    if (encontrado != null) {

                        radio = calcularDistancia(result[i].frequency, result[i].level);
                        encontrado.radio = radio;
                        //Lo agregamos al array
                        beaconsEncontrados.push(encontrado);
                        //dibujarRadioPosicion(encontrado.posX, encontrado.posY, radio * 15, encontrado.idBeacon);

                    }

                }


            }

        }
        //Ordenamos el array de beacons de acuerdo al radio (De menor a mayor)
        beaconsEncontrados.sort(function (a, b) {
            return a.radio - b.radio;
        });

        $("#pResultado").append(mostrarBeacons());
        $("#pResultado").append("Beacons encontrados: " + beaconsEncontrados.length + "<br>AP's encontrados: " + result.length + '<br>');

        switch (beaconsEncontrados.length) {
            case 0:
                alertarOns("Atención", "No se encontraron beacons");
            case 1:
                dibujarRadioPosicion(beaconsEncontrados[0].posX, beaconsEncontrados[0].posY, beaconsEncontrados[0].radio * escala);
                break;
            case 2:
                bilateracion();
                break;
            default:
                alertarOns("Trilateración", "3 o más beacons");
        }

    });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////                                 Bilateración                                   ////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bilateracion() {
    var a = beaconsEncontrados[0];
    var b = beaconsEncontrados[1];
    var disBeacons = dist2puntos(a.posX, a.posY, b.posX, b.posY);
    if (a.radio > disBeacons) {
        //refactorizarRadios(a,b, distancia);
        alertOns("Atención", "los dos radios son mayores a la dist");
    } else {
        if (b.radio > disBeacons) {
            alertOns("Atención", "radio B mayor a la dist");
        } else {
            alertOns("Atención", "todo en orden");
        }
    }
}

//Distancia entre dos puntos
function dist2puntos(aX, aY, bX, bY) {
    dX = aX - bX;
    dY = aY - bY;
    return Math.round(Math.sqrt((dY * dY) + (dX * dX))) / escala;
}





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////                                  Win - Fail                                    ////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function fail(e) {
    alertOns("Atención", "Error checking Wifi status");
}

function scanFail(e) {
    alertOns("Atención", "Error al iniciar el scan, compruebe que el WIFI esté encendido");

}

function winEnable(e) {
    alertOns("Atención", "Wifi enabled successfully");

}


function failEnable(e) {
    alertOns("Atención", "Wifi NOT enabled successfully");
}

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
            alertOns("Atención", "Aún no hay elementos para mostrar");
           
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


