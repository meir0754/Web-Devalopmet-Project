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
    myCaller.getAllSearchResaults(mySmallCarResaultsBuilder.getParentSelector(), true, function(i_response){
        console.log(i_response);
        mySmallCarResaultsBuilder.setResaultArr(i_response);
        //mySearchResaultsDirector.construct(mySmallCarResaultsBuilder);
    });
    

    //---/ Listeners
    
});
