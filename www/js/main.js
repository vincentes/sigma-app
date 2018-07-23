// Objects
Deber = {
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
    var images = $(".deber-image");
    images.each(function(i, element) {
      ons.notification.toast('Uploading item..', { timeout: 500 });    
      var uri = encodeURI('http://{0}/Imagen/Upload'.format(Sigma.baseUrl));
      var fileUrl = element.src;
      var options = new FileUploadOptions();
      options.chunkedMode = false;
      options.headers = { 'Authorization': 'Bearer {0}'.format(Sigma.getToken()), 'Connection': 'close' };
      options.fileKey = "file";
      options.mimeType = "image/jpeg";
      options.fileName = fileUrl.substr(fileUrl.lastIndexOf('/')+1);

      var success = function(response) {
        console.log(response);
        ons.notification.toast('Image uploaded', { timeout: 1000 });
      }; 

      var error = function(response) {
        console.log(response);
        ons.notification.toast('Error uploading', { timeout: 1000 });
      }

      var ft = new FileTransfer();
      ft.upload(fileUrl, uri, success, error, options);
    });

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
          correctOrientation: true  //Corrects Android orientation quirks
      }
      return options;
  },
  openCamera: function openCamera(fn) {
    var srcType = Camera.PictureSourceType.CAMERA;
    var options = Sigma.setOptions(srcType);

    navigator.camera.getPicture(function cameraSuccess(imageUri) {
        fn(imageUri);
    }, function cameraError(error) {
      ons.notification.toast("Unable to obtain picture: " + error, { timeout: 1000 });
    }, options);
  },
  openFilePicker: function(fn) {
    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = Sigma.setOptions(srcType);

    navigator.camera.getPicture(function cameraSuccess(imageUri) {
      fn(imageUri);
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
