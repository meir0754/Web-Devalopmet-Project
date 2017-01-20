//----/ AID FUNCS
function toggleLoadAnimation(i_obj) { //---/ make sure css is hooked aswell!
	if (i_obj.length != undefined) {
		var _loaderClass = 'loader',
			_loaderObj = '<div class="'+ _loaderClass +'"></div>',
			_existingObj = $(i_obj).find('.'+_loaderClass);

		if (_existingObj.length > 0 && $(_existingObj).is(":visible")) $(_existingObj).get(0).style.display = 'none';
		else if (_existingObj.length > 0 && !$(_existingObj).is(":visible")) $(_existingObj).get(0).style.display = 'block';
		else {
			$(i_obj).append(_loaderObj);
			document.querySelector('.'+_loaderClass).style.display = 'block';
		}
	} else { 
		console.error('animation box is not defined.');
		return;
	}
}

//----/ ENGINE		
AIDLib.Caller = (function(){
	//---/ Ctor
	function Caller(i_pathToCall){
		this.m_pathToCall = (i_pathToCall != undefined) ? i_pathToCall : '';
		this.m_animationParent = false;
		this.m_response;
		this.m_validResponse = true;
	}

	//---/ Methods
	Caller.makeCall = function(i_objToSend, i_animationParentSelector, i_toAnimateLoader, o_callback) {
		if (i_toAnimateLoader) toggleLoadAnimation(i_animationParentSelector);
		
		$.post(this.m_path, JSON.stringify(i_objToSend), function(i_response){
			this.m_response = i_response;
			this.m_validResponse = true;

			if (i_response.indexOf('[{') >= 0) v_res = JSON.parse(i_response);
			if (i_toAnimateLoader) toggleLoadAnimation(i_animationParentSelector);
		}).fail(function (jqXHR, textStatus, errorThrown) {
            this.m_response = jqXHR.responseText;
			this.m_validResponse = false;
			console.error(this.m_response);
        }).always(o_callback(this.m_response));
	}

	Caller.prototype.sendCustomerApply = function(i_customerApply, i_responseBox, i_toAnimateLoader, o_callback) {
		this.makeCall(i_customerApply, i_responseBox, i_toAnimateLoader, o_callback);
	}

	//---/ Getters & Setters
	
	return Caller;
})();

//----/ GLOBE
var AIDLib = AIDLib || {},
	myCaller = new AIDLib.Caller('');