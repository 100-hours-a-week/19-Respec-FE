import React from "react";

const RankingFilters = ({ selectedFilter, setSelectedFilter }) => {
    const filters = [
      "전체", "인터넷_IT", "금융", "생산_제조", "영업_고객상담", 
      "전문직_특수직", "연구개발_설계", "무역_유통", "건설", "미디어", "경영_사무"
    ];
    
    return (
      <div className="flex py-2 mb-2 overflow-x-auto hide-scrollbar">
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

        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    );
  };

  export default RankingFilters;