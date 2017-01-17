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
	
	/*----/ CTOR */
	function DBManager(){ 
		$this->m_DbServlet = new DBServlet();
		$this->m_Response = new Response();
	}
	
	/*----/ Methodes */
	//---/ USE PUBLIC METHODS HERE
	public function AuthenticateUser($i_UserParams){ //---/ EXAMPLE USAGE FOR METHOD (REMOVE IT ONCE YOU UNDERSTAND HOE IT WORKS)
		$this->m_User = new User($i_UserParams->UserName, $i_UserParams->UserPassword, $i_UserParams->UserRemember); //---/ this line creates a user
		
		$v_Response = $this->m_DbServlet->IsValidUser($this->m_User); //---/ this line checks if user is registerd and returns a response 
		
		if ($v_Response->GetFlag() == true) { //---/ if response is valid (checks if every thing went 'ok')
			$this->m_RegisterdUser = $this->GrantAccessToUser($this->m_User, $v_Response->GetMsg()); //---/ creates a registerd user
			
			return $this->m_RegisterdUser->GetDetails(); //---/ returns relevant registerd user details for the usage of the admin panel
		} else {
			return $v_Response->GetMsg(); //---/ returns the stored error message
		}
	}
	
	/*----/ Getters & Setters */
	public function GetPropertiesForSaleList($i_Params){ //---/ EXAMPLE USAGE FOR GETTER
		return $this->m_DbServlet->GetPropForSaleList($i_Params); //---/ returns the direct resault retrived from the servlet
	}
	
	/*----/ AID Funcs */
	//---/ USE PRIVATE FUNCS HERE IF NEEDED
}
?>