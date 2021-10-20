import React from 'react';
import {
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
  } from "react-google-maps";
import pinImage from '../assets/img/car.png';

const Map = withGoogleMap(props =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={props.mapcenter}
  >
    {props.locations.map(marker => (
        <Marker
            position={{ lat: marker.lat, lng: marker.lng }}
            key={marker.id}
            icon={{
              url: pinImage
            }}
        >
          <InfoWindow>
            <div>{marker.drivername}</div>
          </InfoWindow>
        </Marker>
    ))}
  </GoogleMap>
);

export default Map;