import React, { useEffect, useRef, useContext } from 'react';
import { StyleSheet, View, Image, ImageBackground, Text, Dimensions, Linking, Platform, Alert } from 'react-native';
import MaterialButtonDark from '../components/MaterialButtonDark';
import * as Facebook from 'expo-facebook';
import { language } from 'config';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { facebookAppId, features } from 'config';
import { useSelector, useDispatch } from 'react-redux';
import { FirebaseContext } from 'common/src';
import { colors } from '../common/theme';

const { width, height } = Dimensions.get('window');

export default function IntroScreen(props) {
	const { api } = useContext(FirebaseContext);
	const { facebookSignIn, appleSignIn, clearLoginError } = api;
	const dispatch = useDispatch();
	const auth = useSelector((state) => state.auth);
	const settings = useSelector((state) => state.settingsdata.settings);
	const pageActive = useRef(false);

	useEffect(() => {
		if (auth.info && pageActive.current) {
			pageActive.current = false;
			props.navigation.navigate('AuthLoading');
		}
		if (auth.error && auth.error.msg && pageActive.current && auth.error.msg.message !== language.not_logged_in) {
			pageActive.current = false;
			Alert.alert(language.alert, auth.error.msg.message);
			dispatch(clearLoginError());
		}
	}, [auth.info, auth.error]);

	const FbLogin = async () => {
		try {
			await Facebook.initializeAsync({ appId: facebookAppId });
			const { type, token } = await Facebook.logInWithReadPermissionsAsync({
				permissions: ['public_profile', 'email'],
			});
			if (type === 'success') {
				pageActive.current = true;
				dispatch(facebookSignIn(token));
			} else {
				Alert.alert(language.alert, language.facebook_login_auth_error);
			}
		} catch ({ message }) {
			Alert.alert(language.alert, language.facebook_login_auth_error`${message}`);
		}
	};

	const AppleLogin = async () => {
		const csrf = Math.random().toString(36).substring(2, 15);
		const nonce = Math.random().toString(36).substring(2, 10);
		const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);
		try {
			const applelogincredentials = await AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
					AppleAuthentication.AppleAuthenticationScope.EMAIL,
				],
				state: csrf,
				nonce: hashedNonce,
			});

			pageActive.current = true;
			dispatch(
				appleSignIn({
					idToken: applelogincredentials.identityToken,
					rawNonce: nonce,
				})
			);
		} catch (e) {
			if (e.code === 'ERR_CANCELED') {
				console.log('Cencelled');
			} else {
				Alert.alert(language.alert, language.apple_signin_error);
			}
		}
	};

	const onPressLoginEmail = async () => {
		pageActive.current = false;
		props.navigation.navigate('Login');
	};

	const onPressRegister = async () => {
		pageActive.current = false;
		props.navigation.navigate('Reg');
	};

	const openTerms = async () => {
		Linking.openURL(settings.CompanyTerms).catch((err) => console.error("Couldn't load page", err));
	};

	return (
		<ImageBackground source={require('../../assets/images/pa4.jpg')} style={styles.imagebg}>
			<View
				style={{
					width,
					height,
					backgroundColor: colors.BLUE.secondary,
					bottom: 0,
					opacity: 0.8,
				}}
			></View>
			
			<View
				style={{
					width,
					height: 'auto',
					// backgroundColor:'white',
					position: 'absolute',
					// borderWidth: 1,
					padding: 20,
					marginTop: height / 2,
				}}
			>
				<Text
					style={{
						fontSize: Platform.OS === 'ios' ? 40 : 30,
						fontWeight: 'bold',
						color:'white'
					}}
				>
					CONTROL YOUR DELIVERY
				</Text>
				<Text style={{
					fontSize: Platform.OS === 'ios' ? 30 : 20,
					fontWeight: 'bold',
					color:'white'
				}}>IN ONE APP</Text>
				<Text style={{
					color:'white'
				}}>The easiest way to make a delivery</Text>
			</View>
			<View style={styles.topSpace}>
				<MaterialButtonDark onPress={onPressLoginEmail} style={styles.materialButtonDark}>
					{language.login}
				</MaterialButtonDark>
				{features.MobileLoginEnabled ? (
					<MaterialButtonDark onPress={onPressRegister} style={styles.materialButtonDark2}>
						<Text style={{color:colors.BLUE.secondary}}>{language.register}</Text>
					</MaterialButtonDark>
				) : null}
				{/* {(Platform.OS == 'ios' && features.AppleLoginEnabled) || features.FacebookLoginEnabled ? (
					<View style={styles.seperator}>
						<View style={styles.lineLeft}></View>
						<View style={styles.lineLeftFiller}>
							<Text style={styles.sepText}>{language.spacer_message}</Text>
						</View>
						<View style={styles.lineRight}></View>
					</View>
				) : null} */}

				{/* {(Platform.OS == 'ios' && features.AppleLoginEnabled) || features.FacebookLoginEnabled ? (
					<View style={styles.socialBar}>
						{features.FacebookLoginEnabled ? (
							<TouchableOpacity style={styles.socialIcon} onPress={FbLogin}>
								<Image
									source={require('../../assets/images/image_fb.png')}
									resizeMode="contain"
									style={styles.socialIconImage}
								></Image>
							</TouchableOpacity>
						) : null}
						{Platform.OS == 'ios' && features.AppleLoginEnabled ? (
							<TouchableOpacity style={styles.socialIcon} onPress={AppleLogin}>
								<Image
									source={require('../../assets/images/image_apple.png')}
									resizeMode="contain"
									style={styles.socialIconImage}
								></Image>
							</TouchableOpacity>
						) : null}
					</View>
				) : null} */}
				{/* <View>
					<TouchableOpacity style={styles.terms} onPress={openTerms}>
						<Text style={styles.actionText}>{language.terms}</Text>
					</TouchableOpacity>
				</View> */}
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	imagebg: {
		position: 'absolute',
		left: 0,
		top: 0,
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
	topSpace: {
		// marginTop: 0,
		// marginLeft: 0,
		// marginRight: 0,
		// height: Dimensions.get('window').height * 0.58,
		// width: Dimensions.get('window').width,
		position: 'absolute',
		width,
		// borderWidth: 1,
		bottom: 40,
		padding: 10,
		alignSelf: 'center',
		// borderTopEndRadius: 10,
		// borderTopLeftRadius: 10,
		// borderBottomLeftRadius: 0,
		// borderBottomRightRadius: 0,
		height: 'auto',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.29,
		shadowRadius: 4.65,
		elevation: 7,
		// backgroundColor:'white',
		flexDirection: 'row',
	},
	materialButtonDark: {
		height: 40,
		// marginTop: 20,
		// marginLeft: 35,
		// marginRight: 35,
		backgroundColor:null,
		width: '47%',
		alignSelf: 'center',
		borderRadius: 5,
		margin: 5,
		borderColor: 'white',
		borderWidth: 1,
	},
	materialButtonDark2: {
		height: 40,
		// marginTop: 14,
		// marginLeft: 35,
		// marginRight: 35,
		backgroundColor: 'white',
		width: '47%',
		alignSelf: 'center',
		borderRadius: 6,
		margin: 5,
        color:'black'
	},
	actionLine: {
		height: 20,
		flexDirection: 'row',
		marginTop: 20,
		alignSelf: 'center',
	},
	actionItem: {
		height: 20,
		marginLeft: 15,
		marginRight: 15,
		alignSelf: 'center',
	},
	actionText: {
		fontSize: 15,
		fontFamily: 'Roboto-Regular',
		fontWeight: 'bold',
	},
	seperator: {
		width: 250,
		height: 20,
		flexDirection: 'row',
		marginTop: 20,
		alignSelf: 'center',
	},
	lineLeft: {
		width: 40,
		height: 1,
		backgroundColor: 'rgba(113,113,113,1)',
		marginTop: 9,
	},
	sepText: {
		color: colors.BLACK,
		fontSize: 16,
		fontFamily: 'Roboto-Regular',
	},
	lineLeftFiller: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	lineRight: {
		width: 40,
		height: 1,
		backgroundColor: 'rgba(113,113,113,1)',
		marginTop: 9,
	},
	socialBar: {
		height: 40,
		flexDirection: 'row',
		marginTop: 15,
		alignSelf: 'center',
	},
	socialIcon: {
		width: 40,
		height: 40,
		marginLeft: 15,
		marginRight: 15,
		alignSelf: 'center',
	},
	socialIconImage: {
		width: 40,
		height: 40,
	},
	terms: {
		marginTop: 18,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		opacity: 0.54,
	},
});
