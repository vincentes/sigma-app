API.Configs.getAlerta  = function() {
    return {
        "async": true,
        "crossDomain": true,
        "url": "{0}/Alerta/Get".format(Sigma.baseUrl),
        "method": "GET",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer {0}".format(Sigma.getToken()),
          "Cache-Control": "no-cache",
        }
    };   
};


API.Configs.postAlerta  = function(args) {
    return {
        "async": true,
        "crossDomain": true,
        "url": "{0}/Alerta/Post".format(Sigma.baseUrl),
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer {0}".format(Sigma.getToken()),
            "Cache-Control": "no-cache",
        },
        "processData": false,
        "data": '{"Estado": "{0}"}'.format(args.estado)
    };
};

API.getAlerta = function() {
    return $.ajax(API.Configs.getAlerta());
}

API.postAlerta = function(args) {
    return $.ajax(API.Configs.postAlerta(args));
}

Pages.adscriptoAlertas = function() {
    Page.pushPage("adscripto-alertas.html");
}

Pages.alumnoAlertas = function() {
    Page.pushPage("alumno-alertas.html");
}

Pages.adscriptoAlertasCreate = function(modify) {
    Page.pushPage("adscripto-alertas-create.html", {
        data: modify
    });
}

document.addEventListener('show', function(e) {
    if(e.target.matches("#adscripto-alertas")) {
        AdscriptoAlertas.init();
    } else if(e.target.matches("#adscripto-alertas-create")) {
        AdscriptoAlertasCreate.init();
    }
});

document.addEventListener('init', function(e) {
    if(e.target.matches("#adscripto-alertas")) {
        AdscriptoAlertas.init();
    } else if(e.target.matches("#adscripto-alertas-create")) {
        AdscriptoAlertasCreate.init();
    }
});

document.addEventListener('init', function(e) {
    if(e.target.matches("#alumno-alertas")) {
        AlumnoAlertas.init();
    }
});

document.addEventListener('show', function(e) {
    if(e.target.matches("#alumno-alertas")) {
        AlumnoAlertas.init();
    } 
});


AdscriptoAlertasCreate = {
    alerta: {},
    init: function() {
        var data = document.getElementById("nav").topPage.data;
        this.alerta = data;
        $("#m-estado").val(data.estado);
    },
    submit: function() {
        var online = Network.isOnline();
        this.alerta.estado = $("#m-estado").val();
        if(online) {
            this.submitOnline(this.alerta);
        } else {
            this.submitOffline(this.alerta);
        }   
    },
    submitGeneric: function(alerta) {
        LocalData.setAlerta(alerta);
        Page.back();
    },
    submitOnline: function(alerta) {
        API.postAlerta(alerta).done(function() {
            AdscriptoAlertasCreate.submitGeneric(alerta);
        }).fail(function() {
            ons.notification.toast("No se puedo modificar la alerta.", {timeout:5000});
        });
    },
    submitOffline: function(alerta) {
        this.submitGeneric(alerta);
    }
};

AlumnoAlertas = {
    init: function() {
        $("#alumno-alertas-spinner").show();
        var online = Network.isOnline();
        if(online) {
            this.getOnline();
        } else {
            this.getOffline();
        }
    },
    display: function(alerta) {
        if(!Utils.empty(alerta)) {
            $("#alerta").css("visibility", "visible");
            switch(alerta.estado) {
                case "r":
                $("#estado-icon").attr("class", "fas fa-exclamation-triangle");
                $("#estado-icon").css("color", "red");
                $("#estado").text("Alerta roja");
                $("#alerta-info").text("Hay alerta roja en Montevideo. ¡No hay clases hoy!");
                break;
                case "a":
                $("#estado-icon").attr("class", "fas fa-exclamation-circle");
                $("#estado-icon").css("color", "yellow");
                $("#estado").text("Alerta amarilla");
                $("#alerta-info").text("Hay alerta amarilla en Montevideo. ¡Ten precaución!");
                break;
                case "n":
                $("#estado-icon").attr("class", "fas fa-exclamation");
                $("#estado-icon").css("color", "orange");
                $("#estado").text("Alerta naranja");
                $("#alerta-info").text("Hay alerta naranja en Montevideo. Por hoy es opcional la asistencia a clases.");
                break;
                case undefined:
                case "na":
                $("#estado-icon").attr("class", "fas fa-check");
                $("#estado-icon").css("color", "green");
                $("#estado").text("No hay alerta");
                $("#alerta-info").text("Actualmente no hay alerta.");
                break;
            }
            $("#adscripto-alertas-spinner").hide();
        } else {
            $("#alerta").css("visibility", "visible");
            $("#estado-icon").attr("class", "fas fa-question");
            $("#estado-icon").css("color", "black");
            $("#estado").text("Información desconocida");
            $("#alerta-info").text("No se pudo averiguar si hay alerta o no. Conectate a internet.");
            $("#adscripto-alertas-spinner").hide();
        }
    },
    getOnline: function() {
        API.getAlerta().done(function(data) {
            $("#alumno-alertas-spinner").hide();
            AlumnoAlertas.display(data);
        }).fail(function() {
            $("#alumno-alertas-spinner").hide();
            ons.notification.toast("No se pudo obtener la alerta.", {timeout: 5000});
        });
    },
    getOffline: function() {
        $("#alumno-alertas-spinner").hide();
        var alerta = LocalData.getAlerta();
        this.display(alerta);
    }
};

AdscriptoAlertas = {
    Templates: {

    },
    alerta: {},
    init: function() {
        var online = Network.isOnline();
        if(online) {
            this.displayOnline();
        } else {
            this.displayOffline();
        }
    },
    displayOffline: function() {
        this.display(LocalData.getAlerta());
    },
    displayOnline: function() {
        API.getAlerta().done(function(data) {
            AdscriptoAlertas.display(data);
        }).fail(function() {
            $("#adscripto-alertas-spinner").hide();
        });
    },
    display: function(alerta) {
        AdscriptoAlertas.alerta = alerta;
        LocalData.setAlerta(alerta);
        $("#alerta").css("visibility", "visible");
        switch(alerta.estado) {
            case "r":
            $("#estado-icon").attr("class", "fas fa-exclamation-triangle");
            $("#estado-icon").css("color", "red");
            $("#estado").text("Alerta roja");
            break;
            case "a":
            $("#estado-icon").attr("class", "fas fa-exclamation-circle");
            $("#estado-icon").css("color", "yellow");
            $("#estado").text("Alerta amarilla");
            break;
            case "n":
            $("#estado-icon").attr("class", "fas fa-exclamation");
            $("#estado-icon").css("color", "orange");
            $("#estado").text("Alerta naranja");
            break;
            case "na":
            $("#estado-icon").attr("class", "fas fa-check");
            $("#estado-icon").css("color", "green");
            $("#estado").text("No hay alerta");
            break;
        }
        $("#adscripto-alertas-spinner").hide();
    },
    create: function() {
        Pages.adscriptoAlertasCreate(this.alerta);
    }
}

/**
 * 
 *             switch(data.estado) {
                case "r":
                $("#estado").text("Hay alerta roja en Montevideo. ¡No hay clases hoy!");
                break;
                case "a":
                $("#estado").text("Hay alerta amarilla en Montevideo. ¡Ten precaucion!");
                break;
                case "n":
                $("#estado").text("Hay alerta naranja en Montevideo. Por hoy, opcional asistencia a clases.");
                break;
            }
 */