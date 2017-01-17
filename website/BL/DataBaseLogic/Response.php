<?php
header('Content-Type: text/html; charset=utf-8');
ini_set('display_errors',1);
error_reporting(E_ALL | E_STRICT);

/*-------------------------------------------------------------------------------/ class RESPONSE */
class Response {
	private $m_AbsFlag;
	private $m_Msg;
	
	/*----/ CTOR */
	function Response() {
		$this->msg = '';
		$this->m_AbsFlag = false;
	}
	
	/*----/ Methodes */
	public function Write($i_String = "") {
		print($i_String);
	}

	public function Redirect($url = "."){
		header("Location: " . $url,TRUE,303);
		die();
	}

	public function End() {
		exit();
	}

	public function Cookies($i_CookieName="", $i_Value="", $i_ExpirationInDays = 31) {
		if($i_CookieName != "" && $i_Value != "" && is_numeric($i_ExpirationInDays) && $i_ExpirationInDays != "") {
			$v_ExpirationTime = time() + 3600 * 24 * $i_ExpirationInDays;
			setcookie($i_CookieName, $i_Value, $v_ExpirationTime);
		}
	}
	
	/*----/ Getters & Setters */
	public function SetMsg($i_Msg) { 
		$this->m_Msg = $i_Msg;
	}

	public function GetMsg() {
		return $this->m_Msg;
	}
	
	public function SetFlag($i_Bool) { 
		$this->m_AbsFlag = $i_Bool;
	}

	public function GetFlag() {
		return $this->m_AbsFlag;
	}
}

?>