var Request = {
    addToQueue: function(name, settings) {
        $.ajaxq(name, settings);
    }
};

var Network = {
    online: false,
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
            timeout: 1000,
            type: "GET",
            cache: false
        });
    },
    updateConnection: function(callback) {  
        Network.isConnected().done(function() {
            Network.setOnline();
            LocalData.sync();
        }).fail(function() {
            Network.setOffline();  
        }).always(function() {
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
    }, 1000);
}, false);

// Local Storage
LocalData = {
    user: null,
    deberes: [],
    encuestas: [],
    images: [],
    responses: [],
    escritos: [],
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
        window.localStorage.setItem("sigma_user_responses", JSON.stringify(this.responses));
        if(!Network.isOnline()) {
            this.addToQueue("respondEncuesta", respond);
        }
    },
    saveDeberes: function(deberes) {
        window.localStorage.setItem("sigma_user_deberes", JSON.stringify(deberes));
        LocalData.deberes = deberes;
        for(var i =0; i < this.deberes.length; i++) {
            if(this.deberes[i].assignments == null) {
                this.deberes[i].assignments = [];
            }
        }
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
    saveImages: function(images) {
        this.images.push(images);
        window.localStorage.setItem("sigma_user_images", JSON.stringify(this.images));
        if(!Network.isOnline()) {
            this.addToQueue("xhrSaveImages", images);
        }
    },
    assignGrupo: function(deberId, grupoId) {
        for(var i = 0; i < this.deberes.length; i++) {
            var deber = this.deberes[i];
            if(deber.id === deberId) {
                if(deber.assignments == null) {
                    deber.assignments = [];
                }

                deber.assignments.push({
                    grupo: this.getGrupo(grupoId)
                });
            }
        }
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
        for(var i = 0; i < LocalData.encuesta.length; i++) {
            var encuesta = LocalData.encuesta[i];
            if(encuesta.id == deberId) {
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

        window.localStorage.setItem("sigma_user_deberes", JSON.stringify(this.deberes));
        if(!Network.isOnline()) {
            this.addToQueue("createAsignacion", asignacion);
        }
    },
    pushEscrito: function(escrito) {
        this.escritos.push(escrito);
        window.localStorage.setItem("sigma_user_escritos", JSON.stringify(this.escritos));
        if(!Network.isOnline()) {
            escrito.lsId = this.escritos.length;
            this.addToQueue("createEscrito", escrito);
            return escrito.id;
        }
    },
    pushEncuesta: function(encuesta) {
        this.encuestas.push(encuesta);
        window.localStorage.setItem("sigma_user_encuesta", JSON.stringify(this.encuestas));
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


        var sp = window.localStorage.getItem("sigma_config_productionServerEnabled");
        if(sp != null) {
            var lsServerProduction = JSON.parse(sp.toLowerCase());
            if(!Utils.empty(lsServerProduction)) {
                LocalData.productionServerEnabled = lsServerProduction;
                Sigma.useProductionServer(lsServerProduction); 
            }
        }
    }
}
