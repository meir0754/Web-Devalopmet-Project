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
		return $this->execute($this->m_DbServlet->InsertCustomerApplyInput($i_UserApplyParams));
	}

	// /*----/ Getters & Setters */	
	public function GetAllCars(){
		return $this->execute($this->m_DbServlet->GetAllCarsInDb());
	}

	public function GetFilteredCars($i_FilterParams){
		return $this->execute($this->m_DbServlet->GetFilteredCarsInDb($i_FilterParams));
	}
	
	/*----/ AID Funcs */
	//---/ USE PRIVATE FUNCS HERE IF NEEDED
	private function execute($i_Response){
		if ($i_Response->GetFlag()) 
			return $i_Response->GetData();
		else 
			return $i_Response->GetMsg();
	}
}
?>