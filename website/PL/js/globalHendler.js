//---/ GLOBE
var theGangSiteHomePageAnimationFlag = {'hasVisited': true}; //---/ flags if site is in browser cash (no need to preload twice)

//---/ Aid funcs
function throwPhaseOutput(i_phase, i_type, i_msg){ 
    (i_type === 'error') ? $(i_phase + ' .output-message').addClass('error-message').text(i_msg) : $(i_phase + ' .output-message').text(i_msg) 
}

function matchFeilds(i_field_1, i_field_2) { 
    return (i_field_1 === i_field_2) ? true : false; 
}

function setPageGlobalScripts() {
    function setScriptHelper(i_src) {
        var v_ScriptToLoad = document.createElement('script');
            v_ScriptToLoad.type = 'text/javascript';
            v_ScriptToLoad.src = i_src;
		
        document.head.appendChild(v_ScriptToLoad);
    } 

    var _path = window.location.pathname,
        _scriptSrcsList = ['js/AIDLib.js','js/navigationHelper.js', 'js/phoneCallerHelper.js', 'js/easyScroll.js', 'js/navMenuHelper.js', 'js/pace.js', 'js/hamburgerBtnHendler.js'];

    $.each(_scriptSrcsList, function (key, scriptSrc) {
        //---/ will load the animation only for the first time user enters the site and only for the home page - else will set session storage as true for next round
        if ((scriptSrc.indexOf('pace') > -1) && (_path.indexOf('index') > -1 ) && !(JSON.parse(sessionStorage.getItem('theGangSiteHomePageAnimationFlag')) != null && JSON.parse(sessionStorage.getItem('theGangSiteHomePageAnimationFlag')).hasVisited) ) {
            setScriptHelper(scriptSrc);
            sessionStorage.setItem('theGangSiteHomePageAnimationFlag', JSON.stringify(theGangSiteHomePageAnimationFlag));
        } else if (scriptSrc.indexOf('pace') < 0) setScriptHelper(scriptSrc);
    });
}

function setNavBtnsAttr() {
    var _pagesList = ['home', 'about', 'search', 'contact', 'regulation'],
        v_CurrPath = window.location.pathname,
        _class = 'nav-btn-active';

    $.each(_pagesList, function (key, page) {
        if ((v_CurrPath.indexOf(page) > -1) || (page === 'home' && v_CurrPath.indexOf('index') > -1)) {
            $('#nav-' + page + '-Btn').addClass(_class);
            $('body').attr('id', page + '-page');
        } else {
            $('#nav-' + page + '-Btn').removeClass(_class);
        }
    });
}

//----/ JS ONLOAD HENDLER /----/
setPageGlobalScripts();

//----/ JQ READY HENDLER /----/
$(function () {
    //---/ Globe
    setNavBtnsAttr();

    //---/ Listeners
    $('.quick-nav-btn').click(function () { initNav(); });
    $('.quick-call-btn').click(function () { initPhoneCall(); });
    $('.logo-img').click(function () { window.open('index.html','_self'); });
    $('.logo-img-inverted').click(function () { window.open('index.html','_self'); });
    $('.redirect-btn').click(function(){ 
        if ($(this).val().length <= 0) return;
        else window.open($(this).val() + '.html' , '_self'); 
    });

    $('form').submit(function(e){
        e.preventDefault();
        
        var o_Requset = {
                "method": "InsertNewApply",
                "params": {
                    "fullName": $('input[name="full_name"]').val(),
                    "phone": $('input[name="phone_number"]').val(),
                    "mail": $('input[name="email"]').val(),
                    "subject": $('select[name="subject"]').val(),
                    "message": $('textarea[name="message"]').val()
                },
                "returntype": "json"
            };
        
        myCaller.sendCustomerApply(o_Requset, 'output-message', true, function(i_response){
            console.log(i_response);
        });
    });
});
