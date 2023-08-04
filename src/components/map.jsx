import { React, useState, useCallback, useEffect , useRef, useImperativeHandle, forwardRef} from 'react'
import { GoogleMap, Marker, InfoWindow} from '@react-google-maps/api';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { renderToString } from 'react-dom/server';
import { useGoogleMapsLoader } from './googleMapsConfig';
import axios from 'axios'; // Import axios library
import carparkData from '../assets/carpark_final.json'; // Import carpark data directly
import {MarkerF} from '@react-google-maps/api'


const Map = forwardRef(({user_latitude,user_longitude,search_text ,carpark_dict,chosen_carpark,carpark_list_change} ,ref) => {
    const [autocompleteService, setAutocompleteService] = useState(null);
    const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
    const [map, setMap] = useState(null);
    const libraries  = ["places"];
    const { isLoaded,loadError } = useGoogleMapsLoader();
    const [target_coords , setTargetCoords] = useState(null)
    const [target_relevant_details , setTargetRelevantDetails] = useState(null)
    const [carparks_found, setCarparksFound] = useState(false); //Kelvin to load map DOM
    const [navigation_in_progress , setNavigationInProgress] = useState(false)
    let [directionsRenderer, setDirectionsRenderer] = useState(null)
    let [index_carpark_list , setIndexCarparkList] = useState(null)
    
    useEffect(() => { 
        if (isLoaded && !loadError && !googleScriptLoaded) {
            setAutocompleteService(new window.google.maps.places.AutocompleteService());
            setGoogleScriptLoaded(true);
            console.log('Scripts for places api loaded');
          }
        console.log("Updated target_coords:", target_coords);
        console.log("Updated details" ,  target_relevant_details)

        if (navigation_in_progress && target_coords != null && chosen_carpark != null) {
            console.log("Clearing preexisting path")
            clearNavigationPath()
            console.log("Finding new path")
            plotNavigationPath()
        } 
        if (!navigation_in_progress && target_coords!= null && chosen_carpark != null){
            console.log("Initiating Path finding ")
            plotNavigationPath()
            setNavigationInProgress(true)
        }
    }, [isLoaded,loadError,target_coords,target_relevant_details,carparks_found,chosen_carpark]); 

    // Kelvin expose function to the parent component to call it on button press
    useImperativeHandle(ref, () => ({
        findPlaces: findPlaces,
      }));

    const findPlaces = async () => {
        console.log("findPlaces method triggered")
        if (!googleScriptLoaded) {
            console.log("map is ",map)
            console.log('Google Maps API is not yet loaded.');
            return;
          }

        const request = {
            query: search_text,
            fields: [
            'name',
            'geometry',
            'photos',
            'accessibility',
            'websiteURI'
            ],
            language: 'en-US',
            maxResults: 10,
            region: 'sg',
            strictBounds: true,
        };
    
        const service = new window.google.maps.places.PlacesService(map);
        service.textSearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                console.log(results);
                console.log(`${search_text} being queried`);
    
                // Handle the first result
                const firstResult = results[0];
                const target_latitude = firstResult.geometry.location.lat();
                const target_longitude = firstResult.geometry.location.lng();
                console.log("Latitude:", target_latitude);
                console.log("Longitude:", target_longitude);
    
                const local_target_coords = `${target_latitude},${target_longitude}`;

                // Add the new marker to the copy
                markers.splice(1, 0, { position: { lat: target_latitude, lng: target_longitude }, color: '#E60000', label: firstResult.name });
                // Update the state with the new array
                setMarkers(markers);
                console.log("user marker is ",markers)
                setTargetCoords(local_target_coords);
                const local_relevant = {
                    name: firstResult.name,
                    location: firstResult.formatted_address,
                    image_src: firstResult.photos && firstResult.photos.length > 0 ? firstResult.photos[0].getUrl(): null
                };
    
                setTargetRelevantDetails(local_relevant);
                // Append map distance
                get_map_distance(carparkData,local_target_coords)
                carparkData.sort((a, b) => a.distance_from_target - b.distance_from_target);
                console.log("Calcuated distance and sorted df" , carparkData)

                // shortlist top 10
                const shortlist = carparkData.slice(0,10)
                carpark_info_search(shortlist)
                
                
            } else {
                // Handle the error or empty results
                console.log('No results found or an error occurred.');
                setTargetCoords(null);
                setTargetRelevantDetails(null);
            }
        });
    };

    function get_map_distance(carpark_list,target_location){
      // target_location format as float,float
      // compares all carpark using the distance function and appends it as a new key to each list
      for (let i =0 ; i<carpark_list.length; i++){
        const ref_carpark = carpark_list[i]
        //ref_carpark coordinate is [lat,lng]
        const dist = get_dist_from_coords(ref_carpark.coordinates , target_location)
        ref_carpark["distance_from_target"] = dist
      }
    }

    //helper to get map dist
    function get_dist_from_coords(ref_carpark_coords , target_location_coords){
      const target_lat = parseFloat(target_location_coords.split(",")[0]);
      const target_lng = parseFloat(target_location_coords.split(",")[1]);
      const ref_carpark_lat = parseFloat(ref_carpark_coords[0]);
      const ref_carpark_lng = parseFloat(ref_carpark_coords[1]);
      // This map dist represents the approximate distance for each deviation in coordinates in km
      const reference_map_dist = 111.32
      // Calculate L2 distance
      const distance = Math.sqrt(
        Math.pow(target_lat - ref_carpark_lat, 2) +
        Math.pow(target_lng - ref_carpark_lng, 2)
      ) * reference_map_dist ;
      return distance;
    }
  
    function carpark_info_search(carpark_list) {
      return new Promise((resolve, reject) => {
        const return_list = [];
        console.log("Searching for carpark details");
    
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
            console.log("Data for carparks is ", return_list);
            setIndexCarparkList(return_list);
            setCarparksFound(true); // trigger carparksfound to populate the fields
            carpark_dict = return_list; // trigger parent prop change
            console.log("shortlisted carparks indexed using google maps api");
            // update parent
            const newmarkers = [...markers]
            return_list.forEach((carpark) => {
              newmarkers.push(carpark);})

            setMarkers(newmarkers)
            carpark_list_change(return_list);
            resolve(return_list); // Resolve the Promise with the return_list
          })
          .catch((error) => {
            console.error("Error occurred during carpark_info_search:", error);
            reject(error); // Reject the Promise if an error occurs
          });
      });
      
    }

    function searchCarparkInfo(this_carpark) {
      return new Promise((resolve, reject) => {
        const request = {
          query: `${this_carpark.coordinates[0]},${this_carpark.coordinates[1]}`,
          fields: ['name', 'geometry', 'photos'],
          language: 'en-US',
          maxResults: 1,
          region: 'sg',
          strictBounds: true,
        };
    
        const service = new window.google.maps.places.PlacesService(map);
        service.textSearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            const firstResult = results[0];
            const target_latitude = firstResult.geometry.location.lat();
            const target_longitude = firstResult.geometry.location.lng();
            // const local_target_coords = `${target_latitude}, ${target_longitude}`;
            const local_relevant = {
              label: this_carpark.carparkName,
              location: firstResult.formatted_address,
              image_src: firstResult.photos && firstResult.photos.length > 0 ? firstResult.photos[0].getUrl() : null,
              position: { lat: target_latitude, lng: target_longitude },
              color: '#0050E6', // not selected colour
              crowd: this_carpark.crowd,
              distance: this_carpark.distance_from_target,
              price: this_carpark.dayRate,
              coordinates: this_carpark.coordinates,
            };
            console.log("Searched", this_carpark.carparkName);
            resolve(local_relevant);
          } else {
            console.log("Failed to search", this_carpark.carparkName);
            resolve(null); // No results found or an error occurred.
          }
        });
      });
    }
    
    
    async function plotNavigationPath() {
        console.log("navigating to " , chosen_carpark);
        const userLatLng = new window.google.maps.LatLng(user_latitude, user_longitude);
        const [targetLat, targetLng] = [chosen_carpark.coordinates[0],chosen_carpark.coordinates[1]]
        const targetLatLng = new window.google.maps.LatLng(targetLat, targetLng);
      
        // Create a DirectionsService object
        const directionsService = new window.google.maps.DirectionsService();
      
        // Create a DirectionsRenderer object to display the route on the map
        if (directionsRenderer == null){
            directionsRenderer = new window.google.maps.DirectionsRenderer();
            setDirectionsRenderer(directionsRenderer)
            directionsRenderer.setMap(map); // Make sure 'map' is the map instance you have in your component
        }
        else{
          directionsRenderer.setMap(map); // Make sure 'map' is the map instance you have in your component
        }
              
      
        // Create a request object for the DirectionsService
        const request = {
          origin: userLatLng,
          destination: targetLatLng,
          travelMode: window.google.maps.TravelMode.DRIVING, // Specify the travel mode (DRIVING, WALKING, BICYCLING, TRANSIT)
        };
      
        // Call the DirectionsService to calculate the route
        directionsService.route(request, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            // Display the route on the map using DirectionsRenderer
            directionsRenderer.setDirections(result);
          } else {
            console.error('Error fetching directions:', status);
          }
        });
      }

      function clearNavigationPath() {
        // Set the map property of the DirectionsRenderer to null
        directionsRenderer.setMap(null);
        console.log("Resetting markers")
        // Update the state with the modified array
        setMarkers([markers[0]]);
        console.log(markers)
      }




    // Google Maps styling
    const containerStyle = {
        width: '100vw',
        height: '85vh'
    };
    
    const mapOptions = {
        zoom: 18,
        center: { lat: user_latitude, lng: user_longitude }, // Kelvin Change to initialise from user position
        mapTypeControl: false,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [
                    { visibility: 'off' }, // Hide points of interest labels
                ],
            },
            {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [
                    { visibility: 'off' }, // Hide points of interest markers
                ],
            },
            {
                featureType: 'road',
                elementType: 'labels',
                stylers: [
                    { visibility: 'off' }, // Hide road labels
                ],
            },
        ],
    };

    // marker styling
    const [markers, setMarkers] = useState([{ position: { lat: user_latitude, lng: user_longitude }, color: '#FF9933', label: 'You are here' }]);

     
    const onLoad = useCallback(function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(mapOptions.center);
      map.fitBounds(bounds);
      console.log("map loaded by onLoad")
      setMap(map)
  }, [isLoaded])
 
    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    const [selectedMarker, setSelectedMarker] = useState(null);
    
    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
        chosen_carpark = marker
    };

    const renderMap = () => {
      return (
        <GoogleMap
          mapContainerStyle={containerStyle}
          options={mapOptions}
          center={mapOptions.center}
          onLoad={onLoad}
          onUnmount={onUnmount}
          key={markers}
          
        >
          {markers.map((marker, index) => {
            // Correct placement of console.log
            return (
              <MarkerF
                key = {index}
                position={marker.position }
                onClick={() => handleMarkerClick(marker)}
                icon={{
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                    renderToString(
                      <IconContext.Provider value={{ color: marker.color }}>
                        <FaMapMarkerAlt />
                      </IconContext.Provider>
                    )
                  )}`,
                  scaledSize: new window.google.maps.Size(35, 35),
                }}
              />
            );
          })}
    
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className='font-medium text-brand-dark-blue'>
                {selectedMarker.label}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      );
    };
    
    return isLoaded ? renderMap() : null;
},);
export default Map;