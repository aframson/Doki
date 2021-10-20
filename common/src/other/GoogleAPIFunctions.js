import { Google_Map_API_Key } from 'config';

export const fetchCoordsfromPlace = async (platform, place_id) => {
    const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?place_id=' + place_id + '&key=' + Google_Map_API_Key[platform]);
    const json = await response.json();
    if (json.results && json.results.length > 0 && json.results[0].geometry) {
        let coords = json.results[0].geometry.location;
        return coords;
    }
    return null;
}

export const fetchAddressfromCoords = async (platform, latlng) => {
    const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&key=' + Google_Map_API_Key[platform])
    const json = await response.json();
    if (json.results && json.results.length > 0 && json.results[0].formatted_address) {
        return json.results[0].formatted_address;
    }
    return null;
}

export const getRouteDetails = async (platform, startLoc, destLoc) => {
    const response = await fetch('https://maps.googleapis.com/maps/api/directions/json?origin=' + startLoc + '&destination=' + destLoc + '&key=' + Google_Map_API_Key[platform])
    const json = await response.json();
    if (json.routes && json.routes.length > 0 && json.routes[0].overview_polyline.points) {
        return {
            distance:(json.routes[0].legs[0].distance.value / 1000),
            duration:json.routes[0].legs[0].duration.value,
            polylinePoints:json.routes[0].overview_polyline.points
        }
    }
    return null;
}

export const getDriveTime = async (platform, startLoc, destLoc) => {
    const response = await fetch('https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + startLoc + '&destinations=' + destLoc + '&key=' + Google_Map_API_Key[platform])
    const json = await response.json();
    if (json.rows && json.rows.length > 0 && json.rows[0].elements.length > 0) {
        return {
            distance_in_km: json.rows[0].elements[0].distance.value / 1000,
            time_in_secs: json.rows[0].elements[0].duration.value,
            timein_text: json.rows[0].elements[0].duration.text
        }
    }
    return null;
}
