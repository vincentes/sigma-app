// Objects
Sigma = {
  setToken: function (token) {
    window.localStorage.setItem("sigma_token", token);
  },
  getToken: function () {
    return window.localStorage.getItem("sigma_token");
  },
  removeToken: function(token) {
    return window.localStorage.setItem("sigma_token", null);
  },
  saveFCMToken: function(success, error) {
    FCMPlugin.getToken(function(token) {
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://192.168.1.108:45455/Notification/SaveToken",
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
    "url": "http://192.168.1.108:45455/Account/Login",
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
    buttonLabels: ["Cancelar", "Si"]
  })
}

function checkLogin() {
  var page = document.querySelector('#nav').topPage.id;
  var hasToken = Sigma.getToken() !== 'null';
  if(page !== "login") {
    if(!hasToken) {
      document.querySelector('#nav').replacePage('login.html');    
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
