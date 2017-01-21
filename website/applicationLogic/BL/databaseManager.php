<?php
header('Content-Type: text/html; charset=utf-8');
ini_set('display_errors',1);
error_reporting(E_ALL | E_STRICT);

include "DataBaseLogic/DBServlet.php"; //---/ include the servlet class that will be incharge of communication with the tables
include "DataBaseLogic/User.php"; //---/ include user class (maybe will be removed)
include "DataBaseLogic/RegisterdUser.php"; //---/ include registerd user class (maybe will be removed)

/*-------------------------------------------------------------------------------/ class DATABASE MANAGER */
class DBManager {
	/*----/ MEMBERS */
	private $m_DbServlet;
	private $m_User;
	private $m_RegisterdUser;
	
	private $m_MailTo = "yakir529@gmail.com"; // change to: somebody@example.vom
	private $m_Subject = "התקבלה פניה חדשה מהאתר";
	private $m_ValidMsgToEmail = "נרשמה פניה חדשה במאגר. אנא בצע טיפול בהקדם.";
	private $m_InvalidMsgToEmail = "קרתה שגיאה במהלך קבלת פניה חדשה! אנא פנה למנהל המערכת בהקדם!";

	
	/*----/ CTOR */
	function DBManager(){ 
		$this->m_DbServlet = new DBServlet();
		$this->m_Response = new Response();
	}
	
	/*----/ Methodes */
	//---/ USE PUBLIC METHODS HERE
	public function InsertNewApply($i_UserApplyParams) {
		$v_Response = $this->m_DbServlet->InsertCustomerApplyInput($i_UserApplyParams);
		
		if ($v_Response->GetFlag()) {
			$v_MailResponse = $this->SendMail($i_UserApplyParams);
			if (!$v_MailResponse) $v_Res = $v_MailResponse;
			else $v_Res = $v_Response->GetMsg();
		} else $v_Res = $v_Response->GetMsg();

		return $v_Res;
	}

	public function SendMail($i_UserApplyParams) {
		$v_CurrMsg = "name: " . $i_UserApplyParams->fullName;
		$v_CurrMsg .= "phone: " . $i_UserApplyParams->phone;
		$v_CurrMsg .= "mail: " . $i_UserApplyParams->mail;
		$v_CurrMsg .= "date: " . $this->m_DbServlet->GetCurrentTime();
		$v_CurrMsg .= "subject: " . $i_UserApplyParams->subject;
		$v_CurrMsg .= "message: " . $i_UserApplyParams->message;
		
		return $this->m_Response->SendToEmail($this->m_MailTo, $this->m_Subject, $v_CurrMsg);
	}
	
	// /*----/ Getters & Setters */	

	
	/*----/ AID Funcs */
	//---/ USE PRIVATE FUNCS HERE IF NEEDED
}
?>