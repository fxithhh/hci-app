import React, { useState, useEffect } from 'react';
import { Button } from '@mantine/core';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {MdOutlineArrowBackIos} from 'react-icons/md'

const Question1 = ({ onNextClick, onBackClick }) => {

  const [formData, setFormData] = useState({
    price: null,
    crowd: null,
    distance: null,
  });

  const [formValid, setFormValid] = useState(false);

  const handleFormSubmit = () => {

    if (formData.price !== null && formData.crowd !== null && formData.distance !== null) {
      // Perform form submission here
      console.log(formData);
      setFormValid(true);
      onNextClick(); // Proceed to the next question
    } else {
      console.log(formData);
      // Set formValid to false to disable "Next" button
      setFormValid(false);
      // Optionally, display an error message to the user
      toast.error('Please select at least one parking facility', {
        position: toast.POSITION.BOTTOM_RIGHT, // You can choose the position of the toast notification
        autoClose: 3000, // The notification will automatically close after 3 seconds
      })
    }
  };


  const handlePriceClick = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      price: prevData.price === value ? null : value,
    }));
  };

  const handleCrowdClick = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      crowd: prevData.crowd === value ? null : value,
    }));
  };

  const handleDistanceClick = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      distance: prevData.distance === value ? null : value,
    }));

  };

  // Handle styling for Price buttons
  useEffect(() => {
    console.log("price", formData)
    const priceButtons = document.querySelectorAll('.price-button-style');
    priceButtons.forEach((button) => {
      const buttonNumber = button.getAttribute('data-button-number');
      if (formData.price == buttonNumber) {
        button.classList.add('active', 'border-brand-dark-blue', 'bg-brand-dark-blue', 'text-white');
        button.classList.remove('border-brand-blue', 'bg-white', 'text-brand-blue');
      } else {
        button.classList.remove('active', 'border-brand-dark-blue', 'bg-brand-dark-blue', 'text-white');
        button.classList.add('border-brand-blue', 'bg-white', 'text-brand-blue');
      }
    });
  }, [formData.price]);

  // Handle styling for Crowd buttons
  useEffect(() => {
    console.log("crowd", formData)
    const crowdButtons = document.querySelectorAll('.crowd-button-style');
    crowdButtons.forEach((button) => {
      const buttonNumber = button.getAttribute('data-button-number');
      if (formData.crowd == buttonNumber) {
        button.classList.add('active', 'border-brand-dark-blue', 'bg-brand-dark-blue', 'text-white');
        button.classList.remove('border-brand-blue', 'bg-white', 'text-brand-blue');
      } else {
        button.classList.remove('active', 'border-brand-dark-blue', 'bg-brand-dark-blue', 'text-white');
        button.classList.add('border-brand-blue', 'bg-white', 'text-brand-blue');
      }
    });
  }, [formData.crowd]);

  // Handle styling for Distance buttons
  useEffect(() => {
    const distanceButtons = document.querySelectorAll('.distance-button-style');
    distanceButtons.forEach((button) => {
      const buttonNumber = button.getAttribute('data-button-number');
      if (formData.distance == buttonNumber) {
        button.classList.add('active', 'border-brand-dark-blue', 'bg-brand-dark-blue', 'text-white');
        button.classList.remove('border-brand-blue', 'bg-white', 'text-brand-blue');
      } else {
        button.classList.remove('active', 'border-brand-dark-blue', 'bg-brand-dark-blue', 'text-white');
        button.classList.add('border-brand-blue', 'bg-white', 'text-brand-blue');
      }
    });
  }, [formData.distance]);

  return (
    <div className="w-full flex flex-col items-start my-8">
      {/* Content for Question 1 */}
      <div className="font-bold mx-10 mt-2 text-left flex flex-col">
        <div className="mb-2"> {/* Add this div container */}
          <MdOutlineArrowBackIos className='text-xl text-left' onClick={onBackClick} />
        </div>
        <span className="text-brand-blue text-xl">Question 1</span>
        <span className='text-gray-800 text-4xl font-bold mt-4 leading-9'>Rank these factors when searching for a parking lot.</span>
      </div>
      <div>
        <div className="mx-10 text-slate-500 font-bold text-md mb-2 mt-8">Price</div>
        <div className="flex mb-6">
          <Button
            className={`w-24 h-8 border-2 text-brand-blue text-lg border-blue-700 ml-10 mr-2 price-button-style`}
            onClick={() => handlePriceClick(1)}
            data-button-number={1}
          >
            1
          </Button>
          <Button
            className={`w-24 h-8 border-2 text-brand-blue text-lg border-blue-700 mx-2 price-button-style`}
            onClick={() => handlePriceClick(2)}
            data-button-number={2}
          >
            2
          </Button>
          <Button
            className={`w-24 h-8 border-2 text-brand-blue text-lg border-blue-700 mx-2 price-button-style`}
            onClick={() => handlePriceClick(3)}
            data-button-number={3}
          >
            3
          </Button>
        </div>

        <div className="mx-10 text-slate-500 font-bold text-lg mb-2">Crowd</div>
        <div className="flex mb-6">
          <Button
            className={`w-24 h-8 border-2 text-brand-blue text-lg border-blue-700 ml-10 mr-2 crowd-button-style`}
            onClick={() => handleCrowdClick(1)}
            data-button-number={1}
          >
            1
          </Button>
          <Button
            className={`w-24 h-8 border-2 text-brand-blue text-lg border-blue-700 mx-2 crowd-button-style`}
            onClick={() => handleCrowdClick(2)}
            data-button-number={2}
          >
            2
          </Button>
          <Button
            className={`w-24 h-8 border-2 text-brand-blue text-lg border-blue-700 mx-2 crowd-button-style`}
            onClick={() => handleCrowdClick(3)}
            data-button-number={3}
          >
            3
          </Button>
        </div>

        <div className="mx-10 text-slate-500 font-bold text-lg mb-2">Distance</div>
        <div className="flex mb-8">
          <Button
            className={`w-24 h-8 border-2 text-brand-blue text-lg border-blue-700 ml-10 mr-2 distance-button-style`}
            onClick={() => handleDistanceClick(1)}
            data-button-number={1}
          >
            1
          </Button>
          <Button
            className={`w-24 h-8 border-2 text-brand-blue text-lg border-blue-700 mx-2 distance-button-style`}
            onClick={() => handleDistanceClick(2)}
            data-button-number={2}
          >
            2
          </Button>
          <Button
            className={`w-24 h-8 border-2 text-brand-blue text-lg border-blue-700 mx-2 distance-button-style`}
            onClick={() => handleDistanceClick(3)}
            data-button-number={3}
          >
            3
          </Button>
        </div>

      </div>
      <div className='mb-12 w-full text-center'>
        <Button
          className=" h-12 bg-brand-dark-blue text-white w-4/5 py-2 rounded-lg font-semibold text-lg"
          onClick={handleFormSubmit}
        >
          Next
        </Button>
      </div>
      <ToastContainer />

    </div>
  );
};

export default Question1;
