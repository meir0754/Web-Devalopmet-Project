<?php
header('Content-Type: text/html; charset=utf-8');
ini_set('display_errors',1);
error_reporting(E_ALL | E_STRICT);

/*-------------------------------------------------------------------------------/ class USER */
class User {
	/*----/ Members */
	private $m_Name = '';
	private $m_Pass = '';
	private $m_RememberMe = false;
	
	/*----/ CTOR's */
	function User ($i_Name, $i_Pass, $i_Rem){ 
		$this->m_Name = $i_Name;
		$this->m_Pass = $i_Pass;
		$this->m_RememberMe = $i_Rem;
	}
	
	/*----/ Methodes */
	
	/*----/ Getters & Setters */
	public function GetName(){
		return $this->m_Name;
	}
	
	public function GetPassword(){
		return $this->m_Pass;
	}
	
	public function GetRememberMeStat(){
		return $this->m_RememberMe;
	}
}
?>