API.Configs.getAllEncuestas = function() {
    return {
        "async": true,
        "crossDomain": true,
        "url": "{0}/EncuestaGlobal/GetAll".format(Sigma.baseUrl),
        "method": "GET",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer {0}".format(Sigma.getToken()),
          "Cache-Control": "no-cache",
        }
    };
},

API.getAllEncuestas = function() {
    return $.ajax(API.Configs.getAllEncuestas());
}

API.Configs.respondEncuestaMO = function(args) {
    return {
        "async": true,
        "crossDomain": true,
        "url": "{0}/EncuestaGlobal/RespondMOPregunta".format(Sigma.baseUrl),
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer {0}".format(Sigma.getToken()),
            "Cache-Control": "no-cache",
        },
        "data": '{ "id": {0}, "opciones": {1} }'.format(args.id, JSON.stringify(args.opciones))
    };
};

API.Configs.respondEncuestaUO = function(args) {
    return {
        "async": true,
        "crossDomain": true,
        "url": "{0}/EncuestaGlobal/RespondUOPregunta".format(Sigma.baseUrl),
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer {0}".format(Sigma.getToken()),
            "Cache-Control": "no-cache",
        },
        "data": '{ "id": {0}, "opcion": {1} }'.format(args.id, JSON.stringify(args.opcion))
    };
};


API.Configs.respondEncuestaEL = function(args) {
    return {
        "async": true,
        "crossDomain": true,
        "url": "{0}/EncuestaGlobal/RespondELPregunta".format(Sigma.baseUrl),
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer {0}".format(Sigma.getToken()),
            "Cache-Control": "no-cache",
        },
        "data": '{ "id": {0}, "texto": {1} }'.format(args.id, JSON.stringify(args.texto))
    };
};

API.respondEncuestaMO = function(args) {
    return $.ajax(API.Configs.respondEncuestaMO(args));
};

API.respondEncuestaUO = function(args) {
    return $.ajax(API.Configs.respondEncuestaUO(args));
};

API.respondEncuestaEL = function(args) {
    return $.ajax(API.Configs.respondEncuestaEL(args));
};

document.addEventListener('init', function(event) {
    if(event.target.matches('#alumno-encuesta-respond')) {
        AlumnoEncuestaRespond.init();
    } else if(event.target.matches('#alumno-encuestas')) {
        AlumnoEncuestas.init();
    }
});


document.addEventListener('show', function(event) {
    if(event.target.matches('#alumno-encuesta-respond')) {
        AlumnoEncuestaRespond.init();
    } else if(event.target.matches('#alumno-encuestas')) {
        AlumnoEncuestas.init();
    }
});


Pages.alumnoEncuestas = function() {
    Page.pushPage("alumno-encuestas.html");
};

Pages.alumnoRespondEncuesta = function(encuesta) {
    Page.pushPage("alumno-encuesta-respond.html", {
        data: encuesta,
        callback: function() {
            AlumnoEncuestaRespond.init();
        }
    });
}

AlumnoEncuestaRespond = {
    Templates: {
        MOOpcionItem: function(args) {
            var id = args.id;
            return {
                html: '<ons-list-item tappable> <label class="left"> <ons-radio name="color" input-id="respuesta-mo-{0}" checked></ons-radio> </label> <label for="respuesta-mo-{0}" class="center"> {1} </label> </ons-list-item>'.format(id, args.texto)
            };
        },
    },
    preguntaCounter: 0,
    respuestas: [],
    encuesta: {},
    toSend: {
        id: null,
        respuestas: []
    },
    init: function() {
        this.respuestas = [];
        this.encuesta = document.getElementById("nav").topPage.data;
        this.preguntaCounter = 0;
        $("#encuesta-titulo").text(this.encuesta.titulo);
        $("#alumno-encuesta-respond .page__background").css("background","#75ABBC");
        $("#el").hide();
        $("#uo").hide();
        $("#mo").hide();
        this.showPregunta();
        $("#box").show();
    },
    nextPregunta: function() {
        var pregunta = this.encuesta.preguntas[this.preguntaCounter];
        this.toSendPregunta = {
            id: pregunta.id
        };

        if(pregunta.tipo == 0) {
            respuesta = $("#adscripto-encuestas-el").val();
            if(Utils.empty(respuesta)) {
                ons.notification.confirm("¡No respondiste la pregunta!", {
                    title: "Alerta",
                    buttonLabels: ["Entendido"]
                });
                return;
            }

            this.toSendPregunta.texto = respuesta;
        } else {
            if(pregunta.tipo == 2) {
                var chosenId = $('input[name=uo-option]:checked').attr('id');
                var chosen = chosenId.split('-')[2];
                if(!Utils.empty(chosen)) {
                    var opciones = [];
                    opciones.push(parseInt(chosen));
                    this.toSendPregunta.opcion = parseInt(chosen);
                } else {
                    ons.notification.confirm("¡No has elegido ninguna respuesta!", {
                        title: "Alerta",
                        buttonLabels: ["Entendido"]
                    });
                    return;
                }
            } else {
                AlumnoEncuestaRespond.toSendPregunta.opciones = [];
                $('input[id^="mo-option"]:checked').each(function(i, obj) {
                    var id = $(obj).attr('id');
                    AlumnoEncuestaRespond.toSendPregunta.opciones.push(id.split('-')[2]);
                });
                if(Utils.empty(this.toSendPregunta.opciones)) {
                    ons.notification.confirm("¡No has elegido ninguna respuesta!", {
                        title: "Alerta",
                        buttonLabels: ["Entendido"]
                    });
                    return;
                }
            }
        }

        if(pregunta.tipo == 0) {
            API.respondEncuestaEL(this.toSendPregunta);
        } else if(pregunta.tipo == 2) {
            API.respondEncuestaUO(this.toSendPregunta);
        } else {
            API.respondEncuestaMO(this.toSendPregunta);
        }

        if(this.preguntaCounter === this.encuesta.preguntas.length - 1) {
            ons.notification.confirm("¡Gracias por responder la encuesta!", {
                title: "Gracias",
                buttonLabels: ["No hay problema"],
                callback: function() {
                    Page.back();                    
                }
            });
        } else {
            this.preguntaCounter++;
            this.showPregunta();
        }

    },
    showPregunta: function() {
        if(this.preguntaCounter !== 0) {
            $("#adscripto-encuestas-create-titulo").val("");
        }

        var pregunta = this.encuesta.preguntas[this.preguntaCounter];
        switch(pregunta.tipo) {
            case 0:
            $("#el").show();
            break;
            case 3:
            $("#mo").show();
            $("#mo-respuestas").empty();
            for(var i = 0; i < pregunta.opciones.length; i++) {
                $("#mo-respuestas").append('<ons-list-item tappable><label class="center">{1}</label><label class="left"><ons-checkbox name="mo-option" input-id="mo-option-{0}" class="mo-option"></ons-checkbox></label></ons-list-item>'.format(pregunta.opciones[i].id, pregunta.opciones[i].texto));
            }
            break;
            case 2:
            $("#uo").show();
            $("#mo-respuestas").empty();
            $("#uo-respuestas").empty();
            for(var i = 0; i < pregunta.opciones.length; i++) {
                $("#uo-respuestas").append('<ons-list-item tappable><label class="center">{1}</label><label class="left"><ons-radio name="uo-option" input-id="uo-option-{0}" class="uo-option"></ons-radio></label></ons-list-item>'.format(pregunta.opciones[i].id, pregunta.opciones[i].texto));
            }
            break;
        }

        $("#encuesta-p-texto").text(this.encuesta.preguntas[this.preguntaCounter].texto);
    }
};

AlumnoEncuestas = {
    Templates: {
        EncuestaCard: function(args) {
            return {
                html: '<ons-card> <div class="title"> <div>{0}</div></div> <div class="content"> <p>{1}</p> <ons-button modifier="quiet" onclick="AlumnoEncuestas.responder({2})">Responder encuesta</ons-button></div> </ons-card>'.format(args.titulo, args.descripcion, args.id)
            };
        },
        NoneEncuestaCard: function() {
            return {
                html: '<ons-card> <div class="title"> :) </div> <div class="content"> <p>No hay encuestas para responder.</p> </div> </ons-card>'
            };
        }
    },
    init: function() {
        var list = $("#encuestas-list");
        list.empty();
        var spinner = $("#alumno-encuestas-spinner");
        spinner.show();
        if(Network.isOnline()) {
            API.getAllEncuestas().done(function(response) {
                if(!Utils.empty(response)) {
                    LocalData.setEncuestas(response);
                }
                AlumnoEncuestas.encuestas = response;
                AlumnoEncuestas.display();
            }).fail(function() {
                ons.notification.alert("No se pudieron obtener las encuestas.", { timeout: 5000 });
            }).always(function() {
                spinner.hide();
            });
        } else {
            this.encuestas = LocalData.getEncuestas();
            this.display();
            spinner.hide();
        }
    },
    display: function() {
        var encuestas = this.encuestas;
        var list = $("#encuestas-list");
        list.empty();
        if(Utils.empty(encuestas)) {
            var element = AlumnoEncuestas.Templates.NoneEncuestaCard();
            list.prepend(element.html);
        } else {
            this.encuestas.forEach(function(encuesta) {
                var list = $("#encuestas-list");
                var element = AlumnoEncuestas.Templates.EncuestaCard(encuesta);
                list.prepend(element.html);
            });
        }
    },
    responder: function(id) {
        if(id == null) {
            return;
        }

        var encuesta;
        for(var i=0; i < this.encuestas.length; i++) {
            var e = this.encuestas[i];
            if(e.id === id) {
                Pages.alumnoRespondEncuesta(e);
                break;
            }
        }
    }
};