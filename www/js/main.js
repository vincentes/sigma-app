// Objects
SigmaLS = {
  myDeberes: [],
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
      var ids = data.ids;
      var content = $("#contenido").val();
      var request = new XMLHttpRequest();
      request.open('POST', 'http://{0}/Tarea/'.format(Sigma.baseUrl));
      request.setRequestHeader("Content-type", "application/json");
      request.setRequestHeader("Authorization", "Bearer {0}".format(Sigma.getToken()));  
      request.onload = function() {
        SigmaLS.saveDeber(JSON.parse(request.response).tarea.id, ids, content, data.imagesURL);
        var loading = document.getElementById('loading-modal-creando-tarea');
        loading.hide();
        document.querySelector('#nav').replacePage("docente-deberes-edit.html", {
          data: SigmaLS.myDeberes[SigmaLS.myDeberes.length - 1]
        });
      };
      request.onerror = function() {
        ons.notification.toast('Error ' + request.response, { timeout: 1000 });  
      };
      request.send(JSON.stringify({ "ImageIds": ids,  "MateriaId": 10, "Contenido": content }));
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
      request.open('POST', 'http://{0}/Imagen/Upload'.format(Sigma.baseUrl));
      request.setRequestHeader("Authorization", "Bearer {0}".format(Sigma.getToken()));  
      request.onload = function() {
        var data = JSON.parse(request.response);
        data.imagesURL = Deber.imagesURL;
        fn(data);
      };
      request.onerror = function() {
      };
      request.send(fd);
    });

  },
  display: function() {
    $("#deberes-list").html("");
    for(var i = 0; i < SigmaLS.myDeberes.length; i++) {
      $("#deberes-list").prepend('<ons-list-item id="tarea-{1}" modifier="chevron" tappable>{0}</ons-list-item>'.format(SigmaLS.myDeberes[i].content, SigmaLS.myDeberes[i].id));
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
  baseUrl: "204.48.19.107:5000",
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
  openCamera: function openCamera() {
    var srcType = Camera.PictureSourceType.CAMERA;
    var options = Sigma.setOptions(srcType);

    navigator.camera.getPicture(function cameraSuccess(imageUri) {
      Deber.imagesURL.push(imageUri);
      Deber.appendThumbnail(imageUri);
    }, function cameraError(error) {
      ons.notification.toast("Unable to obtain picture: " + error, { timeout: 1000 });
    }, options);
  },
  openFilePicker: function(fn) {
    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = Sigma.setOptions(srcType);

    navigator.camera.getPicture(function cameraSuccess(imageUri) {
      Deber.imagesURL.push(imageUri);
      Deber.appendThumbnail(imageUri);
    }, function cameraError(error) {
        ons.notification.toast("Unable to obtain picture: " + error, { timeout: 1000 });
    }, options);
  },
  saveFCMToken: function(success, error) {
    FCMPlugin.getToken(function(token) {
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://{0}/Notification/SaveToken".format(Sigma.baseUrl),
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Authorization": "Bearer {0}".format(Sigma.getToken())
        },
        "processData": false,
        "data": '{"Token": "{0}"}'.format(token),
        "success": function (response) {
          ons.notification.toast('FCM token saved.', { timeout: 2000 });
          success(response);
        },
        "error": function (response) {
          if(response.status) {
            ons.notification.toast('FCM token save skipped.', { timeout: 2000 });
            success(response);
          } else {
            ons.notification.toast('Error: FCM token not saved.', { timeout: 2000 });
            error(response);
          }
        }
      };
      $.ajax(settings);
      
      FCMPlugin.onNotification(function(data) {
        ons.notification.toast('Push notification received. ' + name, { timeout: 2000 });          
      });
    });
  }
};



ons.ready(function() {
  loadData();
  checkLogin();
});


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
    "data": '{"CI": "{0}","Password": "{1}"}'.format(cedula, password),
    "success": function (response) {
      Sigma.setToken(response.token);
      Sigma.saveFCMToken(function(fcmSaveResponse) {
        for(var i = 0; i < response.roles.length; i++) {
          switch(response.roles[i]) {
            case "Docente":
            document.querySelector('#nav').replacePage('docente-home.html');
            loading.hide();
            break;
          }
        }
      }, function(fcmSaveResponse) {
        Sigma.removeToken();
        serverError();
        loading.hide();
      });
    },
    "error": function (response) {
      if(response.status === 401) {
        ons.notification.alert({
          title: 'Atención!',
          message: 'Cédula o contraseña incorrecta.'
        });
      } else {
        serverError();
      }
      loading.hide();
    }
  }

  $.ajax(settings);
}

function serverError() {
  ons.notification.alert({
    title: 'Atención!',
    message: 'Sigma no se pudo conectar con el servidor.'
  });
}

function logout() {
  ons.notification.confirm({
    message: '¿Estás seguro de que querés cerrar sesión?',
    callback: function(idx) {
      if(idx === 1) {
        Sigma.removeToken();
        document.querySelector('#nav').replacePage('login.html'); 
      }
    },
    error: function(idx) {
      ons.notification.toast('sdpokasdpokasdpokaspod fuck');
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
  if(page !== "login") {
    if(!hasToken) {
      document.querySelector('#nav').replacePage('login.html', options = {
        animation: "fade"
      });
    }
  } else {
    if(hasToken) {
      document.querySelector('#nav').replacePage('docente-home.html');    
    }
  }
}

function deberes() {
  document.querySelector('#nav').pushPage('docente-deberes.html');
}

function back() {
  document.querySelector('#nav').popPage();  
}

function createDeber() {
  document.querySelector('#nav').pushPage('docente-deberes-create.html', options = {
    animation: 'lift'
  })  
}

/////////// SEBA ////////////////////

function mapa() {
  document.querySelector('#nav').pushPage('mapa.html')
}

function mapaControl() {
  document.querySelector('#nav').replacePage('mapaControl.html')
}

//Scan Onsen
function scanOnsen() {
  try {
    WifiWizard.startScan(scanOK, scanFail);

  }
  catch (err) {
    ons.notification.alert({
      title: 'Atención!',
      message: "Plugin Error - " + err.message
    });
   
  }
}
