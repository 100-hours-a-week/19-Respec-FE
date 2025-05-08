import React from "react";

const RankingFilters = ({ selectedFilter, setSelectedFilter }) => {
    const filters = ['전체', '경영.사무', '마케팅.광고', '연구개발.설계', '인터넷.IT'];
    
    return (
      <div className="flex py-2 mb-2 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`px-3 py-1 rounded-full mr-2 text-sm whitespace-nowrap ${
              selectedFilter === filter
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    );
  };

  export default RankingFilters;