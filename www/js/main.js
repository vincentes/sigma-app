CurrentUser = {
  role: null,
  token: null
};

// Objects
SigmaLS = {
  myDeberes: [],
  userInfo: {},
  currentUser: {},
  saveDeber: function(id, imagesIds, content, imagesURL) {
    SigmaLS.myDeberes.push({
      id: id,
      imagesIds: imagesIds,
      content: content,
      imagesURL: imagesURL
    });
    window.localStorage.setItem("sigma_mydeberes", JSON.stringify(SigmaLS.myDeberes));
  },
  load: function() {
    var lsMyDeberes = JSON.parse(window.localStorage.getItem("sigma_mydeberes"));
    SigmaLS.myDeberes = (lsMyDeberes === null ? [] : lsMyDeberes);
    SigmaLS.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    SigmaLS.currentUser = JSON.parse(window.localStorage.getItem("currentUser"));  
    if(SigmaLS.currentUser !== null) {
      CurrentUser = SigmaLS.currentUser;  
    }
  },
  setUserInfo: function(info) {
    SigmaLS.userInfo = info;
    window.localStorage.setItem("userInfo", JSON.stringify(info));
  },
  save: function() {
    SigmaLS.currentUser = CurrentUser;
    window.localStorage.setItem("currentUser", JSON.stringify(SigmaLS.currentUser));    
  }
};

Deber = {
  imagesURL: [],
  openImagePicker: function() {
    Sigma.openFilePicker(Deber.appendThumbnail);
  },
  openCamera: function() {
    Sigma.openCamera(Deber.appendThumbnail);
  },
  appendThumbnail: function(imageUri) {
    $('#thumbnail-list').prepend('<div class="thumbnail deber-thumbnail"><img class="deber-image" src="{0}"></img><ons-ripple><ons-ripple></div>'.format(imageUri));    
    $(".thumbnail:eq(0) > img").click(function(targ) {
      PhotoViewer.show($(this)[0].src, 'Imagen asociada');
    });
  },
  save: function() {
    Deber.saveImages(function(data) {
      var ids = data.imagesIds;
      var content = $("#contenido").val();
      var request = new XMLHttpRequest();
      request.open('POST', '{0}/Tarea/Post'.format(Sigma.baseUrl));
      request.setRequestHeader("Content-type", "application/json");
      request.setRequestHeader("Authorization", "Bearer {0}".format(Sigma.getToken()));  
      request.onload = function() {
        SigmaLS.saveDeber(JSON.parse(request.response).tarea.id, ids, content, data.imagesURL);
        var loading = document.getElementById('loading-modal-creando-tarea');
        loading.hide();
        document.querySelector('#nav'). replacePage("docente-deberes-edit.html", {
          data: SigmaLS.myDeberes[SigmaLS.myDeberes.length - 1]
        });
      };
      request.onerror = function() {
        ons.notification.toast('Error ' + request.response, { timeout: 1000 });  
      };
      request.send(JSON.stringify({ "ImageIds": ids,  "MateriaId": 1, "Contenido": content }));
    });
  },
  saveImages: function(fn) {
    var loading = document.getElementById('loading-modal-creando-tarea');
    loading.show();
    
    console.log("Ok, going to upload "+ Deber.imagesURL.length + " images.");
    var defs = [];

    var fd = new FormData();
    Deber.imagesURL.forEach(function(i) {
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
            fd.append('file' + (Deber.imagesURL.indexOf(i) + 1), imgBlob);
            fd.append('fileName' + (Deber.imagesURL.indexOf(i) + 1), file.name);
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
        var data = JSON.parse(request.response);
        fn({
          content: data.content,
          id: data.id,
          imagesIds: data.ids,
          imagesURL: Deber.imagesURL
        });
      };
      request.onerror = function() {
      };
      request.send(fd);
    });

  },
  display: function() {
    $("#deberes-list").html("");
    var deberes = "";
    for(var i = SigmaLS.myDeberes.length - 1; i >= 0; i--) {
      deberes += ('<ons-list-item id="tarea-{1}" modifier="chevron" tappable>{0}</ons-list-item>'.format(SigmaLS.myDeberes[i].content, SigmaLS.myDeberes[i].id));
    }

    $("#deberes-list").append(deberes);
    for(var i = 0; i < SigmaLS.myDeberes.length; i++) {
      $("#tarea-" + SigmaLS.myDeberes[i].id).click(function(evt) {
        var elementId = jQuery(this).attr("id");
        var tokens = elementId.split("-");
        var tareaId = tokens[1];
        var tarea = null;
        for(var j = 0; j < SigmaLS.myDeberes.length; j++) {
          if(SigmaLS.myDeberes[j].id == tareaId) {
            tarea = SigmaLS.myDeberes[j];
          }
        }
        document.querySelector("#nav").pushPage("docente-deberes-edit.html", {
          data: tarea
        });
      });
    }
  },
  reset: function() {
    images = [];
  }
}

Sigma = {
  baseUrl: "http://204.48.19.107:5000",
  productionServerEnabled: false,
  useProductionServer: function(enable) {
    if(enable) {
      this.baseUrl = "http://204.48.19.107:5000";
      this.productionServerEnabled = true;
    } else {
      this.baseUrl = "http://192.168.1.110:45455";
      this.productionServerEnabled = false;
    }
    LocalData.setProductionServerEnabled(enable);
  },
  setToken: function (token) {
    window.localStorage.setItem("sigma_token", token);
  },
  getToken: function () {
    return window.localStorage.getItem("sigma_token");
  },
  removeToken: function(token) {
    return window.localStorage.setItem("sigma_token", null);
  },
  setOptions: function(srcType) {
      var options = {
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: srcType,
          encodingType: Camera.EncodingType.JPEG,
          mediaType: Camera.MediaType.PICTURE,
          allowEdit: false,
          correctOrientation: true
      }
      return options;
  },
  openCamera: function openCamera(fn) {
    var srcType = Camera.PictureSourceType.CAMERA;
    var options = Sigma.setOptions(srcType);

    navigator.camera.getPicture(fn, function cameraError(error) {
    }, options);
  },
  openFilePicker: function(fn) {
    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = Sigma.setOptions(srcType);

    navigator.camera.getPicture(fn, function cameraError(error) {
    }, options);
  },
  saveFCMToken: function(success, error) {
    FCMPlugin.getToken(function(token) {
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "{0}/Notification/SaveToken".format(Sigma.baseUrl),
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Authorization": "Bearer {0}".format(Sigma.getToken())
        },
        "processData": false,
        "data": '{"Token": "{0}"}'.format(token),
        "success": function (response) {
          success(response);
        },
        "error": function (response) {
          if(response.status) {
            success(response);
          } else {
            error(response);
          }
        }
      };
      $.ajax(settings);
      
      FCMPlugin.onNotification(function(data) {
        ons.notification.toast('Push notification received. ' + name, { timeout: 2000 });          
      });
    });
  },
  toGroupName: function(grado, numero) {
    var dGrado;
    switch(grado) {
      case 1:
        dGrado = 4;
        break;
      case 2:
        dGrado = 5;
        break;
      case 3:
        dGrado = 6;
        break;
    }
    return "{0}º{1}".format(dGrado, numero);
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
      "data": '{"CI": "{0}","Password": "{1}"}'.format(args.cedula,  args.password),
      "success": function (response) {
        args.success(response);
      },
      "error": function (response) {
        args.error(response);
      }
    }
  
    $.ajax(settings);
  },
  docenteInfo: function(args) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "{0}/Docente/GetInfo".format(Sigma.baseUrl),
      "method": "GET",
      "headers": {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Authorization": "Bearer {0}".format(Sigma.getToken())
      },
      "processData": false,
      "success": function (response) {
        args.success(response);
      },
      "error": function (response) {
        args.error(response);
      }
    }
    $.ajax(settings);
  },
  assignDeberToGroups: function(args) {
    return $.ajax(API.Configs.assignDeberToGroups(args));
  },
  serverDateToLocal: function(date) {
    var tokens = date.split('-');
    var year = tokens[0];
    var month = tokens[1];
    var day = tokens[2].split('T')[0];
    return "{0}/{1}/{2}".format(day, month, year);
  },
  toLocalized: function(date) {
    if(date == null || Utils.empty(date)) {
      return undefined;
    }
    var tokens = date.split('-');
    var year = tokens[0];
    var month = tokens[1];
    var day = tokens[2];
    return "{0}/{1}/{2}".format(month, day, year);
  },
  getAssignedGrupos: function(args) {   
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "{0}/Tarea/GetAssignedGrupos/{1}".format(Sigma.baseUrl, args.deberId),
      "method": "GET",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer {0}".format(Sigma.getToken()),
        "Cache-Control": "no-cache",
      },
      "success": function(response) {
        args.success(response);
      },
      "error": function(response) {
        args.error(response);
      }
    }
    
    $.ajax(settings);
  },
  getAssignedDeberes: function(args) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "{0}/Tarea/GetAssignedDeberes".format(Sigma.baseUrl),
      "method": "GET",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer {0}".format(Sigma.getToken()),
        "Cache-Control": "no-cache",
      },
      "success": function(data) {
        args.success(data);
      },
      "error": function(data) {
        args.error(data)
      }
    }
    
    $.ajax(settings);
  },
  downloadImages: function(args) {
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
          args.success(src);
      },
      error:function(){
          args.error();
      }
    });
  }
};


// Extension methods
if (!String.prototype.format) {
  String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };
}

// Button actions
function login() {
  var cedula = document.getElementById('cedula').value;
  var password = document.getElementById('password').value;
  
  var loading = document.getElementById('loading-modal');
  loading.show();

  Sigma.login({
    cedula: cedula,
    password: password,
    success: function(response) {
      CurrentUser.token = response.token;
      CurrentUser.role = response.roles[0];
      Sigma.setToken(response.token);
      Sigma.saveFCMToken(function(fcmSaveResponse) {
        for(var i = 0; i < response.roles.length; i++) {
          switch(response.roles[i]) {
            case "Docente":
            document.querySelector('#nav').replacePage('docente-home.html');
              loading.hide();
              break;
            case "Alumno":
              document.querySelector('#nav').replacePage('alumno-home.html');
              loading.hide();
              break;
          }
          SigmaLS.save();
        }
      });

      Sigma.docenteInfo({
        success: function(response) {
          SigmaLS.setUserInfo(response);
        },
        error: function(response) {
          SigmaLS.setUserInfo(response);
        }
      });
    },
    error: function(response) {
        Sigma.removeToken();
        serverError();
        loading.hide();
    }
  });
}

function serverError() {
  ons.notification.alert({
    title: 'Atención!',
    message: 'Sigma no se pudo conectar con el servidor.'
  });
}

function logout() {
  ons.notification.confirm({
    title: 'Confirmar',
    message: '¿Estás seguro de que querés cerrar sesión?',
    callback: function(idx) {
      if(idx === 1) {
        API.deleteFCMToken().done(function() {
          
        });
        Sigma.removeToken();
        LocalData.logout();
        LocalData.emptyQueue();
        Page.replacePage('login.html', {
          animation: 'fade'
        }); 
      }
    },
    buttonLabels: ["Cancelar", "Si"]
  });
}

function loadData() {
  console.log("loading sigmals");
  SigmaLS.load();
}

function checkLogin() {
  var page = document.querySelector('#nav').topPage.id;
  var hasToken = Sigma.getToken() !== 'null';
  console.log("a");  
  if(page !== "login") {
    console.log("b");
    if(!hasToken) {
      document.querySelector('#nav').replacePage('login.html', options = {
        animation: "fade"
      });
    } else {
      console.log(CurrentUser.role);
      switch(CurrentUser.role) {
        case "Docente":
          document.querySelector('#nav').replacePage('docente-home.html');    
          break;
        case "Alumno":
          document.querySelector('#nav').replacePage('alumno-home.html');    
          break;
      }
    } 
  } else {
    console.log("c");
    if(hasToken) {
      console.log(CurrentUser.role);
      switch(CurrentUser.role) {
        case "Docente":
          document.querySelector('#nav').replacePage('docente-home.html', options = {animation: 'none'});    
          break;
        case "Alumno":
          document.querySelector('#nav').replacePage('alumno-home.html', options = {animation: 'none'});    
          break;
      }
    }
  }
}

function deberes() {
  document.querySelector('#nav').pushPage('docente-deberes.html');
}

function back(_callback) {
  var deber = document.getElementById("nav").topPage.data.deber;
  document.querySelector('#nav').popPage({
    callback: function() {
      if(!Utils.empty(_callback)) {
        _callback();
      }
    },
    data: deber
  });  
}

function createDeber() {
  document.querySelector('#nav').pushPage('docente-deberes-create.html', options = {
    animation: 'lift'
  })  
}

function asignarTarea() {
  document.querySelector('#nav').pushPage('docente-deberes-assign.html', options = {
    animation: 'lift',
    data: {
      deberId: document.getElementById("nav").topPage.data.id
    }
  });
}

AlumnoPage = {
  deberes: {},
  misDeberes: function() {
    $("#deberes-list").empty();
    AlumnoPage.deberes = {};
    document.getElementById("nav").pushPage("alumno-deberes.html"); 
  }
}

/////////// SEBA ////////////////////
var periodoScan = null;
var centrarMapa = false;



function mapa() {
  document.querySelector('#nav').pushPage('mapa.html')
}

function mapaControl() {
  document.querySelector('#nav').replacePage('mapaControl.html')
}


///Show / Hide Modal's
function showModal(_modalId) {
  var _modalId
  try {
    var _modal = document.getElementById(_modalId);
    _modal.show();

  }
  catch{ alert("Atención Error al abrir el modal"); }

}

function hideModal(_modalId) {
  var _modalId
  try {
    var _modal = document.getElementById(_modalId);
    _modal.hide();
  }
  catch{ alert("Atención error al cerrar el modal"); }


}


/*
       <button onclick="myVar = setInterval(myFunction, 1000)">Try it</button>
   
   <button onclick="clearTimeout(myVar)">Stop it</button>
   */



//Scan Onsen
function scanOnsen() {
  try {
    if (periodoScan === null) {
      periodoScan = setInterval(function () {
        WifiWizard.startScan(scanOK, scanFail);
      }, 2000);
    } else {
      console.log("Atención - Ya se inició el scan");
    }

  }
  catch (err) {
    toastOns('Atención!', "Plugin Error - " + err.message);
  }
}

function detenerScan() {
  if (periodoScan !== null) {
    clearTimeout(periodoScan);
    periodoScan = null;
    avisadoGPS = 0;
  } else {
    console.log("Atención - Ya se detuvo el scan");
  }
}

function centrarMapaPos() {
  if (centrarMapa) {
    actDesCentrarMapa(false);

  } else {

    actDesCentrarMapa(true);

  }
}

function actDesCentrarMapa(_activar) {
  var _activar;
  var _msg = "Activado";
  var _color = "black";
  var _estadoActualCentrado = centrarMapa;

  if (_activar) {
    centrarMapa = true;
    centrarEnPosicion();
  } else {
    centrarMapa = false;
    _color = "lightgray";
    _msg = "Desactivado";
  }

  document.getElementById('fabCentrarMapa').setAttribute("style", "color: " + _color + ";");
  if (_estadoActualCentrado != centrarMapa) {
    toastOns("Centrar mapa", _msg);

  }
}

function acercaDe() {
  ons.notification.alert({
    title: "Información",
    message: "Esta aplicación utiliza la librería Leaflet, por más información visite leafletjs.com"
  });
}