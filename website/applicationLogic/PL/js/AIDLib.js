//----/ GLOBE
var AIDLib = AIDLib || {};

//----/ AID FUNCS
function inherit(i_Base, i_Derived) {
	function Dummy() { }
	Dummy.prototype = i_Base.prototype;
	i_Derived.prototype = new Dummy();
}

function toggleLoadAnimation(i_obj) { //---/ make sure css is hooked aswell!
	if (i_obj.length != undefined && $(i_obj).length > 0) {
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

function isValidApplyHelper(i_request){
	var v_res = {
		'Data': true, //TODO: modify like isValidFormApplyHelper
		'msg': ''
	};

	if (i_request == undefined || i_request == '' || i_request == null) {
		v_res.Data = false;
		v_res.msg = 'Object is not defined.';
	} else if (i_request.method == '' || i_request.method == null) {
		v_res.Data = false;
		v_res.msg = 'Object method requset is not defined.';
	} else if (i_request.params == undefined || i_request.params == null) {
		v_res.Data = false;
		v_res.msg = 'Object params is not defined.';
	} 

	if (!v_res.Data) console.log(v_res.msg);
	return v_res;
}

function isValidFormApplyHelper(i_FormApply){
	var v_res = {
		'Data': null,
		'msg': ''
	};

	if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(i_FormApply.params.mail))) {
		v_res.Data = false;
		v_res.msg = 'mail error';
	} else if (!(/^(\d[\s-]?)?[\(\[\s-]{0,2}?\d{2}[\)\]\s-]{0,2}?\d{3}[\s-]?\d{4}$/i.test(i_FormApply.params.phone))) {
		v_res.Data = false;
		v_res.msg = 'phone error';
	} else {
		v_res.Data = true;
		v_res.msg = 'ok';
	}

	if (!v_res.Data) console.log(v_res.msg);
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
			var _responseType = Object.prototype.toString.call(i_response);

			if (_responseType === '[object Array]' || _responseType === '[object Object]') this.m_response = i_response;
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

	Caller.prototype.sendCustomerApply = function(i_customerApply, i_responseBox, i_toAnimateLoader, o_callback) {
		var _isValidApply = isValidApplyHelper(i_customerApply);
			_isValidForm = isValidFormApplyHelper(i_customerApply);
		
		if (_isValidForm.Data && _isValidApply.Data) this.makeCall(i_customerApply, i_responseBox, i_toAnimateLoader, o_callback);
		else o_callback(_isValidForm);
	}
	
	Caller.prototype.getSearchResaultsByRequest = function(i_request, i_responseBox, i_toAnimateLoader, o_callback) {
		var _apply = isValidApplyHelper(i_request);
		
		if (_apply.Data) this.makeCall(i_request, i_responseBox, i_toAnimateLoader, o_callback);
		else o_callback(_apply);
	}

	//---/ Getters & Setters
	Caller.prototype.getSearchResaultById = function(i_id, i_animationParentSelector, i_toAnimateLoader, o_callback){
		o_request = {
			'method': 'GetCarDetailsById',
			'params': i_id
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
		this.m_baseNoResaultsMsg = 'לא נמצאו תוצאות מתאימות. אנא נסה שנית.';
		this.m_responseMsg = '';
	}

	MessagePresentor.prototype.SetPartner = function(i_partner){
		this.m_conversationPartner = i_partner;
	}

	MessagePresentor.prototype.GetCurrMsgBox = function(){
		return this.m_conversationPartner + ' ' + this.m_messageHolder;
	}
	
	MessagePresentor.prototype.ClearCurrMsgBox = function(){
		if ($(this.GetCurrMsgBox()).length < 1 || $(this.GetCurrMsgBox()) == undefined) return;
		else $(this.GetCurrMsgBox()).text('');
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
	
	MessagePresentor.prototype.RespondNoResaultsMsg = function(){
		if (this.m_conversationPartner == '') console.error('no partner was setted for this conversation.');
		else $(this.GetCurrMsgBox()).addClass(this.m_errorMessageClass).text(this.m_baseNoResaultsMsg);
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
	
	SearchResaultsBuilder.prototype.clearResaultsPan = function(o_callback){
		$(this.m_parent).text('');
		if (typeof o_callback === 'function' && o_callback != 'undefined')  o_callback();
	}
			
	return SearchResaultsBuilder;
})();

AIDLib.SmallResaultBuilder = (function(){
	var m_searchResaultsBuilder = AIDLib.SearchResaultsBuilder;

	function SmallResaultBuilder(i_parent){
		//--/ 0 = id, 1 = img, 2 = item name, 3 = price
		this.m_defaultSmallResaultTemplate = '<div id="car-{0}" class="car-mini-box easy-transition" data-display="flex" data-flex-dirdction="column"><div class="car-mini-img img-contain" style="background-image:url({1});"></div><p class="car-box-model">{2}</p><p class="car-box-price">החל מ-{3} &#8362;</p></div>';
		this.m_parent = (i_parent != '' || i_parent != undefined) ? i_parent : '';
		m_searchResaultsBuilder.call(this, this.m_parent, this.m_defaultSmallResaultTemplate);
	}
	
	inherit(m_searchResaultsBuilder, SmallResaultBuilder);
	
	SmallResaultBuilder.prototype.buildResaultBox = function(){
		var _typeOfResault = Object.prototype.toString.call(this.m_resaultsArr);

		if (_typeOfResault != '[object Array]' || (_typeOfResault === '[object Array]' && this.m_resaultsArr.length == 0) || this.m_parent === '') console.log('missing parameters on search builder.');
		else {
			var _res = '',
				_template = this.m_resaultTemplate;

			$.each(this.m_resaultsArr, function(key, car){
				_res += _template.format([car.id, car.image, car.manufacturer + ' ' + car.model, car.price]);
			});
			
			$(this.m_parent).append(_res);
		}
	}

	return SmallResaultBuilder;
})();

AIDLib.BigResaultBuilder = (function(){
	var m_searchResaultsBuilder = AIDLib.SearchResaultsBuilder;

	function BigResaultBuilder(i_parent){
		//--/ place holders mapping => 0=id, 1=img, 2=manufacturer, 3=model, 4=category, 5=year, 6=color, 7=mileage, 8=sale, 9=status, 10=price
		this.m_defaultBigResaultTemplate = '<div class="lightbox-data-holder lightbox-body-part"><div id="{0}" class="big-car-resault" data-display="flex" data-flex-direction="column"><div class="big-resault-img img-center-align big-car-resault-prim-data-row" style="background-image: url({1});"></div><div class="big-car-resault-prim-data-row" data-display="flex" data-flex-wrap="nowrap"><div class="big-car-resault-prim-data-part" data-display="flex" data-flex-direction="column"><div class="big-car-resault-prim-data-part-item"><b>יצרן: </b>{2}</div><div class="big-car-resault-prim-data-part-item"><b>דגם: </b>{3}</div><div class="big-car-resault-prim-data-part-item"><b>קטגוריה: </b>{4}</div><div class="big-car-resault-prim-data-part-item"><b>שנה: </b>{5}</div></div><div class="big-car-resault-prim-data-part" data-display="flex" data-flex-direction="column"><div class="big-car-resault-prim-data-part-item"><b>צבע: </b>{6}</div><div class="big-car-resault-prim-data-part-item"><b>קילומטרז: </b>{7}</div><div class="big-car-resault-prim-data-part-item"><b>מכירה: </b>{8}</div><div class="big-car-resault-prim-data-part-item"><b>יד: </b>{9}</div></div></div><div class="big-car-resault-prim-data-row"><b>החל ממחיר: </b>{10}</div></div></div>';
		this.m_parent = (i_parent != '' || i_parent != undefined) ? i_parent : '';
		m_searchResaultsBuilder.call(this, this.m_parent, this.m_defaultBigResaultTemplate);
	}

	inherit(m_searchResaultsBuilder, BigResaultBuilder);
	
	BigResaultBuilder.prototype.buildResaultBox = function(){
		if (Object.prototype.toString.call(this.m_resaultsArr) != '[object Array]' || (Object.prototype.toString.call(this.m_resaultsArr) === '[object Array]' && this.m_resaultsArr.length == 0) || this.m_parent === '') console.log('missing parameters on search builder.');
		else {
			var _res = '',
				_template = this.m_resaultTemplate;

			$.each(this.m_resaultsArr, function(key, car){
				_res += _template.format([car.id, car.image, car.manufacturer, car.model, car.category, car.year, car.color, car.mileage, car.sale, car.status, car.price]);
			});
			
			$(this.m_parent).append(_res);
		}
	}

	return BigResaultBuilder;
})();

AIDLib.SearchResaultsDirector = (function(){
	function SearchResaultsDirector(){ }

	SearchResaultsDirector.prototype.construct = function(i_builder, o_callback){
		i_builder.clearResaultsPan();
		i_builder.buildResaultBox();
		if (typeof o_callback === 'function' && o_callback != 'undefined')  o_callback();
	}

	SearchResaultsDirector.prototype.displayResaults = function(i_request, i_animationParentSelector, i_toAnimateLoader, o_callback){
		myCaller.getSearchResaultsByRequest(i_request ,i_animationParentSelector, i_toAnimateLoader, function(i_response){
			mySmallCarResaultsBuilder.setResaultArr(i_response.Data);
			mySearchResaultsDirector.construct(mySmallCarResaultsBuilder, function(){
				o_callback();
			});
		});
	}

	SearchResaultsDirector.prototype.clearResaultsPan = function(i_builder){
		i_builder.clearResaultsPan();
	}

	return SearchResaultsDirector;
})();

//----/ HANDLER
var myCaller = new AIDLib.Caller('applicationLogic/BL/databaseController.php'),
	myPresentor = new AIDLib.MessagePresentor();