import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, Animated, Button } from 'react-native';
import * as Contacts from 'expo-contacts';
var { width } = Dimensions.get('window');
import { Icon, } from 'react-native-elements';
import BottomSheet from "react-native-gesture-bottom-sheet";
// import {useNavigation} from '@react-navigation/native';

export default function Contact(props) {

  // const userBack = useRef(new Animated.Value(width+100)).current;


  // const navigation = useNavigation();


  const [state, setState] = useState({
    name: '',
    phone: '',
  });

  const [contacts, setContacts] = useState(null);


  const BootnSheet = useRef();
  const bottomSheet = useRef();






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
          setContacts(data);
          console.log(data);
        }
      }
    })();
  }, []);




  const openContact = (items) => {
    setState({ ...state, name: items.name, phone: items.phoneNumbers[0].number })
    bottomSheet.current.close();
  }






  return (
    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "height" : "padding"} style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>

        <TouchableOpacity
          style={{position: 'absolute',margin:20}}
          onPress={() => props.navigation.navigate('Map')}
        >
          <Icon
            name='back'
            type='antdesign'
            color='black'
            size={35}
            style={{ marginTop: 10 }}
          />
        </TouchableOpacity>

        <Text style={{ fontSize: 40, width: width / 1.2, padding: 20, fontWeight: "bold", marginTop: 50 }}>Who's recieving the package</Text>
        <Text style={{ marginLeft: 20, fontSize: 20, width: width / 1.1 }}>The Driver may contact the recient to complete the delivery</Text>

        <View style={{ width: 'auto', marginTop: 50 }}>



          <BottomSheet
            hasDraggableIcon
            ref={bottomSheet} height={600}
          >
            <View style={{ flex: 1 }}>
              <ScrollView>
                {!!contacts && contacts.map((items, key) => (
                  <TouchableOpacity key={key} onPress={() => openContact(items)}
                    style={{
                      padding: 10,
                      borderBottomWidth: 1,
                      width: '100%',
                      borderBottomColor: '#ccc',

                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20 }}>{items.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </BottomSheet>







          {/* <Button title="OPEN BOTTOM SHEET" onPress={() => BootnSheet.current.open()} /> */}
          <Text style={{ fontSize: 25, marginLeft: 22, marginTop: 10 }}>Name </Text>
          <View style={{ flex: 1, flexDirection: 'row', width: '85%', alignSelf: 'center', }}>
            <TextInput
              placeholder="Enter Recievers name"
              value={state.name}
              onChangeText={(text) => { setState({ ...state, name: text }) }}
              style={{ height: 50, borderColor: 'gray', borderWidth: 1, paddingLeft: 20, width: width - 50, alignSelf: 'center', marginTop: 10, fontSize: 20, flex: 0.9 }}
            />
            <TouchableOpacity
              style={{ borderWidth: 1, flex: 0.2, height: 50, marginTop: 10, borderLeftWidth: 0, borderColor: 'gray' }}
              onPress={() => bottomSheet.current.show()}
            >
              <Icon
                name='contacts'
                type='antdesign'
                color='black'
                size={28}
                style={{ marginTop: 10 }}
              />
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 25, marginLeft: 22, marginTop: 10 }}> Telephone </Text>
          <TextInput
            keyboardType={'number-pad'}
            value={state.phone}
            onChangeText={(text) => { setState({ ...state, phone: text }) }}
            placeholder="Enter Recievers name"
            style={{ height: 50, borderColor: 'gray', borderWidth: 1, paddingLeft: 20, width: width - 50, alignSelf: 'center', marginTop: 10, fontSize: 20 }}
          />
        </View>

      </ScrollView>
      {/* <RBSheet
          ref={BootnSheet}
          height={600}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center"
            }
          }}
        >
          
        </RBSheet> */}
      <TouchableOpacity onPress={() => props.navigation.navigate('Map', { name: state.name, phone: state.phone })} style={{ width: '87%', height: 50, backgroundColor: 'black', alignSelf: 'center', bottom: 10, alignItems: 'center', justifyContent: 'center', position: 'absolute' }}>
        <Text style={{ color: 'white' }}>Continue</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({});