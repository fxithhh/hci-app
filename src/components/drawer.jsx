import { React, useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

// images
import Carpark1 from '../assets/carpark1.jpeg'
import Carpark2 from '../assets/carpark2.jpeg'
import Carpark3 from '../assets/carpark3.jpeg'
import Carpark4 from '../assets/carpark4.jpeg'
import Carpark5 from '../assets/carpark5.jpeg'
import Carpark6 from '../assets/carpark6.jpeg'

// react icons
import { LiaMapMarkerSolid } from "react-icons/lia"
import { MdAttachMoney } from "react-icons/md"
import { BsPeople } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { FaSearch } from 'react-icons/fa';

const Drawer = () => {
    // toggle state
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
    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setToggle({ ...toggle, [anchor]: open });
    };

    const anchor = 'bottom';

    // drawer style
    const drawerBleeding = 100;
    const drawerStyles = {
        '& .MuiDrawer-paper': {
            borderRadius: '25px 25px 0 0',
            boxShadow: 'none',

        },
    };

    // data about different carparks
    // crowd: 0-3 empty, 4-6 moderate, 7-9 busy, 9-12 very busy
    const [carparkInfo, setCarparkInfo] = useState([
        { img: Carpark1, name: 'SUTD Hostel', distance: 1.2, price: 3, crowd: 10 },
        { img: Carpark2, name: 'SUTD Sports and Recreation Centre Carpark', distance: 1, price: 2, crowd: 1 },
        { img: Carpark3, name: 'SUTD Running Track', distance: 2.1, price: 1.5, crowd: 5 },
        { img: Carpark4, name: 'Changi Court', distance: 3.27, price: 4, crowd: 2 },
        { img: Carpark5, name: 'Changi City Point', distance: 2, price: 4, crowd: 12 },
        { img: Carpark6, name: 'Singapore University of Technology & Design', distance: 0, price: 3, crowd: 8 },
    ]);

    // default state
    const originalCarparkInfo = [
        { img: Carpark1, name: 'SUTD Hostel', distance: 1.2, price: 3, crowd: 10 },
        { img: Carpark2, name: 'SUTD Sports and Recreation Centre Carpark', distance: 1, price: 2, crowd: 1 },
        { img: Carpark3, name: 'SUTD Running Track', distance: 2.1, price: 1.5, crowd: 5 },
        { img: Carpark4, name: 'Changi Court', distance: 1.2, price: 3, crowd: 10 },
        { img: Carpark5, name: 'Changi City Point', distance: 2, price: 4, crowd: 12 },
        { img: Carpark6, name: 'Singapore University of Technology & Design', distance: 0, price: 3, crowd: 8 },
    ];

    // sorting
    const handleSort = (property) => {
        if (property === 'default') {
            setCarparkInfo(originalCarparkInfo);
        } else {
            const sortedCarparkInfo = [...carparkInfo];
            sortedCarparkInfo.sort((a, b) => a[property] - b[property]);
            setCarparkInfo(sortedCarparkInfo);
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
            const selectedCarpark = carparkInfo.find((carpark) => carpark.name === carparkName);

            // Set the selected carpark as the active carpark for Page 2
            setSelectedCarpark(selectedCarpark);
            setActivePage('page2');
        }
    };


    return (
        <div>
            <div
                style={{
                    paddingTop: '1rem',
                    width: '100%',
                    height: '6%',
                    position: 'fixed',
                    bottom: 0,
                    [anchor]: 0,
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    zIndex: 999,
                    border: '1px solid white',
                    borderRadius: '25px 25px 0 0',
                }}
                onClick={toggleDrawer(anchor, true)}

            >
                <div className='mb-8 flex justify-center align-center'>
                    <div className='align-center w-12 bg-gray-400 h-1.5 rounded-xl'>       </div></div>

            </div>
            <SwipeableDrawer
                anchor={anchor}
                open={toggle[anchor]}
                onClose={toggleDrawer(anchor, false)}
                onOpen={toggleDrawer(anchor, true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                ModalProps={{
                    keepMounted: true, // Ensure the drawer is rendered even when closed
                }}
                sx={drawerStyles}
            >
                {activePage === 'page1' && (
                    <div className="my-4">

                        {/* Slider Indicator */}
                        <div className='mx-8 mb-2 flex justify-center align-center'>
                            <div className='align-center w-12 bg-gray-400 h-1.5 rounded-xl'></div>
                        </div>
                        {/* search */}
                        <div className="flex items-center justify-center">
                            <div className="relative w-full mx-8 mt-4">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full py-2 px-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-brand-blue" />
                            </div>
                        </div>
                        {/* chosen destination */}
                        <div className='py-4 border-b-2 border-brand-gray-blue'>
                            <h5 className='mx-8 text-brand-gray my-2 font-medium text-lg'>Your chosen destination is</h5>
                            <h2 className="mx-8 font-bold text-3xl my-2 leading-tight">Singapore University of Technology & Design</h2>
                        </div>
                        <div className=' my-4'>
                            <h4 className='mx-8 text-lg font-semibold text-brand-green'>Recommendations</h4>
                            <select className='mt-2 mb-4 mx-8 bg-white border border border-brand-blue rounded-sm px-3 py-2 text-md  text-brand-dark-blue focus:outline-none focus:border-brand-blue' onChange={(e) => handleSort(e.target.value)}>
                                <option value="default">
                                    Default
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
                            {carparkInfo.slice(0, toggle.loadedRows).map((row, index) => {
                                return (
                                    <div key={index} className="flex py-4 px-8 hover:bg-gray-100 focus:bg-gray-200" onClick={() => handlePageChange(row.name)} >
                                        <div className="w-2/5 h-28 pr-4">
                                            <img className='w-full h-full object-cover rounded-lg' src={row.img} alt={row.name} />
                                        </div>
                                        <div className="w-3/5">
                                            <h3 className='mb-1 font-bold truncate text-xl'>{row.name}</h3>
                                            {/* distance */}
                                            <div className='flex mb-1'>
                                                <div className="w-1/2 flex items-center mr-4 text-brand-gray">
                                                    <LiaMapMarkerSolid className="text-lg mr-1" />
                                                    <p className="text-sm font-medium">Distance</p>
                                                </div>
                                                <p className='font-semibold text-brand-dark-blue text-sm'>{row.distance} km</p>
                                            </div>
                                            {/* price */}
                                            <div className='flex mb-1'>
                                                <div className="w-1/2 flex items-center mr-4 text-brand-gray">
                                                    <MdAttachMoney className="text-lg mr-1" />
                                                    <p className="text-sm font-medium">Price</p>
                                                </div>
                                                <p className='font-semibold text-brand-dark-blue text-sm'>S${row.price}/entry</p>
                                            </div>
                                            {/* crowd */}
                                            <div className='flex mb-1'>
                                                <div className="w-1/2 flex items-center mr-4 text-brand-gray">
                                                    <BsPeople className="text-lg mr-1" />
                                                    <p className="text-sm font-medium">Crowd</p>
                                                </div>
                                                <p className={
                                                    row.crowd <= 3 ? 'font-semibold text-brand-green text-sm ' :
                                                        row.crowd > 3 && row.crowd <= 6 ? 'font-semibold text-yellow-500 text-sm' :
                                                            row.crowd > 6 && row.crowd <= 9 ? 'font-semibold text-brand-orange text-sm' :
                                                                'font-semibold text-brand-red text-sm'
                                                }>{row.crowd <= 3 && "Empty"}
                                                    {row.crowd > 3 && row.crowd <= 6 && "Moderate"}
                                                    {row.crowd > 6 && row.crowd <= 9 && "Busy"}
                                                    {row.crowd > 9 && row.crowd <= 12 && "Very Busy"}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className='border-t-2 border-brand-gray-blue mt-4 pt-8 w-full text-center'>
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
                            <img className='rounded-lg h-40 w-full' src={selectedCarpark.img}></img>
                            <div>
                                <h2 className='font-bold text-3xl mt-4 leading-tight'>{selectedCarpark.name}</h2>
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
                                        <p className="text-md font-medium">Distance</p>
                                    </div>
                                    <p className='font-semibold text-brand-dark-blue text-md'>{selectedCarpark.distance}km</p>
                                </div>
                                {/* price */}
                                <div className='flex mb-2'>
                                    <div className="w-1/2 flex items-center mr-4 text-brand-gray">
                                        <MdAttachMoney className="text-xl mr-1" />
                                        <p className="text-md font-medium">Price</p>
                                    </div>
                                    <p className='font-semibold text-brand-dark-bluetext-md'>
                                        {timeBasedPrice === 1 && "S$" + selectedCarpark.price + "/entry"}
                                        {timeBasedPrice === 2 && "S$6/hour"}
                                    </p>
                                </div>
                                {/* crowd */}
                                <div className='flex mb-2'>
                                    <div className="w-1/2 flex items-center mr-4 text-brand-gray">
                                        <BsPeople className="text-xl mr-1" />
                                        <p className="text-md font-medium">Crowd</p>
                                    </div>
                                    <p className={
                                        selectedCarpark.crowd <= 3 ? 'font-semibold text-brand-green text-md ' :
                                            selectedCarpark.crowd > 3 && selectedCarpark.crowd <= 6 ? 'font-semibold text-yellow-500 text-md' :
                                                selectedCarpark.crowd > 6 && selectedCarpark.crowd <= 9 ? 'font-semibold text-brand-orange text-md' :
                                                    'font-semibold text-brand-red text-md'
                                    }>{selectedCarpark.crowd <= 3 && "Empty"}
                                        {selectedCarpark.crowd > 3 && selectedCarpark.crowd <= 6 && "Moderate"}
                                        {selectedCarpark.crowd > 6 && selectedCarpark.crowd <= 9 && "Busy"}
                                        {selectedCarpark.crowd > 9 && selectedCarpark.crowd <= 12 && "Very Busy"}</p>
                                </div>
                            </div>

                            <div className='mt-6 w-full text-center'>
                                <button className='bg-brand-green text-white w-full py-2 rounded-lg font-semibold text-lg'>
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
