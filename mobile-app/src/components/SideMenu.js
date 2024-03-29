import React, { useContext } from "react";
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Share,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "react-native-elements";
import { NavigationActions } from "react-navigation";
import SideMenuHeader from "./SideMenuHeader";
import { colors } from "../common/theme";
var { width } = Dimensions.get("window");
import { useSelector, useDispatch } from "react-redux";
import { language } from "config";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { FirebaseContext } from "common/src";

const LOCATION_TASK_NAME = "background-location-task";

export default function SideMenu(props) {
  const { api } = useContext(FirebaseContext);
  const { signOut, updateProfile } = api;

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settingsdata.settings);

  const sideMenuList = [
    {
      name: language.book_your_ride_menu,
      navigationName: "Map",
      icon: "home",
      type: "feather",
    },
    {
      name: language.booking_request,
      navigationName: "DriverTrips",
      icon: "home",
      type: "font-awesome",
    },
    {
      name: language.my_rides_menu,
      navigationName: "RideList",
      icon: "history",
      type: "octicons",
    },
    {
      name: language.incomeText,
      navigationName: "MyEarning",
      icon: "ios-wallet-outline",
      type: "ionicon",
    },
    {
      name: language.my_wallet_menu,
      icon: "wallet",
      navigationName: "wallet",
      type: "ionicon",
    },
    {
      name: language.profile_setting_menu,
      navigationName: "Profile",
      icon: "user",
      type: "antdesign",
    },
    {
      name: language.refer_earn,
      navigationName: "Refer",
      icon: "sharealt",
      type: "antdesign",
    },
    {
      name: language.emergency,
      navigationName: "Emergency",
      icon: "ios-sad",
      type: "ionicon",
    },
    {
      name: language.about_us_menu,
      navigationName: "About",
      icon: "info",
      type: "entypo",
    },
    {
      name: language.logout,
      icon: "sign-out",
      navigationName: "Logout",
      type: "font-awesome",
    },
    {
      name: language.convertmenu,
      navigationName: "Convert",
      icon: "person",
      type: "ionicon",
    },
  ];

  const StopBackgroundLocation = async () => {
    let res = !auth.info.profile.driverActiveStatus;
    dispatch(updateProfile(auth.info, { driverActiveStatus: res }));
    TaskManager.getRegisteredTasksAsync().then((res) => {
      if (res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          if (res[i].taskName == LOCATION_TASK_NAME) {
            Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
            break;
          }
        }
      }
    });
  };

  //navigation to screens from side menu
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    props.navigation.dispatch(navigateAction);
  };

  const onPressCall = (phoneNumber) => {
    let call_link =
      Platform.OS == "android"
        ? "tel:" + phoneNumber
        : "telprompt:" + phoneNumber;
    Linking.canOpenURL(call_link)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(call_link);
        } else {
          console.log("Unable to call");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  //sign out
  logOff = () => {
    auth.info && auth.info.profile && auth.info.profile.usertype == "driver"
      ? StopBackgroundLocation()
      : null;
    AsyncStorage.removeItem("firstRun");
    props.navigation.navigate("Intro");
    setTimeout(() => {
      dispatch(signOut());
    }, 1000);
  };

  return (
    <View style={styles.mainViewStyle}>
      {auth.info && auth.info.profile ? (
        <SideMenuHeader
          headerStyle={styles.myHeader}
          userPhoto={auth.info.profile.profile_image}
          userEmail={auth.info.profile.email}
          userName={
            auth.info.profile.firstName + " " + auth.info.profile.lastName
          }
        ></SideMenuHeader>
      ) : null}
      <View style={styles.compViewStyle}>
        {/* <View style={[styles.vertialLine, { height: (width <= 320) ? width / 1.53 : width / 1.68 }]}></View> */}
        {!!settings ? (
          <FlatList
            data={sideMenuList}
            keyExtractor={(item, index) => index.toString()}
            style={{ paddingTop: 10, flex: 1 }}
            bounces={false}
            renderItem={({ item, index }) => {
              if (
                auth.info.profile.usertype == "admin" &&
                item.navigationName != "About" &&
                item.navigationName != "Logout"
              ) {
                return null;
              } else if (
                auth.info.profile.usertype == "fleetadmin" &&
                item.navigationName != "About" &&
                item.navigationName != "Logout"
              ) {
                return null;
              } else if (
                auth.info.profile.usertype == "rider" &&
                (item.navigationName == "DriverTrips" ||
                  item.navigationName == "MyEarning")
              ) {
                return null;
              } else if (
                auth.info.profile.usertype == "driver" &&
                (item.navigationName == "Map" ||
                  item.navigationName == "Emergency")
              ) {
                return null;
              } else if (
                !(
                  auth.info.profile.usertype == "rider" ||
                  auth.info.profile.usertype == "driver"
                ) &&
                item.navigationName == "Refer"
              ) {
                return null;
              } else if (
                auth.info.profile.usertype == "driver" &&
                item.navigationName == "Convert"
              ) {
                return null;
              } else if (
                (auth.info.profile.usertype == "rider" ||
                  auth.info.profile.usertype == "driver") &&
                item.navigationName == "Refer"
              ) {
                return (
                  <TouchableOpacity
                    style={{ marginLeft: 20 }}
                    onPress={() => {
                      settings.bonus > 0
                        ? Share.share({
                            message:
                              language.share_msg +
                              settings.code +
                              " " +
                              settings.bonus +
                              ".\n" +
                              language.code_colon +
                              auth.info.profile.referralId +
                              "\n" +
                              language.app_link +
                              (Platform.OS == "ios"
                                ? settings.AppleStoreLink
                                : settings.PlayStoreLink),
                          })
                        : Share.share({
                            message:
                              language.share_msg_no_bonus +
                              "\n" +
                              language.app_link +
                              (Platform.OS == "ios"
                                ? settings.AppleStoreLink
                                : settings.PlayStoreLink),
                          });
                    }}
                    style={[
                      styles.menuItemView,
                      {
                        marginTop:
                          index == sideMenuList.length - 1 ? width / 7 : 0,
                      },
                    ]}
                  >
                    <View style={styles.viewIcon}>
                      <Icon
                        name={item.icon}
                        type={item.type}
                        color={"gray"}
                        size={18}
                        containerStyle={styles.iconStyle}
                      />
                    </View>
                    <Text style={styles.menuName}>{item.name}</Text>
                  </TouchableOpacity>
                );
              } else if (
                auth.info.profile.usertype == "rider" &&
                item.navigationName == "Emergency"
              ) {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        language.panic_text,
                        language.panic_question,
                        [
                          {
                            text: language.cancel,
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel",
                          },
                          {
                            text: "OK",
                            onPress: async () => {
                              onPressCall(settings.panic);
                            },
                          },
                        ],
                        { cancelable: false }
                      );
                    }}
                    style={[
                      styles.menuItemView,
                      {
                        marginTop:
                          index == sideMenuList.length - 1 ? width / 7 : 0,
                      },
                    ]}
                  >
                    <View style={styles.viewIcon}>
                      <Icon
                        name={item.icon}
                        type={item.type}
                        color={"gray"}
                        size={18}
                        containerStyle={styles.iconStyle}
                      />
                    </View>
                    <Text style={styles.menuName}>{item.name}</Text>
                  </TouchableOpacity>
                );
              } else if (item.navigationName != "Convert") {
                return (
                  <TouchableOpacity
                    onPress={
                      item.name == language.logout
                        ? () => logOff()
                        : navigateToScreen(item.navigationName)
                    }
                    style={[
                      styles.menuItemView,
                      // {
                      //   marginTop:
                      //     index == sideMenuList.length - 1 ? width / 7 : 0,
                      // },
                    ]}
                  >
                    <View style={styles.viewIcon}>
                      <Icon
                        name={item.icon}
                        type={item.type}
                        color={"gray"}
                        size={25}
                        containerStyle={styles.iconStyle}
                      />
                    </View>
                    <Text style={styles.menuName}>{item.name}</Text>
                  </TouchableOpacity>
                );
              } else if (
                auth.info.profile.usertype == "rider" &&
                item.navigationName == "Convert"
              ) {
                return (
                  <TouchableOpacity
                    onPress={
                      item.name == language.logout
                        ? () => logOff()
                        : navigateToScreen(item.navigationName)
                    }
                    style={[
                      {
                        marginTop: 30,
                        backgroundColor: colors.BLUE.secondary,
                        marginHorizontal: 20,
                        padding: 15,
                        borderRadius: 5,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.menuName,
                        { fontSize: 18, fontWeight: "bold", color: "white" },
                      ]}
                    >
                      Become a rider
                    </Text>
                    <Text
                      style={
                        (styles.menuName, { color: "white", marginLeft: 9 })
                      }
                    >
                      Earn money on your schedules
                    </Text>
                  </TouchableOpacity>
                );
              }
            }}
          />
        ) : null}
      </View>
      <View>
        {/* <Image
                    source={require("../../assets/images/logo165x90white.png")}
                    style={{ width: '100%' }}
                /> */}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  myHeader: {
    marginTop: 0,
  },
  vertialLine: {
    width: 1,
    backgroundColor: colors.GREY.btnPrimary,
    position: "absolute",
    left: 22,
    top: 24,
  },
  menuItemView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  viewIcon: {
    width: 24,
    height: 24,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: colors.GREY.btnPrimary,
    left: 1,
    margin: 10,
  },
  menuName: {
    color: "black",
    // fontWeight: 'bold',
    marginLeft: 8,
    width: "100%",
    fontSize: 16,
  },
  mainViewStyle: {
    backgroundColor: "white",
    height: Dimensions.get("screen").height,
    paddingTop: Platform.OS == "ios" ? 20 : 0,
    // height: "100%",
    // width: width/1.5,
  },
  compViewStyle: {
    // position: "relative",
    flex: 1,
    // backgroundColor: "yellow",
  },
  iconStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
});
