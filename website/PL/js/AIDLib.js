
//TODO: MODIFY FIELDS!!!!
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//----/ GLOBE
var AIDLib = AIDLib || {},
	myCaller = '';

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
	} else return;
}

//----/ ENGINE		
AIDLib.Caller = (function(){
	//---/ Ctor
	function Caller(i_pathToCall){ 
		this.m_userInput = '';
		this.m_userInputType = '';
		this.m_userCode = '';
		this.m_path = i_pathToCall != undefined ? i_pathToCall : '';
		this.m_animationParent = false;
	}

	//---/ Methods
	Caller.prototype.makeCall = function(i_objToSend, i_animationParentSelector, i_toAnimateLoader, o_callback) {
		if (i_toAnimateLoader) toggleLoadAnimation(i_animationParentSelector);
		$.post(this.m_path, i_objToSend, function(response){
			var v_res = response;

			if (response.indexOf('[{') >= 0) v_res = JSON.parse(response);
			
			if (i_toAnimateLoader) toggleLoadAnimation(i_animationParentSelector);
			if (typeof o_callback === 'function' && o_callback != 'undefined') o_callback(v_res);
		});
	}

	Caller.prototype.validateMail = function(i_act, i_toAnimateLoader, o_callback) {
		this.makeCall({'act': i_act, 'email': this.m_userInput, 'phone': 1}, this.m_animationParent, i_toAnimateLoader, o_callback);
	}

	Caller.prototype.validatePhone = function(i_act, i_toAnimateLoader, o_callback) {
		this.makeCall({'act': i_act, 'phone': this.getPhonePostfix(), 'prefix': this.getPhonePrefix()}, this.m_animationParent, i_toAnimateLoader, o_callback);
	}

	Caller.prototype.reset = function(i_act, i_toAnimateLoader, o_callback) {
		if (this.getUserInputType() === 'email') this.makeCall({'act': i_act, 'email': this.m_userInput, 'phone': 1}, this.m_animationParent, i_toAnimateLoader, o_callback);
		else this.makeCall({'act': i_act, 'phone': this.getPhonePostfix(), 'prefix': this.getPhonePrefix()}, this.m_animationParent, i_toAnimateLoader, o_callback);
	}

	Caller.prototype.register = function(i_act, i_code, i_toAnimateLoader, o_callback) {
		this.makeCall({'act': i_act, 'email': this.m_userInput, 'code': i_code}, this.m_animationParent, i_toAnimateLoader, o_callback);
	}

	Caller.prototype.setPass = function(i_act, i_code, i_newPass, i_toAnimateLoader, o_callback) {
		this.makeCall({'act': i_act, 'email': this.m_userInput, 'key': i_code, 'password': i_newPass, 'password2': i_newPass}, this.m_animationParent, i_toAnimateLoader, o_callback);
	}

	Caller.prototype.getExpertise = function(i_act, i_value, i_toAnimateLoader, o_callback){
		this.makeCall({'act': i_act, 'value': i_value}, this.m_animationParent, i_toAnimateLoader, o_callback);
	}

	Caller.prototype.checkExistingExpertise = function(i_act, i_website, i_email, i_toAnimateLoader, o_callback){
		this.makeCall({'act': i_act, 'website': i_website, 'email': i_email}, this.m_animationParent, i_toAnimateLoader, o_callback);
	}

	//---/ Getters & Setters
	Caller.prototype.setUserInput = function(i_data, i_type){
		this.m_userInput = i_data;
		this.m_userInputType = i_type;
	}

	Caller.prototype.getUserInput = function(){
		return this.m_userInput;
	}

	Caller.prototype.setUserCode = function(i_code){
		this.m_userCode = i_code;
	}

	Caller.prototype.getUserCode = function(){
		return this.m_userCode;
	}

	Caller.prototype.setUserInputType = function(i_type){
		this.m_userInputType = i_type;
	}

	Caller.prototype.setPath = function(i_path){
		this.m_path = i_path;
	}

	Caller.prototype.getUserInputType = function(){
		return this.m_userInputType;
	}

	Caller.prototype.getCurrPath = function(){
		return this.m_path;
	}

	Caller.prototype.getPhonePostfix = function(){
		var v_res = '';

		if (this.m_userInputType === 'email') v_res = false; 
		else if (this.m_userInput.indexOf('-') >= 0) v_res = this.m_userInput.split('-')[1];
		else v_res = this.m_userInput.substr(3, this.m_userInput.length);
		
		return v_res;
	}
	
	Caller.prototype.getPhonePrefix = function(){
		var v_res = '';

		if (this.m_userInputType === 'email') v_res = false; 
		else if (this.m_userInput.indexOf('-') >= 0) v_res = this.m_userInput.split('-')[0];
		else v_res = this.m_userInput.substr(0, 3);
		
		return v_res;
	}

	Caller.prototype.setParentObjForAnimation = function(i_parent){
		this.m_animationParent = $(i_parent);
	}

	return Caller;
})();

//----/ HANDLER
$(function(){
	myCaller = new AIDLib.Caller();
});