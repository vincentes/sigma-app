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
                $("#modo-sin-internet").hide();         
            } else {
                $("#modo-sin-internet").show();     
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
    }, 3000);
}, false);

// Local Storage
LocalData = {
    user: null,
    deberes: [],
    images: [],
    queueName: "sigma_sync",
    queue: [],
    xhrQueue: [],
    resetQueue: function() {
        this.queue = [];
    },
    resetXhrQueue: function() {
        this.xhrQueue = [];
    },
    sync: function() {
        for(var i = 0; i < this.xhrQueue.length; i++) {
            var activity = this.xhrQueue[i];
            if(i === this.xhrQueue.length - 1) {
                // Once the last image is uploaded, start doing all the other stuff.
                activity.args.tmpActivityCallback = function() {
                    for(var i = 0; i < this.queue.length; i++) {
                        var _activity = this.queue[i];
                        Request.addToQueue(this.queueName, this.translateMethod(_activity.method, _activity.args));
                    }
                    this.resetQueue();
                };
            }

            this.xhrTranslateMethod(activity.method, activity.args);
        }

        this.resetXhrQueue();
    },
    translateMethod: function(method, args) {
        switch(method) {
            case "deleteDeber":
            return API.Configs.deleteDeber(args);
            case "saveDeber":
            return API.Configs.saveDeber(args);
            case "createAsignacion":
            return API.Configs.assignDeberToGroups(args);
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
    pushDeber: function(deber) {
        this.deberes.push(deber);
        window.localStorage.setItem("sigma_user_deberes", JSON.stringify(this.deberes));
        if(!Network.isOnline()) {
            deber.id = this.deberes.length;
            if(Utils.empty(deberes.imagesUrl)) {
                deberes.imageIds = [];
                this.addToQueue("xhrSaveDeber", deber);
            } else {
                this.addToQueue("xhrSaveDeberAfterImages", deber);
            }
            return deber.id;
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
    getDeberes: function() {
        return LocalData.deberes;
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
    }
}
