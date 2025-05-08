import React from 'react';
import { ArrowLeft } from 'lucide-react';

const TopBar = ({ title, backLink = "/" }) => {
  return (
    <div className="h-14 w-full bg-white flex items-center px-4 border-b border-gray-100">
      <div className="w-10 flex justify-start">
        <a href={backLink} className="mr-4">
          <ArrowLeft size={20} color="#333" />
        </a>
      </div>
      <h1 className="font-medium text-center flex-1 text-lg">{title}</h1>
      <div className="w-10" />
    </div>
  );
};

export default TopBar;