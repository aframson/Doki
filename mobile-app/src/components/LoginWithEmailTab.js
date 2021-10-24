import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { Zocial } from "@expo/vector-icons";
import { colors } from "../common/theme";

const LoginWithEmail = ({ action }) => {
  return (
    <TouchableOpacity style={styles.tabContainer} onPress={action}>
      {/* <Zocial name="email" size={24} color="#9B0000" style={styles.tabIcon} /> */}
      <Text style={styles.tabText}>Login with email</Text>
    </TouchableOpacity>
  );
};

export default LoginWithEmail;

const styles = StyleSheet.create({
  tabContainer: {
    height: 50,
    backgroundColor: "#fff",
    marginHorizontal: 33,
    marginBottom: 25,
    width: "80%",
    alignSelf: "center",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.BLUE.secondary,
  },
  tabIcon: {
    margin: 12,
    // marginLeft: 20,
    // marginRight: 20,
  },
  tabText: {
    paddingLeft: 0,
    // borderLeftWidth: 1,
    // borderLeftColor: colors.WHITE,
    paddingTop: 5,
    paddingBottom: 5,
    color: colors.BLUE.secondary,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    // backgroundColor: 'red'
  },
});
