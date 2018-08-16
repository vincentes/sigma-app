Utils = {
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
    }
};

Page = {
    pushPage: function(htmlFile, options) {
        document.getElementById("nav").pushPage(htmlFile, options);
    }
};

DocenteParciales = {
    init: function() {
        
    }
};

DocenteParcialesCreate = {
    Templates: {
        GrupoListItem: function(grupo) {
            return '<ons-list-item id="grupo-{0}"><label class="left"><ons-checkbox name="grupos[]" input-id="grupo-{0}"></ons-checkbox></label><label for="grupo-{0}">{1}</label></ons-list-item>'.format(grupo.id, Utils.toGroupName(grupo.grado, grupo.numero));
        }
    },
    init: function() {
        var grupos = SigmaLS.userInfo.grupos;
        if(grupos === null) {
            ons.notification.toast("Ocurrio un error. ¡No tenés grupos!");
        } else {
            grupos.forEach(function(grupo) {
                $("#docente-parciales-create-grupos-list").append(DocenteParcialesCreate.Templates.GrupoListItem(grupo));
            });
        }
    }
};

Pages = {
    docenteParciales: function() {
        Page.pushPage("docente-parciales.html", {
            callback: function() {
                DocenteParciales.init();
            }
        });
    },
    docenteParcialesCreate: function() {
        Page.pushPage("docente-parciales-create.html", {
            callback: function() {
                DocenteParcialesCreate.init();
            }
        });
    }
};