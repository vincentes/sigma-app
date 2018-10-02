ons.ready(function() {
    loadData();
    LocalData.loadEverything();
    if(!Utils.empty(LocalData.user)) {
      switch(LocalData.user.roles[0]) {
          case "Docente":
          Pages.docenteHome();
          break;
          case "Alumno":
          Pages.alumnoHome();
          break;
          case "Adscripto":
          Pages.adscriptoHome();
      }
    } else {
        Pages.login();
    }
    ons.disableDeviceBackButtonHandler();
});

function navBack(e) {
    var nav = document.getElementById("nav");
    if(nav.topPage.id === 'adscripto-encuestas-create') {
        if(!AdscriptoEncuestaCreate.exiting) {
            AdscriptoEncuestaCreate.confirmExit();
        }
        e.preventDefault();
    } else if(nav.topPage.id === 'docente-deberes-edit') {
        DocenteDeberes.init();
        nav.popPage();
    } else {
        nav.popPage();
    }
}

document.addEventListener("backbutton", function(e){
    navBack(e);
 }, false);

document.addEventListener('init', function(event) {
    if(event.target.matches('#alumno-deberes')) {
        Alumno.deberes = [];
        $("#alumno-deberes-spinner").show();
        Network.updateConnection(function() {
            if(Network.isOnline()) {
                Sigma.getAssignedDeberes({
                    success: function(data) {
                      $("#alumno-deberes-spinner").hide();
                      Alumno.deberes = data.deberes;
                      LocalData.saveDeberes(data.deberes);
                      $("#deberes-list").empty();
                      if(Utils.empty(data.deberes)) {
                          var deberes = '<ons-list-item>No tenés ningún deber asignado.</ons-list-item>';
                          $("#deberes-list").append(deberes);
                      }
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
            } else {
                $("#alumno-deberes-spinner").hide();
                Alumno.deberes = LocalData.getDeberes();
                $("#deberes-list").empty();
                if(Utils.empty(Alumno.deberes)) {
                    var deberes = '<ons-list-item>No tenés ningún deber asignado.</ons-list-item>';
                    $("#deberes-list").append(deberes);
                }
                Alumno.deberes.forEach(function(deber) {
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
            }

        });
    } else if(event.target.matches('#login')) {
        if(LocalData.user != null) {
            switch(LocalData.user.roles[0]) {
                case "Docente":
                Pages.docenteHome();
                break;
                case "Alumno":
                Pages.alumnoHome();
                break;
                case "Adscripto":
                Pages.adscriptoHome();
            }

            document.getElementById('testing-enabled').addEventListener('change', function(e) { 
                var enabled = e.switch.checked;
                Sigma.useProductionServer(!enabled);
            });

            var productionServerEnabled = LocalData.productionServerEnabled;
            document.getElementById("testing-enabled").checked = !productionServerEnabled;
        }
    } else if(event.target.matches('#alumno-view-deber')) {
        var data = document.getElementById("nav").topPage.data;
        var defs = [];
        $("#thumbnail-list-c").show();
        $("#info-deber-consigna").text(data.contenido);
        if(!Utils.empty(data.imageIds)) {
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
        } else {
            $("#thumbnail-list-c").hide();
        }
    } else if(event.target.matches('#docente-deberes-assign')) {

    }
}, false);

$(".list-deber-item").click(function(evt) {
    
});

