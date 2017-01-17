//---/ GLOBE

//---/ Aid funcs
function setNavBtnsAttr() {
    var _pagesList = ['home', 'about', 'search', 'contact', 'regulation'],
        v_CurrPath = window.location.pathname,
        _class = 'nav-btn-active';

    $.each(_pagesList, function (key, page) {
        if ((v_CurrPath.indexOf(page) > -1) || (page === 'home' && v_CurrPath.indexOf('index') > -1)) {
            $('#nav-' + page + '-Btn').addClass(_class);
        } else {
            $('#nav-' + page + '-Btn').removeClass(_class);
        }
    });
}

function setPageGlobalScripts() {
    var _scriptSrcsList = ['js/navigationHelper.js', 'js/callerHelper.js', 'js/easyScroll.js', 'js/navMenuHelper.js'];

    $.each(_scriptSrcsList, function (key, scriptSrc) {
        var v_ScriptToLoad = document.createElement('script');
        v_ScriptToLoad.type = 'text/javascript';
        v_ScriptToLoad.src = scriptSrc;
		document.head.appendChild(v_ScriptToLoad);
    });
}

//----/ JQ LOAD HENDLER /----/
$(window).load(function(){
    setPageGlobalScripts();
    setNavBtnsAttr();
});

//----/ JQ READY HENDLER /----/
$(function () {
    //---/ Globe

    //---/ Listeners
    $('.quick-nav-btn').click(function () { initNav(); });
    $('.quick-call-btn').click(function () { initCall(); });

    $('.logo-img').click(function () { window.location.href = 'index.html'; });


    
});
