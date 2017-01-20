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

	public function SendEmail($i_To, $i_Subject, $i_Msg)
	{
		$v_Res = null;
		$v_To = $i_To;
		$v_Subject = $i_Subject;
		$v_Msg = $i_Msg;

		$headers = "MIME-Version: 1.0" . "\r\n";
		$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
		$headers .= 'From: <webmaster@example.com>' . "\r\n";
		$headers .= 'Cc: myboss@example.com' . "\r\n";

		$v_Res = mail($v_To, $v_Subject, $v_Msg, $headers);
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