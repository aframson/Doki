import React,{useState,useContext,useEffect} from 'react'
import { View, Text, StyleSheet,TextInput,TouchableOpacity,ActivityIndicator} from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { FirebaseContext } from "common/src";
import { colors } from "../common/theme";

const Verify = (props) => {


    const [code,setCode] = useState('');  
    const [loading,setLoading] = useState(false);
    const bookingId = props.navigation.getParam("bookingId");
    const [curBooking, setCurBooking] = useState(null);
    const dispatch = useDispatch();
    const activeBookings = useSelector((state) => state.bookinglistdata.active);
    const { api } = useContext(FirebaseContext);
    const {
        fetchBookingLocations,
        stopLocationFetch,
        cancelBooking,
        updateBooking,
        getRouteDetails,
      } = api;

  
      useEffect(() => {
        if (activeBookings && activeBookings.length >= 1) {
          let booking = activeBookings.filter(
            (booking) => booking.id == bookingId
          )[0];
          if (booking) {
            setCurBooking(booking);
          }
        }
      }, [activeBookings]);


      const endBooking = () => {
        let booking = { ...curBooking };
        booking.status = "REACHED";
        dispatch(updateBooking(booking));
      };
    


    const conCheckHandler = async ()=>{
        setLoading(true);
        try {
              const res = await fetch('https://doki.clickbuyez.com/check.php',{
                method: 'POST',
                headers:{
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                //   phone: value,
                  code: code,  
                })
              });
      
              const json = await res.json();
              console.log(json.status);
              if(json.status == "success"){
                endBooking();
                setLoading(false);
              }else{
                alert("Invalid Code");
                setLoading(false);
              }
          } catch (e) {
            // error reading value
            console.log("error reading value", e);
            setLoading(false);
          }
        

    }

    
    return (
        <View style={styles.constainer}>
            <View style={{marginTop:150,padding:10,alignItems: 'center'}}>
                <Text style={{fontSize:25,fontWeight:'bold'}}>Verify Identity</Text>
                <Text style={{fontSize:15,marginTop:10,textAlign:'center',width:300}}>Doki makes sure you send the package to the autorized reciever</Text>
            </View>
            <View style={{marginTop:20,padding:20,alignItems: 'center'}}>
                <Text style={{fontSize:18,width:300,textAlign:'center'}}>Enter the verification code from Reciever </Text>
                <TextInput 
                style={{
                    height:'auto',
                    width:300,
                    borderWidth:1,
                    borderColor:'black',
                    marginTop:10,
                    padding:15,
                    fontSize:30,
                    textAlign:'center',
                    borderRadius:5,
                    borderWidthColor:'#eee'
                }} 
                    placeholder="Enter code" 
                    onChangeText={(text)=>setCode(text)}
                />
            </View>
            <TouchableOpacity 
            onPress={()=>conCheckHandler()}
            style={{
                    marginTop:20,
                    padding:15,
                    alignItems: 'center',
                    width:'80%',
                    alignSelf: 'center',
                    backgroundColor:colors.BLUE.secondary,
                    }}>
                {loading?<ActivityIndicator color="white" size="small"/>:<Text style={{fontSize:18,color:'white'}}>Submit</Text>}
            </TouchableOpacity>
        </View>
    )
}

export default Verify

const styles = StyleSheet.create({
    constainer: {
        flex:1,
    }
});
