<?php 

$con = mysqli_connect('localhost','clicbgub_doki','dokidelivery','clicbgub_doki');

$json = file_get_contents('php://input');

$data = json_decode($json,true);  

$phone = $data['phone'];

$code = $data['code'];


    if(mysqli_query($con,"INSERT INTO verication(reciver_num,code) VALUES('$phone','$code')")){

        $phone = $item['reciver_num'];

        $code  = $item['code'];

        $message  = "delivery code : {$code} ";

        // USE ARKESEL TO SEND THE OTP
        
        $ch = curl_init("https://sms.arkesel.com/sms/api?action=send-sms&api_key=Om81MlpxTWVTOXFnN28xMGY=&to={$phone}&from=DOKI&sms={$message}");
        
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, TRUE);
       
        $response = curl_exec($ch);
        
        echo json_encode($response);
        
    }else{

        echo json_encode('couldnt send ');

    }
    
    