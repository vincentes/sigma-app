
API = {
    Configs: {
        deleteDeber: function(args) {
            return {
                "async": true,
                "crossDomain": true,
                "url": "{0}/Tarea/DeleteDeber/{1}".format(Sigma.baseUrl, args.id),
                "method": "POST",
                "headers": {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer {0}".format(Sigma.getToken()),
                  "Cache-Control": "no-cache",
                }
            };
        },
        getEncuestas: function() {
            return {
                "async": true,
                "crossDomain": true,
                "url": "{0}/EncuestaGlobal/GetCreated".format(Sigma.baseUrl),
                "method": "GET",
                "headers": {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer {0}".format(Sigma.getToken()),
                  "Cache-Control": "no-cache",
                }
            };
        },
        saveDeber: function(args) {
            return {
                "async": true,
                "crossDomain": true,
                "url": "{0}/Tarea/Post".format(Sigma.baseUrl),
                "method": "POST",
                "headers": {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer {0}".format(Sigma.getToken()),
                  "Cache-Control": "no-cache",
                },
                "data": '{ "MateriaId": 10, "Contenido": "{0}", "ImageIds": {1} }'.format(args.contenido, JSON.stringify(args.imageIds))
            };
        },
        saveImages: function(args) {
            return {
                "async": true,
                "crossDomain": true,
                "url": "{0}/Tarea/Post".format(Sigma.baseUrl),
                "method": "POST",
                "headers": {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer {0}".format(Sigma.getToken()),
                  "Cache-Control": "no-cache",
                },
                "data": '{ "MateriaId": 10, "Contenido": "{0}", "ImageIds": {1} }'.format(args.contenido, JSON.stringify(args.imageIds))
            };
        },
        assignDeberToGroups: function(args) {
            return {
                "async": true,
                "crossDomain": true,
                "url": "{0}/Tarea/AssignGrupo".format(Sigma.baseUrl),
                "method": "PUT",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer {0}".format(Sigma.getToken()),
                    "Cache-Control": "no-cache",
                },
                "processData": false,
                "data": '{"GrupoIds": {0}, "Deadline": "{1}", "TareaId": {2}}'.format(JSON.stringify(args.groupIds), args.deadline, args.deberId)
            };
        },
        createEscrito: function(args) {
            return {
                "async": true,
                "crossDomain": true,
                "url": "{0}/Escrito/Post".format(Sigma.baseUrl),
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer {0}".format(Sigma.getToken())
                },
                "processData": false,
                "data": '{"Id": 1, "MateriaId": 10, "Temas": "{1}", "Date": "{2}", "GruposAsignados": {3}}'.format(args.materiaId, args.temas, args.fecha, JSON.stringify(args.gruposAsignados))
            };
        },
        createParcial: function(args) {
            return {
                "async": true,
                "crossDomain": true,
                "url": "{0}/Parcial/Post".format(Sigma.baseUrl),
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer {0}".format(Sigma.getToken())
                },
                "processData": false,
                "data": '{"Id": 1, "MateriaId": 10, "Temas": "{1}", "Date": "{2}", "GruposAsignados": {3}}'.format(args.materiaId, args.temas, args.fecha, JSON.stringify(args.gruposAsignados))
            };
        },
        deleteFCMToken: function() {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "{0}/Notification/DeleteToken".format(Sigma.baseUrl),
                "method": "POST",
                "headers": {
                  "Content-Type": "application/json",
                  "Cache-Control": "no-cache",
                  "Authorization": "Bearer {0}".format(Sigma.getToken())
                },
                "processData": false
              };

            return settings;
        }
    },
    createEscrito: function(args) {
        return $.ajax(API.Configs.createEscrito(args));
    },
    createParcial: function(args) {
        return $.ajax(API.Configs.createParcial(args));
    },
    getEncuestas: function() {
        return $.ajax(API.Configs.getEncuestas());
    },
    _saveDeberAfterImages: function(args) {
        this._saveImages({
            images: args.imagesUrl,
            tmpActivityCallback: function(imageIds) {
                API.saveDeber({
                    contenido: args.contenido,
                    imageIds: imageIds
                });
            }
        });
    },
    deleteFCMToken: function() {
        return $.ajax(API.Configs.deleteFCMToken());
    },
    login: function(args) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "{0}/Account/Login".format(Sigma.baseUrl),
            "method": "POST",
            "headers": {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache"
            },
            "processData": false,
            "data": '{"CI": "{0}","Password": "{1}"}'.format(args.cedula,  args.password)
          }
        
          return $.ajax(settings);
    },
    getDocenteParciales: function() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "{0}/Parcial/GetDocenteParciales".format(Sigma.baseUrl),
            "method": "GET",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer {0}".format(Sigma.getToken()),
              "Cache-Control": "no-cache",
            }
        }

        return $.ajax(settings);
    },
    getDocenteDeberes: function() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "{0}/Tarea/GetDocenteTareas".format(Sigma.baseUrl),
            "method": "GET",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer {0}".format(Sigma.getToken()),
              "Cache-Control": "no-cache",
            }
        }

        return $.ajax(settings);
    },
    getAlumnoParciales: function() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "{0}/Parcial/GetAlumnoParciales".format(Sigma.baseUrl),
            "method": "GET",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer {0}".format(Sigma.getToken()),
              "Cache-Control": "no-cache",
            }
        }

        return $.ajax(settings)
    },
    assignDeberToGroups: function(args) {
        return $.ajax(API.Configs.assignDeberToGroups(args));
    },
    getDocenteEscritos: function() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "{0}/Escrito/GetDocenteEscritos".format(Sigma.baseUrl),
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
            "url": "{0}/Escrito/GetAlumnoEscritos".format(Sigma.baseUrl),
            "method": "GET",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer {0}".format(Sigma.getToken()),
              "Cache-Control": "no-cache",
            }
        }

        return $.ajax(settings)
    },
    getEscrito: function(args) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "{0}/Escrito/Get/{1}".format(Sigma.baseUrl, args.id),
            "method": "GET",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer {0}".format(Sigma.getToken()),
              "Cache-Control": "no-cache",
            }
        }

        return $.ajax(settings)
    },
    createGrupoDeber: function() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "{0}/Tarea/AssignGrupo".format(Sigma.baseUrl),
            "method": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer {0}".format(Sigma.getToken()),
                "Cache-Control": "no-cache",
            },
            "processData": false,
            "data": '{"GrupoIds": {0}, "Deadline": "{1}", "TareaId": {2}}'.format(JSON.stringify(args.groupIds), args.deadline, args.deberId),
        }
      
        return $.ajax(settings);
    },
    getParcial: function(args) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "{0}/Parcial/Get/{1}".format(Sigma.baseUrl, args.id),
            "method": "GET",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer {0}".format(Sigma.getToken()),
              "Cache-Control": "no-cache",
            }
        }

        return $.ajax(settings)
    },
    deleteDeber: function(args) {
        return $.ajax(API.Configs.deleteDeber(args));
    },
    saveDeber: function(args) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "{0}/Tarea/Post".format(Sigma.baseUrl),
            "method": "POST",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer {0}".format(Sigma.getToken()),
              "Cache-Control": "no-cache",
            },
            "data": '{ "MateriaId": 10, "Contenido": "{0}", "ImageIds": {1} }'.format(args.contenido, JSON.stringify(args.imageIds))
        }

        return $.ajax(settings)
    },
    _saveImages: function(args) {
        console.log("Ok, going to upload "+ args.images.length + " images.");
        var defs = [];
    
        var fd = new FormData();
        args.images.forEach(function(i) {
          console.log('Processing ' + i);
          var def = $.Deferred();
          window.resolveLocalFileSystemURL(i, function(fileEntry) {
            console.log('Got a file entry');
            fileEntry.file(function(file) {
              console.log('now i have a file ob');
              console.dir(file);
              var reader = new FileReader();
              reader.onloadend = function(e) {
                var imgBlob = new Blob([this.result], { type:file.type});
                fd.append('file' + (args.images.indexOf(i) + 1).url, imgBlob);
                fd.append('fileName' + (args.images.indexOf(i) + 1).url, file.name);
                def.resolve();
              };
              reader.readAsArrayBuffer(file);
            }, function(e) {
              console.log('error getting file', e);
            });			
          }, function(e) {
            console.log('Error resolving fs url', e);
          });
          defs.push(def.promise());
        });
    
        $.when.apply($, defs).then(function() {
          console.log("all things done");
          var request = new XMLHttpRequest();
          request.open('POST', '{0}/Imagen/Upload'.format(Sigma.baseUrl));
          request.setRequestHeader("Authorization", "Bearer {0}".format(Sigma.getToken()));  
          request.onload = function() {
            if(request.status == 401) {
                return;
            }

            if(request.status == 200) {
                var data = JSON.parse(request.response);
                if(args.callback != null) {
                    args.callback({
                      content: data.content,
                      id: data.id,
                      imageIds: data.ids,
                      imagesURL: args.images
                    });
                }

                if(args.tmpActivityCallback != null) {
                    args.tmpActivityCallback(data.ids);
                }
            }
          };
          request.onerror = function() {
          };
          request.send(fd);
        });
    },
    _downloadImage: function(args) {
        jQuery.ajax({
            url: "{0}/Imagen/Download/{1}".format(Sigma.baseUrl, args.imageId),
            cache: true,
            headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer {0}".format(Sigma.getToken()),
            "Cache-Control": "no-cache",
            },
            xhr:function(){
                var xhr = new XMLHttpRequest();
                xhr.responseType= 'blob'
                return xhr;
            },
            success: function(data){
                var url = window.URL || window.webkitURL;
                var src = url.createObjectURL(data);
                args.success(src, args.deberId, args.imageId);
            },
            error:function() {
                ons.notification.toast("Error al descargar imagen.", { timeout: 1000 });
            }
        });
    },
    getAssignedGrupos: function(args) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "{0}/Tarea/GetAssignedGrupos/{1}".format(Sigma.baseUrl, parseInt(args.deberId)),
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer {0}".format(Sigma.getToken()),
                "Cache-Control": "no-cache",
            }
        }
          
        return $.ajax(settings);
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
    },
    empty: function(val) {
        if (val === undefined)
            return true;
    
        if (typeof (val) == 'function' || typeof (val) == 'number' || typeof (val) == 'boolean' || Object.prototype.toString.call(val) === '[object Date]')
            return false;
    
        if (val == null || val.length === 0)
            return true;
    
        if (typeof (val) == "object") {
            var r = true;
    
            for (var f in val)
                r = false;
    
            return r;
        }
    
        return false;
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
    init: function() {
        LocalData.loadEverything();           
    }
};

Page = {
    pushPage: function(htmlFile, options) {
        document.getElementById("nav").pushPage(htmlFile, options);
    },
    replacePage: function(htmlFile, options) {
        if(!options) {
            options = {};
        }

        if(!options.animation) {
            options.animation = "fade";
        }
        document.getElementById("nav").replacePage(htmlFile, {
            animation: options.animation
        });
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
        },
        NoParcialListItem: function() {
            return {
                html: '<ons-list-item><ons-icon icon="sad"></ons-icon> No tenés ningun parcial creado.</ons-list-item>'
            }  
        }
    },
    parcialesList: [],
    init: function() {
        var spinner = $("#docente-parciales-spinner");
        spinner.show();
        if(Network.isOnline()) {
        $("#escritos-list").empty();

            // Get the logged docente's parciales
            API.getDocenteParciales().done(function(response) {
                DocenteParciales.parcialesList = Parciales.toList(response);
                LocalData.setParciales(DocenteParciales.parcialesList);
                DocenteParciales.display();
            }).fail(function() {
                ons.notification.toast("No se pudieron obtener los parciales", {timeout: 5000});
            }).always(function() {
                spinner.hide();
            });
        } else {
            this.parcialesList = LocalData.getParciales();
            this.display();
            spinner.hide();
        }
    },
    display: function() {
        $("#parciales-list").empty();
        if(Utils.empty(this.parcialesList)) {
            $("#parciales-list").prepend(DocenteEscritos.Templates.NoParcialListItem().html);
        } else {
            this.parcialesList.forEach(function(parcial) {
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
        }
    }
};

DocenteEscritos = {
    Templates: {
        EscritoListItem: function(escrito) {
            return {
                html: '<ons-list-item id="escrito-{0}" modifier="chevron" tappable>Escrito {1}</ons-list-item>'.format(escrito.id, Utils.serverDateToLocal(escrito.fecha)),
                id: 'escrito-{0}'.format(escrito.id)
            }
        },
        NoEscritoListItem: function() {
            return {
                html: '<ons-list-item><ons-icon icon="sad"></ons-icon> No tenés ningun escrito creado.</ons-list-item>'
            }  
        }
    },
    escritosList: [],
    init: function() {
        var spinner = $("#docente-escritos-spinner");
        spinner.show();
        if(Network.isOnline()) {
            $("#escritos-list").empty();
            // Get the logged docente's escritos
            API.getDocenteEscritos().done(function(response) {
                DocenteEscritos.escritosList = Escritos.toList(response);
                LocalData.setEscritos(DocenteEscritos.escritosList);
                DocenteEscritos.display();
            }).fail(function() {
                ons.notification.toast("No se pudieron obtener los escritos", {timeout: 5000});
            }).always(function() {
                spinner.hide();
            });
        } else {
            this.escritosList = LocalData.getEscritos();
            this.display();
            spinner.hide();
        }
    },
    display: function() {
        $("#escritos-list").empty();
        if(Utils.empty(this.escritosList)) {
            $("#escritos-list").prepend(DocenteEscritos.Templates.NoEscritoListItem().html);
        } else {
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
        }
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
        var grupos = LocalData.user.info.grupos;
        if(Utils.empty(grupos)) {
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
        var parcial = {
            materiaId: 1,
            fecha: Utils.timeSelectorDateToServer(date),
            temas: temas,
            gruposAsignados: grupos
        };
        if(Network.isOnline()) {
            API.createParcial(parcial).done(function(response) {
                Page.back({
                    callback: function() {
                        DocenteParciales.init();
                    }
                });
                LocalData.pushParcial(parcial); 
            }).fail(function(response) {
                ons.notification.toast("El parcial no pudo ser creado.", {
                    timeout: 5000
                }); 
            }).always(function() {
                $("#loading-modal-creando-parcial").hide();
            });
        } else {
            LocalData.pushParcial(parcial);
            $("#loading-modal-creando-parcial").hide();
        }
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
        var grupos = LocalData.user.info.grupos;
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
        var escrito = {
            materiaId: 1,
            fecha: Utils.timeSelectorDateToServer(date),
            temas: temas,
            gruposAsignados: grupos
        };

        if(Network.isOnline()) {
            API.createEscrito(escrito).done(function(response) {
                LocalData.pushEscrito(response);
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
        } else {
            LocalData.pushEscrito(escrito);
        }
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
    escrito: null,
    init: function() {
        var data = document.getElementById("nav").topPage.data;
        if(Network.isOnline()) {
            API.getEscrito({
                id: data.id
            }).done(function(response) {
                LocalData.pushEscrito(response);
                DocenteEscritoInfo.escrito = response;
                DocenteEscritoInfo.display();
            }).fail(function() {
                ons.notification.toast("No se pudo mostrar el deber.", { timeout: 5000 });
                Page.back();
            });
        } else {
            DocenteEscritoInfo.escrito = LocalData.getEscrito(data.id);
            if(escrito != null) {
                this.display();
            }
        }
    },
    display: function() {
        var escrito = DocenteEscritoInfo.escrito;
        $("#docente-view-escrito-temas").text(escrito.temas);
        $("#docente-view-escrito-grupos").empty();
        var grupos = escrito.gruposAsignados;
        grupos.forEach(function(grupo) {
            var element = DocenteEscritoInfo.Templates.GrupoListItem(grupo);
            $("#docente-view-escrito-grupos").append(element.html);
        });
    }
};

AlumnoParciales = {
    Templates: {
        ParcialListItem: function(parcial) {
            return {
                html: '<ons-list-item id="parcial-{0}" modifier="chevron" tappable>Parcial {1}</ons-list-item>'.format(parcial.id, Utils.serverDateToLocal(parcial.fecha)),
                id: 'parcial-{0}'.format(parcial.id)
            }
        },
        NoParcialListItem: function(parcial) {
            return {
                html: '<ons-list-item>No tenés parciales próximos.</ons-list-item>',
            }
        }
    },
    parcialesList: [],
    init: function() {
        var spinner = $("#alumno-parciales-spinner");
        spinner.show();
        if(Network.isOnline()) {
            $("#parciales-list").empty();

            // Get the logged docente's parciales
            API.getAlumnoParciales().done(function(response) {
                AlumnoParciales.parcialesList = Parciales.toList(response);
                $("#parciales-list").empty();
                if(Utils.empty(AlumnoParciales.parcialesList)) {
                    $("#parciales-list").prepend(AlumnoParciales.Templates.NoParcialListItem().html);
                } 
                AlumnoParciales.parcialesList.forEach(function(parcial) {
                    var element = AlumnoParciales.Templates.ParcialListItem(parcial);
                    $("#parciales-list").prepend(element.html);
                    $("#" + element.id).click(function() {
                        Pages.docenteViewParcial(parcial);
                    });
                });
                spinner.hide();
            }).fail(function() {
                ons.notification.toast("No se pudieron obtener los parciales.", {timeout:5000});
            }).always(function() {
                spinner.hide();  
            });
        } else {
            AlumnoParciales.parcialesList = Parciales.toList(LocalData.getParciales());
            $("#parciales-list").empty();
            if(Utils.empty(AlumnoParciales.parcialesList)) {
                $("#parciales-list").prepend(AlumnoParciales.Templates.NoParcialListItem(parcial).html);
            } else {
                AlumnoParciales.parcialesList.forEach(function(parcial) {
                    var element = AlumnoParciales.Templates.ParcialListItem(parcial);
                    $("#parciales-list").prepend(element.html);
                    $("#" + element.id).click(function() {
                        Pages.docenteViewParcial(parcial);
                    });
                });
            }
        }
    }
};


Login = {
    Templates: {
        
    },
    init: function() {
        if(!Network.isOnline()) {
            
        }
    },
    enableLogin: function() {
        $("#cedula").prop('disabled', false);
        $("#password").prop('disabled', false);
        $("#login-button").prop('disabled', false);
        $("#login-info").hide();
    },
    disableLogin: function() {
        $("#cedula").prop('disabled', true);
        $("#password").prop('disabled', true);
        $("#login-button").prop('disabled', true);
        $("#login-info").show();
    },
    submit: function() {
        var cedula = $("#cedula").val();
        var password = $("#password").val();
        var loading = $('#loading-modal');
        loading.show();

        if(Utils.empty(cedula)) {
            ons.notification.toast("El campo de cédula no puede estar vacío.", { timeout: 4000 });
        } else if(Utils.empty(password)) {
            ons.notification.toast("El campo de contraseña no puede estar vacío.", { timeout: 4000 });
        } else {
            API.login({
                cedula: cedula,
                password: password
            }).done(function(response) {
                Sigma.saveFCMToken(function(fcmSaveResponse) {
                    for(var i = 0; i < response.roles.length; i++) {
                        switch(response.roles[0]) {
                            case "Docente":
                            Pages.docenteHome();
                            break;
                            case "Alumno":
                            Pages.alumnoHome();
                            break;
                            case "Adscripto":
                            Pages.adscriptoHome();
                            break;
                        }
                    }

                    var loading = $('#loading-modal');
                    loading.hide();
                });
                Sigma.setToken(response.token);
                LocalData.saveUser(response);
            }).fail(function(response) {
                switch(response.status) {
                    case 0:
                    ons.notification.alert("Sigma no se pudo contectar con el servidor.");
                    break;
                    case 403:
                    case 401:
                    ons.notification.alert("Contraseña o cédula inválida.");
                    break;
                    default:
                    ons.notification.alert("Ocurrió un error inesperado.");
                    break;                    
                }
                loading.hide();                
            }).always(function() {
            });
        }
    }
}

AlumnoEscritos = {
    Templates: {
        EscritoListItem: function(escrito) {
            return {
                html: '<ons-list-item id="escrito-{0}" modifier="chevron" tappable>Escrito {1}</ons-list-item>'.format(escrito.id, Utils.serverDateToLocal(escrito.fecha)),
                id: 'escrito-{0}'.format(escrito.id)
            }
        },
        NoEscritoListItem: function() {
            return {
                html: '<ons-list-item>No tenes escritos próximos.</ons-list-item>'
            }
        }
    },
    escritosList: [],
    init: function() {
        $("#alumno-escritos-spinner").show();
        $("#escritos-list").empty();
        if(Network.isOnline()) {
            API.getAlumnoEscritos().done(function(response) {
                LocalData.setEscritos(Escritos.toList(response));
                AlumnoEscritos.escritosList = Escritos.toList(response);
                $("#escritos-list").empty();
                if(Utils.empty(AlumnoEscritos.escritosList)) {
                    $("#escritos-list").prepend(AlumnoEscritos.Templates.NoEscritoListItem().html);
                }
                AlumnoEscritos.escritosList.forEach(function(escrito) {
                    var element = AlumnoEscritos.Templates.EscritoListItem(escrito);
                    $("#escritos-list").prepend(element.html);
                    $("#" + element.id).click(function() {
                        Pages.docenteViewEscrito(escrito);
                    });
                });
                $("#alumno-escritos-spinner").hide();
            });
        } else {
            AlumnoEscritos.escritosList = LocalData.getEscritos();
            $("#escritos-list").empty();
            if(Utils.empty(AlumnoEscritos.escritosList)) {
                $("#escritos-list").prepend(AlumnoEscritos.Templates.NoEscritoListItem().html);
            }
            AlumnoEscritos.escritosList.forEach(function(escrito) {
                var element = AlumnoEscritos.Templates.EscritoListItem(escrito);
                $("#escritos-list").prepend(element.html);
                $("#" + element.id).click(function() {
                    Pages.docenteViewEscrito(escrito);
                });
            });
            $("#alumno-escritos-spinner").hide();
        }
}};

DocenteDeberes = {
    Templates: {
        DeberListItem: function(deber) {
            return {
                html: '<ons-list-item id="deber-{0}-item"><div class="center" tappable id="deber-{0}">{1}<ons-ripple></ons-ripple></div><div class="right" onclick="DocenteDeberes.onDeberDelete({0})" style="padding-left: 20px"><ons-icon icon="trash" tappable></ons-icon><ons-ripple></ons-ripple></div></ons-list-item>'.format(deber.id, deber.contenido),
                id: 'deber-{0}-item'.format(deber.id)
            }
        },
        LSDeberListItem: function(deber) {
            return {
                html: '<ons-list-item id="deber-ls-{0}-item"><div class="center" tappable id="deber-ls-{0}">{1}<ons-ripple></ons-ripple></div><div class="right" onclick="DocenteDeberes.onDeberDelete({0})" style="padding-left: 20px"><ons-icon icon="trash" tappable></ons-icon><ons-ripple></ons-ripple></div></ons-list-item>'.format(deber.id, deber.contenido),
                id: 'deber-ls-{0}-item'.format(deber.id)
            }
        },
        NoDeberListItem: function() {
            return {
                html: '<ons-list-item><ons-icon icon="sad"></ons-icon> No tenés ningun deber creado.</ons-list-item>'
            }  
        }
    },
    showDeberes: function(deberes) {
        for(var i = 0; i < deberes.length; i++) {
            var deber = deberes[i];
            var element = DocenteDeberes.Templates.DeberListItem(deber);
            $("#deberes-list").append(element.html);
            $("#deber-" + deber.id).click(function() {
                var elementId = jQuery(this).attr("id");
                var tokens = elementId.split("-");
                var deberId = tokens[1];
                var deber = LocalData.getDeber(deberId);
                Pages.docenteDeberesEdit(deber);
            });
        }

        if(Utils.empty(deberes)) {
            var element = DocenteDeberes.Templates.NoDeberListItem(deber)
            $("#deberes-list").append(element.html);
        }
    },
    init: function() {
        var modal = $("#docente-deberes-modal");
        modal.show();
        $("#deberes-list").empty();
        if(Network.isOnline()) {
            API.getDocenteDeberes().done(function(deberes) {
                LocalData.saveDeberes(deberes);
                DocenteDeberes.showDeberes(deberes);

                deberes.forEach(function(deber) {
                    API.getAssignedGrupos({
                        deberId: deber.id
                    }).done(function(assignment) {
                        LocalData.assignGrupo(deber.id, assignment.groupId);
                    });
                });
            }).fail(function() {
                ons.notification.toast("Los deberes no se pudieron cargar.", { timeout: 5000 });
            }).always(function() {
                modal.hide();
            });
        } else {
            var deberes = LocalData.getDeberes();
            DocenteDeberes.showDeberes(deberes);     
            modal.hide();
        }
    },
    onDeberDelete: function(deberId) {
        ons.notification.confirm({
            message: '¿Estás seguro de que querés eliminar esta tarea?',
            callback: function(idx) {  
                if(idx === 1) {
                    var modal = $("#docente-deberes-modal-delete");
                    modal.show();
                    if(Network.isOnline()) {
                        API.deleteDeber({
                            id: deberId
                        }).done(function() {
                            $("#deber-" + deberId + "-item").remove();
                            LocalData.deleteDeber(deberId);
                            ons.notification.toast("La tarea ha sido eliminada.", { timeout: 2000 });
                        }).fail(function() {
                            ons.notification.toast("La tarea no pudo ser eliminada.", { timeout: 5000 });
                        }).always(function() {
                            modal.hide();
                        });
                    } else {
                        $("#deber-" + deberId + "-item").remove();
                        LocalData.deleteDeber(deberId);
                        ons.notification.toast("La tarea ha sido eliminada.", { timeout: 2000 });
                        modal.hide();
                    }
                }
            },
            error: function(idx) {
                // ?
            },
            buttonLabels: ["Cancelar", "Si"]
        });
    }
};

DocenteDeberesCreate = {
    Templates: {
        ImageItem: function(imageUrl) {
            var id = DocenteDeberesCreate.images.length;
            var elementId = "thumbnail-" + id;
            return {
                html: '<div class="thumbnail deber-thumbnail" id="{1}"><div class="close-button" onclick="DocenteDeberesCreate.removePhoto({2}, \'{1}\')"><ion-icon name="close-circle"></ion-icon><ons-ripple><ons-ripple></div><div style="width: 100%; height: 100%;"><img class="deber-image" src="{0}" /><ons-ripple><ons-ripple></div></div>'.format(imageUrl, elementId, id),
                id: elementId
            };
        }
    },
    images: [],
    init: function() {
        DocenteDeberesCreate.images = [];
    },
    onTakePhoto: function() {
        Sigma.openCamera(DocenteDeberesCreate.processNewImage);
    },
    onAddPhoto: function() {
        Sigma.openFilePicker(DocenteDeberesCreate.processNewImage);
    },
    removePhoto: function(imageId, elementId) {
        ons.notification.confirm({
            message: '¿Estás seguro de que querés eliminar esta imágen?',
            callback: function(idx) {  
                if(idx === 1) {
                    var index = imageId - 1;
                    DocenteDeberesCreate.images.splice(index, 1);
                    $("#" + elementId).remove();
                    ons.notification.toast("La imágen ha sido eliminada.", { timeout: 2000 });
                }
            },
            error: function(idx) {
                // ?
            },
            buttonLabels: ["Cancelar", "Si"]
        });
    },
    processNewImage: function(imageUri) {
        DocenteDeberesCreate.images.push(imageUri);
        var template = DocenteDeberesCreate.Templates.ImageItem(imageUri);
        $('#thumbnail-list').prepend(template.html); 
        $("#" + template.id + " > div > img").click(function() {
          PhotoViewer.show($(this)[0].src, 'Imagen asociada');
        });
    },
    submit: function() {
        var images = DocenteDeberesCreate.images;
        var modal = $("#loading-modal-creando-tarea");
        var contenido = $("#contenido").val();
        if(Utils.empty(contenido)) {
            ons.notification.toast("Te faltó escribir la consigna.", { timeout: 5000 });
        } else {
            modal.show()
            if(Network.isOnline()) {
                API._saveImages({
                    images: images,
                    callback: function(info) {
                        API.saveDeber({
                            contenido: contenido,
                            imageIds: info.imageIds
                        }).done(function(response) {
                            response.tarea.asignaciones = [];
                            LocalData.pushDeber(response.tarea);
                            Pages.docenteDeberesEditAfterCreate({
                                id: response.tarea.id,
                                imageIds: response.tarea.imageIds,
                                contenido: contenido
                            });
                        }).fail(function() {
                            ons.notification.toast('La tarea no pudo ser creada.', { timeout: 5000 });
                        }).always(function() {
                            modal.hide();  
                        });
                    }
                });
            } else {
                var lsId = LocalData.pushDeber({
                    contenido: contenido,
                    imagesUrl: images,
                    asignaciones: [],
                });

                Pages.docenteDeberesEditAfterCreate({
                    lsId: lsId,
                    imagesUrl: images,
                    contenido: contenido,
                    asignaaciones: []
                });
                
                modal.hide();
            }
        }
    }
};

document.addEventListener('show', function() {
    if(event.target.matches("#docente-deberes")) {
        DocenteDeberes.init();
    } else if(event.target.matches("#adscriptos-encuestas")) {
        AdscriptoEncuestas.init();
    }
}, false);

DocenteDeberesEdit = {
    Templates: {
        GroupItem: function(group) {
            var elementId = "group-" + group.id;
            return {
                html: '<div class="thumbnail deber-thumbnail" id="{1}"><div class="close-button" onclick="DocenteDeberesCreate.removePhoto({2}, \'{1}\')"><ion-icon name="close-circle"></ion-icon><ons-ripple><ons-ripple></div><div style="width: 100%; height: 100%;"><img class="deber-image" src="{0}" /><ons-ripple><ons-ripple></div></div>'.format(imageUrl, elementId, id),
                id: elementId
            };
        },
        ImageItem: function(imageUrl) {
            var id = DocenteDeberesCreate.images.length;
            var elementId = "thumbnail-" + id;
            return {
                html: '<div class="thumbnail deber-thumbnail" id="{1}"><div class="close-button" onclick="DocenteDeberesCreate.removePhoto({2}, \'{1}\')"><ion-icon name="close-circle"></ion-icon><ons-ripple><ons-ripple></div><div style="width: 100%; height: 100%;"><img class="deber-image" src="{0}" /><ons-ripple><ons-ripple></div></div>'.format(imageUrl, elementId, id),
                id: elementId
            };
        },
        NoImageItem: function() {
            return {
                html: '<ons-list-item>No tenés imágenes asociadas a este deber.</ons-list-item>'
            };
        },
        NoImgImageItem: function() {
            var id = DocenteDeberesCreate.images.length;
            return {
                html: '<div class="thumbnail deber-noimg-thumbnail center-container"><ons-icon icon="close" class="thumbnail-baby" tappable style="font-size: 50px"></ons-icon><ons-ripple><ons-ripple></div>',
            };
        }
    },
    deber: {},
    images: [],
    downloadingImages: [],
    showGrupos: [],
    isDownloading: function(imageId) {
        return this.downloadingImages.includes(imageId);
    },
    finishDownloading: function(imageId) {
        this.downloadingImages.splice(this.downloadingImages.indexOf(imageId), 1);
    },
    init: function() {
        var data = document.getElementById("nav").topPage.data;
        if(data != null) {
            DocenteDeberesEdit.deber = data;
        } else {
            data = DocenteDeberesEdit.deber;
        }
        var defs = [];
        $("#img-real-list").empty();
        $("#info-deber-consigna").text(data.contenido);
        $("#ons-list-images").hide();
        if(Utils.empty(data.imageIds) && Utils.empty(data.imagesUrl)) {
            $("#ons-list-images").hide();
        } else {
            if(Network.isOnline()) {
                data.imageIds.forEach(function(imageId) {
                    var def = $.Deferred();
                    if(!DocenteDeberesEdit.isDownloading(imageId)) {
                        DocenteDeberesEdit.downloadingImages.push(imageId);
                        API._downloadImage({
                        imageId: imageId,
                        deberId: DocenteDeberesEdit.deber.id,
                        success: function(src, deberId, imageId) {
                            // Prevent images showing up in other deberes when switching through them quickly.
                            if(DocenteDeberesEdit.deber.id != deberId) {
                                return;
                            }
                            
                            var imageAppendedCount = $("#thumbnail-list").children().length;
                            if(imageAppendedCount >= DocenteDeberesEdit.deber.imageIds.length) {
                                DocenteDeberesEdit.finishDownloading(imageId);
                                return;
                            }
                            
                            var xhr = new XMLHttpRequest;
                            xhr.responseType = 'blob';
        
                            xhr.onload = function() {
                                var recoveredBlob = xhr.response;
        
                                var reader = new FileReader;
        
                                reader.onload = function() {
                                    var blobAsDataUrl = reader.result;
                                    $("#thumbnail-list").prepend(DocenteDeberesEdit.Templates.ImageItem(blobAsDataUrl).html);
                                    DocenteDeberesEdit.finishDownloading(imageId);
                                    def.resolve();
                                };
                                
                                reader.readAsDataURL(recoveredBlob);
                            };
                            
                            xhr.open('GET', src);
                            xhr.send();
                        }
                        });
                     }
                    defs.push(def.promise());
                });
            } else {
                this.showImagesOffline(data);
            }
        }


        if(!Utils.empty(defs)) {
            $.when.apply($, defs).then(function() {
                $(".deber-thumbnail > div > img").click(function() {
                    PhotoViewer.show($(this).attr('src'), 'Imagen asociada');
                });

                if(Network.isOnline()) {
                    $("#ons-list-images").show();
                }
            });
        }

        $("#table-grupos-asignados").hide();        
        $("#grupos-asignados").empty();
        if(Network.isOnline()) {
            API.getAssignedGrupos({
                deberId: data.id
            }).done(function(response) {
                var assignments = response.assignments;
                 $("#grupos-asignados").empty();
                LocalData.emptyAssignments(data.id);
                for(var i = 0; i < assignments.length; i++) {
                    var assignment = assignments[i];
                    var grupo = LocalData.getGrupo(assignment.groupId);
                    LocalData.assignGrupo(data.id, assignment.groupId, assignment.deadline);
                    $("#grupos-asignados").append("<tr><td>{0}</td><td>{1}</td></tr>".format(Sigma.toGroupName(grupo.grado, grupo.numero), Sigma.serverDateToLocal(assignment.deadline)));

                }
                
                if(Utils.empty(assignments)) {
                    $("#grupos-asignados").append("<tr><td colspan='2'>No existen grupos asignados.</td></tr>");                
                }
            }).fail(function() {
                ons.notification.toast("No se pudieron cargar los grupos.", { timeout: 5000});
                $("#grupos-asignados").append("<tr><td colspan='2'>No se pudieron cargar los grupos.</td></tr>");                
            }).always(function() {
                $("#table-grupos-asignados").show();  
            });
        } else {
            this.showAssignmentsOffline(data);
        }
    },
    showImagesOffline: function(data) {
        if(!Utils.empty(data.imagesUrl)) {
            data.imagesUrl.forEach(function(imageUrl) {
                var element = DocenteDeberesEdit.Templates.ImageItem(imageUrl);
                $("#thumbnail-list").prepend(element.html);
                $(".deber-thumbnail > div > img").click(function() {
                    PhotoViewer.show($(this).attr('src'), 'Imagen asociada');
                });
            });
            $("#ons-list-images").show();
        } else {
            $("#thumbnail-list").empty();
            if(!Utils.empty(data.imageIds)) {
                for(var i = 0; i < data.imageIds.length; i++) {
                    var element = DocenteDeberesEdit.Templates.NoImgImageItem();
                    $("#thumbnail-list").prepend(element.html);
                    $("#ons-list-images").show();
                }
                $(".deber-noimg-thumbnail").click(function() {
                    ons.notification.alert({
                        message: 'Esta imágen no pudo ser mostrada debido a que no la tenés descargada. Conectate a internet para poder verla.',
                        title: "Alerta",
                        buttonLabels: ["Ok"]
                    });
                });
            }
        }
    },
    showAssignmentsOffline: function(data) {
        var assignments = LocalData.getAssignments(data.id);
        $("#grupos-asignados").empty();
        
        if(!Utils.empty(assignments)) {
            for(var i = 0; i < assignments.length; i++) {
                var assignment = assignments[i];
                for(var j = 0; j < assignment.groupIds.length; j++) {
                    var grupo = LocalData.getGrupo(assignment.groupIds[j]);
                    $("#grupos-asignados").append("<tr><td>{0}</td><td>{1}</td></tr>".format(Sigma.toGroupName(grupo.grado, grupo.numero), assignment.deadline));
                }
            }
        } else {
            $("#grupos-asignados").append("<tr><td colspan='2'>No existen grupos asignados.</td></tr>");      
        }
        $("#table-grupos-asignados").show();  
    },
    goToAssignDeber: function() {
        Pages.docenteDeberesAssign(document.getElementById("nav").topPage.data.id);
    },
    submit: function() {

    }
};

var initialized = false;
document.addEventListener("init", function(e) {
    if(e.target.matches("#docente-deberes-edit")) {
        DocenteDeberesEdit.init();
        initialized = true;
    } 
});

document.addEventListener("show", function(e) {
    if(e.target.matches("#docente-deberes-edit") && !initialized) {
        DocenteDeberesEdit.init();
    } 
});


DocenteDeberesAssign = {
    Templates: {

    },
    init: function() {
        $("#docente-deberes-assign").css("background", "#ffffff");
        for(var i = 0; i < LocalData.user.info.grupos.length; i++) {
            var grupo = LocalData.user.info.grupos[i];
            $("#grupos-list").prepend('<ons-list-item id="grupo-{0}" tappable><label class="left"><ons-checkbox name="grupos[]" input-id="grupo-{0}-assign"></ons-checkbox></label><label for="grupo-{0}-assign">{1}</label></ons-list-item>'.format(grupo.id, Sigma.toGroupName(grupo.grado, grupo.numero)));
        }
    },
    submit: function() {
        var deberId = document.getElementById("nav").topPage.data.deberId;
        var deadline = Sigma.toLocalized($("#docente-deberes-date").val());
        var groups = [];
        
        $("ons-checkbox[name='grupos[]']").each(function ()
        {
            var element = $(this);
            if(element[0].checked) {
                var elementID = element.attr('input-id');
                var tokens = elementID.split('-');
                var groupID = tokens[1];
                groups.push(parseInt(groupID));
            }
        });
        
        if(Utils.empty(groups)) {
            ons.notification.toast("No has elegido ningun grupo para asignar al deber.", {timeout: 5000});
            return;
        } else if(Utils.empty(deadline)) {
            ons.notification.toast("No has elegido ninguna fecha de entrega.", {timeout: 5000});
            return;
        } else if(new Date(deadline) < new Date()) {
            ons.notification.toast("La fecha de entrega tiene que ser en el futuro.", {timeout: 5000});
            return;
        }
        
        var asignacion = {
            groupIds: groups,
            deadline: deadline,
            deberId: deberId,
        };

        DocenteDeberesAssign.deber = LocalData.getDeber(deberId);
        $("#loading-modal-asignando-tarea").show();
        if(Network.isOnline()) {
            API.assignDeberToGroups(asignacion).done(function() {
                DocenteDeberesEdit.deber = LocalData.getDeber(deberId);
                for(var i =0; i < groupIds.length; i++) {
                    LocalData.assignGrupo(deberId, groupIds[i], deadline);
                }
                initialized = false;
                Page.back();
            }).fail(function() {
                ons.notification.toast('No se pudo asignar el deber.', {timeout:5000});  
            }).always(function() {
                $("#loading-modal-asignando-tarea").hide();            
            });
        } else {
            Pages.docenteDeberesEdit(DocenteDeberesAssign.deber, true);
        }

        LocalData.pushAsignacion(asignacion);
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
        Page.pushPage("docente-parciales.html", {
            callback: function() {
                DocenteParciales.init();
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
    docenteDeberes: function() {
        Page.pushPage('docente-deberes.html', {
            callback: function() {
            }
        });
    },
    docenteDeberesEdit: function(deber) {
        document.querySelector("#nav").pushPage("docente-deberes-edit.html", {
            data: deber
        });
    },
    docenteDeberesEditAfterCreate: function(deber) {
        document.querySelector("#nav").replacePage("docente-deberes-edit.html", {
            data: deber
        });
    },
    docenteDeberesAssign: function(deberId) {
        document.querySelector('#nav').pushPage('docente-deberes-assign.html', options = {
            animation: 'lift',
            data: {
              deberId: deberId,
              deber: document.getElementById("nav").topPage.data
            },
            callback: function() {
                DocenteDeberesAssign.init();
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
    docenteDeberesCreate: function() {
        Page.pushPage('docente-deberes-create.html', {
            callback: function() {
                DocenteDeberesCreate.init();
            },
            animation: 'lift'
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
    },
    alumnoHome: function() {
        Page.replacePage('alumno-home.html');
    },
    docenteHome: function() {
        Page.replacePage('docente-home.html');
    },
    login: function() {
        Page.replacePage('login.html');
    },
    docenteDeberesEdit: function(deber, replace) {
        if(replace === false || replace == null) {
            Page.pushPage('docente-deberes-edit.html', {
                data: deber,
                callback: function() {
                    DocenteDeberesEdit.init();  
                } 
            });
        } else {
            Page.back({
                callback: function() {
                    Page.replacePage('docente-deberes-edit.html', {
                        data: deber,
                        callback: function() {
                            DocenteDeberesEdit.init();   
                        }
                    });
                }
            });
        }
    },
    adscriptoEncuestas: function() {
        Page.pushPage('adscripto-encuestas.html', {
            callback: function() {
            }
        });
    },
    adscriptoHome: function() {
        Page.replacePage('adscripto-home.html');
    },
    adscriptoEncuestaCreate: function() {
        Page.pushPage('adscripto-encuestas-create.html', {
            callback: function() {
                AdscriptoEncuestaCreate.init();
            }
        });
    },
    adscriptoEncuestaStats: function() {
        Page.pushPage('adscripto-encuesta-stats.html', {
            callback: function() {
                AdscriptoEncuestaStats.init();
            }
        });
    },
    showConfigPregunta: function() {
        Page.pushPage('adscripto-encuestas-create-pregunta.html', {
            callback: function() {
                AdscriptoEncuestaPregunta.init();
            }
        });
    },
    showConfigPreguntaEdit: function(pregunta) {
        AdscriptoEncuestaPregunta.editionMode(pregunta);
        Page.pushPage('adscripto-encuestas-create-pregunta.html', {
            callback: function() {
                AdscriptoEncuestaPregunta.init();
            }
        });
    }
};