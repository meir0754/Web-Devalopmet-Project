//----/ JQ HENDLER /----//
Run(function(){
    //---/ Globe

    //---/ Listeners
    $('.thumbnail-holder').click(function () {
        var _baseUrl = window.location.origin,
            _redirectTo = $(this).attr('data-redirect');
        
        window.location.href = _baseUrl + '/' + _redirectTo;
    });
});
