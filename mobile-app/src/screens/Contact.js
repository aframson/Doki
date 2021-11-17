import React, { useEffect, useState, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
var { width } = Dimensions.get("window");
import { Icon } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { FirebaseContext } from "common/src";
import { language } from "config";
var { height, width } = Dimensions.get("window");
import { colors } from "../common/theme";
import AsyncStorage from '@react-native-async-storage/async-storage';


import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Contact(props) {


  console.log(props.navigation.state.params);



  const { api } = useContext(FirebaseContext);
  const { getEstimate } = api;

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const tripdata = useSelector((state) => state.tripdata);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { addBooking, clearEstimate, clearBooking, clearTripPoints } = api;
  const estimate = useSelector((state) => state.estimatedata.estimate);
  const settings = useSelector((state) => state.settingsdata.settings);


  const [state, setState] = useState({
    name: "",
    phone: "",
  });
  const cname = props.navigation.state.params && props.navigation.state.params.name;
  const cphone = props.navigation.state.params && props.navigation.state.params.phone;

  const storeContact = async () => {
    try {
      const main = state.phone;
      const nn = main.split(" ").join("")
      await AsyncStorage.setItem('@contact_key', nn)
    } catch (e) {
      // saving error
      console.log('error===>',e)
      
    }
  }




  useEffect(() => {
    if(cname || cphone)
    {
      setState({ ...state, name:cname, phone:cphone });
    }
}, [cname, cphone]);




  const bookNow = () => {
    storeContact();
    if (
      auth.info.profile.mobile == "" ||
      auth.info.profile.mobile == "" ||
      !auth.info.profile.mobile
    ) {
      Alert.alert(language.alert, language.updatemobile);
    } else {
      setButtonDisabled(true);
      dispatch(
        addBooking({
          pickup: estimate.pickup,
          drop: estimate.drop,
          carDetails: estimate.carDetails,
          userDetails: auth.info,
          estimate: estimate,
          tripdate: estimate.bookLater
            ? new Date(estimate.bookingDate).toString()
            : new Date().toString(),
          bookLater: estimate.bookLater,
          settings: settings,
          booking_type_web: false,
        })
      );
    }
  };


 
 

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        // behavior={Platform.OS == "ios" ? "height" : "padding"}
        style={{ flex: 1, height: height, backgroundColor: "white" }}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: "#fff", height: height }}
        >
          <TouchableOpacity
            style={{ position: "absolute", marginTop: 20, marginLeft: 20 }}
            onPress={() => props.navigation.navigate("Map")}
          >
            <Icon
              name="back"
              type="antdesign"
              color="black"
              size={35}
              style={{ marginTop: 10 }}
            />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 40,
              width: width / 1.2,
              padding: 20,
              fontWeight: "bold",
              marginTop: 80,
            }}
          >
            Who's recieving the package
          </Text>
          <Text style={{ marginLeft: 20, fontSize: 20, width: width / 1.1 }}>
            The Driver may contact the recient to complete the delivery
          </Text>

          <View>
           

            <Text style={{ fontSize: 25, marginLeft: 22, marginTop: 10 }}>
              Name{" "}
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                width: "85%",
                alignSelf: "center",
              }}
            >
              <TextInput
                placeholder="Enter Recievers name"
                value={state.name}
                onChangeText={(text) => {
                  setState({ ...state, name: text });
                }}
                style={{
                  height: 50,
                  borderColor: "gray",
                  borderWidth: 1,
                  paddingLeft: 20,
                  width: width - 50,
                  alignSelf: "center",
                  marginTop: 10,
                  fontSize: 20,
                  flex: 0.9,
                  borderRadius: 5,
                }}
              />
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  flex: 0.2,
                  height: 50,
                  marginTop: 10,
                  borderLeftWidth: 0,
                  borderColor: "gray",
                  borderRadius: 5,
                }}
                onPress={() => props.navigation.navigate("ContactList")}
              >
                <Icon
                  name="contacts"
                  type="antdesign"
                  color="black"
                  size={28}
                  style={{ marginTop: 10 }}
                />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 25, marginLeft: 22, marginTop: 10 }}>
              {" "}
              Telephone{" "}
            </Text>
            <TextInput
              keyboardType={"number-pad"}
              value={state.phone}
              onChangeText={(text) => {
                setState({ ...state, phone: text });
              }}
              placeholder="Enter Recievers name"
              style={{
                height: 50,
                borderColor: "gray",
                borderRadius: 5,
                borderWidth: 1,
                paddingLeft: 20,
                width: width - 50,
                alignSelf: "center",
                marginTop: 10,
                fontSize: 20,
              }}
            />
          </View>
          {cphone == ''?<Text style={{
            margin:30,color:'red'
          }}>Please make sure phone number is added</Text>:null}
        </ScrollView>
        <TouchableOpacity
          onPress={() => bookNow()}
          style={{
            width: "87%",
            height: 50,
            backgroundColor: colors.BLUE.secondary,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: 50,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "white" }}>Continue</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
