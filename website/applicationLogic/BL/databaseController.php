<?php
header('Content-Type: text/html; charset=utf-8');
ini_set('display_errors',1);
error_reporting(E_ALL | E_STRICT);

include "databaseManager.php"; //---/ include the manager class

// =======================================================================
	// allowed requstes here (method names as array)
	$allowedRequsets = array(
						"InsertNewApply",
						"SendMail",
						"GetAllCars",
						"GetFilteredCars"
						);    
// =======================================================================

$i_Data =  file_get_contents("php://input");  // get the complete POST request
$m_Flag = false;

if($i_Data) {		
		$data = json_decode($i_Data); 
		
		if(is_object($data)) {
			$requestedMethod =  $data->method;       // method:      String - the name of the function within the class (method)
			@$paramsArr[] = $data->params;       // params:      Array  - optional - an array of parameter values in the order the function expects them
			@$type =   $data->returntype;   // returntype:  String - optional - return data type, default: json || values can be: json, text, html
			
			// check if method request access is allowed 		
			foreach($allowedRequsets as $key => $method){
				if($requestedMethod == $method) $m_Flag = true;
			}
			
			if ($m_Flag){			
			// set type to json if not specified
				if(!$type) $type = "json";
				
				$m_DbMngr = new DBManager();
				
				// check that the function exists within the class
				if(!method_exists($m_DbMngr, $requestedMethod)) {
					die("Method " . $requestedMethod . " was not found.");
					exit();
				}
				
				// execute the function with the provided parameters
				$o_Res = call_user_func_array(array($m_DbMngr, $requestedMethod), $paramsArr);
				
				// return the results with the content type based on the $type parameter
				if ($type == "json") {
					header("Content-Type:application/json");
					echo json_encode($o_Res);
					exit();
				}
			} else {
				die("Forrbiden Access! Method '" . $requestedMethod . "' not allowed!");
				exit();
			}
		} else {
			die("Invalid request.");
			exit();
		}       

} else {
	die("Nothing posted");
	exit();
}

?>