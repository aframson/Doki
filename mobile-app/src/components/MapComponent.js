import React, { useState } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { Image } from "react-native";
import carImageIcon from "../../assets/images/available_car.png";

export default function MapComponent(props) {
  const [state, setState] = useState({
    marginBottom: 0,
  });

  const { mapRegion, mapStyle, nearby, onRegionChangeComplete, onPanDrag } =
    props;
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      loadingEnabled
      showsMyLocationButton={true}
      style={[mapStyle, { marginBottom: state.marginBottom }]}
      region={mapRegion}
      onRegionChangeComplete={onRegionChangeComplete}
      onPanDrag={onPanDrag}
      //   draggable={false}
      onMapReady={() => setState({ ...state, marginBottom: 1 })}
    >
      {nearby
        ? nearby.map((item, index) => {
            return (
              <Marker.Animated
                coordinate={{
                  latitude: item.location ? item.location.lat : 0.0,
                  longitude: item.location ? item.location.lng : 0.0,
                }}
                key={index}
              >
                <Image
                  source={carImageIcon}
                  style={{ height: 50, width: 20 }}
                />
              </Marker.Animated>
            );
          })
        : null}
    </MapView>
  );
}
