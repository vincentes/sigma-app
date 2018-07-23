document.addEventListener('init', function () {
    $(".deber-thumbnail img").click(function(targ) {
        PhotoViewer.show($(this).attr('src'), 'Imagen asociada');
    });
}, false);
