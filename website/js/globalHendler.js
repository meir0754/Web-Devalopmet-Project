//---/ GLOBE
var theGangSiteHomePageAnimationFlag = {'hasVisited': true}; //---/ flags if site is in browser cash (no need to preload twice)

//---/ Aid funcs
function SubmitFilterForm(i_this, i_event){
    i_event.preventDefault();
    myPresentor.SetPartner('main');
    myPresentor.ClearCurrMsgBox();
    var o_Requset = {
            "method": "GetFilteredCars",
            "params": {
                "manufacturer": $('select[name="manufacturer"]').val(),
                "category": $('select[name="category"]').val(),
                "model": $('select[name="model"]').val(),
                "fromYear": $('input[name="from-year"]').val(),
                "toYear": $('input[name="to-year"]').val(),
                "fromMileage": $('input[name="from-mileage"]').val(),
                "toMileage": $('input[name="to-mileage"]').val(),
                "fromPrice": $('input[name="from-price"]').val(),
                "toPrice": $('input[name="to-price"]').val(),
                "typeOfSale": ($('input[name="type-of-sale"]').is(':checked'))? "במבצע" : ''
            },
            "returntype": "json"
        };
    
    if (window.location.pathname.indexOf('search') > -1 && o_Requset.params.manufacturer == '' && o_Requset.params.category == '' && o_Requset.params.model == '' && o_Requset.params.fromYear == '' && o_Requset.params.toYear == '' && o_Requset.params.fromMileage == '' && o_Requset.params.toMileage == '' && o_Requset.params.fromPrice == '' && o_Requset.params.toPrice == '' && o_Requset.params.typeOfSale == 'רגיל' ) window.location.href = window.location.origin + window.location.pathname;

    myCaller.getSearchResaultsByRequest(o_Requset, 'main .output-message', true, function(i_response){
        if (i_response.Data.length == 0) {
            mySearchResaultsDirector.clearResaultsPan(mySmallCarResaultsBuilder);
            myPresentor.RespondNoResaultsMsg();
        } else {
            mySmallCarResaultsBuilder.setResaultArr(i_response.Data);
            mySearchResaultsDirector.construct(mySmallCarResaultsBuilder);

            bindNewSearchListeners();
        }
    });
}

function SubmitContactForm(i_this, i_event){
    i_event.preventDefault();

    var _parent = '#' + $(i_this).attr('id');

    myPresentor.SetPartner(_parent);
    
    var o_Requset = {
            "method": "InsertNewApply",
            "params": {
                "fullName": $(_parent).find('input[name="full_name"]').val(),
                "phone": $(_parent).find('input[name="phone_number"]').val(),
                "mail": $(_parent).find('input[name="email"]').val(),
                "subject": ($(_parent).find('select[name="subject"]').val() == undefined)? 'quick_form' : $(_parent).find('select[name="subject"]').val(),
                "message": $(_parent).find('textarea[name="message"]').val()
            },
            "returntype": "json"
        };

    myCaller.sendCustomerApply(o_Requset, myPresentor.GetCurrMsgBox(), true, function(i_response){
        if (i_response.Data) myPresentor.RespondValidMsg('פנייתך התקבלה בהצלחה. נציג יצור איתך קשר בהקדם.'); 
        else if (i_response.Data == undefined || i_response.Data == null) myPresentor.RespondInternalError(i_response);
        else if (!i_response.Data && i_response.msg.indexOf('mail') != -1) myPresentor.RespondErrorMsg('כתובת המייל אינה תקינה');
        else if (!i_response.Data && i_response.msg.indexOf('phone') != -1) myPresentor.RespondErrorMsg('מספר הטלפון אינו תקין');
        else myPresentor.RespondBaseErrorMsg();
    });
}

function matchFeilds(i_field_1, i_field_2) { 
    return (i_field_1 === i_field_2) ? true : false; 
}

function setPageGlobalScripts(o_callback) {
    function setScriptHelper(i_src) {
        _currListToLoad.push(i_src); // TODO: move command to parent function - no neen for an helper
    }

    function getCurrScripts(i_scripts, o_callback) { // TODO: modify so will be able to handle one script at a time - not a list
        var _progress = 0;
        i_scripts.forEach(function(script) { 
            $.getScript(script, function () {
                if ((++_progress == i_scripts.length) && (typeof o_callback === 'function' && o_callback != 'undefined')) o_callback();
                else if (_progress == i_scripts.length) return;
            }); 
        });
    }

    var _path = window.location.pathname,
        _scriptSrcsList = ['applicationLogic/PL/js/AIDLib.js','js/navigationHelper.js', 'js/phoneCallerHelper.js', 'js/easyScrollHandler.js', 'js/navMenuHelper.js', 'applicationLogic/PL/js/pace.js', 'js/hamburgerBtnHendler.js', 'js/InvalidCustomBubble_HE.js'],
        //_scriptSrcsList = ['js/navigationHelper.js', 'js/phoneCallerHelper.js', 'js/easyScrollHandler.js', 'js/navMenuHelper.js', 'applicationLogic/PL/js/pace.js', 'js/hamburgerBtnHendler.js', 'js/InvalidCustomBubble_HE.js'],
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
            
            if (page === 'search') $('#nav-' + page + '-Btn').parent().addClass(_class);
            else $('#nav-' + page + '-Btn').addClass(_class);
            
            $('body').attr('id', page + '-page');
        } else {
            if (page === 'search') $('#nav-' + page + '-Btn').parent().removeClass(_class);
            else $('#nav-' + page + '-Btn').removeClass(_class);
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

