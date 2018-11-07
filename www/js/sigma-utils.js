var Request = {
    addToQueue: function(name, settings) {
        $.ajaxq(name, settings);
    }
};

var Utils = {
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

var Network = {
    online: false,
    callback: function() {

    },
    setOnline: function() {
        Network.online = true;
    },
    setOffline: function() {
        Network.online = false;
    },
    isOnline: function() {
        return Network.online;
    },
    isConnected: function() {
        return $.ajax({
            url:"http://www.google.com/blank.html",
            timeout: 5000,
            type: "GET",
            cache: false
        });
    },
    updateConnection: function(callback) {  
        if(!Utils.empty(callback)) {
            this.callback = callback;
        } else {
            return;
        }
        Network.isConnected().done(function() {
            Network.setOnline();
            LocalData.sync();
        }).fail(function() {
            Network.setOffline();  
        }).always(function() {
            if(!Utils.empty(Network.callback)) {
                Network.callback();
            } else {
                return;
            }
            
            var online = Network.isOnline();
            if(online) {
                $("#modo-sin-internet").css("visibility", "hidden");
                Login.enableLogin();
            } else {
                $("#modo-sin-internet").css("visibility", "visible");     
                Login.disableLogin();
            }
        });
    }
};

function onNetworkChange() {
    Network.updateConnection(function(online) {
    });
}

document.addEventListener('deviceready', function() {
    Network.updateConnection();

    document.addEventListener("online", Network.updateConnection, false);
    
    document.addEventListener("offline", Network.updateConnection, false);

    setInterval(function(){ 
        Network.updateConnection(); 
    });
}, false);

// Local Storage
LocalData = {
    user: null,
    deberes: [],
    encuestas: [],
    images: [],
    responses: [],
    escritos: [],
    devEnabled: false,
    queueName: "sigma_sync",
    queue: [],
    xhrQueue: [],
    parciales: [],
    productionServerEnabled: false,
    resetQueue: function() {
        this.queue = [];
    },
    resetXhrQueue: function() {
        this.xhrQueue = [];
    },
    doAjaxActivities: function() {
        for(var i = 0; i < this.queue.length; i++) {
            var _activity = this.queue[i];
            Request.addToQueue(this.queueName, this.translateMethod(_activity.method, _activity.args));
        }

        this.resetQueue();
    },
    doAjaxActivitiesPostXhr: function() {
        for(var i = 0; i < this.xhrQueue.length; i++) {
            var activity = this.xhrQueue[i];
            if(i === this.xhrQueue.length - 1) {
                // Once the last image is uploaded, start doing all the other stuff.
                activity.args.tmpActivityCallback = function() {
                    this.doAjaxActivities();
                };
            }

            this.xhrTranslateMethod(activity.method, activity.args);
        }
        
        this.resetXhrQueue();
    },
    setDeberes: function(deberes) {
        this.deberes = deberes;

        window.localStorage.setItem("sigma_user_deberes", JSON.stringify(this.deberes));
    },
    setEncuestas: function(encuestas) {
        this.encuestas = encuestas;

        window.localStorage.setItem("sigma_activities_encuestas", JSON.stringify(this.encuestas));
    },
    setParciales: function(parciales) {
        this.parciales = parciales;

        window.localStorage.setItem("sigma_activities_parciales", JSON.stringify(this.parciales));
    },
    setEscritos: function(escritos) {
        this.escritos = escritos;

        window.localStorage.setItem("sigma_activities_escritos", JSON.stringify(this.escritos));
    },
    getParciales: function() {
        return this.parciales;
    },
    getEscritos: function() {
        return this.escritos;
    },
    getEncuestas: function() {
        return this.encuestas;
    },
    getAlerta: function() {
        this.alerta = window.localStorage.getItem("sigma_activities_alerta");
        return this.alerta;
    },
    sync: function() {
        if(Utils.empty(this.xhrQueue)) {
            this.doAjaxActivities();
        } else {
            this.doAjaxActivitiesPostXhr();
        }
    },
    translateMethod: function(method, args) {
        switch(method) {
            case "deleteDeber":
            return API.Configs.deleteDeber(args);
            case "saveDeber":
            return API.Configs.saveDeber(args);
            case "createAsignacion":
            return API.Configs.assignDeberToGroups(args);
            case "createEscrito":
            return API.Configs.createEscrito(args);
            case "createParcial":
            return API.Configs.createParcial(args);
            case "respondEncuesta":
            return API.Configs.respondEncuesta(args);            
        }
    },
    xhrTranslateMethod: function(method, args) {
        switch(method) {
            case "xhrSaveImages":
            API._saveImages(args);
            break;
            case "xhrSaveDeberAfterImages":
            API._saveDeberAfterImages(args);
            break;
        }
    },
    saveQueue: function() {
        window.localStorage.setItem("sigma_activities_queue", JSON.stringify(this.queue));
        window.localStorage.setItem("sigma_activities_xhrQueue", JSON.stringify(this.xhrQueue));
    },
    emptyQueue: function() {
        this.queue = [];
        this.xhrQueue = [];
        this.saveQueue();
    },
    addToQueue: function(method, args) {
        var _args = {
            method: method,
            args: args  
        };

        if(method.startsWith("xhr")) {
            this.xhrQueue.push(_args);
        } else {
            this.queue.push(_args);
        }

        window.localStorage.setItem("sigma_activities_queue", JSON.stringify(this.queue));
        window.localStorage.setItem("sigma_activities_xhrQueue", JSON.stringify(this.xhrQueue));
    },
    saveUser: function(user) {
        window.localStorage.setItem("sigma_user", JSON.stringify(user));
        LocalData.user = user;
    },
    getUser: function(user) {
        return LocalData.user;
    },
    respondEncuesta: function(respond) {
        this.responses.push(respond);
        window.localStorage.setItem("sigma_activities_responses", JSON.stringify(this.responses));
        if(!Network.isOnline()) {
            this.addToQueue("respondEncuesta", respond);
        }
    },
    saveDeberes: function(deberes) {
        window.localStorage.setItem("sigma_activities_deberes", JSON.stringify(deberes));
        if(!Utils.empty(deberes)) {
            LocalData.deberes = deberes;
            for(var i =0; i < this.deberes.length; i++) {
                if(this.deberes[i].assignments == null) {
                    this.deberes[i].assignments = [];
                }
            }
        }
    },
    setAlerta: function(alerta) {
        this.alerta = alerta;
        this.saveAlerta();
    },
    saveAlerta: function() {
        window.localStorage.setItem("sigma_activities_alerta", JSON.stringify(this.alerta));
    },
    deleteDeber: function(deberId) {
        for(var i = 0; i < LocalData.deberes.length; i++) {
            var deber = LocalData.deberes[i];
            if(deber.id == deberId) {
                this.deberes.splice(i, 1);
            }
        }

        if(!Network.isOnline()) {
            this.addToQueue("deleteDeber", { id: deberId });
        }
    },
    getDeber: function(deberId) {
        for(var i = 0; i < LocalData.deberes.length; i++) {
            var deber = LocalData.deberes[i];
            if(deber.id == deberId) {
                return deber;
            }
        }
    },
    getParcial: function(parcialId) {
        for(var i = 0; i < LocalData.parciales.length; i++) {
            var parcial  = LocalData.parciales[i];
            if(parcial.id == parcialId) {
                return parcial;
            }
        }
    },
    getEscrito: function(escritoId) {
        for(var i = 0; i < LocalData.escritos.length; i++) {
            var escrito  = LocalData.escritos[i];
            if(escrito.id == escritoId) {
                return escrito;
            }
        }
    },
    saveImages: function(images) {
        this.images.push(images);
        window.localStorage.setItem("sigma_user_images", JSON.stringify(this.images));
        if(!Network.isOnline()) {
            this.addToQueue("xhrSaveImages", images);
        }
    },
    logout: function() {
        this.user = null;
        this.deberes = [];
        this.encuestas = [];
        this.images = [];
        this.responses = [];
        this.parciales = [];
        window.localStorage.setItem("sigma_user", JSON.stringify(this.user));
        window.localStorage.setItem("sigma_user_images", JSON.stringify(this.images));
        window.localStorage.setItem("sigma_user_deberes", JSON.stringify(this.deberes));
        window.localStorage.setItem("sigma_activities_encuestas", JSON.stringify(this.encuestas));
        window.localStorage.setItem("sigma_activities_responses", JSON.stringify(this.responses));
        window.localStorage.setItem("sigma_activities_parciales", JSON.stringify(this.parciales));
    },
    isAssigned: function(deber, grupoId) {
        for(var j= 0; j < deber.assignments.length; j++) {
            var a = deber.assignments[j];
            if(a == null) {
                continue;
            }
            
            if(a.groups != null) {
                for(var x =0; x < a.groups.length; x++) {
                    if(a.groups[x].id == grupoId) {
                        return true;
                    }
                }
            } else if(a.groupIds != null) {
                for(var x = 0; x < a.groupIds.length; x++) {
                    if(a.groupIds[x] == grupoId) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    emptyAssignments: function(deberId) {
        for(var i = 0; i < this.deberes.length; i++) {
            var deber = this.deberes[i];
            if(deber.id === deberId) {
                this.deberes[i].assignments = [];
            }
        }

        this.saveDeberes();
    },
    saveItem: function(name, obj) {
        window.localStorage.setItem(name, obj);
    },
    getItem: function(name) {
        return window.localStorage.getItem(name);
    },
    enableDev: function() {
        this.devEnabled = true;
        this.saveItem("devEnabled", this.devEnabled);
    },
    disableDev: function() {
        this.devEnabled = false;
        this.saveItem("devEnabled", this.devEnabled);
    },
    assignGrupo: function(deberId, grupoId, fecha) {
        for(var i = 0; i < this.deberes.length; i++) {
            var deber = this.deberes[i];
            if(deber.id === deberId) {
                if(deber.assignments == null) {
                    deber.assignments = [];
                }

                var grupo =  this.getGrupo(grupoId);
                if(!Utils.empty(grupo)) {
                    if(!this.isAssigned(deber, grupoId)) {
                        deber.assignments.push({
                            deadline: fecha,
                            grupo: grupo
                        });
                    }
                }

            }
        }

        this.saveDeberes();
    },
    getAssignments: function(deberId) {
        var deber = this.getDeber(deberId);
        return deber.assignments;
    },
    getGrupo: function(grupoId) {
        var user = this.user;
        for(var i = 0; i < user.info.grupos.length; i++) {
            var grupo = user.info.grupos[i];
            if(grupo.id == grupoId) {
                return grupo;
            }
        }
        return null;
    },   
    getEncuesta: function(encuestaId) {
        for(var i = 0; i < LocalData.encuestas.length; i++) {
            var encuesta = LocalData.encuestas[i];
            if(encuesta.id == encuestaId) {
                return encuesta;
            }
        }
        return null;
    },
    pushDeber: function(deber) {
        this.deberes.push(deber);
        window.localStorage.setItem("sigma_user_deberes", JSON.stringify(this.deberes));
        if(!Network.isOnline()) {
            deber.id = this.deberes.length;
            if(Utils.empty(deber.imagesUrl)) {
                deber.imageIds = [];
                this.addToQueue("xhrSaveDeber", deber);
            } else {
                this.addToQueue("xhrSaveDeberAfterImages", deber);
            }
            return deber.id;
        }
    },
    pushParcial: function(parcial) {
        this.parciales.push(parcial);
        window.localStorage.setItem("sigma_user_parciales", JSON.stringify(this.parciales));
        if(!Network.isOnline()) {
            parcial.id = this.parciales.length;
            this.addToQueue("createParcial", parcial);
            return parcial.id;
        }
    },
    pushEscrito: function(escrito) {
        this.escritos.push(escrito);
        window.localStorage.setItem("sigma_user_escritos", JSON.stringify(this.escritos));
        if(!Network.isOnline()) {
            escrito.id = this.escritos.length;
            this.addToQueue("createEscrito", escrito);
            return escrito.id;
        }
    },
    pushAsignacion: function(asignacion) {
        for(var i = 0; i < this.deberes.length; i++) {
            if(this.deberes[i].id == asignacion.deberId) {
                this.deberes[i].assignments.push(asignacion);
            }
        }

        window.localStorage.setItem("sigma_activities_deberes", JSON.stringify(this.deberes));
        if(!Network.isOnline()) {
            this.addToQueue("createAsignacion", asignacion);
        }
    },
    pushEscrito: function(escrito) {
        this.escritos.push(escrito);
        window.localStorage.setItem("sigma_activities_escritos", JSON.stringify(this.escritos));
        if(!Network.isOnline()) {
            escrito.lsId = this.escritos.length;
            this.addToQueue("createEscrito", escrito);
            return escrito.id;
        }
    },
    pushEncuesta: function(encuesta) {
        this.encuestas.push(encuesta);
        window.localStorage.setItem("sigma_activities_encuesta", JSON.stringify(this.encuestas));
        if(!Network.isOnline()) {
            encuesta.lsId = this.encuestas.length;
            this.addToQueue("createEscrito", encuesta);
            return encuesta.id;
        }
    },
    getDeberes: function() {
        return LocalData.deberes;
    },
    setProductionServerEnabled: function(enable) {
        this.productionServerEnabled = enable;
        window.localStorage.setItem("sigma_config_productionServerEnabled", this.productionServerEnabled);
    },
    loadEverything: function() {
        LocalData.user = JSON.parse(window.localStorage.getItem("sigma_user"));
        var lsDeberes = JSON.parse(window.localStorage.getItem("sigma_user_deberes"));
        if(lsDeberes != undefined) {
            LocalData.deberes = lsDeberes;
            for(var i =0; i < this.deberes.length; i++) {
                if(this.deberes[i].assignments == null) {
                    this.deberes[i].assignments = [];
                }
            }
        }
        var lsImages = JSON.parse(window.localStorage.getItem("sigma_user_images"));
        if(lsImages != undefined) {
            LocalData.images = lsImages;
        }
        var lsQueue = JSON.parse(window.localStorage.getItem("sigma_activities_queue"));
        if(lsQueue != undefined) {
            LocalData.queue = lsQueue; 
        }

        var lsXhrQueue = JSON.parse(window.localStorage.getItem("sigma_activities_xhrQueue"));
        if(lsXhrQueue != undefined) {
            LocalData.xhrQueue = lsXhrQueue; 
        }

        var lsEscritos = JSON.parse(window.localStorage.getItem("sigma_activities_escritos"));
        if(lsEscritos != undefined) {
            LocalData.escritos = lsEscritos; 
        }

        var lsParciales = JSON.parse(window.localStorage.getItem("sigma_activities_parciales"));
        if(lsParciales != undefined) {
            LocalData.parciales = lsParciales; 
        }

        var lsEncuestas = JSON.parse(window.localStorage.getItem("sigma_activities_encuestas"));
        if(!Utils.empty(lsEncuestas)) {
            LocalData.encuestas = lsEncuestas; 
        }

        
        var lsResponses = JSON.parse(window.localStorage.getItem("sigma_activities_responses"));
        if(!Utils.empty(lsResponses)) {
            LocalData.responses = lsResponses; 
        }

        var lsAlerta = JSON.parse(window.localStorage.getItem("sigma_activities_alerta"));
        if(!Utils.empty(lsAlerta)) {
            LocalData.alerta = lsAlerta;
        }

        var sp = window.localStorage.getItem("sigma_config_productionServerEnabled");
        if(sp != null) {
            var lsServerProduction = JSON.parse(sp.toLowerCase());
            if(!Utils.empty(lsServerProduction)) {
                LocalData.productionServerEnabled = lsServerProduction;
                Sigma.useProductionServer(lsServerProduction); 
            }
        }

        var lsDevEnabled = this.getItem("devEnabled");
        if(!Utils.empty(lsDevEnabled)) {
            this.devEnabled = JSON.parse(lsDevEnabled);
        }
    }
}
