var plano = {
    "type": "FeatureCollection", "features": [
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [0, 0],
                    [1600, 0],
                    [1600, 2380],
                    //Empieza el recorte

                    [563, 2380],

                    [563, 1561],
                    [1279, 1561],
                    [1279, 135],
                    [1391, 135],
                    [1391, 1112],
                    [1435, 1112],
                    [1435, 1564],
                    [1391, 1564],
                    [1391, 2217],
                    [1279, 2217],
                    [1279, 1914],
                    [563, 1914],
                    [563, 1561],

                    [563, 2380],
                    //Termina el corte


                    [0, 2380],
                    [0, 0]

                ]]
            },
            "properties": {
                //"NAME": "perimetro exterior",
                "TIPO": "exterior"
            }
        },/*
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [563, 1561],
                    [1279, 1561],
                    [1279, 135],
                    [1391, 135],
                    [1391, 1112],
                    [1435, 1112],
                    [1435, 1564],
                    [1391, 1564],
                    [1391, 2217],
                    [1279, 2217],
                    [1279, 1914],
                    [563, 1914],
                    [563, 1561]


                ]]
            },
            "properties": {
                //"NAME": "Base Subsuelo",
                "TIPO": "base"
            }
        },*/
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1317, 139],
                    [1387, 139],
                    [1387, 299],
                    [1317, 299],
                    [1317, 139]
                ]]
            },
            "properties": {
                "NAME": "Salón 33",
                "TIPO": "salon",
                "ALIAS": "ssSalon33",
                "LABEL": ["S33","Salón 33"]
                
                
                

            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1317, 305],
                    [1387, 305],
                    [1387, 461],
                    [1317, 461],
                    [1317, 305]
                ]]
            },
            "properties": {
                "NAME": "Salón 32",
                "TIPO": "salon",
                "ALIAS": "ssSalon32",
                "LABEL": ["S32","Salón 32"]
                
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1317, 467],
                    [1387, 467],
                    [1387, 623],
                    [1317, 623],
                    [1317, 467]
                ]]
            },
            "properties": {
                "NAME": "Salón 31",
                "TIPO": "salon",
                "ALIAS": "ssSalon31",
                "LABEL": ["S31","Salón 31"]
                
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1317, 629],
                    [1387, 629],
                    [1387, 786],
                    [1317, 786],
                    [1317, 629]
                ]]
            },
            "properties": {
                "NAME": "Salón 30",
                "TIPO": "salon",
                "ALIAS": "ssSalon30",
                "LABEL": ["S30","Salón 30"]
                
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1317, 792],
                    [1387, 792],
                    [1387, 949],
                    [1317, 949],
                    [1317, 792]
                ]]
            },
            "properties": {
                "NAME": "Salón 29",
                "TIPO": "salon",
                "ALIAS": "ssSalon29",
                "LABEL": ["S29","Salón 29"]
                
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1317, 955],
                    [1387, 955],
                    [1387, 1112],
                    [1317, 1112],
                    [1317, 955]
                ]]
            },
            "properties": {
                "NAME": "Salón 28",
                "TIPO": "salon",
                "ALIAS": "ssSalon28",
                "LABEL": ["S28","Salón 28"]
                
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1317, 1118],
                    [1387, 1118],
                    [1387, 1275],
                    [1317, 1275],
                    [1317, 1118]
                ]]
            },
            "properties": {
                "NAME": "Salón Gremial",
                "TIPO": "salon",
                "ALIAS": "ssSalonGremial",
                "LABEL": ["SG","SGR","Salón<br>Gremial","Salón Gremial"]
               
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [567, 1565],
                    [1279, 1565],
                    [1279, 1638],
                    [1229, 1638],
                    [1229, 1730],
                    [1243, 1730],
                    [1243, 1910],
                    [567, 1910],
                    [567, 1565]
                ]]
            },
            "properties": {
                "NAME": "Gimnasio",
                "TIPO": "gimnasio",
                "ALIAS": "ssGimCan",
                "LABEL": ["Gimnasio"]
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1249, 1757],
                    [1277, 1757],
                    //Puerta Baño dam

                    [1277, 1823],
                    [1283, 1823],
                    [1283, 1805],
                    [1277, 1805],

                    [1277, 1827],
                    [1249, 1827],
                    [1249, 1757]
                ]]
            },
            "properties": {
                "NAME": "Baño de Damas",
                "TIPO": "banio",
                "ALIAS": "ssBanDam",
                "LABEL": ["D","BD","Bañ.<br>Dam.","Baño<br>Damas","Baño de Damas"]
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1249, 1833],
                    [1277, 1833],
                    //Puerta Baño cab

                    [1277, 1900],
                    [1283, 1900],
                    [1283, 1882],
                    [1277, 1882],

                    [1277, 1910],
                    [1249, 1910],
                    [1249, 1833]
                ]]
            },
            "properties": {
                "NAME": "Baño de Caballeros",
                "TIPO": "banio",
                "ALIAS": "ssBanCab",
                "LABEL": ["C","BC","Bañ.<br>Cab.","Baño<br>Caballeros","Baño de Caballeros"]
                
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1317, 1730],
                    [1387, 1730],
                    [1387, 1968],
                    [1317, 1968],
                    [1317, 1730]
                ]]
            },
            "properties": {
                "NAME": "Laboratorio de Física",
                "TIPO": "lab",
                "ALIAS": "ssLabFis",
                "LABEL": ["L<br>F","Lab.<br>Fís.","Laboratorio<br>Física","Laboratorio<br>de Física","Laboratorio de Física"]
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1317, 1974],
                    [1387, 1974],
                    [1387, 2213],
                    [1317, 2213],
                    [1317, 1974]
                ]]
            },
            "properties": {
                "NAME": "Laboratorio de Física 2",
                "TIPO": "lab",
                "ALIAS": "ssLabFis2",
                "LABEL": ["L<br>F2","Lab.<br>Fís.2","Laboratorio<br>Física 2","Laboratorio<br>de Física 2","Laboratorio de Física 2"]
                
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1283, 2004],
                    //Puerta ads
                    [1291, 2004],
                    [1291, 1998],
                    [1309, 1998],
                    [1309, 2004],


                    [1311, 2004],
                    [1311, 2049],
                    [1283, 2049],
                    [1283, 2004]
                ]]
            },
            "properties": {
                "NAME": "Adscripción",
                "TIPO": "admin",
                "ALIAS": "ssAds",
                "LABEL": ["A","Ads","Adscripción"]
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1393, 1281],
                    [1431, 1281],
                    [1431, 1396],
                    [1393, 1396],
                    //Puerta Cantina
                    [1393, 1390],
                    [1386, 1390],
                    [1386, 1365],
                    [1393, 1365],
                    [1393, 1281]
                ]]
            },
            "properties": {
                "NAME": "Cantina",
                "TIPO": "cantina",
                "ALIAS": "ssCantina",
                "LABEL": ["C<br>a","Cant.","Cantina"]
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1317, 1281],
                    [1387, 1281],
                    [1387, 1402],
                    [1317, 1402],
                    [1317, 1281]
                ]]
            },
            "properties": {
                "NAME": "Comedor",
                "TIPO": "comedor",
                "ALIAS": "ssComedor",
                "LABEL": ["Co.","Com.","Comedor","Comedor principal"]
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1393, 1402],
                    [1431, 1402],
                    [1431, 1560],
                    [1393, 1560],
                    [1393, 1402]
                ]]
            },
            "properties": {
                "NAME": "Comedor 2",
                "TIPO": "comedor",
                "ALIAS": "ssComedor2",
                "LABEL": ["C<br>2","Com<br>2","Comedor<br>2","Comedor<br>secundario"]
               
            }
        },
        //////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////               Pasillos, etc             ///////////////////////////      
        //////////////////////////////////////////////////////////////////////////////////////////

        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    //Pasillo largo Salones
                    [1283, 139],
                    [1311, 139],
                    //Puerta 33
                    [1311, 272],
                    [1317, 272],
                    [1317, 297],
                    [1311, 297],
                    //Puerta 32
                    [1311, 434],
                    [1317, 434],
                    [1317, 459],
                    [1311, 459],
                    //Puerta 31
                    [1311, 597],
                    [1317, 597],
                    [1317, 621],
                    [1311, 621],
                    //Puerta 30
                    [1311, 760],
                    [1317, 760],
                    [1317, 785],
                    [1311, 785],
                    //Puerta 29
                    [1311, 922],
                    [1317, 922],
                    [1317, 949],
                    [1311, 949],
                    //Puerta 28
                    [1311, 1071],
                    [1317, 1071],
                    [1317, 1109],
                    [1311, 1109],
                    //Puerta Gremial
                    [1311, 1234],
                    [1317, 1234],
                    [1317, 1272],
                    [1311, 1272],
                    //Fino al lado del comedor
                    [1311, 1281],
                    [1317, 1281],
                    //PreEscalera
                    [1317, 1402],
                    [1393, 1402],
                    [1393, 1440],
                    [1317, 1440],
                    [1317, 1428],


                    [1311, 1428],
                    //Sala de espera
                    [1311, 1564],
                    [1387, 1564],
                    [1387, 1724],
                    [1283, 1724],
                    [1283, 139]
                ]]
            },
            "properties": {
                //"NAME": "Espacio Libre",
                "TIPO": "libre"
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    //Pasillo Baños
                    [1283, 1730],
                    //Puerta sala de espera
                    [1291, 1730],
                    [1291, 1723],
                    [1309, 1723],
                    [1309, 1730],

                    [1311, 1730],
                    [1311, 1938],
                    //Puerta sala labs
                    [1291, 1938],
                    [1291, 1944],
                    [1309, 1944],
                    [1309, 1938],
                    [1283, 1938],


                    [1283, 1730],
                ]]
            },
            "properties": {
                //"NAME": "Espacio Libre",
                "TIPO": "libre"
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    //Pasillo Puerta Labos
                    [1283, 1944],
                    [1317, 1944],
                    [1317, 1968],
                    [1311, 1968],
                    [1311, 1974],
                    [1317, 1974],
                    [1317, 1998],
                    [1283, 1998],
                    [1283, 1944]
                ]]
            },
            "properties": {
                //"NAME": "Espacio Libre",
                "TIPO": "libre"
            }
        },
        {

            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1317, 1526],
                    [1317, 1558],
                    [1387, 1558],
                    [1387, 1526],
                    [1317, 1526]
                ]]
            },
            "properties": {
                "NAME": "Escalera - Descanso",
                "TIPO": "libre",
                "ALIAS": "ssEscPBDescanso"
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1317, 1440],
                    [1349, 1440],
                    [1349, 1520],
                    [1317, 1520],
                    [1317, 1440]
                ]]
            },
            "properties": {
                "NAME": "Escalera al depósito",
                "TIPO": "libre",
                "ALIAS": "ssEscDep"
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1317, 1440],
                    [1349, 1440],
                    [1349, 1446],
                    [1317, 1446],
                    [1317, 1440],
                    [1317, 1452],
                    [1349, 1452],
                    [1349, 1458],
                    [1317, 1458],
                    [1317, 1452],
                    [1317, 1464],
                    [1349, 1464],
                    [1349, 1470],
                    [1317, 1470],
                    [1317, 1464],
                    [1317, 1476],
                    [1349, 1476],
                    [1349, 1482],
                    [1317, 1482],
                    [1317, 1476],
                    [1317, 1488],
                    [1349, 1488],
                    [1349, 1494],
                    [1317, 1494],
                    [1317, 1488],
                    [1317, 1500],
                    [1349, 1500],
                    [1349, 1506],
                    [1317, 1506],
                    [1317, 1500],
                    [1317, 1512],
                    [1349, 1512],
                    [1349, 1518],
                    [1317, 1518],
                    [1317, 1512]
                ]]
            },
            "properties": {
                "NAME": "Escalera al depósito",
                "TIPO": "escalon",
                "ALIAS": "ssEscDep"
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1355, 1440],
                    [1387, 1440],
                    [1387, 1526],
                    [1355, 1526],
                    [1355, 1440]
                ]]
            },
            "properties": {
                "NAME": "Escalera a Planta Baja",
                "TIPO": "libre",
                "ALIAS": "ssEscPB"
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1355, 1440],
                    [1387, 1440],
                    [1387, 1446],
                    [1355, 1446],
                    [1355, 1440],
                    [1355, 1452],
                    [1387, 1452],
                    [1387, 1458],
                    [1355, 1458],
                    [1355, 1452],
                    [1355, 1464],
                    [1387, 1464],
                    [1387, 1470],
                    [1355, 1470],
                    [1355, 1464],
                    [1355, 1476],
                    [1387, 1476],
                    [1387, 1482],
                    [1355, 1482],
                    [1355, 1476],
                    [1355, 1488],
                    [1387, 1488],
                    [1387, 1494],
                    [1355, 1494],
                    [1355, 1488],
                    [1355, 1500],
                    [1387, 1500],
                    [1387, 1506],
                    [1355, 1506],
                    [1355, 1500],
                    [1355, 1512],
                    [1387, 1512],
                    [1387, 1518],
                    [1355, 1518],
                    [1355, 1512]
                ]]
            },
            "properties": {
                "NAME": "Escalera a Planta Baja",
                "TIPO": "escalon",
                "ALIAS": "ssEscPB"
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1235, 1644],
                    [1277, 1644],
                    [1277, 1672],
                    [1235, 1672],
                    [1235, 1644]
                ]]
            },
            "properties": {
                "NAME": "Escalera al gimnasio (Tribuna)",
                "TIPO": "libre",
                "ALIAS": "ssGimTri"
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1235, 1644],
                    [1235, 1672],
                    [1241, 1672],
                    [1241, 1644],
                    [1235, 1644],
                    [1247, 1644],
                    [1247, 1672],
                    [1253, 1672],
                    [1253, 1644],
                    [1247, 1644],
                    [1259, 1644],
                    [1259, 1672],
                    [1265, 1672],
                    [1265, 1644],
                    [1259, 1644],
                    [1271, 1644],
                    [1271, 1672],
                    [1277, 1672],
                    [1277, 1644],
                    [1271, 1644]
                ]]
            },
            "properties": {
                "NAME": "Escalera al gimnasio (Tribuna)",
                "TIPO": "escalon",
                "ALIAS": "ssGimTri"
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1235, 1678],
                    [1277, 1678],
                    [1277, 1724],
                    [1235, 1724],
                    [1235, 1678]
                ]]
            },
            "properties": {
                "NAME": "Escalera al gimnasio (Cancha)",
                "TIPO": "libre",
                "ALIAS": "ssGimCan"
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [1235, 1678],
                    [1235, 1724],
                    [1241, 1724],
                    [1241, 1678],
                    [1235, 1678],
                    [1247, 1678],
                    [1247, 1724],
                    [1253, 1724],
                    [1253, 1678],
                    [1247, 1678],
                    [1259, 1678],
                    [1259, 1724],
                    [1265, 1724],
                    [1265, 1678],
                    [1259, 1678],
                    [1271, 1678],
                    [1271, 1724],
                    [1277, 1724],
                    [1277, 1678],
                    [1271, 1678],
                ]]
            },
            "properties": {
                "NAME": "Escalera al gimnasio (Cancha)",
                "TIPO": "escalon",
                "ALIAS": "ssGimCan"
            }
        }





    ]
}

var nodosMapa = {
    ssAds: { marker: [2001, 1301], ss01: 16 },
    ss01: { marker: [1986, 1301], ss02: 30, ssAds: 16, ssLabFis2: 12 },
    ssLabFis2: { marker: [1986, 1313], ss01: 12, ss63: 17 },
    ss63: { marker: [1986, 1330], ss64: 17, ss67: 17, ssLabFis2: 17 },
    ss64: { marker: [1986, 1347], ss63: 17, ss65: 17 },
    ss65: { marker: [1986, 1364], ss64: 17, ss66: 17 },
    ss66: { marker: [1986, 1381], ss65: 17 },
    ss67: { marker: [2003, 1330], ss63: 17, ss68: 17 },
    ss68: { marker: [2020, 1330], ss67: 17, ss69: 17 },
    ss69: { marker: [2037, 1330], ss68: 17, ss70: 17 },
    ss70: { marker: [2054, 1330], ss69: 17 },

    ss02: { marker: [1956, 1301], ss01: 30, ss03: 65, ssLabFis: 12 },
    ssLabFis: { marker: [1956, 1313], ss02: 12 },
    ss03: { marker: [1922, 1301], ss02: 34, ss04: 31 },
    ss04: { marker: [1891, 1301], ss03: 31, ss05: 38, ssBanCab: 20 },
    ss05: { marker: [1853, 1301], ss04: 38, ss06: 39 },

    ssBanCab: { marker: [1891, 1281], ss04: 20 },
    ss06: { marker: [1814, 1301], ss05: 39, ss07: 34, ssBanDam: 20 },
    ssBanDam: { marker: [1814, 1281], ss06: 20 },
    ss07: { marker: [1780, 1301], ss06: 34, ss08: 34 },
    ss08: { marker: [1746, 1301], ss07: 34, ss09: 24 },
    ss09: { marker: [1722, 1301], ss08: 24, ss10: 24 },
    ss10: { marker: [1698, 1301], ss09: 24, ss11: 21, ssGimCan: 20 },
    ssGimCan: { marker: [1698, 1281], ss10: 20 },
    ss11: { marker: [1677, 1301], ss10: 21, ss12: 21 },
    ss12: { marker: [1657, 1301], ss11: 21, ss13: 34, ssGimTri: 20 },
    ssGimTri: { marker: [1657, 1281], ss12: 20 },
    ss13: { marker: [1623, 1301], ss12: 34, ss14: 34 },
    ss14: { marker: [1589, 1301], ss13: 34, ss15: 34 },
    ss15: { marker: [1555, 1301], ss14: 34, ss16: 34 },
    ss16: { marker: [1521, 1301], ss15: 34, ss17: 34 },
    ss17: { marker: [1487, 1301], ss16: 34, ss18: 34 },
    ss18: { marker: [1453, 1301], ss17: 34, ss19: 39 },
    ss19: { marker: [1415, 1301], ss18: 39, ss20: 33, ss24: 33 },
    ss20: { marker: [1415, 1333], ss19: 33, ss21: 19, ssEscDep: 25 },
    ssEscDep: { marker: [1440, 1333], ss20: 25 },
    ss21: { marker: [1415, 1352], ss20: 19, ss22: 19, ss23: 30 },
    ss22: { marker: [1415, 1371], ss21: 19, ssComedor2: 19, ssEscPB: 25 },
    ssEscPB: { marker: [1440, 1371], ss22: 25, ssEscPBDescanso: 86 },
    ssEscPBDescanso: { marker: [1542, 1371], ssEscPB: 86 },

    ssComedor2: { marker: [1415, 1390], ss22: 19 },
    ssComedor: { marker: [1355, 1352], ss23: 30, ss25: 52 },
    ssCantina: { marker: [1385, 1390], ss23: 38 },
    ss23: { marker: [1385, 1352], ss24: 52, ss21: 30, ssComedor: 30, ssCantina: 38 },
    ss24: { marker: [1385, 1300], ss23: 52, ss19: 30, ss25: 30 },
    ss25: { marker: [1355, 1300], ssComedor: 52, ss24: 30, ss26: 34 },
    ss26: { marker: [1321, 1300], ss25: 34, ss27: 34 },
    ss27: { marker: [1287, 1300], ss26: 34, ss28: 31 },
    ss28: { marker: [1256, 1300], ss27: 31, ss29: 34, ssSalonGremial: 12 },
    ssSalonGremial: { marker: [1256, 1312], ss28: 12 },
    ss29: { marker: [1222, 1300], ss28: 34, ss30: 34 },
    ss30: { marker: [1188, 1300], ss29: 34, ss31: 34 },
    ss31: { marker: [1154, 1300], ss30: 34, ss32: 34 },
    ss32: { marker: [1120, 1300], ss31: 34, ss33: 27 },
    ss33: { marker: [1093, 1300], ss32: 27, ss34: 34, ssSalon28: 12 },
    ssSalon28: { marker: [1093, 1312], ss33: 12 },
    ss34: { marker: [1059, 1300], ss33: 34, ss35: 34 },
    ss35: { marker: [1025, 1300], ss34: 34, ss36: 34 },
    ss36: { marker: [991, 1300], ss35: 34, ss37: 34 },
    ss37: { marker: [956, 1300], ss36: 34, ss38: 17 },
    ss38: { marker: [939, 1300], ss37: 17, ss39: 34, ssSalon29: 12 },
    ssSalon29: { marker: [939, 1312], ss38: 12 },
    ss39: { marker: [905, 1300], ss38: 34, ss40: 34 },
    ss40: { marker: [871, 1300], ss39: 34, ss41: 34 },
    ss41: { marker: [837, 1300], ss40: 34, ss42: 34 },
    ss42: { marker: [803, 1300], ss41: 34, ss43: 27 },
    ss43: { marker: [776, 1300], ss42: 30, ss44: 34, ssSalon30: 12 },
    ssSalon30: { marker: [776, 1312], ss43: 12 },
    ss44: { marker: [739, 1300], ss43: 34, ss45: 34 },
    ss45: { marker: [705, 1300], ss44: 34, ss46: 34 },
    ss46: { marker: [671, 1300], ss45: 34, ss47: 34 },
    ss47: { marker: [637, 1300], ss46: 34, ss48: 28 },
    ss48: { marker: [610, 1300], ss47: 28, ss49: 34, ssSalon31: 12 },
    ssSalon31: { marker: [610, 1312], ss48: 12 },
    ss49: { marker: [576, 1300], ss48: 34, ss50: 34 },
    ss50: { marker: [552, 1300], ss49: 34, ss51: 34 },
    ss51: { marker: [518, 1300], ss50: 34, ss52: 34 },
    ss52: { marker: [484, 1300], ss51: 34, ss53: 28 },
    ss53: { marker: [446, 1300], ss52: 28, ss54: 34, ssSalon32: 12 },
    ssSalon32: { marker: [446, 1312], ss53: 12 },
    ss54: { marker: [412, 1300], ss53: 34, ss55: 34 },
    ss55: { marker: [378, 1300], ss54: 34, ss56: 34 },
    ss56: { marker: [344, 1300], ss55: 34, ss57: 34 },
    ss57: { marker: [310, 1300], ss56: 34, ss58: 26 },
    ss58: { marker: [285, 1300], ss57: 26, ss59: 34, ssSalon33: 12 },
    ssSalon33: { marker: [285, 1312], ss58: 12 },
    ss59: { marker: [251, 1300], ss58: 34, ss60: 34 },
    ss60: { marker: [217, 1300], ss59: 34, ss61: 34 },
    ss61: { marker: [183, 1300], ss60: 34, ss62: 34 },
    ss62: { marker: [149, 1300], ss61: 34 },




    ss71: { marker: [-1] }
};