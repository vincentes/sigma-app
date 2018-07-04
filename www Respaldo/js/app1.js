
$(document).ready(function () {

    var myDB;
    sessionStorage.clickcount = 1;
    var beaconsEncontrados = [];
    var beaconsEnDBLocal = [];


    //Open Database Connection
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        myDB = window.sqlitePlugin.openDatabase({ name: "sigmaDb.db", location: 'default' });
        crearTabla();
        preCargaSQL();
        pasarBeaconsSQLArray();


    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////                              Base de Datos                                     ////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //creamos la tabla si no existe
    function crearTabla() {
        myDB.transaction(function (transaction) {
            transaction.executeSql('CREATE TABLE IF NOT EXISTS beacons (ID INTEGER PRIMARY KEY AUTOINCREMENT, idBeacon text UNIQUE, posX integer, posY integer, piso text, tipo text)', [],
                function (tx, result) {
                    //alert("Table created successfully");
                },
                function (error) {
                    //alert("Error occurred while creating the table.");
                });
        });
    }


    //Insertar Beacon

    function dbInsertBeacon(idBeacon, posX, posY, piso, tipo) {
        myDB.transaction(function (transaction) {
            var executeQuery = "INSERT INTO beacons (idBeacon, posX, posY, piso, tipo) VALUES (?,?,?,?,?)";
            transaction.executeSql(executeQuery, [idBeacon, posX, posY, piso, tipo]
                , function (tx, result) {
                    //alert('Inserted');
                },
                function (error) {
                    //alert('Error occurred');
                });
        });
    }


    //PreCarga de datos
    function preCargaSQL() {
        dbInsertBeacon("SG000001AAAA0001", 40, 40, "PB", "Salón 1");
        dbInsertBeacon("SG000001AAAA0002", 160, 160, "PB", "Salón 2");
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

        myDB.transaction(function (transaction) {
            transaction.executeSql("SELECT * FROM beacons", [], function (tx, results) {

                var len = results.rows.length;
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        //Pasamos cada beacon al Array
                        beaconsEnDBLocal.push(results.rows.item(i))
                    }


                }

            }, null);
        });

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
                function (tx, result) { alert('Table deleted successfully.'); },
                function (error) { alert('Error occurred while droping the table.'); }
            );
        });
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////                              Botones                                           ////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    $('#wifi').click(function () {
        try {
            WifiWizard.isWifiEnabled(win, fail);
        }
        catch (err) {
            alert("Plugin Error - " + err.message);
        }

    });

    $('#scan').click(function () {
        try {
            WifiWizard.startScan(scanOK, scanFail);

        }
        catch (err) {
            alert("Plugin Error - " + err.message);
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
            ret = "";
            for (var i = 0; i < beaconsEncontrados.length; i++) {
                ret = ret + 'SSID: ' + beaconsEncontrados[i].idBeacon + '<br>Piso: ' + beaconsEncontrados[i].piso + '<br>Radio: ' + beaconsEncontrados[i].radio + ' metros<br>' + '<hr>';
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
            alert("Wifi enabled already");
        }
        else {
            WifiWizard.setWifiEnabled(true, winEnable, failEnable);
        }
    }

    function scanOK(e) {
        if (e) {
            //No funca el set interval
            var scan = setInterval(funcExterna(e), 5000);
            

        }

        else {
            alert("No se inició el scan");
        }

    }

    function funcExterna(e){
        
        WifiWizard.getScanResults({ numLevels: false }, function (result) {
            //Purgamos el array
            beaconsEncontrados.length = 0;

            $("#pResultado").text('');
            var counterBeacons = 0;
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
                            dibujarBeacon(encontrado.posX, encontrado.posY, radio * 20, encontrado.idBeacon);

                        }





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


                    }


                }

            }

            $("#pResultado").append("AP's encontrados: " + result.length + '<br>' + "Beacons encontrados: " + beaconsEncontrados.length + '<br>');
            $("#pResultado").append(mostrarBeacons());

        });
    }

    function fail(e) {
        alert("Error checking Wifi status");
    }

    function scanFail(e) {
        alert("Error al iniciar el scan, compruebe que el WIFI esté encendido");
    }

    function winEnable(e) {
        alert("Wifi enabled successfully");
    }

    function failEnable(e) {
        alert("Error enabling Wifi ");
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
                alert("Aún no hay elementos para mostrar");
            }

        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
        }
    }


});



