var marcadoresDisponibles = [];
var marcadorActivo;
var posicionamiento = [];
var map;
var verBeacons = false;


function controlMapaSetup(edicion) {


    map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 2,
        attributionControl: false
    }).
        setView([700, 1000], -2);;






    var yx = L.latLng;

    var xy = function (x, y) {
        if (L.Util.isArray(x)) {    // When doing xy([x, y]);
            return yx(x[1], x[0]);
        }
        return yx(y, x);  // When doing xy(x, y);
    };



    var southWest = L.latLng(0, 0),
        northEast = L.latLng(2380, 1600);
    var bounds = L.latLngBounds(southWest, northEast);

    map.setMaxBounds(bounds);
    map.on('drag', function () {
        map.panInsideBounds(bounds, { animate: false });
    });
    //var bounds = [xy(0, 0), xy(1400, 2000)];
    //var image = L.imageOverlay('img/PlanoBase4_1400x2000.png', bounds).addTo(map);

    var Marcador = L.Icon.extend({
        options: {
            shadowUrl: 'img/marker-shadow.png',
            iconSize: [25, 41],
            shadowSize: [41, 41],
            iconAnchor: [12, 40],
            shadowAnchor: [12, 41],
            popupAnchor: [0, -30]
        }
    });


    var mBeacon = L.Icon.extend({
        options: {
            //shadowUrl: 'img/beaconSelect.png',
            iconSize: [40, 40],
            //shadowSize: [10, 10],
            iconAnchor: [20, 20],
            //shadowAnchor: [0, 0],
            popupAnchor: [0, -20]
        }
    });

    var mBeaconR = L.Icon.extend({
        options: {
            shadowUrl: 'img/beaconSelect.png',
            iconSize: [40, 40],
            shadowSize: [40, 40],
            iconAnchor: [20, 20],
            shadowAnchor: [20, 20],
            popupAnchor: [0, -20]
        }
    });




    //Configuramos los marcadores para los beacons
    var mB1 = new mBeacon({ iconUrl: 'img/beacon1.png' }),
        mB2 = new mBeacon({ iconUrl: 'img/beacon2.png' }),
        mB3 = new mBeacon({ iconUrl: 'img/beacon3.png' }),
        mB4 = new mBeacon({ iconUrl: 'img/beacon4.png' }),
        mB5 = new mBeacon({ iconUrl: 'img/beacon5.png' });


    mR1 = new mBeaconR({ iconUrl: 'img/beacon1.png' });
    mR2 = new mBeaconR({ iconUrl: 'img/beacon2.png' });
    mR3 = new mBeaconR({ iconUrl: 'img/beacon3.png' });
    mR4 = new mBeaconR({ iconUrl: 'img/beacon4.png' });
    mR5 = new mBeaconR({ iconUrl: 'img/beacon5.png' });





    //function ubicarBeacons() {
    var lat = map.getCenter().lat;
    var lng = map.getCenter().lng;
    /*
        var lat = -2000;
        var lng = -2000;
    */
    var b5 = L.marker([lat, lng], { draggable: true, icon: mB5 }).addTo(map);
    var b4 = L.marker([lat, lng], { draggable: true, icon: mB4 }).addTo(map);
    var b3 = L.marker([lat, lng], { draggable: true, icon: mB3 }).addTo(map);
    var b2 = L.marker([lat, lng], { draggable: true, icon: mB2 }).addTo(map);
    var b1 = L.marker([lat, lng], { draggable: true, icon: mB1 }).addTo(map);






    b1.on('dragend', function (e) {
        try {
            b1.bindPopup('Posición Modificada:<br>Lng/X:' + Math.round(b1.getLatLng().lng) + ' - Lat/Y:' + Math.round(b1.getLatLng().lat));
            b1.setIcon(mR1);
        }
        catch{
            alert("No se pudo fijar las propiedades al marcador");
        }
    });

    b2.on('dragend', function (e) {
        try {
            b2.bindPopup('Posición Modificada:<br>Lng/X:' + Math.round(b2.getLatLng().lng) + ' - Lat/Y:' + Math.round(b2.getLatLng().lat));
            b2.setIcon(mR2);
        }
        catch{
            alert("No se pudo fijar las propiedades al marcador");
        }
    });

    b3.on('dragend', function (e) {
        try {
            b3.bindPopup('Posición Modificada:<br>Lng/X:' + Math.round(b3.getLatLng().lng) + ' - Lat/Y:' + Math.round(b3.getLatLng().lat));
            b3.setIcon(mR3);
        }
        catch{
            alert("No se pudo fijar las propiedades al marcador");
        }
    });

    b4.on('dragend', function (e) {
        try {
            b4.bindPopup('Posición Modificada:<br>Lng/X:' + Math.round(b4.getLatLng().lng) + ' - Lat/Y:' + Math.round(b4.getLatLng().lat));
            b4.setIcon(mR4);
        }
        catch{
            alert("No se pudo fijar las propiedades al marcador");
        }
    });

    b5.on('dragend', function (e) {
        try {
            b5.bindPopup('Posición Modificada:<br>Lng/X:' + Math.round(b5.getLatLng().lng) + ' - Lat/Y:' + Math.round(b5.getLatLng().lat));
            b5.setIcon(mR5);
        }
        catch{
            alert("No se pudo fijar las propiedades al marcador");
        }
    });


    //b3.options.icon.options.shadowSize = [40, 40];
    //b3.options.icon.options.shadowAnchor = [20, 20];

    /*
    var icon = centerMarker.options.icon;
    icon.options.iconSize = [newwidth, newheight];
    centerMarker.setIcon(icon);
*/
    /*
        b1.setOpacity(0.3);
        b2.setOpacity(0.3);
        b3.setOpacity(0.3);
    */
    //Purgamos el Array
    marcadoresDisponibles.length = 0;

    marcadoresDisponibles.push(b1);
    marcadoresDisponibles.push(b2);
    marcadoresDisponibles.push(b3);
    marcadoresDisponibles.push(b4);
    marcadoresDisponibles.push(b5);








    //Configuramos los marcadores standard

    var mAzul = new Marcador({ iconUrl: 'img/blue-marker-icon.png' }),
        mRojo = new Marcador({ iconUrl: 'img/red-marker-icon.png' }),
        mVerde = new Marcador({ iconUrl: 'img/green-marker-icon.png' });

    L.icon = function (options) {
        return new L.Icon(options);
    };




    //L.control.scale().addTo(map);



    function getColor(d) {
        return d == "base" ? '#bebebe' :
            d == "salon" ? '#ffffff' :
                d == "gimnasio" ? '#ffffcc' :
                    d == "banio" ? '#cfeef3' :
                        d == "lab" ? '#d1f5d6' :
                            d == "admin" ? '#f7dede' :
                                d == "cantina" ? '#fbddbc' :
                                    d == "comedor" ? '#cfcaeb' :
                                        d == "libre" ? '#eeeeee' :
                                            d == "escalon" ? '#d0d0d0' :
                                                'red';
    }
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.TIPO),

            weight: 2,
            opacity: 1,
            color: getColor(feature.properties.TIPO),
            //dashArray: '3',

            fillOpacity: 1

        };
    }


    function popup(feature, layer) {
        if (feature.properties && feature.properties.NAME) {
            layer.bindPopup(feature.properties.NAME + "<br><ons-button onclick='alert('ok')'>Como llegar</ons-button>");
        }
    }
    geojson = L.geoJson(plano, { style: style, onEachFeature: popup }).addTo(map);



    //Insertamos el circulo de posicionamiento
    var circulo = L.circle(
        [-500, -500],
        20,
        { interactive: false }
    ).addTo(map);

    //Purgamos el array
    posicionamiento.length = 0;
    posicionamiento.push(circulo);

    var miPos = L.marker([-500, -500], { icon: mRojo }).addTo(map);
    posicionamiento.push(miPos);

    // }

    // ubicarBeacons();






    /* 
     var bounds2 = new L.LatLngBounds(
         new L.LatLng(700, 1000),
         new L.LatLng(710, 1010));
     
     var overlay = new L.ImageOverlay("img/punto.png", bounds2, {
         opacity: 0.5,
         interactive: true,
         //attribution: '&copy; A.B.B Corp.'
     });
     map.addLayer(overlay);
     
     //overlay.on('dblclick', function (e) {alert("2 Punto");});
     overlay.on('click', function (e) {alert("1 Punto");});
     
     L.marker([150, 150], { draggable: true }).addTo(map);
     */


}


function dibujarBeacon2(beacon, numero, editable) {
    //alert("dibujarBeacon2:");
    // alert(marcadoresDisponibles[numero].getLatLng().lng);
    //alert("Y:"+ beacon.posY +" - X:"+ beacon.posX);
    marcadoresDisponibles[numero].setLatLng([beacon.posY, beacon.posX]);
    if (!editable) {
        marcadoresDisponibles[numero].dragging.disable();
    }

    marcadoresDisponibles[numero].bindPopup(beacon.idBeacon + "<br>Lng/X:" + Math.round(marcadoresDisponibles[numero].getLatLng().lng) + " - Lat/Y:" + Math.round(marcadoresDisponibles[numero].getLatLng().lat));
    //marcadoresDisponibles[numero].on('dragend', function (e) {bindPopup(beacon.idBeacon + "<br>Lat/Y:" +Math.round(marcadoresDisponibles[numero].getLatLng().lat) + " - Lng/X:" + Math.round(marcadoresDisponibles[numero].getLatLng().lng)); });
}

function grabarPosiciones() {
    for (var i = 0; i < marcadoresDisponibles.length; i++) {
        //dbUpdateBeacon(idBeacon, posX, posY, piso, tipo) 
        /*
        dbInsertBeacon("SG000001AAAA0001", 1310, 1280, "SS", "Beacon 1");
        dbInsertBeacon("SG000001AAAA0002", 1280, 1560, "SS", "Beacon 2");
        dbInsertBeacon("SG000001AAAA0003", 1315, 1725, "SS", "Beacon 3");
        */
        //Modificación para agregar un beacon "falso" para las demos
        //dbUpdateBeacon("SG000001AAAA000" + (i + 1), Math.round(marcadoresDisponibles[i].getLatLng().lng), Math.round(marcadoresDisponibles[i].getLatLng().lat), "SS", "Beacon " + (i + 1));
        switch (i) {
            case 3:
                dbUpdateBeacon("Bermudez", Math.round(marcadoresDisponibles[i].getLatLng().lng), Math.round(marcadoresDisponibles[i].getLatLng().lat), "SS", "Beacon " + (i + 1));
                break;
            case 4:
                dbUpdateBeacon("Wifi-ORT", Math.round(marcadoresDisponibles[i].getLatLng().lng), Math.round(marcadoresDisponibles[i].getLatLng().lat), "SS", "Beacon " + (i + 1));
                break;
            default:
                dbUpdateBeacon("SG000001AAAA000" + (i + 1), Math.round(marcadoresDisponibles[i].getLatLng().lng), Math.round(marcadoresDisponibles[i].getLatLng().lat), "SS", "Beacon " + (i + 1));

        }
//Bermudez Wifi-ORT
       
    }
    actualizarPlano = true;
    dibujarBeaconsEnDb(false);
}

function verPosicionamiento(_ver) {
    posicionamiento.forEach(function (marker) {
        if (_ver) {
            map.addLayer(marker);
        } else {
            map.removeLayer(marker);

        }

    });
}

//activamos o desactivamos el centrar el mapa al obtener la posición




function dibujarRadioPosicion2(posX, posY, radio2, esUnBeacon) {
    radio = redondeo(Math.abs(radio2));
    //Radio de señal
    /*
    if(esUnBeacon == true){
        context.strokeStyle = "gray";
        context.fillStyle = "rgba(90, 255, 255, 0.1)";
    }else{
        context.strokeStyle = "red";
        context.fillStyle = "rgba(255, 90, 90, 0.2)";
    }
*/
    console.log("En dibujarRadioPosicion2: " + posX + " - " + posY + " - " + radio2 + " - " + esUnBeacon);

    if (!esUnBeacon) {
        verPosicionamiento(true);
        try {
            posicionamiento[0].setLatLng([posY, posX]);
            posicionamiento[0].setRadius(radio);

            //Consultamos la latitud del elemento 1, si es menor a cero significa que es la primera vez que se obtiene la pos, centramos el mapa una vez
            if (posicionamiento[1].getLatLng().lat < 0) {
                centrarEnPosicion();
            }
            posicionamiento[1].setLatLng([posY, posX]).bindPopup("Mi ubicación en<br>" + redondeo((radio / escala)) + 'mts');

            /*
            var limitesDelMarcador = L.latLngBounds([posicionamiento[0].getLatLng()]);
            map.fitBounds(limitesDelMarcador);
 
            */
            //posicionamiento[1].openPopup();

            //Centramos el mapa en la posición
            if (centrarMapa) {
                centrarEnPosicion();

            }

        }
        catch{
            alertarOns("Atención", "Error al fijar posición");
        }


    }
}

function centrarEnPosicion() {
    var _posX = posicionamiento[0].getLatLng().lng;
    var _posY = posicionamiento[0].getLatLng().lat;

    if (_posX > 0) {
        map.panTo(new L.LatLng(_posY, _posX));

    }

}


function verOcultarBeacons(_ver) {
    var _ver;


    marcadoresDisponibles.forEach(function (_marcador) {
        var _marcador;
        if (_ver) {
            try {
                map.addLayer(_marcador);
                $('#modPos').show();

            }
            catch{ alertarOns("atención", "Error al agregar el marcador"); }

        } else {
            try {
                map.removeLayer(_marcador);
                $('#modPos').hide();
            }
            catch{ alertarOns("atención", "Error al quitar el marcador"); }



        }

    });
    if (_ver) {
        dibujarBeaconsEnDb(false);
    }

}

function moverBloquearBeacons(_permitir) {
    var _permitir;

    marcadoresDisponibles.forEach(function (marker) {
        if (_permitir) {
            try {
                marker.dragging.enable();
            }
            catch{ alertarOns("atención", "Error al aplicar la propiedad"); }


        } else {
            try {
                marker.dragging.disable();
            }
            catch{ alertarOns("atención", "Error al aplicar la propiedad"); }


        }

    });

}

function buscarLugar(_lugar) {
    alertarOns("Estás buscando", _lugar);


    for (var i = 0; i < geojson.getLayers().length; i++) {
        var _name = geojson.getLayers()[i].feature.properties.NAME;

        if (_name == _lugar) {
            geojson.getLayers()[i].openPopup();
        }



    }


}


