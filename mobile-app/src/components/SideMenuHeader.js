import React from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { Icon } from "react-native-elements";
import { colors } from "../common/theme";
//make a compontent
const SideMenuHeader = ({ headerStyle, userPhoto, userName, userEmail }) => {
  return (
    <View
      style={[
        styles.viewStyle,
        // headerStyle,
        { borderBottomColor: colors.GREY.btnSecondary, borderBottomWidth: 1 },
      ]}
    >
      <TouchableOpacity style={styles.userImageView}>
        <Image
          source={
            userPhoto == null
              ? require("../../assets/images/profilePic.png")
              : { uri: userPhoto }
          }
          style={styles.imageStyle}
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <View style={styles.headerTextStyle}>
          <Text style={styles.ProfileNameStyle}>
            {userName ? userName.toUpperCase() : ""}
          </Text>
        </View>
        <View style={styles.iconViewStyle}>
          {/* <Icon 
                        name='mail-read'
                        type='octicon'
                        color={colors.WHITE}
                        size={16}
                    /> */}
          <Text style={styles.emailStyle}>
            {userEmail ? userEmail.toLowerCase() : ""}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = {
  viewStyle: {
    // backgroundColor:colors.BLUE.secondary,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignItems: "center",
    // height: 100,
    // paddingVertical: 10,
    paddingHorizontal: 10,
    paddingTop:
      Platform.OS.toLocaleLowerCase === "ios" ? 15 : StatusBar.currentHeight,
    // shadowColor: colors.BLACK,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // elevation: 2,
    // backgroundColor: "yellow",
    // backgroundColor: "red",
  },
  textStyle: {
    fontSize: 20,
    color: colors.WHITE,
  },
  headerTextStyle: {
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 10,
  },
  iconStyle: {},
  userImageView: {
    width: 84,
    height: 84,
    borderWidth: 2,
    borderColor: colors.GREY.btnPrimary,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  ProfileNameStyle: {
    fontWeight: "bold",
    // color: colors.WHITE,
    fontSize: 15,
  },
  iconViewStyle: {
    width: 150,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  emailStyle: {
    color: colors.GREY.btnPrimary,
    fontSize: 13,
    // marginLeft: 4,
    // textAlign: "left",
  },
  imageStyle: {
    width: 60,
    height: 60,
    padding: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.GREY.secondary,
  },
};
//make the component available to other parts of the app
export default SideMenuHeader;
