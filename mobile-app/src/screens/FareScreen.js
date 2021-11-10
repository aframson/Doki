import React, { useState, useRef, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
  Alert,
} from "react-native";
import { Icon, Button } from "react-native-elements";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { colors } from "../common/theme";
var { width, height } = Dimensions.get("window");
import { useSelector, useDispatch } from "react-redux";
import { language } from "config";
import { FirebaseContext } from "common/src";

export default function FareScreen(props) {
  const { api } = useContext(FirebaseContext);
  const { addBooking, clearEstimate, clearBooking, clearTripPoints } = api;
  const dispatch = useDispatch();

  const settings = useSelector((state) => state.settingsdata.settings);
  const tripdata = useSelector((state) => state.tripdata);
  const auth = useSelector((state) => state.auth);
  const estimate = useSelector((state) => state.estimatedata.estimate);
  const bookingdata = useSelector((state) => state.bookingdata);

  const mapRef = useRef(null);

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const onPressCancel = () => {
    dispatch(clearEstimate());
    dispatch(clearTripPoints());
    setButtonDisabled(false);
    props.navigation.navigate('Map');
  };

  useEffect(() => {
    setTimeout(() => {
      mapRef.current.fitToCoordinates(
        [
          { latitude: tripdata.pickup.lat, longitude: tripdata.pickup.lng },
          { latitude: tripdata.drop.lat, longitude: tripdata.drop.lng },
        ],
        {
          edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
          animated: true,
        }
      );
    }, 1000);
  }, []);

  useEffect(() => {
    if (bookingdata.booking) {
      dispatch(clearEstimate());
      dispatch(clearBooking());
      dispatch(clearTripPoints());
      if (bookingdata.booking.mainData.bookLater) {
        props.navigation.navigate("RideList");
      } else {
        props.navigation.navigate("BookedCab", {
          bookingId: bookingdata.booking.booking_id,
        });
      }
    }
    if (bookingdata.error && bookingdata.error.flag) {
      Alert.alert(bookingdata.error.msg);
      dispatch(clearBooking());
    }
  }, [bookingdata.booking, bookingdata.error, bookingdata.error.flag]);

  const bookNow = () => {
    if (
      auth.info.profile.mobile == "" ||
      auth.info.profile.mobile == " " ||
      !auth.info.profile.mobile
    ) {
      Alert.alert(language.alert, language.updatemobile);
    } else {
      setButtonDisabled(true);
      dispatch(
        addBooking({
          pickup: estimate.pickup,
          drop: estimate.drop,
          carDetails: estimate.carDetails,
          userDetails: auth.info,
          estimate: estimate,
          tripdate: estimate.bookLater
            ? new Date(estimate.bookingDate).toString()
            : new Date().toString(),
          bookLater: estimate.bookLater,
          settings: settings,
          booking_type_web: false,
        })
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* <Header
                backgroundColor={colors.GREY.default}
                leftComponent={{ icon: 'md-menu', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { props.navigation.toggleDrawer(); } }}
                centerComponent={<Text style={styles.headerTitleStyle}>{language.confirm_booking}</Text>}
                containerStyle={styles.headerStyle}
                innerContainerStyles={styles.headerInnerStyle}
            /> */}

      {/* <View style={styles.topContainer}>
                <View style={styles.topLeftContainer}>
                    <View style={styles.circle} />
                    <View style={styles.staightLine} />
                    <View style={styles.square} />
                </View>
                <View style={styles.topRightContainer}>
                    <TouchableOpacity style={styles.whereButton}>
                        <View style={styles.whereContainer}>
                            <Text numberOfLines={1} style={styles.whereText}>{tripdata.pickup.add}</Text>
                            <Icon
                                name='gps-fixed'
                                color={colors.WHITE}
                                size={23}
                                containerStyle={styles.iconContainer}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropButton}>
                        <View style={styles.whereContainer}>
                            <Text numberOfLines={1} style={styles.whereText}>{tripdata.drop.add}</Text>
                            <Icon
                                name='search'
                                type='feather'
                                color={colors.WHITE}
                                size={23}
                                containerStyle={styles.iconContainer}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View> */}
      <View
        style={{
          height: 50,
          width: 50,
          backgroundColor: "white",
          // borderWidth: 1,
          position: "absolute",
          zIndex: 99999,
          marginTop: 35,
          marginLeft: 20,
          borderRadius: 100,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.37,
          shadowRadius: 7.49,

          elevation: 12,
        }}
      >
        <Icon
          name="md-menu"
          type="ionicon"
          color={"black"}
          size={30}
          containerStyle={{}}
          onPress={() => props.navigation.toggleDrawer()}
        />
      </View>
      <View style={styles.mapcontainer}>
        {tripdata && tripdata.pickup.lat ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: tripdata.pickup.lat,
              longitude: tripdata.pickup.lng,
              latitudeDelta: 0.9922,
              longitudeDelta: 1.9421,
            }}
          >
            <Marker
              coordinate={{
                latitude: tripdata.pickup.lat,
                longitude: tripdata.pickup.lng,
              }}
              title={tripdata.pickup.add}
              pinColor={colors.BLUE.somablue}
              image={require("../../assets/images/green_pin2.png")}
            ></Marker>

            <Marker
              coordinate={{
                latitude: tripdata.drop.lat,
                longitude: tripdata.drop.lng,
              }}
              title={tripdata.drop.add}
              image={require("../../assets/images/rsz_2red_pin2.png")}
            ></Marker>

            {estimate && estimate.waypoints ? (
              <MapView.Polyline
                coordinates={estimate.waypoints}
                strokeWidth={5}
                strokeColor={colors.BLUE.dark}
              />
            ) : null}
          </MapView>
        ) : null}
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.topContainer}>
          <View style={styles.topLeftContainer}>
            <View style={styles.circle} />
            <View style={styles.staightLine} />
            <View style={styles.square} />
          </View>
          <View style={styles.topRightContainer}>
            <TouchableOpacity style={styles.whereButton}>
              <View style={styles.whereContainer}>
                <Text numberOfLines={1} style={styles.whereText}>
                  {tripdata.pickup.add}
                </Text>
                <Icon
                  name="gps-fixed"
                  color={colors.WHITE}
                  size={23}
                  containerStyle={styles.iconContainer}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropButton}>
              <View style={styles.whereContainer}>
                <Text numberOfLines={1} style={styles.whereText}>
                  {tripdata.drop.add}
                </Text>
                <Icon
                  name="search"
                  type="feather"
                  color={colors.WHITE}
                  size={23}
                  containerStyle={styles.iconContainer}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.offerContainer}>
          <TouchableOpacity>
            <Text style={styles.offerText}> {language.estimate_fare_text}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.priceDetailsContainer}>
          <View style={styles.priceDetailsLeft}>
            <View style={styles.priceDetails}>
              <View style={styles.totalFareContainer}>
                <Text style={styles.totalFareText}>{language.total_fare}</Text>
              </View>
              <Icon
                name="info"
                color={colors.WHITE}
                type="simple-line-icon"
                size={15}
                containerStyle={styles.infoIcon}
              />
            </View>

            <View style={styles.iconContainer}>
              <Text style={styles.priceText}>
                {" "}
                Gh{settings ? settings.symbol : null}{" "}
                {estimate ? Math.round(estimate.estimateFare) : null}
              </Text>
            </View>
          </View>
          <View style={styles.priceDetailsMiddle}>
            <View style={styles.triangle} />
            <View style={styles.lineHorizontal} />
          </View>
          <View style={styles.priceDetailsLeft}>
            <View style={styles.priceDetails}>
              <View style={styles.totalFareContainer}>
                <Text style={styles.totalFareText}>
                  {estimate && estimate.estimateDistance
                    ? parseFloat(estimate.estimateDistance).toFixed(2)
                    : 0}{" "}
                  {settings.convert_to_mile ? language.mile : language.km}{" "}
                </Text>
              </View>
              <Icon
                name="info"
                color={colors.WHITE}
                type="simple-line-icon"
                size={15}
                containerStyle={styles.infoIcon}
              />
            </View>
            <View style={styles.iconContainer}>
              <Text style={styles.priceText}>
                {estimate
                  ? parseFloat(estimate.estimateTime / 60).toFixed(0)
                  : 0}{" "}
                {language.mins}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1.5, flexDirection: "row" }}>
          <View style={styles.iconContainer}>
            <Button
              title={language.cancel}
              loading={false}
              loadingProps={{ size: "large", color: colors.WHITE }}
              titleStyle={{ color: colors.WHITE, fontWeight: "bold" }}
              onPress={onPressCancel}
              buttonStyle={{
                height: "100%",
                backgroundColor: colors.BLUE.dark,
              }}
              containerStyle={{ height: "100%", padding: 5 }}
            />
          </View>
          <View style={styles.flexView}>
            <Button
              title={language.confirm_booking}
              loading={buttonDisabled}
              loadingProps={{ size: "large", color: colors.BLUE.default }}
              titleStyle={{ color: colors.WHITE, fontWeight: "bold" }}
              disabled={buttonDisabled}
              onPress={bookNow}
              buttonStyle={{ height: "100%", backgroundColor: "#10d885" }}
              containerStyle={{ height: "100%", padding: 5 }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: colors.GREY.default,
    borderBottomWidth: 0,
  },
  headerInnerStyle: {
    marginLeft: 10,
    marginRight: 10,
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: "Roboto-Bold",
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    //marginTop: StatusBar.currentHeight
  },
  topContainer: {
    // flex: 1.5,
    flexDirection: "row",
    borderTopWidth: 0,
    alignItems: "center",
    backgroundColor: colors.BLUE.somablue,
    padding: 20,
  },
  topLeftContainer: {
    flex: 1.5,
    alignItems: "center",
  },
  topRightContainer: {
    flex: 9.5,
    justifyContent: "space-between",
  },
  circle: {
    height: 12,
    width: 12,
    borderRadius: 15 / 2,
    backgroundColor: "#669cff",
  },
  staightLine: {
    height: height / 25,
    width: 1,
    backgroundColor: "white",
  },
  square: {
    height: 14,
    width: 14,
    backgroundColor: "#66ff6e",
  },
  whereButton: {
    flex: 1,
    justifyContent: "center",
    borderBottomColor: colors.WHITE,
    borderBottomWidth: 1,
  },
  whereContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  whereText: {
    flex: 9,
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    fontWeight: "400",
    color: "black",
  },
  iconContainer: { flex: 1 },
  dropButton: { flex: 1, justifyContent: "center" },
  mapcontainer: {
    flex: 7,
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  bottomContainer: { flex: 5, alignItems: "center" },
  offerContainer: {
    flex: 1,
    backgroundColor: "#669cff",
    width: width,
    justifyContent: "center",
    borderBottomWidth: Platform.OS == "ios" ? 0 : 0,
  },
  offerText: {
    alignSelf: "center",
    color: "white",
    fontSize: 12,
    fontFamily: "Roboto-Regular",
  },
  priceDetailsContainer: {
    flex: 2.3,
    backgroundColor: colors.WHITE,
    flexDirection: "row",
    position: "relative",
    zIndex: 1,
  },
  priceDetailsLeft: { flex: 19 },
  priceDetailsMiddle: { flex: 2, height: 50, width: 1, alignItems: "center" },
  priceDetails: { flex: 1, flexDirection: "row" },
  totalFareContainer: {
    flex: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  totalFareText: {
    color: colors.GREY.btnPrimary,
    fontFamily: "Roboto-Bold",
    fontSize: 15,
    marginLeft: 40,
  },
  infoIcon: { flex: 2, alignItems: "center", justifyContent: "center" },
  priceText: {
    alignSelf: "center",
    color: colors.GREY.iconSecondary,
    fontFamily: "Roboto-Bold",
    fontSize: 30,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: colors.TRANSPARENT,
    borderStyle: "solid",
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 10,
    borderLeftColor: colors.TRANSPARENT,
    borderRightColor: colors.TRANSPARENT,
    borderBottomColor: "#669cff",
    transform: [{ rotate: "180deg" }],
    marginTop: -1,
    overflow: "visible",
  },
  lineHorizontal: {
    height: height / 18,
    width: 1,
    backgroundColor: colors.BLACK,
    alignItems: "center",
    marginTop: 10,
  },
  logoContainer: { flex: 19, alignItems: "center", justifyContent: "center" },
  logoImage: { width: 80, height: 80 },
  buttonsContainer: { flex: 1.5, flexDirection: "row" },
  buttonText: {
    color: colors.WHITE,
    fontFamily: "Roboto-Bold",
    fontSize: 17,
    alignSelf: "flex-end",
  },
  buttonStyle: { backgroundColor: colors.GREY.secondary, elevation: 0 },
  buttonContainerStyle: { flex: 1, backgroundColor: colors.GREY.secondary },
  confirmButtonStyle: { backgroundColor: colors.GREY.btnPrimary, elevation: 0 },
  confirmButtonContainerStyle: {
    flex: 1,
    backgroundColor: colors.GREY.btnPrimary,
  },

  flexView: {
    flex: 1,
  },
});
