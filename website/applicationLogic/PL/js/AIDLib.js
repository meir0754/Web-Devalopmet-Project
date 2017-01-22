//----/ GLOBE
var AIDLib = AIDLib || {};

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

function isValidFormApplyHelper(i_FormApply){
	var v_res = {
		'valid': true,
		'msg': ''
	};

	if (i_FormApply == undefined || i_FormApply == '' || i_FormApply == null) {
		v_res.valid = false;
		v_res.msg = 'Object is not defined.';
	} else if (i_FormApply.method == '' || i_FormApply.method == null) {
		v_res.valid = false;
		v_res.msg = 'Object method requset is not defined.';
	} else if (i_FormApply.params == undefined  || i_FormApply.params == '' || i_FormApply.params == null) {
		v_res.valid = false;
		v_res.msg = 'Object params is not defined.';
	} else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(i_FormApply.params.mail))) {
		v_res.valid = false;
		v_res.msg = 'mail error';
	} else if (!(/^(\d[\s-]?)?[\(\[\s-]{0,2}?\d{2}[\)\]\s-]{0,2}?\d{3}[\s-]?\d{4}$/i.test(i_FormApply.params.phone))) {
		v_res.valid = false;
		v_res.msg = 'phone error';
	} 

	if (!v_res.valid) console.log(v_res.msg);
	return v_res;
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
	Caller.prototype.makeCall = function(i_objToSend, i_animationParentSelector, i_toAnimateLoader, o_callback) {
		if (i_toAnimateLoader) toggleLoadAnimation(i_animationParentSelector);
		
		$.post(this.m_pathToCall, JSON.stringify(i_objToSend), function(i_response){
			this.m_validResponse = true;
			this.m_response = JSON.parse(i_response);
		}).fail(function (jqXHR, textStatus, errorThrown) {
			this.m_validResponse = false;
            this.m_response = jqXHR.responseText;
			console.error(this.m_response);
		}).always(function(){

			if (i_toAnimateLoader) toggleLoadAnimation(i_animationParentSelector);
			if (typeof o_callback === 'function' && o_callback != 'undefined')  o_callback(this.m_response);
		});
	}

	Caller.prototype.isValidFormApply = function(i_FormApply){
		return isValidFormApplyHelper(i_FormApply);
	}

	Caller.prototype.sendCustomerApply = function(i_customerApply, i_responseBox, i_toAnimateLoader, o_callback) {
		var _isValidForm = this.isValidFormApply(i_customerApply);
		
		if (_isValidForm.valid) this.makeCall(i_customerApply, i_responseBox, i_toAnimateLoader, o_callback);
		else o_callback(_isValidForm);
	}

	//---/ Getters & Setters
	return Caller;
})();

AIDLib.MessagePresentor = (function(){
	function MessagePresentor(){
		this.m_conversationPartner = '';
		this.m_messageHolder = '.output-message';
		this.m_errorMessageClass = 'error-message';
		this.m_baseErrorMsg = 'ארעה שגיאה. אנא נסה שנית מאוחר יותר.';
		this.m_responseMsg = '';
	}

	MessagePresentor.prototype.SetPartner = function(i_partner){
		this.m_conversationPartner = i_partner;
	}

	MessagePresentor.prototype.GetCurrMsgBox = function(){
		return this.m_conversationPartner + ' ' + this.m_messageHolder;
	}

	MessagePresentor.prototype.RespondBaseErrorMsg = function(){
		if (this.m_conversationPartner == '') console.error('no partner was setted for this conversation.');
		else $(this.GetCurrMsgBox()).addClass(this.m_errorMessageClass).text(this.m_baseErrorMsg);
	}

	MessagePresentor.prototype.RespondErrorMsg = function(i_msg){
		if (this.m_conversationPartner == '') console.error('no partner was setted for this conversation.');
		else $(this.GetCurrMsgBox()).addClass(this.m_errorMessageClass).text(i_msg);
	}
	
	MessagePresentor.prototype.RespondValidMsg = function(i_msg){
		if (this.m_conversationPartner == '') console.error('no partner was setted for this conversation.');
		else $(this.GetCurrMsgBox()).text(i_msg);
	}

	MessagePresentor.prototype.RespondInternalError = function(i_msg){
		console.log(i_msg);
		this.RespondBaseErrorMsg();
	}

	return MessagePresentor;
})();

//----/ HANDLER
var myCaller = new AIDLib.Caller('applicationLogic/BL/databaseController.php'),
	myPresentor = new AIDLib.MessagePresentor();