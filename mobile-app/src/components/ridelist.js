import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Icon } from "react-native-elements";
import { colors } from "../common/theme";
import { language, dateStyle } from "config";
import { useSelector } from "react-redux";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
// getting the specific document to update
import { getDatabase, ref, update } from "firebase/database";

export default function RideList(props) {
  const settings = useSelector((state) => state.settingsdata.settings);
  const [tabIndex, setTabIndex] = useState(props.tabIndex);

  const onPressButton = (item, index) => {
    props.onPressButton(item, index);
  };

  const deleteBooking = (id, name) => {
    const db = getDatabase();

    // A post entry.
    const postData = {
      deleted: 1,
    };

    // Get a key for a new Post.
    const newPostKey = push(child(ref(db), "bookings")).key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = { deleted: 1 };
    updates["/bookings/" + newPostKey] = postData;
    updates["/bookings/" + id + "/" + newPostKey] = postData;

    return update(ref(db), updates);
  };

  const renderData = ({ item, index }) => {
    return (
      <>
        <TouchableOpacity
          style={styles.iconClickStyle}
          onPress={() => onPressButton(item, index)}
        >
          <View style={styles.iconViewStyle}>
            <Icon
              name="package"
              type="material-community"
              color={colors.BLUE.secondary}
              size={35}
            />
          </View>
          <View style={styles.flexViewStyle}>
            <View style={styles.textView1}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",

                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* <Text style={{ color: "black" }}>{item.customer_name}</Text> */}
                <Text style={[styles.textStyle, styles.dateStyle]}>
                  {item.bookingDate
                    ? new Date(item.bookingDate).toLocaleString(dateStyle)
                    : ""}
                </Text>
              </View>
              <Text style={[styles.textStyle, styles.carNoStyle]}>
                {item.carType ? item.carType : null} -{" "}
                {item.vehicle_number
                  ? item.vehicle_number
                  : language.no_car_assign_text}
              </Text>
              <View style={[styles.picupStyle, styles.position]}>
                <View style={styles.greenDot} />
                <Text style={[styles.picPlaceStyle, styles.placeStyle]}>
                  {item.pickup ? item.pickup.add : language.not_found_text}
                </Text>
              </View>
              <View style={[styles.dropStyle, styles.textViewStyle]}>
                <View style={[styles.redDot, styles.textPosition]} />
                <Text style={[styles.dropPlaceStyle, styles.placeStyle]}>
                  {item.drop ? item.drop.add : language.not_found_text}
                </Text>
              </View>
            </View>

            <View style={[styles.textView2, { alignItems: "flex-end" }]}>
              {/* <TouchableOpacity
                  style={{ marginRight: 15 }}
                  onPress={() => deleteBooking(item.id, item.customer_name)}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={22}
                    color={colors.GREY.btnPrimary}
                  />
                </TouchableOpacity> */}
              <Text
                style={[
                  styles.fareStyle,
                  styles.dateStyle,
                  { marginRight: 15 },
                ]}
              >
                {item.status == "NEW" || item.status == "PAYMENT_PENDING"
                  ? language[item.status]
                  : null}
              </Text>
              <Text
                style={[
                  styles.fareStyle,
                  styles.dateStyle,
                  { marginRight: 15, marginTop: 10 },
                ]}
              >
                {item.status == "PAID" || item.status == "COMPLETE"
                  ? item.customer_paid
                    ? settings.symbol + Math.round(item.customer_paid)
                    : settings.symbol + Math.round(item.estimate)
                  : null}
              </Text>
              {item.status == "CANCELLED" ? (
                <Image
                  style={styles.cancelImageStyle}
                  source={require("../../assets/images/cancel.png")}
                />
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={styles.textView3}>
      <SegmentedControlTab
        values={[
          language.active_booking,
          language.COMPLETE,
          language.CANCELLED,
        ]}
        selectedIndex={tabIndex}
        onTabPress={(index) => setTabIndex(index)}
        borderRadius={0}
        tabsContainerStyle={styles.segmentcontrol}
        tabStyle={{
          borderWidth: 0,
          backgroundColor: "transparent",
          borderBottomWidth: 1,
          borderBottomColor: colors.GREY.primary,
          paddingHorizontal: 15,
        }}
        activeTabStyle={{
          borderBottomColor: colors.GREY.background,
          backgroundColor: "transparent",
          borderBottomWidth: 2,
        }}
        tabTextStyle={{ color: colors.GREY.secondary, fontWeight: "bold" }}
        activeTabTextStyle={{ color: colors.GREY.background }}
      />
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={
          tabIndex === 0
            ? props.data.filter(
                (item) =>
                  !(item.status === "CANCELLED" || item.status === "COMPLETE")
              )
            : tabIndex === 1
            ? props.data.filter((item) => item.status === "COMPLETE")
            : props.data.filter((item) => item.status === "CANCELLED")
        }
        renderItem={renderData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 18,
  },
  fareStyle: {
    fontSize: 18,
  },
  carNoStyle: {
    marginLeft: 45,
    fontSize: 13,
    marginTop: 10,
  },
  picupStyle: {
    flexDirection: "row",
  },
  picPlaceStyle: {
    color: colors.GREY.secondary,
  },
  dropStyle: {
    flexDirection: "row",
  },
  drpIconStyle: {
    color: colors.RED,
    fontSize: 20,
  },
  dropPlaceStyle: {
    color: colors.GREY.secondary,
  },
  greenDot: {
    alignSelf: "center",
    borderRadius: 10,
    width: 10,
    height: 10,
    backgroundColor: colors.GREEN.default,
  },
  redDot: {
    borderRadius: 10,
    width: 10,
    height: 10,
    backgroundColor: colors.RED,
  },
  logoStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconClickStyle: {
    flex: 1,
    flexDirection: "row",
    borderBottomColor: colors.GREY.secondary,
    borderBottomWidth: 1,
  },
  flexViewStyle: {
    flex: 7,
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 5,
  },
  dateStyle: {
    fontFamily: "Roboto-Bold",
    color: colors.GREY.default,
  },
  carNoStyle: {
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    marginTop: 8,
    color: colors.GREY.default,
  },
  placeStyle: {
    marginLeft: 10,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    alignSelf: "center",
  },
  textViewStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  cancelImageStyle: {
    width: 50,
    height: 50,
    marginRight: 20,
    marginTop: 18,
    alignSelf: "flex-end",
  },
  iconViewStyle: {
    flex: 1,
    marginTop: 10,
  },
  textView1: {
    flex: 5,
  },
  textView2: {
    flex: 2,
  },
  textView3: {
    flex: 1,
  },
  position: {
    marginTop: 20,
  },
  textPosition: {
    alignSelf: "center",
  },
  segmentcontrol: {
    color: colors.WHITE,
    fontSize: 18,
    fontFamily: "Roboto-Regular",
    marginTop: 0,
    alignSelf: "center",
    height: 50,
  },
});
