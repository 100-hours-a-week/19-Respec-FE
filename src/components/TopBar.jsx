import React from 'react';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ title, onBack }) => {
  const navigate = useNavigate();

  // Allow overriding the back behavior
  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="flex items-center h-14 px-4 border-b border-gray-200">
      <button 
        onClick={handleBack}
        className="p-2 -ml-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="flex-1 text-center text-lg font-medium mr-8">{title}</h1>
    </div>
  );
};

export default TopBar;