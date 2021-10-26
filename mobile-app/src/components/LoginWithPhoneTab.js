// Bismark- login with phone tab button component
import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../common/theme";

const LoginWithPhone = ({ action }) => {
  return (
    <TouchableOpacity style={styles.tabContainer} onPress={action}>
      {/* <Entypo
        name="mobile"
        size={28}
        color={colors.BLUE.secondary}
        style={styles.tabIcon}
      /> */}
      <Text style={styles.tabText}>Login with mobile number</Text>
    </TouchableOpacity>
  );
};

export default LoginWithPhone;

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
