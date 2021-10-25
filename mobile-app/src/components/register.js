import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  TextInput,
  StyleSheet,
  StatusBar,
} from "react-native";
import Background from "./Background";
import { Icon } from "react-native-elements";
import { FontAwesome, Zocial, Fontisto, Entypo } from "@expo/vector-icons";
import { colors } from "../common/theme";
var { height } = Dimensions.get("window");
import { language, countries, default_country_code, features } from "config";
import RadioForm from "react-native-simple-radio-button";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import ActionSheet from "react-native-actions-sheet";
import { FormTitle } from "./FormTitle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { style } from "dom-helpers";

export default function Registration(props) {
  const [state, setState] = useState({
    usertype: "rider",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    referralId: "",
    vehicleNumber: "",
    vehicleMake: "",
    vehicleModel: "",
    carType: props.cars && props.cars.length > 0 ? props.cars[0].value : "",
    bankAccount: "",
    bankCode: "",
    bankName: "",
    licenseImage: null,
    other_info: "",
    password: "",
  });
  const [role, setRole] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null);
  const [confirmpassword, setConfirmPassword] = useState("");
  const [countryCode, setCountryCode] = useState(
    "+" + default_country_code.phone
  );
  const [mobileWithoutCountry, setMobileWithoutCountry] = useState("");
  const settings = useSelector((state) => state.settingsdata.settings);
  const actionSheetRef = useRef(null);

  //   Bis-states for active sections
  const [activeSection, setActiveSection] = useState(0);
  const [subtitle, setSubtitle] = useState();

  // Bis- function to change subtitle text based on activeScreen
  const activeSectionBtnHandler = (val) => {
    if (val === 0) {
      setSubtitle("Fill out your contact details");
    } else if (val === 1) {
      setSubtitle("Let's get to know you");
    }
    setActiveSection(val);
  };
  const radio_props = [
    { label: language.no, value: 0 },
    { label: language.yes, value: 1 },
  ];

  const formatCountries = () => {
    let arr = [];
    for (let i = 0; i < countries.length; i++) {
      arr.push({
        label: countries[i].label + " (+" + countries[i].phone + ")",
        value: "+" + countries[i].phone,
        key: countries[i].code,
      });
    }
    return arr;
  };

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

  _pickImage = async (permissionType, res) => {
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
  cancelPhoto = () => {
    setCapturedImage(null);
  };

  const setUserType = (value) => {
    if (value == 0) {
      setState({ ...state, usertype: "user" });
      Alert.alert("User");
    } else {
      setState({ ...state, usertype: "rider" });
      activeSectionBtnHandler(3);
    }
  };

  validateMobile = () => {
    let mobileValid = true;
    if (mobileWithoutCountry.length < 6) {
      mobileValid = false;
      Alert.alert(language.alert, language.mobile_no_blank_error);
    }
    return mobileValid;
  };

  validatePassword = (complexity) => {
    let passwordValid = true;
    const regx1 = /^([a-zA-Z0-9@*#]{8,15})$/;
    const regx2 =
      /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/;
    if (complexity == "any") {
      passwordValid = state.password.length >= 1;
      if (!passwordValid) {
        Alert.alert(language.alert, language.password_blank_messege);
      }
    } else if (complexity == "alphanumeric") {
      passwordValid = regx1.test(state.password);
      if (!passwordValid) {
        Alert.alert(language.alert, language.password_alphaNumeric_check);
      }
    } else if (complexity == "complex") {
      passwordValid = regx2.test(password);
      if (!passwordValid) {
        Alert.alert(language.alert, language.password_complexity_check);
      }
    } else if (state.password != confirmpassword) {
      passwordValid = false;
      if (!passwordValid) {
        Alert.alert(language.alert, language.confirm_password_not_match_err);
      }
    }
    return passwordValid;
  };

  //register button press for validation
  onPressRegister = () => {
    const { onPressRegister } = props;
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(state.email)) {
      if (state.usertype == "driver" && state.licenseImage == null) {
        Alert.alert(language.alert, language.proper_input_licenseimage);
      } else {
        if (
          (state.usertype == "driver" && state.vehicleNumber.length > 1) ||
          state.usertype == "rider"
        ) {
          if (state.firstName.length > 0 && state.lastName.length > 0) {
            if (validatePassword("alphanumeric")) {
              if (validateMobile()) {
                onPressRegister(state);
              } else {
                Alert.alert(language.alert, language.mobile_no_blank_error);
              }
            }
          } else {
            Alert.alert(language.alert, language.proper_input_name);
          }
        } else {
          Alert.alert(language.alert, language.proper_input_vehicleno);
        }
      }
    } else {
      Alert.alert(language.alert, language.proper_email);
    }
  };

  return (
    <Background>
      <StatusBar barStyle="dark-content" backgroundColor={colors.WHITE} />
      <ScrollView
        style={styles.scrollViewStyle}
        showsVerticalScrollIndicator={false}
      >
        {uploadImage()}
        <KeyboardAwareScrollView
          behavior={Platform.OS == "ios" ? "padding" : "padding"}
          style={styles.form}
        >
          <View style={styles.containerStyle}>
            <FormTitle title="Sign Up" subtitle={subtitle} />
            {/* BASIC INFO SECTION */}
            {activeSection === 0 ? (
              <>
                {/* CONTACT DETAILS SECTION */}
                <View style={styles.textInputContainerStyle}>
                  <FontAwesome
                    name="flag"
                    color={colors.GREY.btnPrimary}
                    size={20}
                    style={[styles.textInputIcon, { marginRight: 5 }]}
                  />
                  <View style={styles.inputTextStyle}>
                    <RNPickerSelect
                      placeholder={{
                        label: language.select_country,
                        value: language.select_country,
                      }}
                      value={countryCode}
                      useNativeAndroidPickerStyle={true}
                      style={{
                        inputIOS: styles.pickerStyle,
                        inputAndroid: styles.pickerStyle,
                      }}
                      onValueChange={(text) => {
                        setCountryCode(text);
                        let formattedNum = mobileWithoutCountry.replace(
                          / /g,
                          ""
                        );
                        formattedNum = text + formattedNum.replace(/-/g, "");
                        setState({ ...state, mobile: formattedNum });
                      }}
                      items={formatCountries()}
                      disabled={features.AllowCountrySelection ? false : true}
                    />
                  </View>
                </View>
                <View style={styles.textInputContainerStyle}>
                  <Entypo
                    name="mobile"
                    size={20}
                    color={colors.GREY.btnPrimary}
                    style={styles.textInputIcon}
                  />
                  <TextInput
                    placeholder={language.mobile_no_placeholder}
                    value={mobileWithoutCountry}
                    keyboardType={"number-pad"}
                    autoFocus={true}
                    style={[styles.inputTextStyle]}
                    onChangeText={(text) => {
                      setMobileWithoutCountry(text);
                      let formattedNum = text.replace(/ /g, "");
                      formattedNum =
                        countryCode + formattedNum.replace(/-/g, "");
                      setState({ ...state, mobile: formattedNum });
                    }}
                  />
                </View>
                <View style={styles.textInputContainerStyle}>
                  <Entypo
                    name="link"
                    size={20}
                    color={colors.GREY.btnPrimary}
                    style={styles.textInputIcon}
                  />

                  <TextInput
                    editable={true}
                    placeholder={language.referral_id_placeholder}
                    value={state.referralId}
                    style={styles.inputTextStyle}
                    onChangeText={(text) => {
                      setState({ ...state, referralId: text });
                    }}
                  />
                </View>
                {/* Button container */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => activeSectionBtnHandler(1)}
                  >
                    <Text style={styles.buttonTitle}>Continue</Text>
                  </TouchableOpacity>
                </View>
                {/* REGISTERATION LINK */}
                <View
                  style={[
                    styles.linkBar,
                    {
                      marginTop: 60,
                      alignSelf: "center",
                      marginRight: 10,
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text style={styles.regularText}>
                    Already have an account?
                  </Text>
                  <TouchableOpacity
                    style={{ paddingLeft: 5 }}
                    onPress={props.navigation}
                  >
                    <Text style={[styles.linkText, { color: "#9B0000" }]}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : activeSection === 1 ? (
              <>
                <View style={styles.textInputContainerStyle}>
                  <FontAwesome
                    style={styles.textInputIcon}
                    name="user"
                    size={20}
                    color={colors.GREY.btnPrimary}
                  />
                  <TextInput
                    editable={true}
                    placeholder={language.first_name_placeholder}
                    value={state.firstName}
                    keyboardType={"email-address"}
                    style={styles.inputTextStyle}
                    onChangeText={(text) => {
                      setState({ ...state, firstName: text });
                    }}
                  />
                </View>

                <View style={styles.textInputContainerStyle}>
                  <FontAwesome
                    style={styles.textInputIcon}
                    name="user"
                    size={20}
                    color={colors.GREY.btnPrimary}
                  />
                  <TextInput
                    editable={true}
                    placeholder={language.last_name_placeholder}
                    value={state.lastName}
                    keyboardType={"email-address"}
                    style={styles.inputTextStyle}
                    onChangeText={(text) => {
                      setState({ ...state, lastName: text });
                    }}
                  />
                </View>
                <View style={styles.textInputContainerStyle}>
                  <Zocial
                    name="email"
                    size={20}
                    color={colors.GREY.btnPrimary}
                    style={styles.textInputIcon}
                  />
                  <TextInput
                    placeholder={language.email_placeholder}
                    value={state.email}
                    keyboardType={"email-address"}
                    style={styles.inputTextStyle}
                    onChangeText={(text) => {
                      setState({ ...state, email: text });
                    }}
                  />
                </View>
                <View style={styles.textInputContainerStyle}>
                  <Fontisto
                    name="locked"
                    size={20}
                    color={colors.GREY.btnPrimary}
                    style={styles.textInputIcon}
                  />
                  <TextInput
                    placeholder={language.password_placeholder}
                    value={state.password}
                    style={styles.inputTextStyle}
                    onChangeText={(text) =>
                      setState({ ...state, password: text })
                    }
                    secureTextEntry={true}
                  />
                </View>

                {/* Button container */}
                <View
                  style={[
                    styles.buttonContainer,
                    styles.buttonContainerFixedBottom,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.formBackBtn}
                    onPress={() => activeSectionBtnHandler(0)}
                  >
                    <Text
                      style={[
                        styles.buttonTitle,
                        { color: colors.BLUE.secondary },
                      ]}
                    >
                      Back
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => onPressRegister()}
                  >
                    <Text style={styles.buttonTitle}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </Background>
  );
}

const ScreenHeight = Dimensions.get("window").height;
const ScreenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  // Bis
  textInputIcon: {
    margin: 12,
    marginLeft: 15,
    marginRight: 10,
  },
  headerContainerStyle: {
    backgroundColor: "white",
    borderBottomWidth: 0,
    marginTop: 0,
  },
  headerInnerContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  inputContainerStyle: {
    color: "black",
    fontSize: 18,
    fontFamily: "Roboto-Regular",
    textAlign: "left",
    marginTop: 0,
    marginLeft: 5,
    flex: 1,
    height: 40,
  },
  textInputStyle: {
    marginLeft: 10,
    width: "90%",
  },
  iconContainer: {
    paddingBottom: 20,
  },
  gapView: {
    height: 40,
    width: "100%",
  },
  buttonContainer: {
    width: ScreenWidth,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 40,
    paddingHorizontal: 30,
  },
  //   position buttons to the bottom
  buttonContainerFixedBottom: {
    width: ScreenWidth,
    position: "relative",
    left: 0,
    right: 0,
    bottom: 0,
  },
  registerButton: {
    flex: 1,
    backgroundColor: colors.BLUE.secondary,
    paddingVertical: 13,
    marginHorizontal: 5,
    borderWidth: 0,
    marginTop: 30,
    borderRadius: 6,
  },
  formBackBtn: {
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingVertical: 13,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: colors.BLUE.secondary,
    marginTop: 30,
    borderRadius: 6,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.WHITE,
    textAlign: "center",
  },
  pickerStyle: {
    color: colors.BLACK,
    fontSize: 18,
    width: "100%",
    height: 40,
    // marginLeft: Platform.OS == "ios" ? 20 : 10,
    // marginTop: Platform.OS == "ios" ? 0 : 10,
    borderBottomWidth: 1,
  },
  inputTextStyle: {
    color: "black",
    fontSize: 18,
    fontFamily: "Roboto-Regular",
    textAlign: "left",
    marginTop: 0,
    marginLeft: 5,
    flex: 1,
    height: 40,
  },
  errorMessageStyle: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 0,
  },
  containerStyle: {
    flexDirection: "column",
    marginTop: 50,
  },
  form: {
    flex: 1,
  },
  logo: {
    marginTop: 60,
    alignItems: "center",
  },
  scrollViewStyle: {
    height: height,
    backgroundColor: "white",
  },
  textInputContainerStyle: {
    height: 50,
    backgroundColor: "#f1f1f1",
    marginTop: 12,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 8,
    paddingRight: 5,
    // borderWidth: 1,
    // borderColor: colors.GREY.border,
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
    borderRadius: 5,
  },
  headerStyle: {
    fontSize: 38,
    color: colors.BLUE.secondary,
    textAlign: "center",
    flexDirection: "row",
    marginTop: 0,
    fontWeight: "bold",
  },

  capturePhoto: {
    width: "80%",
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: colors.WHITE,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 10,
  },
  capturePhotoTitle: {
    color: colors.BLACK,
    fontSize: 18,
    textAlign: "center",
    paddingBottom: 25,
  },
  errorPhotoTitle: {
    color: colors.RED,
    fontSize: 18,
    textAlign: "center",
    paddingBottom: 25,
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
    backgroundColor: colors.WHITE,
    alignItems: "center",
  },
  imageStyle: {
    width: 100,
    height: 100,
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
    height: 100,
  },
  myView: {
    flex: 2,
    height: 50,
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
    marginTop: 15,
  },
  linkBar: {
    flexDirection: "row",
    marginTop: 3,
    marginRight: 25,
    alignSelf: "flex-end",
  },
  linkText: {
    fontSize: 16,
    color: colors.BLUE.secondary,
    fontFamily: "Roboto",
    fontWeight: "normal",
  },
  regularText: {
    fontWeight: "normal",
    fontSize: 16,
    color: colors.GREY.btnPrimary,
  },
  buttonAddImage: {
    backgroundColor: colors.WHITE,
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    right: -30,
    top: -30,
    margin: 3,
  },
});
