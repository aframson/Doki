import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { Zocial } from "@expo/vector-icons";
import { colors } from "../common/theme";

const LoginWithEmail = ({ action }) => {
  return (
    <TouchableOpacity style={styles.tabContainer} onPress={action}>
      <Zocial name="email" size={24} color="white" style={styles.tabIcon} />
      <Text style={styles.tabText}>Login with email</Text>
    </TouchableOpacity>
  );
};

export default LoginWithEmail;

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: "#9B0000",
    marginLeft: 35,
    marginRight: 35,
    // borderWidth: 1,
    // borderColor: colors.GREY.border,
    width: "80%",
    alignSelf: "center",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  tabIcon: {
    margin: 12,
    marginLeft: 18,
    marginRight: 18,
  },
  tabText: {
    paddingLeft: 20,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: colors.WHITE,
    paddingTop: 5,
    paddingBottom: 5,
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
});
