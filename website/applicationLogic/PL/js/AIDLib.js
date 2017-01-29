//----/ GLOBE
var AIDLib = AIDLib || {};

//----/ AID FUNCS
function inherit(i_Base, i_Derived) {
	function Dummy() { }
	Dummy.prototype = i_Base.prototype;
	i_Derived.prototype = new Dummy();
}

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
		this.m_validResponse;
	}

	//---/ Methods
	Caller.prototype.makeCall = function(i_objToSend, i_animationParentSelector, i_toAnimateLoader, o_callback) {
		if (i_toAnimateLoader) toggleLoadAnimation(i_animationParentSelector);
		
		$.post(this.m_pathToCall, JSON.stringify(i_objToSend), function(i_response){
			this.m_validResponse = true;
			if (Object.prototype.toString.call(i_response) === '[object Array]') this.m_response = i_response;
			else this.m_response = JSON.parse(i_response);
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
	Caller.prototype.getAllSearchResaults = function(i_animationParentSelector, i_toAnimateLoader, o_callback){
		o_request = {
			'method': 'GetAllCars',
			'params': ''
		};

		this.makeCall(o_request, i_animationParentSelector, i_toAnimateLoader, o_callback);
	}

	Caller.prototype.getLastResponse = function(){
		return this.m_response;
	}

	Caller.prototype.isValidResponse = function(){
		return this.m_validResponse;
	}

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

AIDLib.SearchResaultsBuilder = (function(){
	function SearchResaultsBuilder(i_parent, i_template){
		//--/ 0 = id, 1 = img, 2 = item name, 3 = price
		this.m_defaultResaultTemplate = (i_template != '' || i_template != undefined) ? i_template : '';
		this.m_resaultTemplate = this.m_defaultResaultTemplate;
		this.m_parent = (i_parent != '' || i_parent != undefined) ? i_parent : '';
		this.m_resaultsArr = [];
	}

	SearchResaultsBuilder.prototype.setNewResaultParent = function(i_resaultParent){
		this.m_parent = (i_resaultParent != '' || i_resaultParent != undefined) ? i_resaultParent : '';
	}
	
	SearchResaultsBuilder.prototype.setNewResaultTemplate = function(i_template){
		this.m_resaultTemplate = (i_template != '' || i_template != undefined) ? i_template : '';
	}

	SearchResaultsBuilder.prototype.setResaultArr = function(i_resaultArr){
		this.m_resaultsArr = i_resaultArr;
	}

	SearchResaultsBuilder.prototype.restoreTemplateToDefault = function(){
		this.m_resaultTemplate = this.m_defaultResaultTemplate;
	}

	SearchResaultsBuilder.prototype.getParentSelector = function(){
		return this.m_parent;
	}
			
	return SearchResaultsBuilder;
})();

AIDLib.SmallResaultBuilder = (function(){
	var m_searchResaultsBuilder = AIDLib.SearchResaultsBuilder;

	function SmallResaultBuilder(i_parent){
		//--/ 0 = id, 1 = img, 2 = item name, 3 = price
		this.m_defaultSmallResaultTemplate = '<div id="car-{0}" class="car-box" data-display="flex" data-flex-dirdction="column"><div class="car-mini-img">{1}</div><p class="car-box-model">{2}</p><p class="car-box-price">החל מ-{3} &#8362;</p></div>';
		this.m_parent = (i_parent != '' || i_parent != undefined) ? i_parent : '';
		m_searchResaultsBuilder.call(this, this.m_parent, this.m_defaultSmallResaultTemplate);
	}
	
	SmallResaultBuilder.prototype.buildResaultBox = function(){
		if (Object.prototype.toString.call(this.m_resaultsArr) != '[object Array]' || (Object.prototype.toString.call(this.m_resaultsArr) === '[object Array]' && this.m_resaultsArr.length == 0) || this.m_parent === '') console.log('missing parameters on search builder.');
		else {
			var _res = '';

			$.each(this.m_resaultsArr, function(key, car){
				_res += this.m_resaultTemplate.format([car.id, car.image, car.details, car.price]);
			});
			
			$(this.m_parent).append(_res);
		}
	}

	inherit(m_searchResaultsBuilder, SmallResaultBuilder);

	return SmallResaultBuilder;
})();

AIDLib.BigResaultBuilder = (function(){
	var m_searchResaultsBuilder = AIDLib.SearchResaultsBuilder;

	function BigResaultBuilder(i_parent){
		//--/ 0 = id, 1 = 
		this.m_defaultBigResaultTemplate = '';
		this.m_parent = (i_parent != '' || i_parent != undefined) ? i_parent : '';
		m_searchResaultsBuilder.call(this, this.m_parent, this.m_defaultBigResaultTemplate);
	}
	
	BigResaultBuilder.prototype.buildResaultBox = function(i_arr){
		if (Object.prototype.toString.call(this.m_resaultsArr) != '[object Array]' || (Object.prototype.toString.call(this.m_resaultsArr) === '[object Array]' && this.m_resaultsArr.length == 0) || this.m_parent === '') console.log('missing parameters on search builder.');
		else $(this.m_parent).append(this.m_resaultTemplate.format(i_arr)); //TODO: make build accomodations here
	}

	inherit(m_searchResaultsBuilder, BigResaultBuilder);

	return BigResaultBuilder;
})();

AIDLib.SearchResaultsDirector = (function(){
	function SearchResaultsDirector(){ }

	SearchResaultsDirector.prototype.construct = function(i_builder){
		i_builder.buildResaultBox();
	}

	return SearchResaultsDirector;
})();

//----/ HANDLER
var myCaller = new AIDLib.Caller('applicationLogic/BL/databaseController.php'),
	myPresentor = new AIDLib.MessagePresentor();