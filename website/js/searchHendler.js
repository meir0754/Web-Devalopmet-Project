//----/ GLOBE /----//
var mySearchResaultsDirector = {},
    mySmallCarResaultsBuilder = {};

//----/ AID FUNCS /----//

//----/ JQ HENDLER /----//
Run(function () {
    //---/ Globe
    mySearchResaultsDirector = new AIDLib.SearchResaultsDirector(),
    mySmallCarResaultsBuilder = new AIDLib.SmallResaultBuilder('#search-resaults-holder');
    
    //---/ Process
    myCaller.getAllSearchResaults('main .output-message', true, function(i_response){
        mySmallCarResaultsBuilder.setResaultArr(i_response.Data);
        mySearchResaultsDirector.construct(mySmallCarResaultsBuilder);

        //---/ Listeners
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
    });
});
