import React, { useEffect, useState, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  Button,
  Alert,
} from "react-native";
import * as Contacts from "expo-contacts";
var { width } = Dimensions.get("window");
import { Icon } from "react-native-elements";
import BottomSheet from "react-native-gesture-bottom-sheet";
import { useSelector, useDispatch } from "react-redux";
import { FirebaseContext } from "common/src";
import { language } from "config";
var { height, width } = Dimensions.get("window");
import { colors } from "../common/theme";


import filter from "lodash.filter";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Contact(props) {
  const { api } = useContext(FirebaseContext);
  const { getEstimate } = api;

  const dispatch = useDispatch();

  const tripdata = useSelector((state) => state.tripdata);

  const [state, setState] = useState({
    name: "",
    phone: "",
  });

  const [contacts, setContacts] = useState(null);

  const BootnSheet = useRef();
  const bottomSheet = useRef();

  //Go to confirm booking page
  const onPressBook = () => {
    if (state.name == "" || state.phone == "") {
      Alert.alert("Required", "All fields are required");
    } else {
      if (tripdata.pickup && tripdata.drop && tripdata.drop.add) {
        if (!tripdata.carType) {
          Alert.alert(language.alert, language.car_type_blank_error);
        } else {
          dispatch(
            getEstimate({
              bookLater: false,
              bookingDate: null,
              pickup: {
                coords: { lat: tripdata.pickup.lat, lng: tripdata.pickup.lng },
                description: tripdata.pickup.add,
              },
              drop: {
                coords: { lat: tripdata.drop.lat, lng: tripdata.drop.lng },
                description: tripdata.drop.add,
              },
              carDetails: tripdata.carType,
              platform: Platform.OS,
            })
          );
        }
      } else {
        Alert.alert(language.alert, language.drop_location_blank_error);
      }
    }
  };

  // fetch only the first 10 deatls of contacts
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails, Contacts.PHONE_NUMBERS],
          pageSize: 100,
        });
        setContacts(data);
        if (data.length > 0) {
          const contact = data[0];
          setContacts(data);
          console.log(data);
        }
      }
    })();
  }, []);

  // function to search contact by name or phone number
  // const searchContact = (text) => {
  //   if (text) {
  //     const newData = contacts.filter((item) => {
  //       const itemData = item.name.toUpperCase();
  //       const textData = text.toUpperCase();
  //       return itemData.includes(textData);
  //     });
  //     setContacts(newData);
  //   } else {
  //     setContacts(contacts);
  //   }
  // };

  const searchContact = (text) => {
    if (text !== "") {
      const results = contacts.filter((user) => {
        return user.name.toLowerCase().startsWith(text.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      });
      setContacts(results);
    } else {
      (async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === "granted") {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Emails, Contacts.PHONE_NUMBERS],
            pageSize: 100,
          });
          setContacts(data);
          if (data.length > 0) {
            const contact = data[0];
            setContacts(data);
            console.log(data);
          }
        }
      })();
    }
  };

  const contains = ({ name }, query) => {
    if (name.includes(query)) {
      return true;
    } else {
      return false;
    }
  };

  const openContact = (items) => {
    setState({
      ...state,
      name: items.name,
      phone: items.phoneNumbers[0].number,
    });
    bottomSheet.current.close();
  };

  // function to search contact by name or phone number

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        // behavior={Platform.OS == "ios" ? "height" : "padding"}
        style={{ flex: 1, height: height, backgroundColor: "red" }}
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
            <BottomSheet hasDraggableIcon ref={bottomSheet} height={height / 2}>
              <ScrollView>
                <View style={{ width: "100%", padding: 10 }}>
                  <TextInput
                    placeholder="Search Contacts..."
                    placeholderTextColor={"black"}
                    style={{
                      backgroundColor: "#eee",
                      borderRadius: 10,
                      padding: 10,
                      paddingHorizontal: 15,
                      marginTop: 10,
                      fontSize: 25,
                      borderWidth: 1,
                      borderColor: colors.GREY.btnPrimary,
                    }}
                    onChangeText={(text) => searchContact(text)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  {!!contacts &&
                    contacts.map((items, key) => (
                      <TouchableOpacity
                        key={key}
                        onPress={() => openContact(items)}
                        style={{
                          padding: 10,
                          borderBottomWidth: 1,
                          width: "100%",
                          borderBottomColor: "#ccc",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            marginLeft: 20,
                          }}
                        >
                          {items.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </ScrollView>
            </BottomSheet>

            {/* <Button title="OPEN BOTTOM SHEET" onPress={() => BootnSheet.current.open()} /> */}
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
                onPress={() => bottomSheet.current.show()}
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
        </ScrollView>
        <TouchableOpacity
          onPress={() => onPressBook()}
          style={{
            width: "87%",
            height: 50,
            backgroundColor: colors.BLUE.secondary,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: 20,
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
