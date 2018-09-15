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

API.Configs.respondEncuesta = function(args) {
    return {
        "async": true,
        "crossDomain": true,
        "url": "{0}/EncuestaGlobal/Respond".format(Sigma.baseUrl),
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer {0}".format(Sigma.getToken()),
            "Cache-Control": "no-cache",
        },
        "data": '{ "EncuestaId": {0}, "List": {1} }'.format(args.encuestaId, JSON.stringify(args.lista))
    };
};

API.respondEncuesta = function(args) {
    return $.ajax(API.Configs.respondEncuesta(args));
}

Pages.alumnoEncuestas = function() {
    Page.pushPage("alumno-encuestas.html", {
        callback: function() {
            AlumnoEncuestas.init();
        }
    });
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
        Respond: function(args) {
            return {
            };
        },
    },
    preguntaCounter: 0,
    respuestas: [],
    init: function() {
        this.respuestas = [];
        this.encuesta = document.getElementById("nav").topPage.data;
        $("#encuesta-titulo").text(this.encuesta.titulo);
        $("#alumno-encuesta-respond .page__background").css("background","#75ABBC");
        this.showPregunta();
        $("#box").show();
    },
    nextPregunta: function() {
        var respuesta = $("#adscripto-encuestas-create-titulo").val();
        if(Utils.empty(respuesta)) {
            ons.notification.confirm("¡No respondiste la pregunta!", {
                title: "Alerta",
                buttonLabels: ["Entendido"]
            });
            return;
        }
        
        var preguntaId = this.encuesta.preguntas[this.preguntaCounter].id;
        this.respuestas.push({
            preguntaId: preguntaId,
            valor: respuesta
        });

        var modal = $("#loading-modal-respondiendo-encuesta");
        modal.show();
        if(this.preguntaCounter === this.encuesta.preguntas.length - 1) {
            var lista = [];
            for(var i=0;i < this.respuestas.length; i++) {
                lista.push({
                    preguntaId: this.respuestas[i].preguntaId,
                    valor: this.respuestas[i].valor
                });
            }

            var respond = {
                encuestaId: this.encuesta.id,
                lista: lista
            };
            
            if(Network.isOnline()) {
                API.respondEncuesta(respond).done(function() {
                    Page.back();
                }).fail(function() {
                    ons.notification.toast("No se pudo responder la encuesta", {timeout: 5000});
                    AlumnoEncuestaRespond.respuestas.pop();
                }).always(function() {
                    modal.hide();
                });

            }

            LocalData.respondEncuesta(respond);
        } else {
            this.preguntaCounter++;
            this.showPregunta();
            modal.hide();
        }

    },
    showPregunta: function() {
        if(this.preguntaCounter !== 0) {
            $("#adscripto-encuestas-create-titulo").val("");
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