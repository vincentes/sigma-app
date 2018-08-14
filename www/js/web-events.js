document.addEventListener('init', function () {
    $(".deber-thumbnail img").click(function(targ) {
        PhotoViewer.show($(this).attr('src'), 'Imagen asociada');
    });
}, false);

document.addEventListener('init', function(event) {
    if (event.target.matches('#docente-deberes')) {
        Deber.display();
    } else if (event.target.matches('#docente-deberes-edit')) {
        var data = document.getElementById("nav").topPage.data;
        $("#info-deber-consigna").text(data.content);
        for(var i = 0; i < data.imagesURL.length; i++) {
            $("#thumbnail-list").prepend('<div class="thumbnail deber-thumbnail"><img class="deber-image" src="{0}"></img><ons-ripple><ons-ripple></div>'.format(data.imagesURL[i]));
        }
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