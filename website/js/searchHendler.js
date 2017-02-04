//----/ GLOBE /----//
var mySearchResaultsDirector = {},
    mySmallCarResaultsBuilder = {};

//----/ AID FUNCS /----//
function bindNewSearchListeners(){
    $('.car-mini-box').unbind('click');
    $('button.close-lightbox-btn').unbind('click');

    $('.car-mini-box').click(function(){
        var myBigCarResaultsBuilder = new AIDLib.BigResaultBuilder('#big-search-resault .lightbox-data-holder'),
            v_id = $(this).attr('id').match(/\d+/g)[0];
        
        myCaller.getSearchResaultById(v_id, '', false, function(i_response){
            myBigCarResaultsBuilder.setResaultArr(i_response.Data);
            mySearchResaultsDirector.construct(myBigCarResaultsBuilder);
            
            refactorCBFlex(function(){
                $('.lightbox-holder').show();
            });
        });
    });

    $('button.close-lightbox-btn').click(function(){
        $('.lightbox-holder').hide();
    });
}

function generatePrimRequset(i_request){
    if (i_request == undefined || i_request == null) return;

    var _method = '';

    switch (i_request) {
        case 'secondHand':
            _method = 'GetSecondHandCars';
            break;

        case 'new':
            _method = 'GetNewCars';
            break;

        case 'onSale':
            _method = 'GetCarsOnSale';
            break;
        
        case '':
            _method = 'GetAllCars';
            break;

        default:
            console.error('Bad Requset!');
            break;
    }

    return o_request = {
        'method': _method,
        'params': ''
    };
}

function getClientRequest(){
    var _request = '',
        _key = '?',
        _path = window.location.search;
    
    if (_path.indexOf(_key) > -1) _request = _path.split(_key)[1];
    
    _request = generatePrimRequset(_request);

    return _request;
}

//----/ JQ HENDLER /----//
Run(function () {
    //---/ Globe
    mySearchResaultsDirector = new AIDLib.SearchResaultsDirector(),
    mySmallCarResaultsBuilder = new AIDLib.SmallResaultBuilder('#search-resaults-holder');
    
    //---/ Process
    mySearchResaultsDirector.displayResaults(getClientRequest(), 'main .output-message', true, function(){
        bindNewSearchListeners();
    });
});
