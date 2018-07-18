// Objects
var localStorage = function () {
};

localStorage.setToken = function (token) {
  window.localStorage.setItem("sigma_token", token);
};

localStorage.getToken = function (token) {
  return window.localStorage.getItem("sigma_token");
};

// Initialize
document.addEventListener('init', function (event) {

}, false);

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

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://204.48.19.107:5000/Account/Login",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache"
    },
    "processData": false,
    "data": '{"CI": "{0}","Password": "{1}"}'.format(cedula, password),
    "success": function (response) {
      document.querySelector('#nav').replacePage('home.html');
      ons.notification.alert({
        title: 'Atención!',
        message: 'Logueado! Tu token es ' + response.token
      })
    },
    "error": function (response) {
      ons.notification.alert({
        title: 'Atención!',
        message: 'Cédula o contraseña incorrecta.'
      });
    }
  }

  $.ajax(settings);
}

/////////// SEBA ////////////////////

function mapa() {
  document.querySelector('#nav').replacePage('mapa.html')
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
