import React, { useEffect,useState } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity ,TextInput,KeyboardAvoidingView,ScrollView,Animated,} from 'react-native';
import * as Contacts from 'expo-contacts';
var { height, width } = Dimensions.get('window');
import { Icon, Header, Tooltip } from 'react-native-elements';
// import {useNavigation} from '@react-navigation/native';

export default function Contact(props) {

  // const userBack = useRef(new Animated.Value(width+100)).current;


// const navigation = useNavigation();


const [state,setState] = useState({
            name:'',
            phone:'',
});



  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.Emails,
            Contacts.PHONE_NUMBERS,
          ],
        });

        if (data.length > 0) {
          const contact = data[0];  
          // console.log(data);
        }
      }
    })();  
  }, []);









  return (
      <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "height" : "padding"} style={{flex:1}}>
       <ScrollView style={{flex:1}}>
      <Text style={{ fontSize: 40, width: width / 1.2, padding: 20, fontWeight: "bold", marginTop: 50 }}>Who's recieving the package</Text>
      <Text style={{ marginLeft: 20, fontSize: 20, width: width / 1.1 }}>The Driver may contact the recient to complete the delivery</Text>
     
      <View style={{width:'auto',marginTop:50}}>
          <Text style={{fontSize:25,marginLeft:22,marginTop:10}}>Name {state.name}</Text>
          <TextInput
           placeholder="Enter Recievers name"
           value={state.name}
           onChangeText={(text) => { setState({ ...state, name: text }) }}
           style={{height: 50, borderColor: 'gray', borderWidth: 1,paddingLeft:20,width:width-50,alignSelf: 'center',marginTop:10,fontSize:20}}
          />
          <Text style={{fontSize:25,marginLeft:22,marginTop:10}}>Telephone </Text>
          <TextInput
           keyboardType={'number-pad'}
           value={state.telephone}
           onChangeText={(text) => { setState({ ...state, phone: text}) }}
           placeholder="Enter Recievers name"
           style={{height: 50, borderColor: 'gray', borderWidth: 1,paddingLeft:20,width:width-50,alignSelf: 'center',marginTop:10,fontSize:20}}
          />
      </View>
      <TouchableOpacity onPress={()=>props.navigation.navigate('Map',{name:state.name,phone:state.phone})} style={{width:'87%',height:50,backgroundColor:'black',alignSelf:'center',bottom:-50,alignItems: 'center',justifyContent: 'center'}}>
          <Text style={{color:'white'}}>Continue</Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}