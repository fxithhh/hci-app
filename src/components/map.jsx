// Map.jsx

import React, { useState, useCallback, useEffect, useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { renderToString } from 'react-dom/server';
import { useGoogleMapsLoader } from './googleMapsConfig';
import { findPlaces, searchCarparkInfo } from './apiService';
import { getMapDistance } from './helper';
import carparkData from '../assets/carpark_final.json';

const MarkerComponent = ({ position, color }) => (
    <Marker
        position={position}
        icon={{
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                renderToString(
                    <IconContext.Provider value={{ color: color }}>
                        <FaMapMarkerAlt />
                    </IconContext.Provider>
                )
            )}`,
            scaledSize: new window.google.maps.Size(35, 35),
        }}
    />
);

const Map = forwardRef(({ user_latitude, user_longitude, search_text, carpark_dict, chosen_carpark, carpark_list_change }, ref) => {
    const [autocompleteService, setAutocompleteService] = useState(null);
    const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
    const [map, setMap] = useState(null);
    const libraries  = ["places"];
    const { isLoaded, loadError } = useGoogleMapsLoader();
    const [target_coords , setTargetCoords] = useState(null)
    const [target_relevant_details , setTargetRelevantDetails] = useState(null)
    const [carparks_found, setCarparksFound] = useState(false);
    const [navigation_in_progress , setNavigationInProgress] = useState(false)
    let [directionsRenderer, setDirectionsRenderer] = useState(null)
    let [index_carpark_list , setIndexCarparkList] = useState(null)

    // ... existing useEffect and useImperativeHandle ...

    const createRequest = (query) => ({
        query: query,
        fields: ['name', 'geometry', 'photos', 'accessibility', 'websiteURI'],
        language: 'en-US',
        maxResults: 10,
        region: 'sg',
        strictBounds: true,
    });

    const findPlacesFn = useCallback(async () => {
        if (!googleScriptLoaded) {
            return;
        }

        const request = createRequest(search_text);
    
        const service = new window.google.maps.places.PlacesService(map);
        const results = await findPlaces(service, request);
        if (results) {
            const firstResult = results[0];
            const target_latitude = firstResult.geometry.location.lat();
            const target_longitude = firstResult.geometry.location.lng();
            const local_target_coords = `${target_latitude},${target_longitude}`;
            user_marker.splice(1, 0, { position: { lat: target_latitude, lng: target_longitude }, color: '#E60000', label: firstResult.name });
            setTargetCoords(local_target_coords);
            const local_relevant = {
                name: firstResult.name,
                location: firstResult.formatted_address,
                image_src: firstResult.photos && firstResult.photos.length > 0 ? firstResult.photos[0].getUrl() : null
            };
            setTargetRelevantDetails(local_relevant);
            getMapDistance(carparkData, local_target_coords);
            carparkData.sort((a, b) => a.distance_from_target - b.distance_from_target);
            const shortlist = carparkData.slice(0, 10);
            carpark_info_search(shortlist);
        } else {
            setTargetCoords(null);
            setTargetRelevantDetails(null);
        }
    }, [search_text]);

    function carpark_info_search(carpark_list) {
        return new Promise((resolve, reject) => {
            const return_list = [];
            let promises = [];
            for (let i = 0; i < carpark_list.length; i++) {
                const this_carpark = carpark_list[i];
                const promise = searchCarparkInfo(this_carpark);
                promises.push(promise);
            }
    
            Promise.all(promises)
                .then((results) => {
                    for (const result of results) {
                        if (result) {
                            return_list.push(result);
                        } 
                    }
                    setIndexCarparkList(return_list);
                    setCarparksFound(true);
                    carpark_dict = return_list;
                    carpark_list_change(return_list);
                    resolve(return_list);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // ... existing functions ...

    const user_marker = useMemo(() => [
        { position: { lat: user_latitude, lng: user_longitude }, color: '#FF9933', label: 'You are here' },
    ], [user_latitude, user_longitude]);

    const containerStyle = {
        width: '100vw',
        height: '85vh'
    };
    
    const mapOptions = {
        zoom: 18,
        center: { lat: user_latitude, lng: user_longitude },
        mapTypeControl: false,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [
                    { visibility: 'off' },
                ],
            },
            {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [
                    { visibility: 'off' },
                ],
            },
            {
                featureType: 'road',
                elementType: 'labels',
                stylers: [
                    { visibility: 'off' },
                ],
            },
        ],
    };

    const onLoad = useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        user_marker.forEach((marker) => {
            bounds.extend({
                lat: marker.position.lat,
                lng: marker.position.lng,
            });
        });
        map.fitBounds(bounds);
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapOptions.center}
            zoom={mapOptions.zoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={mapOptions}
        >
            {user_marker.map((marker, index) => (
                <MarkerComponent
                    key={index}
                    position={marker.position}
                    color={marker.color}
                />
            ))}
        </GoogleMap>
    ) : <></>;
});

export default Map;
