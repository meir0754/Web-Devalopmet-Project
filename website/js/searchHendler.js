//----/ GLOBE /----//
var mySearchResaultsDirector = {},
    mySmallCarResaultsBuilder = {};

//----/ AID FUNCS /----//

//----/ JQ HENDLER /----//
Run(function () {
    //---/ Globe
    mySearchResaultsDirector = new AIDLib.SearchResaultsDirector(),
    mySmallCarResaultsBuilder = new AIDLib.SmallResaultBuilder('#search-resaults-holder');
    myBigCarResaultsBuilder = new AIDLib.BigResaultBuilder('body');
    
    //---/ Process
    myCaller.getAllSearchResaults('main .output-message', true, function(i_response){
        console.log(i_response); // TODO: remove once debug is done
        mySmallCarResaultsBuilder.setResaultArr(i_response.Data);
        mySearchResaultsDirector.construct(mySmallCarResaultsBuilder);
    });
    

    //---/ Listeners
    
});
