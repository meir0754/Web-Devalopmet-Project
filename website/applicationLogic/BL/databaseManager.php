<?php
header('Content-Type: text/html; charset=utf-8');
ini_set('display_errors',1);
error_reporting(E_ALL | E_STRICT);

include "DataBaseLogic/DBServlet.php"; //---/ include the servlet class that will be incharge of communication with the tables

/*-------------------------------------------------------------------------------/ class DATABASE MANAGER */
class DBManager {
	/*----/ MEMBERS */
	private $m_DbServlet;
	private $m_User;
	private $m_RegisterdUser;
	private $m_Response;
	
	/*----/ CTOR */
	function DBManager(){ 
		$this->m_DbServlet = new DBServlet();
		$this->m_Response = new Response();
	}
	
	/*----/ Methodes */
	//---/ USE PUBLIC METHODS HERE
	public function InsertNewApply($i_UserApplyParams) {
		$v_Response = $this->m_DbServlet->InsertCustomerApplyInput($i_UserApplyParams);
		
		if ($v_Response->GetFlag()) $v_Res = true;
		else $v_Res = $v_Response->GetMsg();

		return $v_Res;
	}

	// /*----/ Getters & Setters */	
	public function GetAllCars(){
		return $this->m_DbServlet->GetAllCarsInDb(); 
	}
	
	/*----/ AID Funcs */
	//---/ USE PRIVATE FUNCS HERE IF NEEDED
}
?>