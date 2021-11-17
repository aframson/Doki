import React, { useEffect, useState, useRef, useContext } from "react";
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
 
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
    const [loading , setLoading] = useState(false);

    const bottomSheet = useRef();

    // fetch only the first 10 deatls of contacts
    useEffect(() => {
        setLoading(true);
        (async () => {  
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === "granted") {
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.Emails, Contacts.PHONE_NUMBERS],
                    pageSize: 1000,  
                });
                setContacts(data); 
                if (data.length > 0) {
                    const contact = data[0];
                    setContacts(data);
                    console.log(data);
                    setLoading(false);

                }
            }
        })();
    }, []);


    const searchContact = async(text) => {
       
        if (text !== "") {
            const newData = contacts.filter((item) => {
                const itemData  = `${item.name.toUpperCase()}`;
                const textData = `${text.toUpperCase()}`;
                return itemData.indexOf(textData) > -1;
    
            })
            setContacts(newData);
            setLoading(false);
        } else {
           
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
                    {loading ?(<ActivityIndicator size="small" color="black"/>):!!contacts &&
                        contacts.map((items, key) => (      
                            <TouchableOpacity
                                key={key}
                                onPress={() => props.navigation.navigate("Contact",{name:items.name,phone:items.phoneNumbers?items.phoneNumbers[0].number:""})}
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
