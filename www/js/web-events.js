document.addEventListener('init', function () {
    $(".deber-thumbnail img").click(function(targ) {
        PhotoViewer.show($(this).attr('src'), 'Imagen asociada');
    });
}, false);

document.addEventListener('init', function(event) {
    if (event.target.matches('#docente-deberes')) {
        Deber.display();
    } else if (event.target.matches('#docente-deberes-edit')) {
        var data = document.getElementById("nav").topPage.data;
        $("#info-deber-consigna").text(data.content);
        for(var i = 0; i < data.imagesURL.length; i++) {
            $("thumbnail-list").prepend('<div class="thumbnail deber-thumbnail"><img class="deber-image" src="{0}"></img><ons-ripple><ons-ripple></div>'.format(data.imagesURL[i]));
        }
    }
}, false);

document.addEventListener('show', function(event) {
    if (event.target.matches('#docente-deberes')) {
        Deber.display();
    }
}, false);

$(".list-deber-item").click(function(evt) {
    
});