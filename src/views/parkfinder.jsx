import { React, useEffect,useState, useRef } from 'react';
import Map from '../components/map'
import Drawer from '../components/drawer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch } from 'react-icons/fa';




const ParkFinder = () => {
  // warning state
  const warnState = false;
  const [user_latitude, setUserLatitude] = useState(null)
  const [user_longitude, setUserLongitude] = useState(null)
  const isLocationAvailable = user_latitude !== null && user_longitude !== null
  const [searchText, setSearchText] = useState('')
  const [carpark_dict,setCarparkDict] = useState(null) //carpark details of all carparks
  const [chosen_carpark,setChosenCarpark] = useState(null)  //chosen carpark
  const trigger_search = useRef() //trigger navigation
  const [upbar , setUpBar] = useState(false)

  useEffect(() => {
    if (warnState) {
      // Display a toast notification when myState changes to true
      toast.error('Your chose carpark is getting crowded!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // Kelvin_change Get user's location on start-up of the page
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLatitude(latitude);
          setUserLongitude(longitude);
          console.log(`latitude is ${user_latitude}, longitude is ${user_longitude}`);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
    
    
  }, [warnState, user_latitude, user_longitude,chosen_carpark]); // these will load first 

  // Get user target location

  
  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      get_search(event)
    }
  };

  const handleButtonClick = (event) => {
    event.preventDefault();
    get_search(event)
    
  };
  const get_search = (event) => {
    const enteredSearchText = searchText;
    console.log(`Search Text: ${enteredSearchText}`);

    if (enteredSearchText === '') {
      // Handle the case when the search text is empty
      console.log('Error: Search text cannot be empty.');
      toast.error('Empty Search Box', {
        position: toast.POSITION.BOTTOM_CENTER, // You can choose the position of the toast notification
        autoClose: 1000, // The notification will automatically close after 3 seconds
      })    } else {
      setSearchText(enteredSearchText);
      const searchBox = document.getElementById('search_box');
      // Kelvin trigger places search
      if (trigger_search.current) {
        trigger_search.current.findPlaces();
        console.log('Children component called');
        setUpBar(true)
      }
    }
  };
  

  function handlecarparklistChange(newValue)  {
    setCarparkDict(newValue);
  };
  function handlesetcarpark(value){
    setChosenCarpark(value)
    console.log("Targetted carparked found" , chosen_carpark)
  }

  function handleupbar(value){
    setUpBar(value)
  }
  return (
    <div>
      {/* Drawer & Bottom Bar */}
      <div className="fixed bottom-0 w-full z-20">
        <Drawer user_destination={searchText} setchosenCarpark={handlesetcarpark} carpark_list = {carpark_dict} upbar = {upbar} resetbar={handleupbar}/>
      </div>


      <div className="z-10 absolute top-10 left-0 right-0 flex items-center justify-center shadow-2xl">
        <div className="fixed w-5/6 mx-8 mt-12 flex items-center"> {/* flex container */}
          {/* Search Input */}
          {/* Kelvin Problem with text upon clicking the button */}
          <input
            type="text"
            placeholder= "Search Parkfinder "
            className="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            id = "search_box"
            value={searchText}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
          {/* Search Button */}
          <button
            className="ml-4 bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none"
            onClick={handleButtonClick}
          >
            Search
          </button>
        </div>
      </div>
      <ToastContainer />
      {/* This ensures the user coords are available before loading */}
      {isLocationAvailable && (
        <Map user_latitude={user_latitude} user_longitude={user_longitude} search_text={searchText} carpark_dict = {carpark_dict} chosen_carpark={chosen_carpark} 
        ref = {trigger_search}  carpark_list_change= {handlecarparklistChange}/>

      )}
    </div>
  );
};

export default ParkFinder;