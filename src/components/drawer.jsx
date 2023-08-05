import { React, useState, useEffect } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useNavigate } from 'react-router-dom';
// images
import CarparkDefault from '../assets/carparkdefault.jpg'
// react icons
import { LiaMapMarkerSolid, LiaWalkingSolid } from "react-icons/lia"
import { MdAttachMoney } from "react-icons/md"
import { BsPeople, BsFillPinMapFill, BsPersonCircle } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { AiOutlineCar } from "react-icons/ai"

const Drawer = ({user_destination , setchosenCarpark , carpark_list ,upbar,resetbar}) => {

    const [selectedsort, setSelectedSort] = useState("Recommended");
    const [carparkInfo, setCarparkInfo] = useState([
        // { img: Carpark1, name: 'SUTD Hostel', distance: 1.2, price: 3, crowd: "Empty" , image_url: "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAaw_FcKCRl0R1YDPszjG3FTuc8BoV0JWHwBi19Df6Vo23gh1GWlJ4-uqTOgMxS5NfOZFKQyXsg7l26t1uKaZgPxqG7bhf2iNycekxhngCwyXsSwYoPObmKh6srlTB2AikSMr96OHt8scLotEU30Vj2O_GJnvxzP_S4vLrKlojDAj5ylXghgE&3u4032&5m1&2e1&callback=none&key=AIzaSyAhY1RECYWhzJtChjr0iNIAV5NUFlljv9g&token=127467"    },
        // { img: Carpark2, name: 'SUTD Sports and Recreation Centre Carpark', distance: 1, price: 2, crowd: 1 },
        // { img: Carpark3, name: 'SUTD Running Track', distance: 2.1, price: 1.5, crowd: 5 },
        // { img: Carpark4, name: 'Changi Court', distance: 3.27, price: 4, crowd: 2 },
        // { img: Carpark5, name: 'Changi City Point', distance: 2, price: 4, crowd: 12 },
        // { img: Carpark6, name: 'Singapore University of Technology & Design', distance: 0, price: 3, crowd: 8 },
    ]);

    // default state input from jia sheng
    // [{name: "" , distance: int , price: int, crowd: str}]
    const [checkifnewlist, setCheckIfNewList] = useState(false);
    let originalCarparkInfo = [
        // { img: Carpark1, name: 'SUTD Hostel', distance: 1.2, price: 3, crowd: 10 },
        // { img: Carpark2, name: 'SUTD Sports and Recreation Centre Carpark', distance: 1, price: 2, crowd: 1 },
        // { img: Carpark3, name: 'SUTD Running Track', distance: 2.1, price: 1.5, crowd: 5 },
        // { img: Carpark4, name: 'Changi Court', distance: 1.2, price: 3, crowd: 10 },
        // { img: Carpark5, name: 'Changi City Point', distance: 2, price: 4, crowd: 12 },
        // { img: Carpark6, name: 'Singapore University of Technology & Design', distance: 0, price: 3, crowd: 8 },
    ];
    const [reloadDrawer, setReloadDrawer] = useState(false)
    // toggle state
    useEffect(() => {
        if (upbar == true) {
            setCheckIfNewList(false) // this only triggers if a new search
            toggleDrawer('bottom', true, false)();
            resetbar(false)
            console.log("setting new carparks due to new search")
        }
        // Code to run when the component mounts (equivalent to componentDidMount)
        if (carpark_list != null && checkifnewlist === false ){
            // if i update the carpark then i dont touch the list anymore 
            setCheckIfNewList(true)
            
            changecarparkinfo(carpark_list)
            originalCarparkInfo  = carpark_list
            setReloadDrawer((prev) => !prev);
            console.log("setting new carparks")
        }
       
      }, [carpark_list,carparkInfo,upbar]); //if carpark_list changes, parse it

    const [toggle, setToggle] = useState({
        bottom: false,
        loadedRows: 3
    });

    // load more results
    const handleLoadMore = () => {
        setToggle((prevState) => {
            const { loadedRows } = prevState;
            const newLoadedRows = loadedRows + 3;

            // Check if there are more rows to load
            if (newLoadedRows <= carparkInfo.length) {
                return {
                    ...prevState,
                    loadedRows: newLoadedRows,
                };
            } else {
                // If all rows are already loaded, reset to initial state
                return {
                    ...prevState,
                    loadedRows: 3, // Set the initial number of loaded rows
                };
            }
        });
    };


    // toggle open close drawer
    const toggleDrawer = (anchor, open, navigate) => (event) => {
        console.log("anchor and open", anchor, open)
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        if (navigate===true){
            console.log("carpark selected")
            setchosenCarpark(selectedCarpark)
        }

        setToggle({ ...toggle, [anchor]: open });
    };

    const anchor = 'bottom';

    // drawer style
    const drawerStyles = {
        '& .MuiDrawer-paper': {
            borderRadius: '25px 25px 0 0',
            boxShadow: 'none',
        },
    };
    function changecarparkinfo(carpark_list){
        originalCarparkInfo=carpark_list
        setCarparkInfo(carpark_list)
    }

    

    // sorting
    const handleSort = (property) => {
        if (property === 'Recommended') {
            setCarparkInfo(originalCarparkInfo);
            console.log(carparkInfo)
            setReloadDrawer((prev) => !prev);
        } else {
            if (property === "crowd") {
                console.log("Sorting based on crowd");
    
                // Define a custom sorting order based on crowd levels
                const crowdOrder = {
                    "Empty": 1,
                    "Moderate": 2,
                    "Very Busy": 3,
                };
    
                const sortedCarparkInfo = [...carparkInfo];
                sortedCarparkInfo.sort((a, b) => {
                    const crowdLevelA = crowdOrder[a[property]];
                    const crowdLevelB = crowdOrder[b[property]];
    
                    return crowdLevelA - crowdLevelB;
                });
    
                setCarparkInfo(sortedCarparkInfo);
                setReloadDrawer((prev) => !prev);
            }
            else{
            console.log("Sorting based on, " , property)
            const sortedCarparkInfo = [...carparkInfo];
            sortedCarparkInfo.sort((a, b) => a[property] - b[property]);
            setCarparkInfo(sortedCarparkInfo);
            console.log(carparkInfo)
            setReloadDrawer((prev) => !prev);
            }
        }
    };

    // time based price
    const [timeBasedPrice, settimeBasedPrice] = useState(1)

    const handlePriceSort = (property) => {
        if (property === 'late') {
            settimeBasedPrice(2)
        } else {
            settimeBasedPrice(1)
        }

    };

    // different pages
    const [activePage, setActivePage] = useState('page1');

    const [selectedCarpark, setSelectedCarpark] = useState("");

    const handlePageChange = (carparkName) => {
        if (carparkName === 'page1') {
            setActivePage(carparkName);
            setSelectedCarpark(null);
        } else {
            // Find the selected carpark in the carparkInfo array
            const selectedCarpark = carparkInfo.find((carpark) => carpark.label === carparkName);

            // Set the selected carpark as the active carpark for Page 2
            setSelectedCarpark(selectedCarpark);
            setchosenCarpark(selectedCarpark)
            console.log("selected carpark from user preference is " ,selectedCarpark)
            setActivePage('page2');
        }
    };

    // navigate
    const navigate = useNavigate() 

    const toProfile = () => {
        navigate('/profile');  
      };
    

    return (
        <div>
            {/* Bottom Bar */}
            <div className="bg-brand-dark-blue flex h-full shadow-2xl">
                <button onClick={toggleDrawer(anchor, true)} className="py-2 w-1/2 flex flex-col items-center justify-center text-gray-300 active:text-white active:bg-brand-blue">
                    <AiOutlineCar className="text-xl" />
                    Parking Options
                </button>
                <button onClick={toProfile} className="py-2 w-1/2 flex flex-col items-center justify-center text-gray-300 active:text-white active:bg-brand-blue">
                    <BsPersonCircle className="text-xl" />
                    Profile
                </button>
            </div>

            <SwipeableDrawer
                key={carparkInfo}
                anchor="bottom"
                open={toggle.bottom}
                onClose={toggleDrawer('bottom', false)}
                onOpen={toggleDrawer('bottom', true)}
                sx={{
                    '& .MuiDrawer-paper': {
                        borderRadius: '25px 25px 0 0',
                        boxShadow: 'none'
                    }
                }}
            >
                {activePage === 'page1' && (
                    <div className="my-4">

                        {/* Slider Indicator */}
                        <div className='mx-8 mb-2 flex justify-center align-center'>
                            <div className='align-center w-12 bg-gray-400 h-1.5 rounded-xl'></div>
                        </div>
                        {/* chosen destination */}
                        <div className='py-4 border-b-2 border-brand-gray-blue'>
                            <h5 className='mx-8 text-brand-gray my-2 font-medium text-lg'>Your chosen destination is</h5>
                            <h2 className="mx-8 font-bold text-3xl my-2 leading-tight">
                                {user_destination}
                            </h2>
                        </div>
                        {/* Drop down filter list */}
                        <div className=' my-4'>
                            <h4 className='mx-8 text-lg font-semibold text-brand-green'>Your Parking Options</h4>
                            <label className='ml-8 font-semibold text-brand-dark-blue'>Filter By:</label>
                            <select className='mt-2 mb-4 ml-2  bg-white border border border-brand-blue rounded-sm px-3 py-2 text-md  text-brand-dark-blue focus:outline-none focus:border-brand-blue' 
                                value = {selectedsort}
                                onChange={(e) => {
                                    setSelectedSort(e.target.value);
                                    handleSort(e.target.value); // Call your sorting function here
                                  }}>
                                <option value="default">
                                    Recommended
                                </option>
                                <option value="distance">
                                    Distance
                                </option>
                                <option value="price">
                                    Price
                                </option>
                                <option value="crowd">
                                    Crowd
                                </option>
                            </select>
                            {/* Parking Options */}
                            {carparkInfo.slice(0, toggle.loadedRows).map((row, index) => {
                                return (
                                    <div key={index} className="flex py-4 px-8 hover:bg-gray-100 focus:bg-gray-200 border-b-2 border-gray-300" onClick={() => handlePageChange(row.label)} >
                                        <div className="w-2/5 h-28 pr-4">
                                            <img className='w-full h-full object-cover rounded-lg' 
                                                src={row.image_src!== null ? row.image_src : CarparkDefault}
                                                alt={row.label}
                                                onError={(e) => console.log('Error loading image:', e)} />
                                        </div>
                                        <div className="w-3/5">
                                            <h3 className='mb-1 font-bold truncate text-xl'>{row.name}</h3>
                                            {/* Walking time from distance */}
                                            <div className='flex mb-1'>
                                                <div className="w-1/2 flex items-center mr-4 text-brand-gray">
                                                    <LiaWalkingSolid className="text-lg mr-1" />
                                                    <p className="text-sm font-semibold">Walking Time</p>
                                                </div>
                                                <p className='font-semibold text-brand-dark-blue text-sm'>{(row.distance * 10).toFixed(0) } mins</p>
                                            </div>
                                            {/* price */}
                                            <div className='flex mb-1'>
                                                <div className="w-1/2 flex items-center mr-4 text-brand-gray">
                                                    <MdAttachMoney className="text-lg mr-1" />
                                                    <p className="text-sm font-semibold">Price</p>
                                                </div>
                                                <p className='font-semibold text-brand-dark-blue text-sm'>S${row.price}/entry</p>
                                            </div>
                                            {/* crowd */}
                                            <div className='flex mb-1'>
                                                <div className="w-1/2 flex items-center mr-4 text-brand-gray">
                                                    <BsPeople className="text-lg mr-1" />
                                                    <p className="text-sm font-semibold">Crowd</p>
                                                </div>
                                                <div>
                                                <p className={
                                                    row.crowd === "Empty" ? 'font-semibold text-brand-green text-sm' :
                                                    row.crowd === "Moderate" ? 'font-semibold text-yellow-500 text-sm' :
                                                    row.crowd === "Busy" ? 'font-semibold text-brand-orange text-sm' :
                                                    row.crowd === "Very Busy" ? 'font-semibold text-brand-red text-sm' :
                                                    'font-semibold text-brand-black text-sm'
                                                }>
                                                    {row.crowd}
                                                </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className=' mt-4 pt-8 w-full text-center'>
                                {toggle.loadedRows < carparkInfo.length ? (
                                    <button className='bg-brand-dark-blue text-white w-5/6 py-2 rounded-lg font-semibold text-lg' onClick={handleLoadMore}>
                                        Load More
                                    </button>
                                ) : (
                                    <button className='bg-brand-dark-blue text-white w-5/6 py-2 rounded-lg font-semibold text-lg' onClick={handleLoadMore}>
                                        Load Less
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                )}

                {/* page 2 */}
                {activePage === 'page2' && (
                    <div className="mx-10 my-4">
                        <div className='flex justify-center align-center'>
                            <div className='align-center w-12 bg-gray-400 h-1.5 rounded-xl'>  </div>
                        </div>
                        <div onClick={() => handlePageChange('page1')}><IoIosArrowBack className='text-2xl -mt-2 -ml-2 text-brand-dark-blue' /></div>

                        {/* detailed carpark info */}
                        <div className='my-4'>
                            <img className='rounded-lg h-40 w-full' src={selectedCarpark.image_src !== null ? selectedCarpark.image_src : CarparkDefault} alt="Carpark"></img>
                            <div>
                                <h2 className='font-bold text-3xl mt-4 leading-tight'>{selectedCarpark.location}</h2>
                                <div className='flex items-center mb-2'>
                                    <h5 className='font-semibold text-brand-blue my-4 text-lg mr-2'>I want to reach:</h5>
                                    <select className='bg-white border-b-2 border-brand-blue rounded-sm text-md text-brand-blue focus:outline-none font-semibold' onChange={(e) => handlePriceSort(e.target.value)}>
                                        <option value="early">7am-4.59pm</option>
                                        <option value="late">After 5pm</option>
                                    </select>
                                </div>


                            </div>
                            <div className="flex flex-col">
                                {/* distance */}
                                <div className='flex mb-2'>
                                    <div className="w-1/2 flex items-center mr-4 text-brand-gray">
                                        <LiaMapMarkerSolid className="text-xl mr-1" />
                                        <p className="text-md font-semibold">Distance</p>
                                    </div>
                                    <p className='font-semibold text-brand-dark-blue text-md'>{selectedCarpark.distance.toFixed(2)}km</p>
                                </div>
                                {/* walking distance */}
                                
                                <div className='flex mb-2'>
                                    <div className="w-1/2 flex items-center mr-4 text-brand-gray">
                                        <LiaWalkingSolid className="text-xl mr-1" />
                                        <p className="text-md font-semibold">Walking Time</p>
                                    </div>
                                    <p className='font-semibold text-brand-dark-blue text-md'>{(selectedCarpark.distance * 10).toFixed(0) }mins</p>
                                </div>
                                {/* price */}
                                <div className='flex mb-2'>
                                    <div className="w-1/2 flex items-center mr-4 text-brand-gray">
                                        <MdAttachMoney className="text-xl mr-1" />
                                        <p className="text-md font-semibold">Price</p>
                                    </div>
                                    <p className='font-semibold text-brand-dark-bluetext-md'>
                                        {timeBasedPrice === 1 && "S$" + selectedCarpark.price + "/entry"}
                                        {timeBasedPrice === 2 && "S$6/hour"}
                                    </p>
                                </div>
                                {/* crowd level colouring*/}
                                <div className='flex mb-2'>
                                    <div className="w-1/2 flex items-center mr-4 text-brand-gray">
                                        <BsPeople className="text-xl mr-1" />
                                        <p className="text-md font-semibold">Crowd</p>
                                    </div>
                                    <p className={
                                                    selectedCarpark.crowd == "Empty" ? 'font-semibold text-brand-green text-sm' :
                                                    selectedCarpark.crowd == "Moderate" ? 'font-semibold text-yellow-500 text-sm' :
                                                    selectedCarpark.crowd == "Busy" ? 'font-semibold text-brand-orange text-sm' :
                                                    selectedCarpark.crowd == "Very Busy" ? 'font-semibold text-brand-red text-sm' :
                                                    'font-semibold text-brand-black text-sm'
                                                }>
                                                    {selectedCarpark.crowd}
                                                </p>
                                </div>
                            </div>

                            <div className='mt-6 w-full text-center'>
                                <button className='bg-brand-green text-white w-full py-2 rounded-lg font-semibold text-lg' 
                                id="navigate_btn" 
                                onClick={toggleDrawer(anchor, false, true)}>
                                    Navigate
                                </button>
                            </div>

                        </div>
                    </div>

                )}

            </SwipeableDrawer>
        </div>
    );
};

export default Drawer;