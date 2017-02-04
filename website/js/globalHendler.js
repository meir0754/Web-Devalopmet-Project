//---/ GLOBE
var theGangSiteHomePageAnimationFlag = {'hasVisited': true}; //---/ flags if site is in browser cash (no need to preload twice)

//---/ Aid funcs
function SubmitFilterForm(i_this, i_event){
    i_event.preventDefault();
    myPresentor.SetPartner('#' + $(i_this).attr('id'));
    var o_Requset = {
            "method": "GetFilteredCars",
            "params": {
                "manufacturer": $('input[name="manufacturer"]').val(),
                "category": $('input[name="category"]').val(),
                "model": $('input[name="model"]').val(),
                "fromYear": $('input[name="from-year"]').val(),
                "toYear": $('input[name="to-year"]').val(),
                "fromMileage": $('input[name="from-mileage"]').val(),
                "toMileage": $('input[name="to-mileage"]').val(),
                "fromPrice": $('input[name="from-price"]').val(),
                "toPrice": $('input[name="to-price"]').val()
            },
            "returntype": "json"
        };

    myCaller.getSearchResaultsByRequest(o_Requset, 'main .output-message', true, function(i_response){
        if (i_response.Data.length == 0) myPresentor.RespondNoResaultsMsg();
        else {
            mySmallCarResaultsBuilder.setResaultArr(i_response.Data);
            mySearchResaultsDirector.construct(mySmallCarResaultsBuilder);

            bindNewSearchListeners();
        }
    });
}

function SubmitContactForm(i_this, i_event){
    i_event.preventDefault();
    myPresentor.SetPartner('#' + $(i_this).attr('id'));
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

    myCaller.sendCustomerApply(o_Requset, myPresentor.GetCurrMsgBox(), true, function(i_response){
        if (!i_response) myPresentor.RespondBaseErrorMsg();
        else if (i_response) myPresentor.RespondValidMsg('פנייתך התקבלה בהצלחה. נציג יצור איתך קשר בהקדם.'); 
        else if (i_response.valid == undefined || i_response.valid == null || i_response.msg == undefined || i_response.msg == null || i_response.msg == '') myPresentor.RespondInternalError(i_response);
        else if (i_response.msg.indexOf('mail') != -1) myPresentor.RespondErrorMsg('כתובת המייל אינה תקינה');
        else if (i_response.msg.indexOf('phone') != -1) myPresentor.RespondErrorMsg('מספר הטלפון אינו תקין');
        else myPresentor.RespondBaseErrorMsg();
    });
}

function matchFeilds(i_field_1, i_field_2) { 
    return (i_field_1 === i_field_2) ? true : false; 
}

function setPageGlobalScripts(o_callback) {
    function setScriptHelper(i_src) {
        _currListToLoad.push(i_src);
    }

    function getCurrScripts(i_scripts, o_callback) {
        var _progress = 0;
        i_scripts.forEach(function(script) { 
            $.getScript(script, function () {
                if ((++_progress == i_scripts.length) && (typeof o_callback === 'function' && o_callback != 'undefined')) o_callback();
                else if (_progress == i_scripts.length) return;
            }); 
        });
    }

    var _path = window.location.pathname,
        //_scriptSrcsList = ['applicationLogic/PL/js/AIDLib.js','js/navigationHelper.js', 'js/phoneCallerHelper.js', 'js/easyScrollHandler.js', 'js/navMenuHelper.js', 'applicationLogic/PL/js/pace.js', 'js/hamburgerBtnHendler.js', 'js/InvalidCustomBubble_HE.js'], //----/ removed for debug mode - retrive once done debugging!!!
        _scriptSrcsList = ['js/navigationHelper.js', 'js/phoneCallerHelper.js', 'js/easyScrollHandler.js', 'js/navMenuHelper.js', 'applicationLogic/PL/js/pace.js', 'js/hamburgerBtnHendler.js', 'js/InvalidCustomBubble_HE.js'],
        _currListToLoad = [];

    $.each(_scriptSrcsList, function (key, scriptSrc) {
        //---/ will load the animation only for the first time user enters the site and only for the home page - else will set session storage as true for next round
        if ((scriptSrc.indexOf('pace') > -1) && (_path === '/' ) && !(JSON.parse(sessionStorage.getItem('theGangSiteHomePageAnimationFlag')) != null && JSON.parse(sessionStorage.getItem('theGangSiteHomePageAnimationFlag')).hasVisited) ) {
            setScriptHelper(scriptSrc);
            sessionStorage.setItem('theGangSiteHomePageAnimationFlag', JSON.stringify(theGangSiteHomePageAnimationFlag));
        } else if (scriptSrc.indexOf('pace') < 0) setScriptHelper(scriptSrc);
    });

    getCurrScripts(_currListToLoad, o_callback);
}

function setNavBtnsAttr() {
    var _pagesList = ['index', 'about', 'search', 'contact', 'regulation'],
        v_CurrPath = window.location.pathname,
        _class = 'nav-btn-active';

    $.each(_pagesList, function (key, page) {
        if ((v_CurrPath.indexOf(page) > -1) || ((v_CurrPath === '/') && (page === 'index'))) {
            if (page === 'index') page = 'home';
            $('#nav-' + page + '-Btn').addClass(_class);
            $('body').attr('id', page + '-page');
        } else {
            $('#nav-' + page + '-Btn').removeClass(_class);
        }
    });
}

//----/ JS ONLOAD HENDLER /----//
function Run(o_callback){
    setPageGlobalScripts(function(){
        //----/ JQ READY HENDLER /----//
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
                if ($(this).attr('id') === 'search-filter-form') SubmitFilterForm(this, e); 
                else SubmitContactForm(this, e);
            });

            if (typeof o_callback === 'function' && o_callback != 'undefined') o_callback();

        }, o_callback);
    }, o_callback);
}

