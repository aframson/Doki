import React, { useContext } from 'react';
import { Platform, StatusBar, Button, Alert,TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { colors } from '../common/theme';
import { Icon, } from 'react-native-elements';

import {
    Google_Map_API_Key,
    language,
    features,
    default_country_code
} from 'config';
import { useDispatch } from 'react-redux';
import { FirebaseContext } from 'common/src';

export default function SearchScreen(props) {
    const { api } = useContext(FirebaseContext);
    const {
        fetchCoordsfromPlace,
        updateTripPickup,
        updateTripDrop
    } = api;
    const dispatch = useDispatch();
    const locationType = props.navigation.getParam('locationType');
    const savedAddresses = props.navigation.getParam('savedAddresses');

    if(features.AllowCountrySelection == false){

    }

    const updateLocation = (data) => {
        if(data.place_id){
            fetchCoordsfromPlace(Platform.OS, data.place_id).then((res)=>{
                if(res && res.lat){
                    if(locationType=='pickup'){
                        dispatch(updateTripPickup({
                            lat:res.lat,
                            lng:res.lng,
                            add:data.description,
                            source: 'search'
                        }));
                    }else{
                        dispatch(updateTripDrop({
                            lat:res.lat,
                            lng:res.lng,
                            add:data.description,
                            source: 'search'
                        }));
                    }
                    props.navigation.pop();
                }else{
                    Alert.alert(language.alert,language.place_to_coords_error);
                }
            });
        } else {
            if(data.description){
                if(locationType=='pickup'){
                    dispatch(updateTripPickup({
                        lat:data.lat,
                        lng:data.lng,
                        add:data.description,
                        source: 'search'
                    }));
                }else{
                    dispatch(updateTripDrop({
                        lat:data.lat,
                        lng:data.lng,
                        add:data.description,
                        source: 'search'
                    }));
                }
                props.navigation.pop();
            }
        }

    }

    return (
        <GooglePlacesAutocomplete
            placeholder={language.search}
            minLength={2} // minimum length of text to search
            autoFocus={true}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed='auto'  // true/false/undefined
            fetchDetails={true}
            renderLeftButton={() =>   
            <TouchableOpacity
                // style={{position: 'absolute',margin:20}}
                onPress={() => props.navigation.goBack()}
              >
                <Icon
                  name='back'
                  type='antdesign'
                  color='black'
                  size={35}
                  style={{ marginTop: 10}}
                />
              </TouchableOpacity>
            }
            textInputProps={{ clearButtonMode: 'while-editing' }}
            onPress={(data) => { // 'details' is provided when fetchDetails = true
                updateLocation(data);
            }}

            query={
                features.AllowCountrySelection?
                {
                    key: Google_Map_API_Key[Platform.OS],
                    language: 'en',
                }
                :
                {
                    key: Google_Map_API_Key[Platform.OS],
                    language: 'en',
                    components: 'country:' + default_country_code.code.toLowerCase()
                }
            }
            predefinedPlaces = {savedAddresses}

            styles={{
                container: {
                  flex: 1,
                  marginTop:40,
                //   backgroundColor: 'red'
                },
                textInputContainer: {
                  flexDirection: 'row',
                  height:'auto',
                  backgroundColor: '#eee',
                  padding:10,
                },
                textInput: {
                  backgroundColor: '#FFFFFF',
                  height: 44,
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  fontSize: 15,
                  flex: 1,
                },
                poweredContainer: {
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  borderBottomRightRadius: 5,
                  borderBottomLeftRadius: 5,
                  borderColor: '#c8c7cc',
                  borderTopWidth: 0.5,
                },
                powered: {},
                listView: {},
                row: {
                  backgroundColor: '#FFFFFF',
                  padding: 13,
                  height: 44,
                  flexDirection: 'row',
                },
                separator: {
                  height: 0.5,
                  backgroundColor: '#c8c7cc',
                },
                description: {},
                loader: {
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  height: 20,
                },
              }}
            renderDescription={(row) => row.description || row.formatted_address || row.name}
            fetchDetails={false}
            minLength={4}
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        />
    );
}