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
	private $m_Response;
	
	/*----/ CTOR */
	function DBServlet (){ 
		$this->m_DbHost = dbHost;
		$this->m_DbUserName = dbUser;
		$this->m_DbPassword = dbPass;
		$this->m_DbName = dbName;
		
		$this->m_Response = new Response();
	}
	
	/*----/ Methodes */
	public function InsertCustomerApplyInput($i_CostumerApply){
		return $this->processOperation("INSERT INTO CustomerSupport(Full_Name, Phone, Mail, Date, Subject, Message) VALUES(".$i_CostumerApply->fullName.", ".$i_CostumerApply->phone.", ".$i_CostumerApply->mail.", ".$this->GetCurrentTime().", ".$i_CostumerApply->subject.", ".$i_CostumerApply->message.")");
	}
	
	/*----/ Getters & Setters */
	public function GetCurrentTime(){
		return date('y-m-d H:i:s', time());
	}

	public function GetAllCarsInDb(){
		return $this->processOperation("SELECT * FROM Cars");
	}
	
	public function GetFilteredCarsInDb($i_FilterParams){
		//----/ from selectors
		$fromYear = ($i_FilterParams->fromYear == "")? 0 : $i_FilterParams->fromYear;
		$fromMileage = ($i_FilterParams->fromMileage == "")? 0 : $i_FilterParams->fromMileage;
		$fromPrice = ($i_FilterParams->fromPrice == "")? 0 : $i_FilterParams->fromPrice;
		//----/ to selectors
		$toYear = ($i_FilterParams->toYear == "")? '(SELECT MAX(Year) FROM Cars)' : $i_FilterParams->toYear;
		$toMileage = ($i_FilterParams->toMileage == "")? '(SELECT MAX(Mileage) FROM Cars)' : $i_FilterParams->toMileage;
		$toPrice = ($i_FilterParams->toPrice == "")? '(SELECT MAX(Price) FROM Cars)' : $i_FilterParams->toPrice;
		//----/ any selectors
		$manufacturerQuery = ($i_FilterParams->manufacturer == "")? '(Manufacturer >= 0)' : '(Manufacturer="'.$i_FilterParams->manufacturer.'")';
		$categoryQuery = ($i_FilterParams->category == "")? '(Category >= 0)' : '(Category="'.$i_FilterParams->category.'")';
		$modelQuery = ($i_FilterParams->model == "")? '(Model >= 0)' : '(Model="'.$i_FilterParams->model.'")';
		//----/ agrigate queries
		$yearQuery = '(Year BETWEEN '.$fromYear.' AND '.$toYear.')';
		$mileageQuery = '(Mileage BETWEEN '.$fromMileage.' AND '.$toMileage.')';
		$priceQuery = '(Price BETWEEN '.$fromPrice.' AND '.$toPrice.')';

		$queryBase = 'SELECT * FROM Cars WHERE ('.$manufacturerQuery.' AND '.$categoryQuery.' AND '.$modelQuery.' AND '.$yearQuery.' AND '.$mileageQuery.' AND '.$priceQuery.')';
		
		return $this->processOperation($queryBase);
	}

	/*----/ AID Funcs */
	private function processOperation($i_mysqlQuery){
		try {
			$this->initConnection();

			$query = $this->m_Connection->prepare($i_mysqlQuery);
			$query->execute();	
			$v_res = $query->fetchAll();

			if (!$v_res) throw new PDOException("Error Processing Request", 1);
			else { 
				$this->m_Response->SetMsg('successful');
				$this->m_Response->SetFlag(true);
				$this->m_Response->SetData($this->generateValidResaultResponse($v_res));
			}
		} catch(PDOException $e) {
			$this->setConnectionStat(false); 
			$this->m_Response->SetMsg($e->getMessage()); 
			$this->m_Response->SetFlag(false); 
			$this->m_Response->SetData($e);
		}

		return $this->m_Response;
	}

	private function generateValidResaultResponse($i_queryValue){
		$v_res = true;

		if (is_array($i_queryValue)) {
			$convertedArray = array();
			foreach($i_queryValue as $key => $val){
				$v_currConvertedVal = array(
					'id' => $val['Cars.ID'],
					'manufacturer' => $val['Cars.Manufacturer'],
					'category' => $val['Cars.Category'],
					'model' => $val['Cars.Model'],
					'year' => $val['Cars.Year'],
					'color' => $val['Cars.Color'],
					'mileage' => $val['Cars.Mileage'],
					'status' => $val['Cars.Car_status'],
					'sale' => $val['Cars.Type_of_sale'],
					'price' => $val['Cars.Price'],
					'image' => $val['Cars.Image']
				);

				array_push($convertedArray, $v_currConvertedVal);
			}

			$v_res = array(
				'TotalResaultsNumber' => count($i_queryValue),
				'Data' => $convertedArray
			);
		} 

		return $v_res;
	}

	private function isConected(){ //----/ THIS IS A MUST - DONT MODIFY
		return $this->m_IsConnected;
	}
	
	private function setConnectionStat($bool){ //----/ THIS IS A MUST - DONT MODIFY
		$this->m_IsConnected = $bool;
	}

	private function initConnection() { //----/ THIS IS A MUST - DONT MODIFY
		try {
			$this->m_Connection = new PDO("mysql:host=".$this->m_DbHost.";dbname=".$this->m_DbName, $this->m_DbUserName, $this->m_DbPassword);
			$this->m_Connection-> exec("SET NAMES 'utf8';");
			$this->m_Connection-> setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
			$this->m_Connection-> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->m_Connection-> setAttribute(PDO::ATTR_EMULATE_PREPARES, 1);
			$this->m_Connection-> setAttribute(PDO::ATTR_FETCH_TABLE_NAMES, true);
			
		} catch(PDOException $e) {
			$this->m_Response->SetMsg("ERROR, Could not connect to DB: ".$e->getMessage());
			$this->m_Response->SetFlag(false);
			$this->m_Response->SetData($e);
			exit();
		}		
	}
}
?>