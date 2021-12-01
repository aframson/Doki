<?php 

    $con = mysqli_connect('localhost','clicbgub_doki','dokidelivery','clicbgub_doki');

    $json = file_get_contents('php://input');

    $data = json_decode($json,true);  

    // $phone = $data['phone'];

    $code = $data['code'];
    
    


    $check = mysqli_query($con,"SELECT * FROM verication WHERE code = '$code'");

    $result =  array();

    if (mysqli_num_rows($check) > 0) {


        $result = array(

            'status' => 'success',

            'message' => 'Verification Successful'

        );
        
    }else{
            
            $result = array(
    
                'status' => 'error',
    
                'message' => 'Verification Failed'
    
            );
    }

    echo json_encode($result);
    
    