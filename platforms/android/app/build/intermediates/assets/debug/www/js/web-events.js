document.addEventListener('init', function (event) {
    $(".deber-img-thumbnail").click(function() {
        PhotoViewer.show('http://www.sapiensman.com/matematicas/imagenesdownload/problemas1.jpg', 'Title');
    });
}, false);