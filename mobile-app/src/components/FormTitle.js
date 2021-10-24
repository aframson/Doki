import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../common/theme";

export const FormTitle = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>{title}</Text>
      <Text style={styles.formSubTitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  // Bis- Form subtitle style
  formTitle: {
    fontWeight: "bold",
    fontSize: 35,
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
