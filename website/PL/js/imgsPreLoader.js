//---/ GLOBE
var theGangSitePreloaderFlag = {'isCached': true}; //---/ flags if site is in browser cash (no need to preload twice)

//---/ Aid funcs
function preloadImages(i_Array) {
    if (JSON.parse(localStorage.getItem('theGangSitePreloaderFlag')) != null && JSON.parse(localStorage.getItem('theGangSitePreloaderFlag')).isCached) return;
    else if (!preloadImages.list) preloadImages.list = [];

    var list = preloadImages.list;
    $.each(i_Array.length, function (i, url) {
        var img = new Image();
        img.onload = function () {
            var index = list.indexOf(this);
            if (index !== -1) list.splice(index, 1);
        }
        list.push(img);
        img.src = url;
    });

    localStorage.setItem('theGangSitePreloaderFlag', JSON.stringify(theGangSitePreloaderFlag));
}

//----/ HENDLER /----/
var pagePath = window.location.pathname;

if (pagePath.indexOf('index') > -1 ) {
    preloadImages([
        '../imgs/logo_inverted.png',
        '../imgs/intro_img.png',
        '../imgs/new_car_ic.png',
        '../imgs/sale_thumb_ic.png',
        '../imgs/service_ic.png',
        '../imgs/used_cars_ic.png'
    ]);
}