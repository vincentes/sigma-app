Pages.adscriptoCS = function() {
    Page.pushPage("adscripto-cs.html");
};

Pages.adscriptoCSCreate = function() {
    Page.pushPage("adscripto-cs-create.html");
};

document.addEventListener("init", function(e) {
    if(e.target.matches("#adscripto-cs")) {
        AdscriptoCS.init();
    }
});

document.addEventListener("show", function(e) {
    if(e.target.matches("#adscripto-cs")) {
        AdscriptoCS.init();
    } else if(e.target.matches("#adscripto-cs-create")) {
        AdscriptoCSCreate.init();
    }
});

API.Configs.getCSCreated  = function() {
    return {
        "async": true,
        "crossDomain": true,
        "url": "{0}/CambioDeSalon/GetCreated".format(Sigma.baseUrl),
        "method": "GET",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer {0}".format(Sigma.getToken()),
          "Cache-Control": "no-cache",
        }
    };   
};

API.Configs.getHMInfo  = function() {
    return {
        "async": true,
        "crossDomain": true,
        "url": "{0}/CambioDeSalon/GetInfo".format(Sigma.baseUrl),
        "method": "GET",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer {0}".format(Sigma.getToken()),
          "Cache-Control": "no-cache",
        }
    };   
};

API.getCSCreated = function() {
    return $.ajax(API.Configs.getCSCreated());
};

API.getHMInfo = function() {
    return $.ajax(API.Configs.getHMInfo());
};

var Horarios = {
    Matutino: {
        1: "7:30",
        2: "8:05",
        3: "8:45",
        4: "9:20",
        5: "10:05",
        6: "10:40",
        7: "11:20"
    },
    Intermedio: {
        1: "12:00",
        2: "12:35",
        3: "13:20",
        4: "13:55",
        5: "14:40",
        6: "15:15"
    },
    Vespertino: {
        1: "16:00",
        2: "16:35",
        3: "17:20",
        4: "17:55",
        5: "18:40",
        6: "19:15"
    },
    Nocturno: {
        1: "19:55",
        2: "20:25",
        3: "21:00",
        4: "21:30",
        5: "22:05",
        6: "23:35",
        7: "23:05"
    }
};

AdscriptoCS = {
    csList: [],
    init: function() {
        this.csList = [];

        API.getCSCreated().done(function(data) {
            if(Utils.empty(data)) {
                
            }
            AdscriptoCS.csList = data;
            AdscriptoCS.display();
        });
    },
    display: function() {
        $("#cs-list").empty();
        for(var i =0;i <this.csList.length;i++) 
        {
            var cs = this.csList[i];
            var dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            var fecha = new Date(cs.fecha);
            var numHoraInicial = cs.horaMateriaInicial.hora;
            var turno = cs.horaMateriaInicial.turno;
            var horaRealInicial;
            var horaRealFinal;
            switch(turno) {
            case "Matutino":
            horaRealInicial = Horarios.Matutino[numHoraInicial];
            horaRealFinal = Horarios.Matutino[numHoraFinal];
            break;
            case "Intermedio":
            horaRealInicial = Horarios.Intermedio[numHoraInicial];
            horaRealFinal = Horarios.Matutino[numHoraFinal];
            break;
            case "Vespertino":
            horaRealInicial = Horarios.Vespertino[numHoraInicial];
            horaRealFinal = Horarios.Matutino[numHoraFinal];
            break;
            case "Nocturno":
            horaRealInicial = Horarios.Nocturno[numHoraInicial];
            horaRealFinal = Horarios.Matutino[numHoraFinal];
            break;
            }
            var dia = dias[fecha.getDay()];
            var inicial = cs.salonInicial.nombre;
            var destino = cs.salonDestino.nombre;

            $("#cs-list").prepend("<ons-card> <h3>{0}</h3> <p>El {0}, en vez de tener clase en el {1}, a las {2} tendrás clase en el {3} hasta las {4}.</p> </ons-card>".format(dia, inicial, horaRealInicial, destino, horaRealFinal));
        }
    }
};

AlumnoCS = {
    csList: [],
    init: function() {
        this.csList = [];

        API.getCS().done(function(data) {
            AdscriptoCS.csList = data;
            AdscriptoCS.display();
        });
    },
    display: function() {
        $("#cs-list").empty();
        for(var i =0;i <this.csList.length;i++) 
        {
            var cs = this.csList[i];
            var dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            var fecha = new Date(cs.fecha);
            var numHoraInicial = cs.horaMateriaInicial.hora;
            var turno = cs.horaMateriaInicial.turno;
            var horaRealInicial;
            var horaRealFinal;
            switch(turno) {
            case "Matutino":
            horaRealInicial = Horarios.Matutino[numHoraInicial];
            horaRealFinal = Horarios.Matutino[numHoraFinal];
            break;
            case "Intermedio":
            horaRealInicial = Horarios.Intermedio[numHoraInicial];
            horaRealFinal = Horarios.Matutino[numHoraFinal];
            break;
            case "Vespertino":
            horaRealInicial = Horarios.Vespertino[numHoraInicial];
            horaRealFinal = Horarios.Matutino[numHoraFinal];
            break;
            case "Nocturno":
            horaRealInicial = Horarios.Nocturno[numHoraInicial];
            horaRealFinal = Horarios.Matutino[numHoraFinal];
            break;
            }
            var dia = dias[fecha.getDay()];
            var inicial = cs.salonInicial.nombre;
            var destino = cs.salonDestino.nombre;

            $("#cs-list").prepend("<ons-card> <h3>{0}</h3> <p>El {0}, en vez de tener clase en el {1}, a las {2} tendrás clase en el {3} hasta las {4}.</p> </ons-card>".format(dia, inicial, horaRealInicial, destino, horaRealFinal));
        }
    }
};

AdscriptoCSCreate = {
    init: function() {
        API.getHMInfo().done(function(data) {
            AdscriptoCSCreate.hms = data;
        });

        $('.selected-input').on('change', function(e) {
            AdscriptoCSCreate.update();
        });
    },
    update: function() {
        var salon = $("#salon").val();
        var dia = $("#dia").val();
        var turno = $("#turno").val();
        var hora = $("#hora").val();
        
        if(Utils.empty(salon) || Utils.empty(dia) || Utils.empty(turno) || Utils.empty(hora)) {
            return;
        }

        for(var i =0; i < this.hms.length; i++) {
            var hm = this.hms[i];
            if(hm.salon.nombre == salon && hm.dia == dia && hm.grupo.turno == turno && hm.hora == hora) {
                
                $("#reservado").text("El salón está reservado para el grupo " + hm.grupo.grado + "º" + + hm.grupo.numero + ".");
                return;
            }

            $("#c-reservado").show();
            $("#c-reservado").css("display", "block");
            $("#reservado").text("Ningún grupo.");            
        }
    },
    submit: function() {
        var dialog = document.getElementById('my-dialog');

        if (dialog) {
          dialog.show();
        } else {
          ons.createElement('my-dialog.html', { append: true })
            .then(function(dialog) {
              dialog.show();
            });
        }
    }
};