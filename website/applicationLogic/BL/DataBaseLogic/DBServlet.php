<?php
header('Content-Type: text/html; charset=utf-8');
ini_set('display_errors',1);
error_reporting(E_ALL | E_STRICT);

include (dirname(__FILE__)."/../Includs/dbKey.php");
include "Response.php";

/*-------------------------------------------------------------------------------/ class DATABASE SERVLET */
class DBServlet {
	/*----/ MEMBERS */
	private	$m_DbHost = '';
	private	$m_DbUserName = '';
	private	$m_DbPassword = '';
	private	$m_DbName = '';
	private $m_IsConnected = false;
	private $m_Connection = NULL;
	
	/*----/ CTOR */
	function DBServlet (){ 
		$this->m_DbHost = dbHost;
		$this->m_DbUserName = dbUser;
		$this->m_DbPassword = dbPass;
		$this->m_DbName = dbName;
	}
	
	/*----/ Methodes */
	
	//--------------/ EXAMPLE METHOD (REMOVE AFTER YOU UNDERSTAND HOW IT WORKS AND START WORKING ON YOUR OWN CODE) /-------------------//
	//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
	
	// public function IsValidUser($i_User){ 
	// 	$v_Response = new Response();
		
	// 	try {
	// 		$this->initConnection(); //---/ this line calls to a private method to connect the database (listed below)
			
	// 		$query = $this->connection->prepare("SELECT * FROM RegisterdUsersList WHERE UserName='" . $i_User->GetName() . "' AND UserPass='" . $i_User->GetPassword() . "' LIMIT 1"); //---/ pdo example usage to select relevant data from table
	// 		$query->execute(); //---/ pdo execution statement for the line above
	// 		$row = $query->fetch(); //---/ pdo retrive last executed data statement into 'row' element 
			
	// 		if ($row) { //---/ check if data was retrived
	// 			//----/ do stuff here and get some response into an element...
				
	// 			$this->setConnectionStat(true); //---/ this line keeps connection to database open and flags if there is a cross request (only on request at a time is allowed)
	// 			$v_Response->SetMsg(/*--/ element(str / obj / int / etc) /--*/); //---/ this line stores the resault 
	// 			$v_Response->SetFlag(true); //---/ this line sets the response as a valid response (just like saying 'ok')
	// 		}
	// 	} catch (PDOException $e) { //---/ catchs pdo default exceptions (no need for custom messages here - use only default!)
	// 		$this->setConnectionStat(false); //---/ this line closes the connection
	// 		$v_Response->SetMsg($e); //---/ this line stores the exception message
	// 		$v_Response->SetFlag(false); //---/ this line sets the response as an invalid response
	// 	}
		
	// 	return $v_Response; //---/ return the response object
	// }

	public function InsertCustomerApplyInput($i_CostumerApply){
		$v_Response = new Response();
	
		try {
			$this->initConnection();

			$query = $this->connection->prepare("INSERT INTO CustomerSupport(Full_Name, Phone, Mail, Date, Subject, Message) VALUES(:fullName, :phone, :mail, :date, :subject, :msg)"); //---/ pdo example usage to select relevant data from table
			$v_res = $query->execute(array(':fullName' => $i_CostumerApply->fullName, ':phone' => $i_CostumerApply->phone, ':mail' => $i_CostumerApply->mail, ':date' => $this->GetCurrentTime(), ':subject' => $i_CostumerApply->subject, ':msg' => $i_CostumerApply->message));	

			if ($v_res) {
				$v_Response->SetMsg($v_res);
				$v_Response->SetFlag(true);
			}
		} catch(PDOException $e) {
			$this->setConnectionStat(false); 
			$v_Response->SetMsg($e); 
			$v_Response->SetFlag(false); 
		}

		return $v_Response;
	}


// 	public function FetchCarsDetailsFromTable($i_Type){
	
// 	$v_response = new Response();
	
// 	try {
// 		$this->initConnection();
// 	// 		$query = $this->connection->prepare("SELECT * FROM RegisterdUsersList WHERE UserName='" . $i_User->GetName() . "' AND UserPass='" . $i_User->GetPassword() . "' LIMIT 1"); //---/ pdo example usage to select relevant data from table

// 		$query = $this->connection->prepare("SELECT * FROM Cars WHERE Full_Name = '" . $i_Type . "' OR phone = '". $i_Type . "' OR //---/ pdo example usage to select relevant data from table
// 		$v_res = $query->execute(array(':fullName' => $i_CostumerApply->fullName, ':phone' => $i_CostumerApply->phone, ':mail' => $i_CostumerApply->mail, ':date' => $i_CostumerApply->date, ':subject' => $i_CostumerApply->subject, ':msg' => $i_CostumerApply->message));
	
// 		if ($v_res) {
// 			$v_response->SetMsg($v_res);
// 			v_Response->SetFlag(true);			
// 		}
// 	} catch(PDOException $e) {
// 		$this->setConnectionStat(false); 
// 		$v_Response->SetMsg($e); 
// 		$v_Response->SetFlag(false); 
// 	}

// 	return $v_response;
// }


	
	/*----/ Getters & Setters */
	public function SetConnectionStat($bool){ //----/ THIS IS A MUST - DONT MODIFY
		$this->m_IsConnected = $bool;
	}
	
	public function GetCurrentTime(){
		return date('y-m-d H:i:s', time());
	}

	public function GetAllCarsInDb(){
		$v_Response = new Response();
	
		try {
			$this->initConnection();

			$query = $this->connection->prepare("SELECT * FROM Cars");
			$query->execute();	
			$v_res = $query->fetchAll();

			if ($v_res) {
				$v_Response->SetMsg('successful');
				$v_Response->SetFlag(true);

				return $v_res;
			}
		} catch(PDOException $e) {
			$this->setConnectionStat(false); 
			$v_Response->SetMsg($e); 
			$v_Response->SetFlag(false); 
		}

		return $v_Response;
	}

	/*----/ AID Funcs */
	// private function getSearchRange($i_StartRange, $i_EndRange){
		// TODO
	// }

	public function IsConected(){ //----/ THIS IS A MUST - DONT MODIFY
		return $this->m_IsConnected;
	}
	
	private function initConnection() { //----/ THIS IS A MUST - DONT MODIFY
		try {
			$this->connection = new PDO("mysql:host=".$this->m_DbHost.";dbname=".$this->m_DbName, $this->m_DbUserName, $this->m_DbPassword);
			$this->connection-> exec("SET NAMES 'utf8';");
			$this->connection-> setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
			$this->connection-> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->connection-> setAttribute(PDO::ATTR_EMULATE_PREPARES, 1);
			$this->connection-> setAttribute(PDO::ATTR_FETCH_TABLE_NAMES, true);
			
		} catch(PDOException $e) {
			$this->response->setMsg("ERROR, Could not connect to DB: ".$e->getMessage());
			exit();
		}		
	}
}
?>