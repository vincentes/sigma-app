var marcadoresDisponibles = [];
var marcadorActivo;
var posicionamiento = [];
var map;
var verBeacons = false;
var geojson;
var destinoFijado = "";
var origenFijado = false;
var dupArray = [];

var centrarEnRuta = false;

function controlMapaSetup(edicion) {

    try {
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
        mB6 = new mBeacon({ iconUrl: 'img/beacon6.png' });



        mR1 = new mBeaconR({ iconUrl: 'img/beacon1.png' });
        mR2 = new mBeaconR({ iconUrl: 'img/beacon2.png' });
        mR3 = new mBeaconR({ iconUrl: 'img/beacon3.png' });
        mR4 = new mBeaconR({ iconUrl: 'img/beacon4.png' });
        mR5 = new mBeaconR({ iconUrl: 'img/beacon5.png' });
        mR6 = new mBeaconR({ iconUrl: 'img/beacon6.png' });






        //function ubicarBeacons() {
        var lat = map.getCenter().lat;
        var lng = map.getCenter().lng;
        /*
            var lat = -2000;
            var lng = -2000;
        */
        var b6 = L.marker([lat, lng], { draggable: true, icon: mB6 }).addTo(map);
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

        b6.on('dragend', function (e) {
            try {
                b6.bindPopup('Posición Modificada:<br>Lng/X:' + Math.round(b6.getLatLng().lng) + ' - Lat/Y:' + Math.round(b6.getLatLng().lat));
                b6.setIcon(mR6);
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
        marcadoresDisponibles.push(b6);









        //Configuramos los marcadores standard

        var mAzul = new Marcador({ iconUrl: 'img/blue-marker-icon.png' }),
            mRojo = new Marcador({ iconUrl: 'img/red-marker-icon.png' }),
            mVerde = new Marcador({ iconUrl: 'img/green-marker-icon.png' });

        L.icon = function (options) {
            return new L.Icon(options);
        };



        // Acciones de acuerdo al nivel de Zoom
        var legAtZoom1 = '<b>20 mts.</b><br><img src="img/Escala1.png" height="15" width="100">';
        var legAtZoom2 = '<b>10 mts.</b><br><img src="img/Escala2.png" height="15" width="100">';
        var legAtZoom3 = '<b>5 mts.</b><br><img src="img/Escala3.png" height="15" width="100">';
        var legAtZoom4 = '<b>2 mts.</b><br><img src="img/Escala4.png" height="15" width="100">';
        var legAtZoom5 = '<b>1 mt.</b><br><img src="img/Escala4.png" height="15" width="100">';

        var legend = L.control({ position: 'bottomleft' });
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += legAtZoom1;

            return div;
        };
        legend.addTo(map);


        map.on('zoomend', onZoomend);

        function onZoomend() {
            //alert(map.getZoom());
            var _zoom = map.getZoom();
            switch (_zoom) {
                case -2:
                    legend.getContainer().innerHTML = legAtZoom1;

                    break;
                case -1:
                    legend.getContainer().innerHTML = legAtZoom2;

                    break;
                case 0:
                    legend.getContainer().innerHTML = legAtZoom3;

                    break;
                case 1:
                    legend.getContainer().innerHTML = legAtZoom4;

                    break;
                case 2:
                    legend.getContainer().innerHTML = legAtZoom5;

                    break;
                default:
                    legend.getContainer().innerHTML = "Zoom Fuera de rango";

                    break;
            }

            nombreDeLosFeatures(_zoom);

        };


        //L.control.scale().addTo(map);



        function getColor(d) {
            return d == "exterior" ? '#cadfc6' :
                d == "base" ? '#414141' :
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
                //layer.bindPopup(feature.properties.NAME + "<br><ons-button onclick='comoLlegar(" + '"ssAds","' + feature.properties.ALIAS + '"' + ")'>Como llegar</ons-button>");
                layer.bindPopup(feature.properties.NAME + "<br><ons-button onclick='rutaMasCorta(" + '"' + feature.properties.ALIAS + '"' + ")'>Como llegar</ons-button>");
                //console.log(feature.geometry.coordinates[0][0].getBounds().getCenter());
                //layer.bindTooltip("label", { permanent: true, direction: "center", className: "my-labels" }).openTooltip();
                //.getLatLng().lng
            }
        }

        geojson = L.geoJson(plano, { style: style, onEachFeature: popup }).addTo(map);




        //Insertamos el circulo de posicionamiento
        var circulo = L.circle(
            [-2500, -2500],
            20,
            { interactive: false }
        ).addTo(map);

        //Purgamos el array
        posicionamiento.length = 0;
        posicionamiento.push(circulo);

        var miPos = L.marker([-2500, -2500], { icon: mRojo }).addTo(map);
        var miDestino = L.marker([-2500, -2500], { icon: mVerde }).addTo(map);
        var miOrigen = L.marker([-2500, -2500], { icon: mAzul }).addTo(map);



        posicionamiento.push(miPos);
        posicionamiento.push(miDestino);
        posicionamiento.push(miOrigen);



        //Nombre para las features (En desarrollo)
        /*
            var miPosXX = L.marker([900, 900], { icon: mVerde }).addTo(map);
            //miPosXX.bindTooltip("my tooltip text").openTooltip();
            miPosXX.bindTooltip("label", { permanent: true, direction: "center", className: "my-labels" }).openTooltip();
        */

        ///////////////////////////////////////////////////////////////////////////////////////
        ////////////////// Búsqueda
        ///////////////////////////////////////////////////////////////////////////////////////

        var searchControl = new L.Control.Search({
            layer: geojson,
            propertyName: 'NAME',
            marker: false,
            moveToLocation: function (latlng, title, map) {
                //map.fitBounds( latlng.layer.getBounds() );
                var zoom = (map.getBoundsZoom(latlng.layer.getBounds())) - 1;

                map.setView(latlng, zoom); // access the zoom
            }
        });

        searchControl.on('search:locationfound', function (e) {

            //console.log('search:locationfound', );

            //map.removeLayer(this._markerSearch)

            e.layer.setStyle({ fillColor: '#3f0', color: '#0f0' });
            if (e.layer._popup)
                e.layer.openPopup();

        }).on('search:collapsed', function (e) {

            geojson.eachLayer(function (layer) {	//restore feature color
                geojson.resetStyle(layer);
            });
        });

        map.addControl(searchControl);  //inizialize search control



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


        function nombreDeLosFeatures(_zoom) {
            var _capaObtenida;
            var _nombre;
            var _zoom;
            var _nivel;
            var _count;

            for (var i = 0; i < geojson.getLayers().length; i++) {
                _capaObtenida = geojson.getLayers()[i];
                if (_capaObtenida.feature.properties.LABEL) {
                    if (_zoom != "no") {
                        _count = _capaObtenida.feature.properties.LABEL.length;
                        // alert(_nivel + " - "+ _capaObtenida.feature.properties.NAME + " - " + _count);
                        switch (_count) {
                            case 1:
                                _nivel = 0;
                                break;
                            case 2:
                                if (_zoom < 0) {
                                    _nivel = 0;
                                } else {
                                    _nivel = 1;
                                }

                                break;
                            case 3:
                                if (_zoom < 0) {
                                    _nivel = 0;
                                } else {
                                    if (_zoom == 0) {
                                        _nivel = 1;
                                    } else {
                                        _nivel = 2;
                                    }
                                }


                                break;

                            case 4:
                                if (_zoom == 2) {
                                    _nivel = 3;
                                } else {

                                    _nivel = _zoom + 2;

                                }


                                break;
                            default:
                                _nivel = _zoom + 2;
                                break;
                        }
                        _nombre = _capaObtenida.feature.properties.LABEL[(_nivel)];
                        _capaObtenida.setTooltipContent(_nombre);
                    } else {
                        _nombre = _capaObtenida.feature.properties.LABEL[0];
                        _capaObtenida.bindTooltip(_nombre, { permanent: true, direction: "center", className: "my-labels" }).openTooltip();

                    }


                    // console.log(_capaObtenida.feature.properties.NAME);
                    // console.log(_capaObtenida.getBounds());

                    // console.log(_capaObtenida.getBounds().getCenter());
                    //L.marker(_capaObtenida.getBounds().getCenter(), { icon: mVerde }).addTo(map);
                    //_capaObtenida.unbindTooltip();
                }

            }
        }


        nombreDeLosFeatures("no");



    }

    catch{
        console.log("Mapa ya inicializado");
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Llave de fin de función inicial
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
}

function viajar(_Array, _comienzaEnPosicion, _distancia) {
    var _miPos = posicionamiento[1].getLatLng();
    var _marcadorOrigen = posicionamiento[3];
    var _marcadorDestino = posicionamiento[2];
    var _distancia;
    var _distanciaObt = 0;
    var _grupo;
    var _Array;
    



    if (_comienzaEnPosicion) {


        //generamos el punto "nexo" entre la posición y el nodo inicio
        var _lat = _Array[_Array.length - 1][0];
        var _lng = _Array[_Array.length - 1][1];


        //dist2puntos(a.posX, a.posY, b.posX, b.posY);
        _distanciaObt += dist2puntos(_lng, _lat, _miPos.lng, _miPos.lat);
        _distanciaObt += dist2puntos(_lng, _lat, _miPos.lng, _lat);


        _Array.push([_lat, _miPos.lng]);

        _Array.push(_miPos);
    }


    if (!origenFijado) {
        dupArray.length = 0;
        dupArray = _Array.slice();
        /*
       for(var i = 0; i < _Array.length; i++){
           dupArray[i] = _Array[i];
       }
*/
        map.addLayer(_marcadorOrigen);

        _marcadorOrigen.setLatLng(posicionamiento[0].getLatLng());
        _marcadorOrigen.bindPopup("Punto de partida");
        origenFijado = true;
    }

    travel1 = L.polyline(dupArray).addTo(map);

    travel1.setStyle({
        color: 'grey',
        weight: '10',
        dashArray: [1, 15]
    });

    travel2 = L.polyline(_Array).addTo(map);
    travel2.setStyle({
        color: 'red',
        weight: '10',
        dashArray: [1, 15]
    });
    _marcadorDestino.bindPopup("Tu destino a:<br>" + redondeo((_distancia / escala) + _distanciaObt) + " metros");
    map.addLayer(_marcadorDestino);
    map.addLayer(_marcadorOrigen);




    if (centrarEnRuta) {

        _marcadorDestino.openPopup();
        map.fitBounds(travel2.getBounds(), { padding: [25, 25] });

        //toastOns("Su destino a: ", redondeo((_distancia / escala) + _distanciaObt) + " metros");
        centrarEnRuta = false;
    }

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
            case 5:
                dbUpdateBeacon("Ceibal", Math.round(marcadoresDisponibles[i].getLatLng().lng), Math.round(marcadoresDisponibles[i].getLatLng().lat), "SS", "Beacon " + (i + 1));
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
    //posicionamiento.forEach(function (marker) {
    for (var i = 0; i < 2; i++) {
        if (_ver) {
            map.addLayer(posicionamiento[i]);
        } else {
            map.removeLayer(posicionamiento[i]);

        }
    }
    //});
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

            if (destinoFijado != "") {
                //alert("Destino ya fijado: " + destinoFijado);
                rutaMasCorta(destinoFijado);
            }

            //Centramos el mapa en la posición
            if (centrarMapa) {
                centrarEnPosicion();

            }

        }
        catch{
            // toastOns("Atención", "Error al fijar posición");
            console.log("En dibujarRadioPosicion2 Error al fijar posición")
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
            catch{ console.log("atención Error al agregar el marcador"); }

        } else {
            try {
                map.removeLayer(_marcador);
                $('#modPos').hide();
            }
            catch{ console.log("atención Error al quitar el marcador"); }



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
            catch{ console.log("En moverBloquearBeacons Error al activar dragging"); }


        } else {
            try {
                marker.dragging.disable();
            }
            catch{ console.log("En moverBloquearBeacons Error al desactivar dragging"); }



        }

    });

}

//Se cambió por Search Control
/*
function buscarLugar(_lugar) {
    var _name;
    var _lugar;
    var _msg = "No se encontró";
    
       
 
 
     for (var i = 0; i < geojson.getLayers().length; i++) {
         
         if(geojson.getLayers()[i].feature.properties.NAME){
                        
             _name = geojson.getLayers()[i].feature.properties.NAME;
             
         if (_name.toLowerCase() === _lugar.toLowerCase()) {
             geojson.getLayers()[i].openPopup();
               _msg = "Encontrado";
 
         }
         }
 
 
     }
  toastOns(_msg, _lugar);
 
 }
*/
//Buscar el nombre de un lugar según su Alias
function nombreSegunAlias(_alias) {
    var _name;
    var _alias;
    var _aliasObt;

    for (var i = 0; i < geojson.getLayers().length; i++) {

        if (geojson.getLayers()[i].feature.properties.NAME) {

            _aliasObt = geojson.getLayers()[i].feature.properties.ALIAS;

            if (_aliasObt.toLowerCase() === _alias.toLowerCase()) {
                _name = geojson.getLayers()[i].feature.properties.NAME;

            }
        }


    }
    return _name;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DIJKSTRA - JS
// Fuente del Original : https://gist.github.com/MoeweX/ab98efee9435b47529e3a6cb50c5b605
///////////////////////////////////////////////////////////////////////////////////////////////////////////////


const lowestCostNode = (costs, processed) => {
    return Object.keys(costs).reduce((lowest, node) => {
        if (lowest === null || costs[node] < costs[lowest]) {
            if (!processed.includes(node)) {
                lowest = node;
            }
        }
        return lowest;
    }, null);
};

// function that returns the minimum cost and path to reach Finish
const dijkstra = (graph, startNodeName, endNodeName) => {
    var nodosObtenidos = [];
    // track the lowest cost to reach each node
    let costs = {};
    costs[endNodeName] = "Infinity";
    costs = Object.assign(costs, graph[startNodeName]);

    // track paths
    const parents = { endNodeName: null };
    for (let child in graph[startNodeName]) {
        parents[child] = startNodeName;
    }

    // track nodes that have already been processed
    const processed = [];

    let node = lowestCostNode(costs, processed);

    while (node) {
        let cost = costs[node];
        let children = graph[node];
        for (let n in children) {
            if (String(n) === String(startNodeName)) {
                //log("WE DON'T GO BACK TO START");
            } else {

                let newCost = cost + children[n];

                if (!costs[n] || costs[n] > newCost) {
                    costs[n] = newCost;
                    parents[n] = node;

                } else {
                    // log("A shorter path already exists");
                }
            }
        }
        processed.push(node);
        node = lowestCostNode(costs, processed);
    }

    let optimalPath = [endNodeName];
    let parent = parents[endNodeName];
    nodosObtenidos.push(nodosMapa[endNodeName].marker);

    while (parent) {
        optimalPath.push(parent);
        nodosObtenidos.push(nodosMapa[parent].marker);
        parent = parents[parent];
    }
    optimalPath.reverse();

    const results = {
        distance: costs[endNodeName],
        path: optimalPath,
        nodos: nodosObtenidos
    };

    return results;
};


/// Queda acá para tener los valores
function comoLlegar(origen, destino, comienzaEnPosicion) {
    var _marcadorDestino = posicionamiento[2];

    try {
        map.removeLayer(travel2);


        map.removeLayer(travel1);

    }
    catch{
        console.log("Atención: Aún no hay rutas trazadas");
        //toastOns("Atención:", "Aún no hay rutas trazadas")
    }
    try {
        map.removeLayer(_marcadorDestino);

    }
    catch{
        console.log("Atención: No se pudo eliminar el marcador destino");
    }

    if (origen !== destino) {


        try {

            var res = dijkstra(nodosMapa, origen, destino);
            //console.log(dijkstra(nodosMapa, origen, destino));
            //console.log("res.nodos");
            //cerrarPopup(destino);
            //console.log(res.nodos);
            if (res.nodos.length > 3) {
                viajar(res.nodos, comienzaEnPosicion, res.distance);


                _marcadorDestino.setLatLng(res.nodos[0]);
            } else {
                try {
                    cancelarRuta(false);
                }
                catch{
                    console.log("En como llegar TRY, no se pudo cancelar la ruta");
                }

                alertarOns("Atención:", "Llegaste a tu destino");
            }

            //$("#pInfo").text("Su destino a", redondeo(res.distance / escala) + " metros");
            // toastOns("Su destino a", redondeo(res.distance / escala) + " metros");

        }
        catch{
            toastOns("Atención:", "No se pudo calcular la ruta al destino");
            try {
                cancelarRuta(false);
            }
            catch{
                console.log("En como llegar CATCH, no se pudo cancelar la ruta");
            }

        }
    } else {
        alertarOns("Atención:", "El origen y el destino deben ser distintos");
        try {
            cerrarPopup(destino);
        }
        catch{
            console.log("En else de como llegar TRY, no se pudo cerrar el popup");
        }

    }

}


function nodoMasCercano(_lat, _lng) {
    var _grafo = nodosMapa;
    var _prefijo = "ss0";
    var _counter = 1;
    var _nodo = _grafo["ss01"];
    var _menorDistancia = Number.POSITIVE_INFINITY;
    var _nodoMasCercano = "";
    var bandera = false;

    while (!bandera) {

        var _temp = dist2puntos(_lng, _lat, _nodo.marker[1], _nodo.marker[0]);

        if (_temp < _menorDistancia) {

            _menorDistancia = _temp;
            _nodoMasCercano = _prefijo + _counter;
            // console.log("M dist:" + _menorDistancia + " Nodo: " + _nodoMasCercano);
        }
        /*
        else {
            console.log("NO - M dist:" + _temp + " Nodo: " + _prefijo + _counter);

        }
*/
        //L.polyline([[_lat,_lng],_nodo.marker]).addTo(map);

        _counter++;

        if (_counter > 9 && _prefijo == "ss0") {
            _prefijo = "ss";
        }
        _nodo = _grafo[_prefijo + _counter];

        if (_nodo.marker[0] < 0) {
            bandera = true;
        }

    }

    return _nodoMasCercano;



}



function cerrarPopup(_capa) {
    var _capa;
    //console.log(geojson);
    for (var i = 0; i < geojson.getLayers().length; i++) {

        if (geojson.getLayers()[i].feature.properties.ALIAS) {

            _name = geojson.getLayers()[i].feature.properties.ALIAS;

            if (_name === _capa) {
                console.log("encontrado en " + geojson.getLayers()[i].feature.properties.ALIAS);

                geojson.getLayers()[i].closePopup();
            }
        }


    }
}



function rutaMasCorta(_destino) {
    var _origen;
    var _destino;
    var _estaDentro = false;
    var _estaEnPasillo = false;
    var _capaObtenida;

    //Sólo para pruebas
    // posicionamiento[1].setLatLng( [866, 1352]) ;

    var _miPos = posicionamiento[1].getLatLng();
    var _aliasNodo;



    if (_miPos.lat > 0) {

        //Si la ubicación está dentro de un lugar determinado por el plano se tomara como nodo más cercano a la entrada de dicho lugar
        for (var i = 0; i < geojson.getLayers().length; i++) {
            _capaObtenida = geojson.getLayers()[i];

            //Preguntamos si las coordenadas están dentro de los límites de la capa
            if (_capaObtenida.getBounds().contains(_miPos)) {

                //con el if nos aseguramos que el lugar es un salón, lab, etc pues posee ALIAS o es libre (pasillo)
                if (_capaObtenida.feature.properties.ALIAS || _capaObtenida.feature.properties.TIPO === "libre") {

                    if (_capaObtenida.feature.properties.TIPO !== "libre") {
                        //_counterAdentro++;
                        //console.log(_capaObtenida.feature.properties.ALIAS);

                        _estaDentro = true;
                        //_origen = _capaObtenida.feature.properties.ALIAS;
                        _aliasNodo = _capaObtenida.feature.properties.ALIAS;

                        console.log("Dentro de: " + _capaObtenida.feature.properties.NAME);

                    } else {
                        _estaEnPasillo = true;
                    }




                }
            }


        }



        if (_estaDentro) {

            _origen = _aliasNodo;

        } else if (_estaEnPasillo) {
            _origen = nodoMasCercano(posicionamiento[1].getLatLng().lat, posicionamiento[1].getLatLng().lng);

        } else {
            _origen = "";
        }

        if (_origen != "") {


            if (destinoFijado != _destino) {
                destinoFijado = _destino;
                //bannerDestino.getContainer().innerHTML = "<ons-button onclick='cancelarRuta()'>Cancelar ruta actual</ons-button>";
                document.getElementById("divCancelarRuta").innerHTML = "<ons-button onclick='cancelarRuta(true)'>Cancelar Ruta actual</ons-button>";
                centrarEnRuta = true;

            }
            comoLlegar(_origen, _destino, true);


        } else {
            toastOns("Atención", "Punto de origen no válido");

        }

    } else {
        alertarOns("No se obtuvo la posición", "La ruta no puede ser generada");
    }




}

function cancelarRuta(_avisar) {
    var _avisar;
    if (_avisar) {
        alertarOns("Atención", "Ruta actual cancelada");
    }

    destinoFijado = "";
    origenFijado = false;


    try {

        map.removeLayer(travel2);
        map.removeLayer(travel1);


    }
    catch{
        console.log("En cancelar ruta, no se pudo quitar Travel2")
    }
    try {
        map.removeLayer(posicionamiento[2]);
        map.removeLayer(posicionamiento[3]);

    }
    catch{
        console.log("En cancelar ruta, no se pudo quitar el marcador de destino")
    }
    document.getElementById("divCancelarRuta").innerHTML = "";
    //document.getElementById("divCancelarRuta").hide();
}





