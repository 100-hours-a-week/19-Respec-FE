import React from 'react';
import { ArrowLeft } from 'lucide-react';

const TopBar = ({ title, backLink = "/" }) => {
  return (
    <div className="flex items-center w-full px-4 bg-white border-b border-gray-100 h-14">
      <div className="flex justify-start w-10">
        <a href={backLink} className="mr-4">
          <ArrowLeft size={20} color="#333" />
        </a>
      </div>
      <h1 className="flex-1 text-lg font-medium text-center">{title}</h1>
      <div className="w-10" />
    </div>
  );
};

export default TopBar;