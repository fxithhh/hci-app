import React, { useState, useEffect } from 'react';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {MdOutlineArrowBackIos} from 'react-icons/md'


const Question2 = ({ onBackClick }) => {
  const navigate = useNavigate();

  const [activeButtons, setActiveButtons] = useState([]);

  const handleFormSubmit = () => {
    // Check if at least one button is selected
    if (activeButtons.length > 0) {
      // Perform any necessary logic with the form data for question 2
      console.log(activeButtons)
      navigate('/parkfinder'); // Proceed to the next question
    } else {
      toast.error('Please select at least one parking facility', {
        position: toast.POSITION.BOTTOM_RIGHT, // You can choose the position of the toast notification
        autoClose: 3000, // The notification will automatically close after 3 seconds
      })
    }
  };

  const handleButtonClick = (buttonNumber) => {
    setActiveButtons((prevButtons) => {
      if (prevButtons.includes(buttonNumber)) {
        return prevButtons.filter((btn) => btn !== buttonNumber);
      } else {
        return [...prevButtons, buttonNumber];
      }
    });
  };

  useEffect(() => {
    console.log('Current activeButtons state:', activeButtons);

    // Update button styles based on the active state
    // Update button styles based on the active state
    const buttons = document.querySelectorAll('.button-style');
    buttons.forEach((button) => {
      const buttonNumber = button.getAttribute('data-button-number');
      if (activeButtons.includes(buttonNumber)) {
        button.classList.add('active', 'border-brand-dark-blue', 'bg-brand-dark-blue', 'text-white');
        button.classList.remove('border-brand-blue', 'bg-white', 'text-brand-blue');
      } else {
        button.classList.remove('active', 'border-brand-dark-blue', 'bg-brand-dark-blue', 'text-white');
        button.classList.add('border-brand-blue', 'bg-white', 'text-brand-blue');
      }
    });
  }, [activeButtons]);


  return (
    <div className="w-full flex flex-col items-start my-8">
      {/* Content for Question 2 */}
      <div className="font-bold mx-10 mt-2 text-left flex flex-col">
      <div className="mb-2"> {/* Add this div container */}
          <MdOutlineArrowBackIos className='text-xl text-left' onClick={onBackClick} />
        </div>
        <span className="text-brand-blue text-xl">Question 2</span>
        <span className='text-gray-800 text-4xl font-bold mt-4 leading-9'>Please select your preferred types of parking facilities.</span>
        <div className="text-brand-gray italic font-semibold mt-3">Please select all that apply.</div>

      </div>

      <div className="w-4/5 mx-auto mt-6 flex flex-wrap gap-3 justify-start">
        <Button
          className={`flex-1 h-10 border-2 text-brand-blue text-lg button-style`}
          onClick={() => handleButtonClick('Outdoor')}
          data-button-number="Outdoor"
        >
          Outdoor
        </Button>
        <Button
          className={`flex-1 h-10 border-2 text-brand-blue text-lg border-brand-blue button-style`}
          onClick={() => handleButtonClick('Multi-Story')}
          data-button-number="Multi-Story"

        >
          Multi-Story
        </Button>
        <Button
          className={`flex-1 h-10 border-2 text-brand-blue text-lg border-brand-blue button-style`}
          onClick={() => handleButtonClick('Underground')}
          data-button-number="Underground"

        >
          Underground
        </Button>
        <Button
          className={`flex-1 h-10 border-2 text-brand-blue text-lg border-brand-blue button-style`}
          onClick={() => handleButtonClick('Valet')}
          data-button-number="Valet"

        >
          Valet
        </Button>
        <Button
          className={`flex-1 h-10 border-2 text-brand-blue text-lg border-brand-blue button-style`}
          onClick={() => handleButtonClick('Roadside')}
          data-button-number="Roadside"
        >
          Roadside
        </Button>
        <Button
          className={`flex-1 h-10 border-2 text-brand-blue text-lg border-brand-blue button-style`}
          onClick={() => handleButtonClick('EV Charging Station')}
          data-button-number="EV Charging Station"
        >
          EV Charging Station
        </Button>
      </div>

      <div className='my-12 w-full text-center'>
        <Button
          className="h-12 bg-brand-dark-blue text-white w-4/5 py-2 rounded-lg font-semibold text-lg"
          onClick={handleFormSubmit}
        >
          Next
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Question2;
