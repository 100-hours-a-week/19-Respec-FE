import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TopBar = ({ title, backLink }) => {
  const navigate = useNavigate();
  
  const handleBackClick = (e) => {
    e.preventDefault();
    if (typeof backLink === 'function') {
      backLink();
    } else if (backLink) {
      navigate(backLink);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 mx-auto max-w-[390px] z-20 flex items-center w-full px-4 bg-white border-b border-gray-100 h-14">
      <div className="flex justify-start w-10">
        {backLink && (
          <a href="#" onClick={handleBackClick} className="mr-4">
            <ArrowLeft size={20} color="#333" />
          </a>
        )}
      </div>
      <h1 className="flex-1 text-lg font-medium text-center">{title}</h1>
      <div className="w-10" />
    </div>
  );
};

export default TopBar;