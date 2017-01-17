<?php
header('Content-Type: text/html; charset=utf-8');
ini_set('display_errors',1);
error_reporting(E_ALL | E_STRICT);

/*-------------------------------------------------------------------------------/ class REGISTERD USER */
class RegisterdUser {
	/*----/ Members */
	private $m_AuthStat;
	private $m_Response;
	private $m_User;
	private $m_ID;
	private $m_Token;
	private $m_FirstName;
	private $m_LastName;
	private $m_City;
	private $m_Street;
	private $m_HouseNum;
	private $m_PrimPhone;
	private $m_SecPhone;
	private $m_BirthDate;
	private $m_Email;
	
	/*----/ CTOR's */
	function RegisterdUser ($i_User, $i_Details){ 
		$this->m_AuthStat = true;
		$this->m_Response = new Response();
		
		$this->m_User = $i_User;
		
		$this->m_ID = $i_Details["id"];
		$this->m_FirstName = $i_Details["firstName"];
		$this->m_LastName = $i_Details["lastName"];
		$this->m_City = $i_Details["city"];
		$this->m_Street = $i_Details["street"];
		$this->m_HouseNum = $i_Details["houseNum"];
		$this->m_PrimPhone = $i_Details["phonePrim"];
		$this->m_SecPhone = $i_Details["phoneSec"];
		$this->m_BirthDate = $i_Details["birthDate"];
		$this->m_Token = $i_Details["token"];
		$this->m_Email = $i_Details["email"];
	}
	
	/*----/ Methodes */
	
	/*----/ Getters & Setters */
	public function GetRegisteredUserResponse(){
		return $this->m_Response;
	}
	
	public function GetUserName(){
		return $this->m_User->GetName();
	}
	
	public function GetUserPass(){
		return $this->m_User->GetPassword();
	}
	
	public function GetUserRememberMeStat(){
		return $this->m_User->GetRememberMeStat();
	}
	
	public function GetUserAuthStat() {
		return $this->m_AuthStat;
	}	
	
	public function GetUserToken() {
		return $this->m_Token;
	}

	public function GetUserID() {
		return $this->m_ID;
	}
	
	public function GetDetails(){
		return array(
			'id' => $this->m_ID,
			'firstName' => $this->m_FirstName,
			'lastName' => $this->m_LastName,
			'city' => $this->m_City,
			'street' => $this->m_Street,
			'houseNum' => $this->m_HouseNum,
			'phonePrim' => $this->m_PrimPhone,
			'phoneSec' => $this->m_SecPhone,
			'birthDate' => $this->m_BirthDate,
			'token' => $this->m_Token,
			'email' => $this->m_Email
		);
	}
}
?>