import React, { useEffect, useContext, useState, useRef } from "react";
import { colors } from "../common/theme";
import { language } from "config";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  StyleSheet,
  TextInput,
} from "react-native";
import { Icon, Button, Header, Input, CheckBox } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import { FirebaseContext } from "common/src";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ActionSheet from "react-native-actions-sheet";
var { height, width } = Dimensions.get("window");

export default function ConvertDriver(props) {
  const { api } = useContext(FirebaseContext);
  const dispatch = useDispatch();
  const { signOut, updateProfile } = api;
  const [state, setState] = useState({
    usertype: "driver",
    vehicleNumber: "",
    vehicleMake: "",
    vehicleModel: "",
    carType: null,
    bankAccount: "",
    bankCode: "",
    bankName: "",
    licenseImage: null,
    other_info: "",
    queue: false,
    driverActiveStatus: true,
  });
  const cars = useSelector((state) => state.cartypes.cars);
  const auth = useSelector((state) => state.auth);
  const settingsdata = useSelector((state) => state.settingsdata);
  const [carTypes, setCarTypes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const actionSheetRef = useRef(null);

  useEffect(() => {
    if (auth.info && auth.info.profile && auth.info.profile.licenseImage) {
      setLoading(false);
      AsyncStorage.removeItem("firstRun");
      props.navigation.navigate("Intro");
      dispatch(signOut());
    }
  }, [auth.info]);

  useEffect(() => {
    if (cars) {
      let arr = [];
      for (let i = 0; i < cars.length; i++) {
        arr.push({ label: cars[i].name, value: cars[i].name });
      }
      if (arr.length > 0) {
        setState({ ...state, carType: arr[0].value });
      }
      setCarTypes(arr);
    }
  }, [cars]);

  const showActionSheet = () => {
    actionSheetRef.current?.setModalVisible(true);
  };

  const uploadImage = () => {
    return (
      <ActionSheet ref={actionSheetRef}>
        <TouchableOpacity
          style={{
            width: "90%",
            alignSelf: "center",
            paddingLeft: 20,
            paddingRight: 20,
            borderColor: colors.GREY.iconPrimary,
            borderBottomWidth: 1,
            height: 60,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            _pickImage("CAMERA", ImagePicker.launchCameraAsync);
          }}
        >
          <Text
            style={{ color: colors.BLUE.greenish_blue, fontWeight: "bold" }}
          >
            {language.camera}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "90%",
            alignSelf: "center",
            paddingLeft: 20,
            paddingRight: 20,
            borderBottomWidth: 1,
            borderColor: colors.GREY.iconPrimary,
            height: 60,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            _pickImage("MEDIA", ImagePicker.launchImageLibraryAsync);
          }}
        >
          <Text
            style={{ color: colors.BLUE.greenish_blue, fontWeight: "bold" }}
          >
            {language.medialibrary}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "90%",
            alignSelf: "center",
            paddingLeft: 20,
            paddingRight: 20,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            actionSheetRef.current?.setModalVisible(false);
          }}
        >
          <Text style={{ color: "red", fontWeight: "bold" }}>
            {language.cancel}
          </Text>
        </TouchableOpacity>
      </ActionSheet>
    );
  };

  const _pickImage = async (permissionType, res) => {
    var pickFrom = res;
    let permisions;
    if (permissionType == "CAMERA") {
      permisions = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permisions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }
    const { status } = permisions;

    if (status == "granted") {
      let result = await pickFrom({
        allowsEditing: true,
        aspect: [4, 3],
        base64: true,
        quality: 1.0,
      });

      actionSheetRef.current?.setModalVisible(false);

      if (!result.cancelled) {
        let data = "data:image/jpeg;base64," + result.base64;
        setCapturedImage(result.uri);
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function () {
            Alert.alert(language.alert, language.image_upload_error);
            setLoader(false);
          };
          xhr.responseType = "blob";
          xhr.open("GET", Platform.OS == "ios" ? data : result.uri, true);
          xhr.send(null);
        });
        if (blob) {
          setState({ ...state, licenseImage: blob });
        }
      }
    } else {
      Alert.alert(language.alert, language.camera_permission_error);
    }
  };

  //upload cancel
  const cancelPhoto = () => {
    setCapturedImage(null);
  };

  //register button press for validation
  const onPressRegister = () => {
    if (state.licenseImage == null) {
      Alert.alert(language.alert, language.proper_input_licenseimage);
    } else {
      if (state.vehicleNumber.length > 1) {
        setLoading(true);
        dispatch(
          updateProfile(auth.info, {
            ...state,
            approved: !settingsdata.settings.driver_approval,
          })
        );
      } else {
        Alert.alert(language.alert, language.proper_input_vehicleno);
      }
    }
  };

  return (
    <View style={styles.mainView}>
      <Header
        backgroundColor={colors.GREY.default}
        leftComponent={{
          icon: "md-menu",
          type: "ionicon",
          color: colors.WHITE,
          size: 30,
          component: TouchableWithoutFeedback,
          onPress: () => {
            props.navigation.toggleDrawer();
          },
        }}
        centerComponent={
          <Text style={styles.headerTitleStyle}>Convert to Rider</Text>
        }
        containerStyle={styles.headerStyle}
        innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
      />
      <ScrollView
        style={styles.scrollViewStyle}
        showsVerticalScrollIndicator={false}
      >
        {uploadImage()}
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "padding"}
          style={styles.form}
        >
          <View style={styles.containerStyle}>
            <Text style={styles.formSubTitle}>
              Fill out the fields to create a rider's account
            </Text>
            <View
              style={[
                styles.textInputContainerStyle,
                { marginTop: 10, marginBottom: 10 },
              ]}
            >
              {/* <Icon
                name="car"
                type="font-awesome"
                color={colors.WHITE}
                size={18}
                containerStyle={[styles.iconContainer, { paddingTop: 20 }]}
              /> */}
              <Text style={styles.label}>Delivery type</Text>
              {carTypes ? (
                <View style={styles.pickerContainer}>
                  <RNPickerSelect
                    value={state.carType}
                    useNativeAndroidPickerStyle={true}
                    style={{
                      inputIOS: styles.pickerStyle,
                      placeholder: {
                        color: "white",
                        fontSize: 14,
                      },
                      inputAndroid: styles.pickerStyle,
                    }}
                    onValueChange={(value) =>
                      setState({ ...state, carType: value })
                    }
                    items={carTypes}
                  />
                </View>
              ) : null}
            </View>
            <View style={styles.textInputContainerStyle}>
              {/* <Icon
                name="car"
                type="font-awesome"
                color={colors.WHITE}
                size={18}
                containerStyle={styles.iconContainer}
              /> */}
              <Text style={styles.label}>{language.vehicle_model_name}</Text>
              <TextInput
                editable={true}
                returnKeyType={"next"}
                // placeholderTextColor={colors.WHITE}
                value={state.vehicleMake}
                style={styles.inputTextStyle}
                onChangeText={(text) => {
                  setState({ ...state, vehicleMake: text });
                }}
              />
            </View>
            <View style={styles.textInputContainerStyle}>
              {/* <Icon
                name="car"
                type="font-awesome"
                color={colors.WHITE}
                size={18}
                containerStyle={styles.iconContainer}
              /> */}
              <Text style={styles.label}>{language.vehicle_model_no}</Text>
              <TextInput
                editable={true}
                underlineColorAndroid={colors.TRANSPARENT}
                // placeholderTextColor={colors.WHITE}
                value={state.vehicleModel}
                style={styles.inputTextStyle}
                onChangeText={(text) => {
                  setState({ ...state, vehicleModel: text });
                }}
              />
            </View>
            <View style={styles.textInputContainerStyle}>
              {/* <Icon
                name="car"
                type="font-awesome"
                color={colors.WHITE}
                size={18}
                containerStyle={styles.iconContainer}
              /> */}
              <Text style={styles.label}>{language.vehicle_reg_no}</Text>
              <TextInput
                editable={true}
                underlineColorAndroid={colors.TRANSPARENT}
                // placeholderTextColor={colors.WHITE}
                value={state.vehicleNumber}
                style={styles.inputTextStyle}
                onChangeText={(text) => {
                  setState({ ...state, vehicleNumber: text });
                }}
              />
            </View>
            <View style={styles.textInputContainerStyle}>
              {/* <Icon
                name="car"
                type="font-awesome"
                color={colors.WHITE}
                size={18}
                containerStyle={styles.iconContainer}
              /> */}
              <Text style={styles.label}>{language.other_info}</Text>
              <TextInput
                editable={true}
                underlineColorAndroid={colors.TRANSPARENT}
                // placeholderTextColor={colors.WHITE}
                value={state.other_info}
                style={styles.inputTextStyle}
                onChangeText={(text) => {
                  setState({ ...state, other_info: text });
                }}
              />
            </View>
            {settingsdata.settings.bank_fields ? (
              <View style={styles.textInputContainerStyle}>
                {/* <Icon
                  name="numeric"
                  type={"material-community"}
                  color={colors.WHITE}
                  size={20}
                  containerStyle={styles.iconContainer}
                /> */}
                <Text style={styles.label}>{language.bankName}</Text>
                <TextInput
                  editable={true}
                  underlineColorAndroid={colors.TRANSPARENT}
                  //   placeholderTextColor={colors.WHITE}
                  value={state.bankName}
                  style={styles.inputTextStyle}
                  onChangeText={(text) => {
                    setState({ ...state, bankName: text });
                  }}
                />
              </View>
            ) : null}
            {settingsdata.settings.bank_fields ? (
              <View style={styles.textInputContainerStyle}>
                {/* <Icon
                  name="numeric"
                  type={"material-community"}
                  color={colors.WHITE}
                  size={20}
                  containerStyle={styles.iconContainer}
                /> */}
                <Text style={styles.label}>{language.bankCode}</Text>
                <TextInput
                  editable={true}
                  underlineColorAndroid={colors.TRANSPARENT}
                  //   placeholderTextColor={colors.WHITE}
                  value={state.bankCode}
                  style={styles.inputTextStyle}
                  onChangeText={(text) => {
                    setState({ ...state, bankCode: text });
                  }}
                />
              </View>
            ) : null}
            {settingsdata.settings.bank_fields ? (
              <View style={styles.textInputContainerStyle}>
                {/* <Icon
                  name="numeric"
                  type={"material-community"}
                  color={colors.WHITE}
                  size={20}
                  containerStyle={styles.iconContainer}
                /> */}
                <Text style={styles.label}>{language.bankAccount}</Text>
                <TextInput
                  editable={true}
                  underlineColorAndroid={colors.TRANSPARENT}
                  //   placeholderTextColor={colors.WHITE}
                  value={state.bankAccount}
                  style={styles.inputTextStyle}
                  onChangeText={(text) => {
                    setState({ ...state, bankAccount: text });
                  }}
                />
              </View>
            ) : null}
            {capturedImage ? (
              <View style={styles.imagePosition}>
                <TouchableOpacity
                  style={styles.photoClick}
                  onPress={cancelPhoto}
                >
                  <Image
                    source={require("../../assets/images/cross.png")}
                    resizeMode={"contain"}
                    style={styles.imageStyle}
                  />
                </TouchableOpacity>
                <Image
                  source={{ uri: capturedImage }}
                  style={styles.photoResult}
                  resizeMode={"cover"}
                />
              </View>
            ) : (
              <>
                <View>
                  {state.imageValid ? (
                    <Text style={styles.capturePhotoTitle}>
                      {language.upload_driving_license}
                    </Text>
                  ) : (
                    <Text style={styles.errorPhotoTitle}>
                      {language.upload_driving_license}
                    </Text>
                  )}
                </View>
                <View style={styles.capturePhoto}>
                  <View style={styles.capturePicClick}>
                    <TouchableOpacity
                      style={styles.flexView1}
                      onPress={showActionSheet}
                    >
                      <View>
                        <View style={styles.imageFixStyle}>
                          <Image
                            source={require("../../assets/images/camera.png")}
                            resizeMode={"contain"}
                            style={styles.imageStyle2}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                    {/* <View style={styles.myView}>
                    <View style={styles.myView1} />
                  </View> */}
                    <View style={styles.myView2}>
                      <View style={styles.myView3}>
                        <Text style={styles.textStyle}>
                          {language.image_size_warning}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            )}
            <View style={styles.buttonContainer}>
              <Button
                onPress={onPressRegister}
                title={"Submit"}
                loading={loading}
                titleStyle={styles.buttonTitle}
                buttonStyle={styles.registerButton}
              />
            </View>
            <View style={styles.gapView} />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: colors.YELLOW.cabsydney,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: "Roboto",
    fontSize: 20,
  },
  containerView: { flex: 1 },
  textContainer: { textAlign: "center" },
  mainView: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  headerContainerStyle: {
    backgroundColor: colors.TRANSPARENT,
    borderBottomWidth: 0,
    marginTop: 0,
  },
  headerInnerContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  inputContainerStyle: {
    // borderBottomWidth: 1,
    // borderBottomColor: colors.WHITE,
  },
  textInputStyle: {
    width: width - 60,
  },
  formSubTitle: {
    textAlign: "center",
    marginVertical: 20,
    marginBottom: 30,
    color: "grey",
    fontSize: 16,
  },
  iconContainer: {
    paddingBottom: 20,
  },
  gapView: {
    height: 40,
    width: "100%",
  },
  buttonContainer: {
    width: "80%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 6,
    marginTop: 30,
  },
  registerButton: {
    backgroundColor: colors.SKY,
    width: "100%",
    height: 50,
    borderColor: colors.TRANSPARENT,
    borderWidth: 0,
    borderRadius: 6,
  },
  buttonTitle: {
    fontSize: 16,
  },
  pickerContainer: {
    width: "100%",
    height: 50,
    // marginHorizontal: 25,
    borderRadius: 6,
    backgroundColor: "#f1f1f1",
    // flexDirection: 'row',
    // alignItems: 'center'
    marginBottom: 15,
  },
  pickerStyle: {
    width: "100%",
    color: colors.BLACK,
    fontSize: 15,
    height: 40,
    marginLeft: Platform.OS == "ios" ? 20 : 10,
    marginTop: Platform.OS == "ios" ? 0 : 5,
    // borderBottomWidth: 1,
    // borderBottomColor: colors.WHITE,
  },
  label: {
    color: "#777",
    marginBottom: 8,
  },
  inputTextStyle: {
    color: colors.BLACK,
    fontSize: 15,
    marginLeft: 0,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: "#f1f1f1",
    borderRadius: 6,
    width: "100%",
  },
  errorMessageStyle: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 0,
  },
  containerStyle: {
    flexDirection: "column",
    marginTop: 20,
  },
  form: {
    flex: 1,
  },
  logo: {
    width: "100%",
    justifyContent: "flex-start",
    marginTop: 10,
    alignItems: "center",
  },
  scrollViewStyle: {
    height: height,
  },
  textInputContainerStyle: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 25,
    paddingHorizontal: 15,
    width: width - 40,
    backgroundColor: "transparent",
    borderRadius: 6,
  },
  headerStyle: {
    fontSize: 18,
    color: colors.WHITE,
    textAlign: "center",
    flexDirection: "row",
    marginTop: 0,
  },

  capturePhoto: {
    width: "80%",
    alignSelf: "center",
    borderColor: "#ccc",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 15,
    paddingBottom: 10,
    marginTop: 10,
  },
  capturePhotoTitle: {
    color: colors.BLACK,
    fontSize: 14,
    textAlign: "left",
    marginLeft: 40,
    paddingBottom: 0,
  },
  errorPhotoTitle: {
    color: colors.RED,
    fontSize: 13,
    textAlign: "left",
    marginLeft: 40,
    paddingBottom: 0,
  },
  photoResult: {
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 15,
    paddingBottom: 10,
    marginTop: 15,
    width: "80%",
    height: height / 4,
  },
  imagePosition: {
    position: "relative",
  },
  photoClick: {
    paddingRight: 48,
    position: "absolute",
    zIndex: 1,
    marginTop: 18,
    alignSelf: "flex-end",
  },
  capturePicClick: {
    backgroundColor: "#fff",
    // flexDirection: "row",
    // position: "relative",
    // zIndex: 1,
  },
  imageStyle: {
    width: 30,
    height: height / 15,
  },
  flexView1: {
    flex: 12,
  },
  imageFixStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyle2: {
    width: 150,
    height: height / 15,
    marginVertical: 30,
  },
  myView: {
    flex: 2,
    height: 50,
    width: 1,
    alignItems: "center",
  },
  myView1: {
    height: height / 18,
    width: 1.5,
    backgroundColor: colors.GREY.btnSecondary,
    alignItems: "center",
    marginTop: 10,
  },
  myView2: {
    flex: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  myView3: {
    flex: 2.2,
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    color: colors.GREY.btnPrimary,
    fontFamily: "Roboto-Bold",
    fontSize: 13,
    marginBottom: 20,
  },
  actionText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
    color: colors.BLUE.greenish_blue,
  },
});
