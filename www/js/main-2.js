API = {
    login: function() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://{0}/Account/Login".format(Sigma.baseUrl),
            "method": "POST",
            "headers": {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache"
            },
            "processData": false,
            "data": '{"CI": "{0}","Password": "{1}"}'.format(args.cedula,  args.password),
            "success": function (response) {
              args.success(response);
            },
            "error": function (response) {
              args.error(response);
            }
          }
        
          return $.ajax(settings);
    },
    getDocenteParciales: function() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://{0}/Parcial/GetDocenteParciales".format(Sigma.baseUrl),
            "method": "GET",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer {0}".format(Sigma.getToken()),
              "Cache-Control": "no-cache",
            }
        }

        return $.ajax(settings)
    },
    getAlumnoParciales: function() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://{0}/Parcial/GetAlumnoParciales".format(Sigma.baseUrl),
            "method": "GET",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer {0}".format(Sigma.getToken()),
              "Cache-Control": "no-cache",
            }
        }

        return $.ajax(settings)
    },
    getDocenteEscritos: function() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://{0}/Escrito/GetDocenteEscritos".format(Sigma.baseUrl),
            "method": "GET",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer {0}".format(Sigma.getToken()),
              "Cache-Control": "no-cache",
            }
        }

        return $.ajax(settings)
    },
    getAlumnoEscritos: function() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://{0}/Escrito/GetAlumnoEscritos".format(Sigma.baseUrl),
            "method": "GET",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer {0}".format(Sigma.getToken()),
              "Cache-Control": "no-cache",
            }
        }

        return $.ajax(settings)
    },
    createEscrito: function(args) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://{0}/Escrito/Post".format(Sigma.baseUrl),
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer {0}".format(Sigma.getToken())
            },
            "processData": false,
            "data": '{"Id": 1, "MateriaId": {0}, "Temas": "{1}", "Date": "{2}", "GruposAsignados": {3}}'.format(args.materiaId, args.temas, args.fecha, JSON.stringify(args.gruposAsignados))
        };
        
        return $.ajax(settings);
    },
    getEscrito: function(args) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://{0}/Escrito/Get/{1}".format(Sigma.baseUrl, args.id),
            "method": "GET",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer {0}".format(Sigma.getToken()),
              "Cache-Control": "no-cache",
            }
        }

        return $.ajax(settings)
    },
    getParcial: function(args) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://{0}/Parcial/Get/{1}".format(Sigma.baseUrl, args.id),
            "method": "GET",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer {0}".format(Sigma.getToken()),
              "Cache-Control": "no-cache",
            }
        }

        return $.ajax(settings)
    }
};

Utils = {
    toGroupName: function(grado, numero) {
        var gradoTranslation;
        switch(grado) {
          case 1:
            gradoTranslation = 4;
            break;
          case 2:
            gradoTranslation = 5;
            break;
          case 3:
            gradoTranslation = 6;
            break;
        }
        return "{0}º{1}".format(gradoTranslation, numero);
    },
    serverDateToLocal: function(serverDate) {
        var tokens = serverDate.split('-');
        var year = tokens[0];
        var month = tokens[1];
        var day = tokens[2].split('T')[0];
        return "{0}/{1}/{2}".format(day, month, year);
    },
    timeSelectorDateToServer: function(timeSelectorDate) {
        var tokens = timeSelectorDate.split('-');
        var year = tokens[0];
        var month = tokens[1];
        var day = tokens[2];
        return "{0}/{1}/{2}".format(month, day, year);
    }
};

// DB Objects
Parcial = function() {

}

Parcial.prototype.id = null;
Parcial.prototype.fecha = null;
Parcial.prototype.docenteId = null;
Parcial.prototype.materiaId = null;
Parcial.prototype.temas = null;
Parcial.prototype.gruposAsignados = [];
Parcial.prototype.valid = function() {
    if(isNaN(this.id) || isNaN(this.materiaId) || this.docenteId == null || this.fecha == null || this.gruposAsignados == null || this.temas == null) {
        return false;
    }

    for(var i = 0; i < this.gruposAsignados.length; i++) {
        var grupo = this.gruposAsignados[i];
        if(!grupo.valid()) {
            return false;
        }
    }

    return true;
}
Parcial.prototype.set = function(object) {
    if(object == null) {
        return;
    }
    
    this.id = object.id;
    this.fecha = object.fecha;
    this.docenteId = object.docenteId;
    this.materiaId = object.materiaId;
    this.temas = object.temas;
    
    if(object.gruposAsignados == null) {
        return;
    }
    
    for(var i = 0; i < object.gruposAsignados.length; i++) {
        var g = object.gruposAsignados[i];
        var grupo = new Grupo();
        grupo.set(g);
        this.gruposAsignados.push(grupo);
    }
};

Escrito = function() {

}

Escrito.prototype.id = null;
Escrito.prototype.fecha = null;
Escrito.prototype.docenteId = null;
Escrito.prototype.materiaId = null;
Escrito.prototype.temas = null;
Escrito.prototype.gruposAsignados = [];
Escrito.prototype.valid = function() {
    if(isNaN(this.id) || isNaN(this.materiaId) || this.docenteId == null || this.fecha == null || this.gruposAsignados == null || this.temas == null) {
        return false;
    }

    for(var i = 0; i < this.gruposAsignados.length; i++) {
        var grupo = this.gruposAsignados[i];
        if(!grupo.valid()) {
            return false;
        }
    }

    return true;
}
Escrito.prototype.set = function(object) {
    if(object == null) {
        return;
    }
    
    this.id = object.id;
    this.fecha = object.fecha;
    this.docenteId = object.docenteId;
    this.materiaId = object.materiaId;
    this.temas = object.temas;
    
    if(object.gruposAsignados == null) {
        return;
    }
    
    for(var i = 0; i < object.gruposAsignados.length; i++) {
        var g = object.gruposAsignados[i];
        var grupo = new Grupo();
        grupo.set(g);
        this.gruposAsignados.push(grupo);
    }
};

Grupo = function() {

}

Grupo.prototype.id = null;
Grupo.prototype.grado = null;
Grupo.prototype.anio = null;
Grupo.prototype.numero = null;
Grupo.prototype.valid = function() {
    if(isNaN(this.id) || isNaN(this.grado) || isNaN(this.anio) || isNaN(this.numero)) {
        return false;
    }

    return true;
};
Grupo.prototype.set = function(object) {
    this.id = object.id;
    this.grado = object.grado;
    this.anio = object.anio;
    this.numero = object.numero;
};

User = function() {

}

User.prototype.cedula = null;
User.prototype.extension = {};
User.prototype.valid = function() {
    if(this.cedula == null || this.extension == null) {
        return false;
    }

    for(var i = 0; i < this.grupos.length; i++) {
        var grupo = this.grupos[i];
        if(!grupo.valid()) {
            return false;
        }
    }

    return true;
};
User.prototype.set = function(object) {
    this.cedula = object.cedula;
    this.extension = object.extension;
}

Docente = function() {

}

Docente.prototype.grupos = [];
Docente.prototype.parciales = [];
Docente.prototype.deberes = [];
Docente.prototype.valid = function() {
    if(this.grupos == null || this.parciales == null || this.deberes == null) {
        return false;
    }

    for(var i = 0; i < this.grupos.length; i++) {
        var grupo = this.grupos[i];
        if(!grupo.valid()) {
            return false;
        }
    }

    for(var i = 0; i < this.parciales.length; i++) {
        var parcial = this.parciales[i];
        if(!parcial.valid()) {
            return false;
        }
    }

    for(var i = 0; i < this.deberes.length; i++) {
        var deber = this.deberes[i];
        if(!deber.valid()) {
            return false;
        }
    }

    return true;
};
Docente.prototype.set = function(object) {
    this.grupos = object.grupos;
    this.parciales = object.parciales;
    this.deberes = object.deberes;
}

Alumno = function() {

}
Alumno.prototype.grupo = null;
Alumno.prototype.parciales = [];
Alumno.prototype.deberes = [];
Alumno.prototype.valid = function() {
    if(this.grupo == null || this.parciales == null || this.deberes == null) {
        return false;
    }

    for(var i = 0; i < this.parciales.length; i++) {
        var parcial = this.parciales[i];
        if(!parcial.valid()) {
            return false;
        }
    }

    for(var i = 0; i < this.deberes.length; i++) {
        var deber = this.deberes[i];
        if(!deber.valid()) {
            return false;
        }
    }

    return true;
};

Alumno.prototype.set = function(object) {
    this.grupo = object.grupo;
    this.parciales = object.parciales;
    this.deberes = object.deberes;
};

// DB Objects Utilities
Parciales = {
    toList: function(parciales) {
        if(parciales === null) {
            throw "The parciales argument is null.";
        }

        var parcialesList = [];
        for(var i = 0; i < parciales.length; i++) {
            var p = parciales[i];
            var parcial = new Parcial();
            parcial.set(p);

            if(!parcial.valid()) {
                throw "Argumented parciales list is invalid.";
            } 

            parcialesList.push(parcial);
        }
        return parcialesList;
    }
};

Escritos = {
    toList: function(escritos) {
        if(escritos === null) {
            throw "The escritos argument is null.";
        }

        var escritosList = [];
        for(var i = 0; i < escritos.length; i++) {
            var e = escritos[i];
            var escrito = new Escrito();
            escrito.set(e);

            if(!escrito.valid()) {
                throw "Argumented escritos list is invalid.";
            } 
            escritosList.push(escrito);
        }

        return escritosList;
    }
};

// Pages

ons.ready(function() {
    General.init();
});

General = {
    user: {},
    init: function() {
        user = SigmaLS.userInfo;        
    }
};

Page = {
    pushPage: function(htmlFile, options) {
        document.getElementById("nav").pushPage(htmlFile, options);
    },
    back: function(options) {
        document.getElementById("nav").popPage(options);
    }
};

DocenteParciales = {
    Templates: {
        ParcialListItem: function(parcial) {
            return {
                html: '<ons-list-item id="parcial-{0}" modifier="chevron" tappable>Parcial {1}</ons-list-item>'.format(parcial.id, Utils.serverDateToLocal(parcial.fecha)),
                id: 'parcial-{0}'.format(parcial.id)
            }
        }
    },
    parcialesList: [],
    init: function() {
        // Get the logged docente's parciales
        API.getDocenteParciales().done(function(response) {
            DocenteParciales.parcialesList = Parciales.toList(response);
            $("#parciales-list").empty();
            DocenteParciales.parcialesList.forEach(function(parcial) {
                var element = DocenteParciales.Templates.ParcialListItem(parcial);
                $("#parciales-list").prepend(element.html);
                $("#" + element.id).click(function() {
                    Page.pushPage('docente-view-parcial.html', {
                        data: parcial,
                        callback: function() {
                            DocenteParcialInfo.init();
                        }
                    });
                });
            });
        });
    }
};

DocenteEscritos = {
    Templates: {
        EscritoListItem: function(escrito) {
            return {
                html: '<ons-list-item id="escrito-{0}" modifier="chevron" tappable>Escrito {1}</ons-list-item>'.format(escrito.id, Utils.serverDateToLocal(escrito.fecha)),
                id: 'escrito-{0}'.format(escrito.id)
            }
        }
    },
    escritosList: [],
    init: function() {
        // Get the logged docente's escritos
        API.getDocenteEscritos().done(function(response) {
            DocenteEscritos.escritosList = Escritos.toList(response);
            $("#escritos-list").empty();
            DocenteEscritos.escritosList.forEach(function(escrito) {
                var element = DocenteEscritos.Templates.EscritoListItem(escrito);
                $("#escritos-list").prepend(element.html);
                $("#" + element.id).click(function() {
                    Page.pushPage('docente-view-escrito.html', {
                        data: escrito,
                        callback: function() {
                            DocenteEscritoInfo.init();
                        }
                    });
                });
            });
        });
    }
};
    
DocenteParcialesCreate = {
        Templates: {
        GrupoListItem: function(grupo) {
            return {
                html: '<ons-list-item id="grupo-{0}"><label class="left"><ons-checkbox class="grupo-checkbox" name="grupos[]" input-id="grupo-check-{0}"></ons-checkbox></label><label for="grupo-{0}">{1}</label></ons-list-item>'.format(grupo.id, Utils.toGroupName(grupo.grado, grupo.numero)),
                id: 'grupo-{0}'.format(grupo.id),
                checkboxId: 'grupo-check-{0}'.format(grupo.id)
            }
        }
    },
    init: function() {
        var grupos = SigmaLS.userInfo.grupos;
        if(grupos === null) {
            ons.notification.toast("Ocurrio un error. ¡No tenés grupos!");
        } else {
            grupos.forEach(function(grupo) {
                var element = DocenteParcialesCreate.Templates.GrupoListItem(grupo);
                $("#docente-parciales-create-grupos-list").append(element.html);
            });
        }
    },
    submit: function() {
        var date = $("#docente-parciales-create-fecha").val();
        var temas = $("#docente-parciales-create-temas").val();
        var grupos = $('input[type="checkbox"][name="grupos\\[\\]"]:checked').map(function() { 
            return { "Id": parseInt(this.id.split('-')[2]) }; 
        }).get();

        $("#loading-modal-creando-parcial").show();
        API.createParcial({
            materiaId: 10,
            fecha: Utils.timeSelectorDateToServer(date),
            temas: temas,
            gruposAsignados: grupos
        }).done(function(response) {
            Page.back({
                callback: function() {
                    DocenteParciales.init();
                }
            });
        }).fail(function(response) {
            ons.notification.toast("El parcial no pudo ser creado.", {
                timeout: 1000
            }); 
        }).always(function() {
            $("#loading-modal-creando-parcial").hide();
        });
    }
};


DocenteEscritosCreate = {
    Templates: {
    GrupoListItem: function(grupo) {
        return {
            html: '<ons-list-item id="grupo-{0}"><label class="left"><ons-checkbox class="grupo-checkbox" name="grupos[]" input-id="grupo-check-{0}"></ons-checkbox></label><label for="grupo-{0}">{1}</label></ons-list-item>'.format(grupo.id, Utils.toGroupName(grupo.grado, grupo.numero)),
            id: 'grupo-{0}'.format(grupo.id),
            checkboxId: 'grupo-check-{0}'.format(grupo.id)
        }
    }
},
init: function() {
    var grupos = SigmaLS.userInfo.grupos;
    if(grupos === null) {
        ons.notification.toast("Ocurrio un error. ¡No tenés grupos!");
    } else {
        grupos.forEach(function(grupo) {
            var element = DocenteEscritosCreate.Templates.GrupoListItem(grupo);
            $("#docente-escritos-create-grupos-list").append(element.html);
        });
    }
},
submit: function() {
    var date = $("#docente-escritos-create-fecha").val();
    var temas = $("#docente-escritos-create-temas").val();
    var grupos = $('input[type="checkbox"][name="grupos\\[\\]"]:checked').map(function() { 
        return { "Id": parseInt(this.id.split('-')[2]) }; 
    }).get();

    $("#loading-modal-creando-escrito").show();
    API.createEscrito({
        materiaId: 10,
        fecha: Utils.timeSelectorDateToServer(date),
        temas: temas,
        gruposAsignados: grupos
    }).done(function(response) {
        Page.back({
            callback: function() {
                DocenteEscritos.init();
            }
        });
    }).fail(function(response) {
        ons.notification.toast("El escrito no pudo ser creado.", {
            timeout: 1000
        }); 
    }).always(function() {
        $("#loading-modal-creando-escrito").hide();
    });
}
};

DocenteParcialInfo = {
    Templates: {
        GrupoListItem: function(grupo) {
            return {
                html: '<ons-list-item id="grupo-{0}">{1}</ons-list-item>'.format(grupo.id, Utils.toGroupName(grupo.grado, grupo.numero)),
                id: 'grupo-{0}'.format(grupo.id)
            }
        }
    },
    init: function() {
        var data = document.getElementById("nav").topPage.data;
        API.getParcial({
            id: data.id
        }).done(function(response) {
            $("#docente-view-parcial-temas").text(response.temas);
            $("#docente-view-parcial-grupos").empty();
            var grupos = response.gruposAsignados;
            grupos.forEach(function(grupo) {
                var element = DocenteParcialInfo.Templates.GrupoListItem(grupo);
                $("#docente-view-parcial-grupos").append(element.html);
            });
        });;
    }
};

DocenteEscritoInfo = {
    Templates: {
        GrupoListItem: function(grupo) {
            return {
                html: '<ons-list-item id="grupo-{0}">{1}</ons-list-item>'.format(grupo.id, Utils.toGroupName(grupo.grado, grupo.numero)),
                id: 'grupo-{0}'.format(grupo.id)
            }
        }
    },
    init: function() {
        var data = document.getElementById("nav").topPage.data;
        API.getEscrito({
            id: data.id
        }).done(function(response) {
            $("#docente-view-escrito-temas").text(response.temas);
            $("#docente-view-escrito-grupos").empty();
            var grupos = response.gruposAsignados;
            grupos.forEach(function(grupo) {
                var element = DocenteEscritoInfo.Templates.GrupoListItem(grupo);
                $("#docente-view-escrito-grupos").append(element.html);
            });
        });;
    }
};

AlumnoParciales = {
    Templates: {
        ParcialListItem: function(parcial) {
            return {
                html: '<ons-list-item id="parcial-{0}" modifier="chevron" tappable>Parcial {1}</ons-list-item>'.format(parcial.id, Utils.serverDateToLocal(parcial.fecha)),
                id: 'parcial-{0}'.format(parcial.id)
            }
        }
    },
    parcialesList: [],
    init: function() {
        // Get the logged docente's parciales
        API.getAlumnoParciales().done(function(response) {
            AlumnoParciales.parcialesList = Parciales.toList(response);
            $("#parciales-list").empty();
            AlumnoParciales.parcialesList.forEach(function(parcial) {
                var element = AlumnoParciales.Templates.ParcialListItem(parcial);
                $("#parciales-list").prepend(element.html);
                $("#" + element.id).click(function() {
                    Pages.docenteViewParcial(parcial);
                });
            });
        });
    }
};



AlumnoEscritos = {
    Templates: {
        EscritoListItem: function(escrito) {
            return {
                html: '<ons-list-item id="escrito-{0}" modifier="chevron" tappable>Escrito {1}</ons-list-item>'.format(escrito.id, Utils.serverDateToLocal(escrito.fecha)),
                id: 'escrito-{0}'.format(escrito.id)
            }
        }
    },
    escritosList: [],
    init: function() {
        // Get the logged alumno's escritos
        API.getAlumnoEscritos().done(function(response) {
            AlumnoEscritos.escritosList = Escritos.toList(response);
            $("#escritos-list").empty();
            AlumnoEscritos.escritosList.forEach(function(escrito) {
                var element = AlumnoEscritos.Templates.EscritoListItem(escrito);
                $("#escritos-list").prepend(element.html);
                $("#" + element.id).click(function() {
                    Pages.docenteViewEscrito(escrito);
                });
            });
        });
    }
};

Pages = {
    docenteParciales: function() {
        Page.pushPage("docente-parciales.html", {
            callback: function() {
                DocenteParciales.init();
            }
        });
    },
    docenteParciales: function() {
        Page.pushPage("docente-escritos.html", {
            callback: function() {
                DocenteEscritos.init();
            }
        });
    },
    docenteViewEscrito: function(escrito) {
        Page.pushPage('docente-view-escrito.html', {
            data: escrito,
            callback: function() {
                DocenteEscritoInfo.init();
            }
        });
    },
    docenteEscritosCreate: function() {
        Page.pushPage("docente-escritos-create.html", {
            callback: function() {
                DocenteEscritosCreate.init();
            }
        });
    },
    docenteViewParcial: function(parcial) {
        Page.pushPage('docente-view-parcial.html', {
            data: parcial,
            callback: function() {
                DocenteParcialInfo.init();
            }
        });
    },
    docenteParcialesCreate: function() {
        Page.pushPage("docente-parciales-create.html", {
            callback: function() {
                DocenteParcialesCreate.init();
            }
        });
    },
    alumnoParciales: function() {
        Page.pushPage("alumno-parciales.html", {
            callback: function() {
                AlumnoParciales.init();
            }
        });
    },
    docenteEscritos: function() {
        Page.pushPage("docente-escritos.html", {
            callback: function() {
                DocenteEscritos.init();
            }
        });
    },
    alumnoEscritos: function() {
        Page.pushPage("alumno-escritos.html", {
            callback: function() {
                AlumnoEscritos.init();
            }
        });
    }
};
