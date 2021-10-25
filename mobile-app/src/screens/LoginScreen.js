import React, { useState, useRef, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Dimensions,
  // KeyboardAvoidingView, ...using KeyboardAwareScrollView instead
  Alert,
  TextInput,
  Image,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import MaterialButtonDark from "../components/MaterialButtonDark";
import { TouchableOpacity } from "react-native-gesture-handler";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { useDispatch, useSelector } from "react-redux";
import { FirebaseContext } from "common/src";
import { colors } from "../common/theme";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import RNPickerSelect from "react-native-picker-select";
import {
  language,
  countries,
  default_country_code,
  FirebaseConfig,
  features,
} from "config";

//Bis- imports
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LoginWithEmail from "../components/LoginWithEmailTab";
import LoginWithPhone from "../components/LoginWithPhoneTab";
import { Zocial, Fontisto, Entypo } from "@expo/vector-icons";
import { FormTitle } from "../components/FormTitle";

export default function EmailLoginScreen(props) {
  const { api } = useContext(FirebaseContext);
  const {
    signIn,
    sendResetMail,
    clearLoginError,
    requestPhoneOtpDevice,
    mobileSignIn,
    checkUserExists,
  } = api;
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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
  const [state, setState] = useState({
    email: "",
    password: "",
    customStyleIndex: 0,
    phoneNumber: null,
    verificationId: null,
    verificationCode: null,
    countryCodeList: formatCountries(),
    countryCode: "+" + default_country_code.phone,
  });

  const emailInput = useRef(null);
  const passInput = useRef(null);
  const pageActive = useRef(false);
  const [loading, setLoading] = useState(false);
  const recaptchaVerifier = useRef(null);

  useEffect(() => {
    if (auth.info && pageActive.current) {
      pageActive.current = false;
      props.navigation.navigate("AuthLoading");
      setLoading(false);
    }
    if (
      auth.error &&
      auth.error.msg &&
      pageActive.current &&
      auth.error.msg.message !== language.not_logged_in
    ) {
      pageActive.current = false;
      if (
        auth.error.msg.message === language.require_approval ||
        auth.error.msg.message === language.email_verify_message
      ) {
        setState({
          ...state,
          password: "",
          phoneNumber: null,
          verificationId: null,
          verificationCode: null,
        });
      }
      Alert.alert(language.alert, auth.error.msg.message);
      dispatch(clearLoginError());
      setLoading(false);
    }
    if (auth.verificationId) {
      pageActive.current = false;
      setState({ ...state, verificationId: auth.verificationId });
      setLoading(false);
    }
  }, [auth.info, auth.error, auth.error.msg, auth.verificationId]);

  onPressLogin = async () => {
    setLoading(true);
    if (state.countryCode && state.countryCode !== language.select_country) {
      if (state.phoneNumber) {
        let formattedNum = state.phoneNumber.replace(/ /g, "");
        formattedNum = state.countryCode + formattedNum.replace(/-/g, "");
        if (formattedNum.length > 8) {
          checkUserExists({ mobile: formattedNum }).then((res) => {
            if (res.users && res.users.length > 0) {
              pageActive.current = true;
              dispatch(
                requestPhoneOtpDevice(formattedNum, recaptchaVerifier.current)
              );
            } else {
              setLoading(false);
              Alert.alert(language.alert, language.user_does_not_exists);
            }
          });
        } else {
          Alert.alert(language.alert, language.mobile_no_blank_error);
          setLoading(false);
        }
      } else {
        Alert.alert(language.alert, language.mobile_no_blank_error);
        setLoading(false);
      }
    } else {
      Alert.alert(language.alert, language.country_blank_error);
      setLoading(false);
    }
  };

  onSignIn = async () => {
    setLoading(true);
    pageActive.current = true;
    dispatch(mobileSignIn(state.verificationId, state.verificationCode));
  };

  CancelLogin = () => {
    setState({
      ...state,
      phoneNumber: null,
      verificationId: null,
      verificationCode: null,
    });
  };

  validateEmail = (email) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailValid = re.test(email);
    if (!emailValid) {
      emailInput.current.focus();
      setLoading(false);
      Alert.alert(language.alert, language.valid_email_check);
    }
    return emailValid;
  };

  onAction = async () => {
    setLoading(true);
    const { email, password } = state;
    if (validateEmail(email)) {
      if (password != "") {
        pageActive.current = true;
        dispatch(signIn(email, password));
        setState({
          ...state,
          email: "",
          password: "",
        });
        emailInput.current.focus();
      } else {
        passInput.current.focus();
        setLoading(false);
        Alert.alert(language.alert, language.password_blank_messege);
      }
    }
  };

  Forgot_Password = async (email) => {
    if (validateEmail(email)) {
      Alert.alert(
        language.forgot_password_link,
        language.forgot_password_confirm,
        [
          { text: language.cancel, onPress: () => {}, style: "cancel" },
          {
            text: language.ok,
            onPress: () => {
              pageActive.current = true;
              dispatch(sendResetMail(email));
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  handleCustomIndexSelect = (index) => {
    setState({ ...state, customStyleIndex: index });
  };

  // Bis- form tab action/reducer
  const loginTypeTabActionEmail = () => {
    // toggle customStyleIndex
    setState({ ...state, customStyleIndex: 1 });
  };
  const loginTypeTabActionPhone = () => {
    // toggle customStyleIndex
    setState({ ...state, customStyleIndex: 0 });
  };

  return (
    <KeyboardAwareScrollView style={styles.container} extraHeight={50}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.WHITE} />
      {/* -- */}
      <View style={styles.formContainer}>
        {/* <Image
          style={styles.formLogo}
          source={require("../../assets/images/logo.png")}
        /> */}
        {/* Bis- form Title component */}
        <FormTitle title="Login" subtitle="Log into your account to continue" />

        {state.customStyleIndex == 1 ? (
          <View style={styles.inputContainer}>
            {/* Bis- adding icons to text Input */}
            <Zocial
              name="email"
              size={24}
              color={colors.GREY.btnPrimary}
              style={styles.txtInputIcon}
            />
            <TextInput
              ref={emailInput}
              style={styles.textInput}
              placeholder={language.email_placeholder}
              onChangeText={(value) => setState({ ...state, email: value })}
              value={state.email}
            />
          </View>
        ) : null}
        {state.customStyleIndex == 1 ? (
          <View style={styles.inputContainer}>
            <Fontisto
              name="locked"
              size={24}
              color={colors.GREY.btnPrimary}
              style={styles.txtInputIcon}
            />
            <TextInput
              ref={passInput}
              style={styles.textInput}
              placeholder={language.password_placeholder}
              onChangeText={(value) => setState({ ...state, password: value })}
              value={state.password}
              secureTextEntry={true}
            />
          </View>
        ) : null}
        {state.customStyleIndex == 1 ? (
          <View style={styles.linkBar}>
            <TouchableOpacity
              style={styles.barLinks}
              onPress={() => Forgot_Password(state.email)}
            >
              <Text style={styles.linkText}>
                {language.forgot_password_link}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {state.customStyleIndex == 1 ? (
          <MaterialButtonDark
            onPress={onAction}
            style={styles.materialButtonDark}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {language.login_button}
            </Text>
          </MaterialButtonDark>
        ) : null}

        {state.customStyleIndex != 1 ? (
          <View style={styles.inputContainer}>
            <View style={{ width: "100%", borderRadius: 5 }}>
              <RNPickerSelect
                placeholder={{
                  label: language.select_country,
                  value: language.select_country,
                }}
                value={state.countryCode}
                useNativeAndroidPickerStyle={true}
                style={{
                  inputIOS: styles.pickerStyle,
                  inputAndroid: styles.pickerStyle,
                }}
                onValueChange={(value) =>
                  setState({ ...state, countryCode: value })
                }
                items={state.countryCodeList}
                disabled={
                  !!state.verificationId || !features.AllowCountrySelection
                    ? true
                    : false
                }
              />
            </View>
          </View>
        ) : null}
        {/* form component */}
        <View>
          {state.customStyleIndex != 1 ? (
            <View style={styles.inputContainer}>
              <Entypo
                name="mobile"
                size={28}
                color={colors.GREY.btnPrimary}
                style={[
                  styles.txtInputIcon,
                  { marginRight: 5, marginLeft: 10 },
                ]}
              />
              <TextInput
                style={styles.textInput}
                placeholder={language.mobile_no_placeholder}
                onChangeText={(value) =>
                  setState({ ...state, phoneNumber: value })
                }
                value={state.phoneNumber}
                editable={!!state.verificationId ? false : true}
                keyboardType="phone-pad"
              />
            </View>
          ) : null}
          {state.customStyleIndex != 1 ? (
            state.verificationId ? null : (
              <MaterialButtonDark
                onPress={onPressLogin}
                style={[styles.materialButtonDark]}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {/* {language.request_otp} */}
                  Log in
                </Text>
              </MaterialButtonDark>
            )
          ) : null}
          {state.customStyleIndex != 1 && !!state.verificationId ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder={language.otp_here}
                onChangeText={(value) =>
                  setState({ ...state, verificationCode: value })
                }
                value={state.verificationCode}
                ditable={!!state.verificationId}
                keyboardType="phone-pad"
                secureTextEntry={true}
              />
            </View>
          ) : null}
        </View>

        {state.customStyleIndex != 1 && !!state.verificationId ? (
          <MaterialButtonDark
            onPress={onSignIn}
            style={[styles.materialButtonDark, styles.bgRed]}
          >
            {language.authorize}
          </MaterialButtonDark>
        ) : null}
        {state.verificationId ? (
          <View style={styles.actionLine}>
            <TouchableOpacity style={styles.actionItem} onPress={CancelLogin}>
              <Text style={styles.actionText}>{language.cancel}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.BLACK} size="large" />
          </View>
        ) : null}

        {/*Bis- orComponent */}
        <View style={{ marginVertical: 20 }}>
          <Text style={styles.orComponentTxt}>OR</Text>
        </View>
        {/* end of orComponent */}

        {/* Bis- tab component */}
        {state.customStyleIndex == 1 ? (
          <LoginWithPhone action={() => loginTypeTabActionPhone()} />
        ) : (
          <LoginWithEmail action={() => loginTypeTabActionEmail()} />
        )}

        {/* End of tab component */}

        {/* REGISTERATION LINK */}
        <View
          style={[
            styles.linkBar,
            {
              marginTop: 20,
              alignSelf: "center",
              marginRight: 10,
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.regularText}>Don't have an account?</Text>
          <TouchableOpacity
            style={{ paddingLeft: 5 }}
            onPress={() => props.navigation.navigate("Reg")}
          >
            <Text style={[styles.linkText, { color: "#9B0000" }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

// Bis- form components heights and widths
const ScreenHeight = Dimensions.get("window").height;
const ScreenWidth = Dimensions.get("screen").width;
let formImgContainerHeight = ScreenHeight / 2;

const styles = StyleSheet.create({
  // Bis- Form tab style
  activeTabStyle: {
    borderBottomColor: colors.GREY.background,
    backgroundColor: colors.BLUE.secondary,
    borderBottomWidth: 0,
  },
  // Bis- login with phone number submit btn bg color
  bgRed: {
    backgroundColor: "#9B0000",
  },
  // Bis- Form Container style
  formContainer: {
    paddingTop: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "white",
    position: "relative",
    bottom: 0,
    left: 0,
    top: -15,
    zIndex: 99,
    height: ScreenHeight,
    width: ScreenWidth,
  },

  // Bis- Form Container style
  orComponentTxt: {
    backgroundColor: colors.WHITE,
    borderRadius: 50,
    marginLeft: "auto",
    marginRight: "auto",
    // marginTop: -20,
    padding: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: colors.GREY.default,
  },

  // Bis- Form txt input icon style
  txtInputIcon: {
    margin: 12,
    marginLeft: 18,
    marginRight: 10,
  },

  // Bis- Box shadow
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },

  regularText: {
    fontWeight: "normal",
    fontSize: 16,
    color: colors.GREY.btnPrimary,
  },

  formLogo: {
    width: 140,
    height: 80,
    marginRight: "auto",
    marginLeft: "auto",
    marginBottom: 20,
  },

  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    height: ScreenHeight,
    paddingTop: 60,
    backgroundColor: colors.WHITE,
  },
  imagebg: {
    flex: 1,
    // position: "absolute",
    // left: 0,
    // top: 0,
    width: Dimensions.get("window").width,
    height: formImgContainerHeight,
  },
  topBar: {
    // flex:0.5,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    height:
      Dimensions.get("window").height * 0.52 +
      (Platform.OS == "android" ? 40 : 0),
    zIndex: 999999999999999999999,
  },
  backButton: {
    height: 40,
    width: 40,
    marginLeft: 35,
    marginTop: 45,
  },
  backButtonImage: {
    height: 40,
    width: 40,
  },
  segmentcontrol: {
    color: colors.WHITE,
    fontSize: 18,
    fontFamily: "Roboto-Regular",
    marginTop: 0,
    alignSelf: "center",
    height: 50,
    marginLeft: 35,
    marginRight: 35,
  },

  // Bis- combined box1 and inputContainer style into inputContainer
  inputContainer: {
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

  textInput: {
    color: "black",
    fontSize: 18,
    fontFamily: "Roboto-Regular",
    textAlign: "left",
    marginTop: 0,
    marginLeft: 5,
    flex: 1,
    height: 40,
  },
  materialButtonDark: {
    height: 50,
    marginTop: 22,
    marginLeft: 35,
    marginRight: 35,
    borderRadius: 6,
    backgroundColor: colors.BLUE.secondary,
  },
  linkBar: {
    flexDirection: "row",
    marginTop: 3,
    marginRight: 25,
    alignSelf: "flex-end",
  },
  barLinks: {
    marginLeft: 15,
    marginRight: 15,
    alignSelf: "center",
    fontSize: 14,
  },
  linkText: {
    fontSize: 16,
    color: colors.BLUE.secondary,
    fontFamily: "Roboto",
    fontWeight: "normal",
  },
  pickerStyle: {
    color: colors.GREY.background,
    fontFamily: "Roboto-Regular",
    fontSize: 18,
    marginLeft: 5,
  },

  actionLine: {
    height: 20,
    flexDirection: "row",
    marginTop: 20,
    alignSelf: "center",
  },
  actionItem: {
    height: 20,
    marginLeft: 15,
    marginRight: 15,
    alignSelf: "center",
  },
  actionText: {
    fontSize: 15,
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
  },
});
