import { React, useState, useCallback, useEffect , useRef, useImperativeHandle, forwardRef} from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow} from '@react-google-maps/api';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { renderToString } from 'react-dom/server';
import { useGoogleMapsLoader } from './googleMapsConfig';

const Map = forwardRef(({user_latitude,user_longitude,search_text ,carpark_dict,chosen_carpark} ,ref) => {
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
    // API keys
    // const { isLoaded,loadError } = useJsApiLoader({
    //     id: 'google-map-script',
    //     googleMapsApiKey: "AIzaSyAhY1RECYWhzJtChjr0iNIAV5NUFlljv9g",// Kelvin's api for places
    //     libraries :libraries
    
    // })
    // googleMapsApiKey: "AIzaSyBWvcQDLx5sbyKHzJCx6J3LEmAKVuhUHPI" faith api key

    useEffect(() => { 
        if (isLoaded && !loadError && !googleScriptLoaded) {
            setAutocompleteService(new window.google.maps.places.AutocompleteService());
            setGoogleScriptLoaded(true);
            console.log('Scripts for places api loaded');
          }
        console.log("Updated target_coords:", target_coords);
        console.log("Updated details" ,  target_relevant_details)

        if (navigation_in_progress && target_coords != null) {
            console.log("Clearing preexisting path")
            clearNavigationPath()
            plotNavigationPath()
        } 
        if (!navigation_in_progress && target_coords!= null){
            plotNavigationPath()
            setNavigationInProgress(true)
        }

    }, [isLoaded,loadError,target_coords,target_relevant_details]); 

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
    
                const local_target_coords = `${target_latitude}, ${target_longitude}`;
                setTargetCoords(local_target_coords);
                
    
                const local_relevant = {
                    name: firstResult.name,
                    location: firstResult.formatted_address,
                    image_src: firstResult.photos[0].getUrl()
                };
    
                setTargetRelevantDetails(local_relevant);
            } else {
                // Handle the error or empty results
                console.log('No results found or an error occurred.');
                setTargetCoords(null);
                setTargetRelevantDetails(null);
            }
        });
    };
    
    
    async function plotNavigationPath() {
        const userLatLng = new window.google.maps.LatLng(user_latitude, user_longitude);
        const [targetLat, targetLng] = target_coords.split(',').map(coord => parseFloat(coord.trim()));
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
      
        // Set the map for the DirectionsRenderer
        
      
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
            // Add more customizations as needed
        ],
    };

    // marker styling
    let user_marker = [

        // User Starting Position
        { position: { lat: user_latitude, lng: user_longitude }, color: '#FF9933', label: 'You are here' },// you are here


        // Carpark Positions
        { position: { lat: 1.3433019907805732, lng: 103.96416792617076 }, color: '#0050E6', label: 'SUTD Hostel' }, //sutd hostel
        { position: { lat: 1.341707516705738, lng: 103.96514557439521 }, color: '#0050E6', label: 'SUTD Sports and Recreation Centre' }, //sutd recreation
        { position: { lat: 1.341435444980101, lng: 103.9650531473447 }, color: '#0050E6', label: 'SUTD Running Track' } ,//sutd running


        // Target Position
        { position: { lat: 1.3413, lng: 103.9638 }, color: '#E60000', label: 'SUTD' }, // sutd

    ];

    

    

    const onLoad = useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(mapOptions.center);
        map.fitBounds(bounds);
        console.log("map loaded")
        setMap(map)
    }, [isLoaded,map,user_marker])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    const [selectedMarker, setSelectedMarker] = useState(null);
    
    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };

    return isLoaded && user_marker ?(
        <GoogleMap
            mapContainerStyle={containerStyle}
            options={mapOptions}
            center = {mapOptions.center}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
           {user_marker.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
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
      ))}
      
      {selectedMarker && (
        <InfoWindow
          position={selectedMarker.position}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div className='font-medium text-brand-dark-blue'>{selectedMarker.label}</div>
        </InfoWindow>
      )}
        </GoogleMap>
    ) : <></>;

});

export default Map;