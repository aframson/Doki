import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../common/theme";

export const FormTitle = ({ title, subtitle }) => {
  return (
    <View>
      <Text style={styles.formTitle}>{title}</Text>
      <Text style={styles.formSubTitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // Bis- Form subtitle style
  formTitle: {
    fontWeight: "bold",
    fontSize: 30,
    marginRight: "auto",
    marginLeft: "auto",
    marginBottom: 10,
  },

  // Bis- Form form style
  formSubTitle: {
    fontSize: 16,
    marginBottom: 35,
    marginRight: "auto",
    marginLeft: "auto",
    color: colors.GREY.btnPrimary,
  },
});
