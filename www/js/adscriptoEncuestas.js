API.Configs.createEncuesta = function(args) {
    return {
        "async": true,
        "crossDomain": true,
        "url": "{0}/EncuestaGlobal/Post".format(Sigma.baseUrl),
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer {0}".format(Sigma.getToken()),
            "Cache-Control": "no-cache",
        },
        "data": '{ "Id": 0, "Titulo": "{0}", "FechaCreacion": "12/05/2018", "Descripcion": "{1}", "Preguntas": {2} }'.format(args.titulo, args.descripcion, JSON.stringify(args.preguntas))
    };
};

API.createEncuesta = function(args) {
    return $.ajax(API.Configs.createEncuesta(args));
};

API.Configs.getEncuesta = function(args) {
    return {
        "async": true,
        "crossDomain": true,
        "url": "{0}/EncuestaGlobal/Get/{0}".format(Sigma.baseUrl, args.id),
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer {0}".format(Sigma.getToken()),
            "Cache-Control": "no-cache",
        }
    };
};

API.getEncuesta = function(args) {
    return $.ajax(API.Configs.getEncuesta(args));
}

document.addEventListener('init', function(event) {
    if(event.target.matches('#adscripto-encuestas-create')) {
        AdscriptoEncuestaCreate.init();
    } else if(event.target.matches('#adscripto-encuestas-create-pregunta')) {
        AdscriptoEncuestaPregunta.init();
    }
});


document.addEventListener('show', function(event) {
    if(event.target.matches('#adscripto-encuestas-create')) {
        AdscriptoEncuestaCreate.init();
    } else if(event.target.matches('#adscripto-encuestas-create-pregunta')) {
        AdscriptoEncuestaPregunta.init();
    }
});

AdscriptoEncuestaPregunta = {
    Templates: {
        RespuestaPrompt: function(args) {
            var num = args.num;
            var id = "res-" + num;
            return {
                id: id,
                html: '<ons-list-item> <div class="left"> <div style="padding: 10px" onclick="AdscriptoEncuestaPregunta.removeRespuesta(this)" id="i{0}"><ons-icon icon="close" style="font-size: 20px"></ons-icon> <ons-ripple></ons-ripple></div> </div> <div class="center"> <ons-input id="{0}" class="respuesta" modifier="underbar" width="100%"></ons-input> </div> </ons-list-item>'.format(id, num)
            };
        }
    },
    respuestasCounter: 1,
    respuestas: [],
    pregunta: {},
    editionModeOn: false,
    init: function() {
        $("#add-respuesta").show();
        this.respuestasCounter = 1;
        if(this.editionModeOn) {
            var pregunta = this.pregunta;
            $("#p-titulo").text("Editar pregunta");
            $("#pregunta-texto-i").val(pregunta.texto);
            $("#p-submit").text("Confirmar");
            $("#respuestas-list").empty();
            $("#entrada").val('' + pregunta.tipo);
            this.respuestasCounter = 1;
            for(var i =0; i < pregunta.respuestas.length; i++) {
                var element = AdscriptoEncuestaPregunta.Templates.RespuestaPrompt({
                    num: this.respuestasCounter
                });
                $("#respuestas-list").prepend(element.html);
                $("#" + element.id).val(pregunta.respuestas[i].valor);
                this.respuestasCounter++;
            }
        } else {
            $("#p-titulo").text("Añadir pregunta");
            $("#pregunta-texto-i").val("");
            $("#p-submit").text("Añadir");
            $("#respuestas-list").empty();
            var element = AdscriptoEncuestaPregunta.Templates.RespuestaPrompt({
                num: this.respuestasCounter++
            });
            $("#respuestas-list").prepend(element.html);
        }
    },
    addRespuesta: function() {
        $("#respuestas-list").append(AdscriptoEncuestaPregunta.Templates.RespuestaPrompt({
            num: this.respuestasCounter
        }).html);
        this.respuestasCounter++;
        if(this.respuestasCounter == 11) {
            $("#add-respuesta").hide();
        }
    },
    removeRespuesta: function(element) {
        var elementId = $(element).attr('id');
        var id = elementId.split('-')[1];
        AdscriptoEncuestaPregunta.respuestas = [];
        $(".respuesta").each(function(i, obj) {
            var val = $(obj).val();
            AdscriptoEncuestaPregunta.respuestas.push({
                valor: val
            });
        });

        this.respuestas.splice(id - 1, 1);
        this.respuestasCounter = 1;
        $("#respuestas-list").empty();
        for(var i =0; i < this.respuestas.length; i++) {
            var element = AdscriptoEncuestaPregunta.Templates.RespuestaPrompt({
                num: this.respuestasCounter
            });
            $("#respuestas-list").prepend(element.html);
            $("#" + element.id).val(this.respuestas[i].valor);
            this.respuestasCounter++;
        }
    },
    submit: function() {
        AdscriptoEncuestaPregunta.respuestas = [];
        $(".respuesta").each(function(i, obj) {
            var val = $(obj).val();
            AdscriptoEncuestaPregunta.respuestas.push({
                valor: val
            });
        });
        
        for(var j = 0; j < AdscriptoEncuestaPregunta.respuestas.length; j++) {
            var respuesta = AdscriptoEncuestaPregunta.respuestas[j];
            if($.trim(respuesta.valor) === "") {
                ons.notification.alert("Dejaste una respuesta vacía. Podés llenarla o eliminarla.", {title:"Alerta", buttonLabels:["OK"]});
                return;
            }
         }

        var texto = $("#pregunta-texto-i").val();
        var tipo = parseInt($("#entrada").val());

        var preguntas = AdscriptoEncuestaCreate.encuesta.preguntas;
        for(var i =0; i<preguntas.length;i++) {
            var pregunta = preguntas[i];
            for(var j = 0; j < pregunta.respuestas.length; j++) {
                var respuesta = pregunta.respuestas[j];
                if(Utils.empty(respuesta)) {
                    ons.notification.alert("Dejaste una respuesta vacía. Podés llenarla o eliminarla.", {title:"Alerta", buttonLabels:["OK"]});
                    return;
                }
            }

            if(pregunta.texto === texto && pregunta.id != this.pregunta.id) {
                ons.notification.alert("Ya existe esa pregunta, cambiá el contenido.", { title: "Alerta", buttonLabels: ["OK"] });
                return;
            }
        }

        if(this.editionModeOn) {
            AdscriptoEncuestaCreate.editPregunta({
                tempId: this.pregunta.id,
                texto: texto,
                tipo: tipo,
                respuestas: AdscriptoEncuestaPregunta.respuestas
            });
        } else {
            AdscriptoEncuestaCreate.addPregunta({
                tempId: AdscriptoEncuestaCreate.encuesta.preguntas.length,
                texto: texto,
                tipo: tipo,
                respuestas: AdscriptoEncuestaPregunta.respuestas
            });
        }


        AdscriptoEncuestaPregunta.respuestas = [];
        this.editionModeOn = false;
        this.respuestasCounter = 1;
        Page.back();
    },
    editionMode: function(pregunta) {
        this.editionModeOn = true;
        this.pregunta = pregunta;
    }
};

AdscriptoEncuestaStats = {
    Templates: {
        PreguntaItem: function(args) {
            var id = 'pregunta-' + args.id;
            return {
                id: id,
                html: '<ons-list-item id="{0}">{1}</ons-list-item>'.format(id, args.texto)
            };
        }
    },
    encuesta: {
        preguntas: []
    },
    init: function() {
        var encuesta = document.getElementById("nav").topPage.data;
        this.encuesta = encuesta;

        if(Network.isOnline()) {
            API.getEncuesta({
                id: encuesta.id
            }).done(function(encuesta) {
                AdscriptoEncuestaStats.encuesta = encuesta;
            }).fail(function() {
                ons.notification.toast("No se pudo actualizar los resultados de la encuesta.", { timeout: 5000 });
            }).always(function() {
                
            });
        }
    },
    display: function() {
        var encuesta = this.encuesta;

        if(encuesta == null) {
            ons.notification.toast("No se pudo mostrar los resultados de la encuesta.", {
                timeout: 5000
            });
            return;
        }
        $("#s-titulo").text(encuesta.titulo);
        for(var i =0; i < encuesta.preguntas.length; i++) {
            var pregunta = encuesta.preguntas[i];
            var element = AdscriptoEncuestaStats.Templates.PreguntaItem(pregunta);
            $("#s-preguntas").prepend();
        }
    }
};

AdscriptoEncuestas = {
    Templates: {
        EncuestaCard: function(args) {
            return {
                html: '<ons-card> <div class="title"> <div>{0}</div></div> <div class="content"> <p>{1}</p> <ons-button modifier="quiet" onclick="Pages.adscriptoEncuestaStats()">Ver respuestas</ons-button></div> </ons-card>'.format(args.titulo, args.descripcion)
            };
        },
        NoneEncuestaCard: function() {
            return {
                html: '<ons-card> <div class="title"> :( </div> <div class="content"> <p>No tenes ninguna encuesta creada.</p> </div> </ons-card>'
            };
        }
    },
    encuestas: null,
    init: function() {
        var spinner = $("#adscripto-encuestas-spinner");
        spinner.show();
        if(Network.isOnline()) {
            API.getEncuestas().done(function(response) {
                if(!Utils.empty(response)) {
                    LocalData.setEncuestas(response);
                }
                AdscriptoEncuestas.encuestas = response;
                AdscriptoEncuestas.display();
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
            var element = AdscriptoEncuestas.Templates.NoneEncuestaCard();
            list.prepend(element.html);
        } else {
            this.encuestas.forEach(function(encuesta) {
                var list = $("#encuestas-list");
                var element = AdscriptoEncuestas.Templates.EncuestaCard(encuesta);
                list.prepend(element.html);
            });
        }
    }
};

AdscriptoEncuestaCreate = {
    Templates: {
        PreguntaItem: function(pregunta) {
            var id = "preg-";
            if(pregunta.tmpId != null) {
                id += pregunta.tmpId;
            } else {
                if(pregunta.id != null) {
                    id += pregunta.id;
                } else {
                    ons.notification.toast("Ocurrió un error.", {timeout:5000});
                    return;
                }
            }

            return {
                id: id,
                html: '<ons-list-item modifier="chevron" id="{0}" tappable> {1} </ons-list-item>'.format(id, pregunta.texto)
            };
        }
    },
    preguntaCounter: 1,
    encuesta: {
        preguntas: []
    },
    init: function() {
        AdscriptoEncuestaPregunta.editionModeOn = false;
        this.preguntaCounter = 1;
    },
    addPregunta: function() {
        if(this.preguntaCounter >= 10) {
            ons.notification.alert("La máxima cantidad de preguntas es 10.", {
                title: "Alerta",
                buttonLabels: ["OK"]
            });
            return;
        }

        Pages.showConfigPregunta();
    },
    submit: function() {
        var title = $("#adscripto-encuestas-create-titulo").text();
        if(Utils.empty(title)) {
            ons.notification.toast("El titulo no puede quedar vacío.", {timeout:5000});
            return;
        }
        this.encuesta.titulo = title;

        var descripcion = $("#adscripto-encuestas-create-descripcion").val();
        if(Utils.empty(descripcion)) {
            ons.notification.toast("La descripcion no puede quedar vacía.", {timeout:5000});
            return;
        }
        this.encuesta.descripcion = descripcion;

        var preguntas = this.encuesta.preguntas;
        if(pregunta == null) {
            ons.notification.alert("¡La encuesta debe tener por lo menos una pregunta!", {
                title: "Alerta",
                buttonLabels: ["OK"]
            });
            return;
        }

        var modal = $("#loading-modal-creando-encuesta");
        modal.show();
        if(Network.isOnline()) {
            API.createEncuesta(this.encuesta).done(function(encuesta) {
                LocalData.pushEncuesta(encuesta);
                Page.back()
            }).fail(function() {
                ons.notification.toast("La encuesta no pudo ser creada.", {timeout: 5000});
            }).always(function() {
                var modal = $("#loading-modal-creando-encuesta");
                modal.hide();
            });
        } else {
            LocalData.pushEncuesta(encuesta);
            Page.back();
        }

        this.encuesta.preguntas = [];
    },
    showConfig: function() {
        Pages.showConfigPregunta();
    },
    addPregunta: function(args) {
        var pregunta = {
            id: args.tempId,
            texto: args.texto,
            tipo: args.tipo,
            respuestas: args.respuestas
        };
        
        var element = AdscriptoEncuestaCreate.Templates.PreguntaItem(pregunta);
        $("#preguntas-list").prepend(element.html);
        $("#" + element.id).click(function() {
            var elementId = this.id;
            var tokens = elementId.split("-");
            var preguntaId = parseInt(tokens[1]);
            Pages.showConfigPreguntaEdit(AdscriptoEncuestaCreate.encuesta.preguntas[preguntaId]);
        });
        this.encuesta.preguntas.push(pregunta);
    },
    editPregunta: function(args) {
        var pregunta = {
            id: args.tempId,
            texto: args.texto,
            tipo: args.tipo,
            respuestas: args.respuestas
        };
        
        for(var i =0; i < this.encuesta.preguntas.length; i++) {
            var p = this.encuesta.preguntas[i];
            if(pregunta.id == p.id) {
                this.encuesta.preguntas[i].id = pregunta.id;
                this.encuesta.preguntas[i].texto = pregunta.texto;
                this.encuesta.preguntas[i].tipo = pregunta.tipo;
                this.encuesta.preguntas[i].respuestas = pregunta.respuestas;
            }
        }
    },
    confirmExit: function() {
        AdscriptoEncuestaCreate.exiting = true;
        var title = $("#adscripto-encuestas-create-titulo").val();
        this.encuesta.titulo = title;

        var descripcion = $("#adscripto-encuestas-create-descripcion").val();
        this.encuesta.descripcion = descripcion;

        var preguntas = this.encuesta.preguntas;
        if(!Utils.empty(preguntas) || !Utils.empty(title) || !Utils.empty(descripcion)) {
            ons.notification.confirm({
                message: '¿Estás seguro de que querés descartar esta encuesta?',
                callback: function(idx) {  
                    if(idx === 1) {
                        Page.back();                    
                    }
                    AdscriptoEncuestaCreate.exiting = false;
                },
                error: function(idx) {
                    // ?
                },
                buttonLabels: ["Cancelar", "Si"]
            });
            return;
        }

        Page.back();
        AdscriptoEncuestaCreate.exiting = false;    
    }
};