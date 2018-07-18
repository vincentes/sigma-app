// Objects
SigmaLocalStorage = {
  setToken: function (token) {
    window.localStorage.setItem("sigma_token", token);
  },
  getToken: function (token) {
    return window.localStorage.getItem("sigma_token");
  },
  removeToken: function(token) {
    return window.localStorage.setItem("sigma_token", null);
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
      for(var i = 0; i < response.roles.length; i++) {
        switch(response.roles[i]) {
          case "Docente":
          SigmaLocalStorage.setToken(response.token);
          document.querySelector('#nav').replacePage('docente-home.html');
          loading.hide();
          break;
        }
      }
    },
    "error": function (response) {
      ons.notification.alert({
        title: 'Atención!',
        message: 'Cédula o contraseña incorrecta.'
      });
      loading.hide();
    }
  }

  $.ajax(settings);
}

function logout() {
  ons.notification.confirm({
    message: '¿Estás seguro de que querés cerrar sesión?',
    callback: function(idx) {
      if(idx === 1) {
        SigmaLocalStorage.removeToken();
        document.querySelector('#nav').replacePage('login.html'); 
      }
    },
    buttonLabels: ["Cancelar", "Si"]
  })
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
