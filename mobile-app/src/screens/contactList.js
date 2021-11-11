import React, { useEffect, useState, useRef, useContext } from "react";
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    TextInput,
    ScrollView,
 
} from "react-native";
import * as Contacts from "expo-contacts";
var { width } = Dimensions.get("window");
import { useSelector, useDispatch } from "react-redux";
import { FirebaseContext } from "common/src";
import { colors } from "../common/theme";



import { SafeAreaView } from "react-native-safe-area-context";

export default function ContactList(props) {



    const [state, setState] = useState({
        name: "",
        phone: "",
    });

    const [contacts, setContacts] = useState(null);

    const bottomSheet = useRef();

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



    // function to search contact by name or phone number

    return (
        <SafeAreaView style={{ flex: 1 }}>
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
                                onPress={() => props.navigation.navigate("Contact",{name:items.name,phone:items.phoneNumbers[0].number?items.phoneNumbers[0].number:""})}
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
