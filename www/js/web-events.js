document.addEventListener('init', function(event) {
    if (event.target.matches('#docente-deberes')) {
        Deber.display();
    } else if(event.target.matches('#docente-deberes-create')) {
        $(".deber-thumbnail img").click(function(targ) {
            PhotoViewer.show($(this).attr('src'), 'Imagen asociada');
        });
    } else if(event.target.matches('#alumno-deberes')) {
        Alumno.deberes = [];
        Sigma.getAssignedDeberes({
            success: function(data) {
              Alumno.deberes = data.deberes;
              data.deberes.forEach(function(deber) {
                var deberes = "";
                deberes += ('<ons-list-item id="tarea-{1}" modifier="chevron" tappable>{0}</ons-list-item>'.format(deber.contenido, deber.id));
                
                $("#deberes-list").append(deberes);
                $("#tarea-" + deber.id).click(function(evt) {
                  var elementId = jQuery(this).attr("id");
                  var tokens = elementId.split("-");
                  var tareaId = tokens[1];
                  var tarea = null;
                  for(var j = 0; j < Alumno.deberes.length; j++) {
                    if(Alumno.deberes[j].id == tareaId) {
                      tarea = Alumno.deberes[j];
                    }
                  }
        
                  document.querySelector("#nav").pushPage("alumno-view-deber.html", {
                    data: tarea
                  });
                });
              });
            },
            error: function(data) {
  
            }  
        });
    } else if(event.target.matches('#alumno-view-deber')) {
        var data = document.getElementById("nav").topPage.data;
        var defs = [];
        $("#info-deber-consigna").text(data.contenido);
        data.imageIds.forEach(function(imageId) {
            var def = $.Deferred();
            Sigma.downloadImages({
                imageId: imageId,
                success: function(src) {
                    var xhr = new XMLHttpRequest;
                    xhr.responseType = 'blob';

                    xhr.onload = function() {
                        var recoveredBlob = xhr.response;

                        var reader = new FileReader;

                        reader.onload = function() {
                            var blobAsDataUrl = reader.result;
                            $("#thumbnail-list").prepend('<div class="thumbnail deber-thumbnail"><img class="deber-image" src="{0}"></img><ons-ripple><ons-ripple></div>'.format(blobAsDataUrl));
                            def.resolve();
                        };

                        reader.readAsDataURL(recoveredBlob);
                    };

                    xhr.open('GET', src);
                    xhr.send();
                }
            });
            defs.push(def.promise());
        });

        $.when.apply($, defs).then(function() {
            $(".deber-thumbnail img").click(function() {
                PhotoViewer.show($(this).attr('src'), 'Imagen asociada');
            });
        });
    } else if(event.target.matches('#docente-deberes-edit')) {
        var data = document.getElementById("nav").topPage.data;
        var defs = [];
        $("#info-deber-consigna").text(data.content);
        data.imagesIds.forEach(function(imageId) {
            var def = $.Deferred();
            Sigma.downloadImages({
                imageId: imageId,
                success: function(src) {
                    var xhr = new XMLHttpRequest;
                    xhr.responseType = 'blob';

                    xhr.onload = function() {
                        var recoveredBlob = xhr.response;

                        var reader = new FileReader;

                        reader.onload = function() {
                            var blobAsDataUrl = reader.result;
                            $("#thumbnail-list").prepend('<div class="thumbnail deber-thumbnail"><img class="deber-image" src="{0}"></img><ons-ripple><ons-ripple></div>'.format(blobAsDataUrl));
                            def.resolve();
                        };

                        reader.readAsDataURL(recoveredBlob);
                    };

                    xhr.open('GET', src);
                    xhr.send();
                }
            });
            defs.push(def.promise());
        });

        $.when.apply($, defs).then(function() {
            $(".deber-thumbnail img").click(function() {
                PhotoViewer.show($(this).attr('src'), 'Imagen asociada');
            });
        });

        Sigma.getAssignedGrupos({
            deberId: data.id,
            success: function(response) {
                var assignments = response.assignments;
                for(var j = 0; j < SigmaLS.userInfo.grupos.length; j++) {
                    for(var i = 0; i < assignments.length; i++) {
                        var assignment = assignments[i];
                        if(SigmaLS.userInfo.grupos[j].id === assignment.groupId) {
                            var group = SigmaLS.userInfo.grupos[j];
                            $("#grupos-asignados").append("<tr><td>{0}</td><td>{1}</td></tr>".format(Sigma.toGroupName(group.grado, group.numero), Sigma.serverDateToLocal(assignment.deadline)));
                        }
                    }
                }
            },
            error: function(response) {

            }
        });
    } else if(event.target.matches('#docente-deberes-assign')) {
        $("#docente-deberes-assign").css("background", "#ffffff");
        for(var i = 0; i < SigmaLS.userInfo.grupos.length; i++) {
            var grupo = SigmaLS.userInfo.grupos[i];
            $("#grupos-list").prepend('<ons-list-item id="grupo-{0}" tappable><label class="left"><ons-checkbox name="grupos[]" input-id="grupo-{0}-assign"></ons-checkbox></label><label for="grupo-{0}-assign">{1}</label></ons-list-item>'.format(grupo.id, Sigma.toGroupName(grupo.grado, grupo.numero)));
        }

        $("#assign-deber").click(function() {
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
            
            $("#loading-modal-asignando-tarea").show();
            Sigma.assignDeberToGroups({
                groupIds: groups,
                deadline: deadline,
                deberId: deberId,
                success: function(response) {
                    $("#loading-modal-asignando-tarea").hide();  
                    back(function() {
                        var nav = document.getElementById("nav");
                        Sigma.getAssignedGrupos({
                            deberId: nav.topPage.data.id,
                            success: function(response) {
                                var assignments = response.assignments;
                                $("#grupos-asignados").empty();
                                for(var j = 0; j < SigmaLS.userInfo.grupos.length; j++) {
                                    for(var i = 0; i < assignments.length; i++) {
                                        var assignment = assignments[i];
                                        if(SigmaLS.userInfo.grupos[j].id === assignment.groupId) {
                                            var group = SigmaLS.userInfo.grupos[j];
                                            $("#grupos-asignados").append("<tr><td>{0}</td><td>{1}</td></tr>".format(Sigma.toGroupName(group.grado, group.numero), Sigma.serverDateToLocal(assignment.deadline)));
                                        }
                                    }
                                }
                            },
                            error: function(response) {
                    
                            }
                        }); 
                    });
                },
                error: function(response) {
                    $("#loading-modal-asignando-tarea").hide();
                    ons.notification.toast('Error ' + response, { timeout: 1000 });  
                }
            });

            
        });
    }
}, false);

document.addEventListener('show', function(event) {
    if (event.target.matches('#docente-deberes')) {
        Deber.display();
    }
}, false);

$(".list-deber-item").click(function(evt) {
    
});