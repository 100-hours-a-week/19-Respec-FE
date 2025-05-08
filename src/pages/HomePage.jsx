import React, {useState} from "react";
import ProfileCard from "../components/ProfileCard";
import ServiceIntro from "../components/ServiceIntro";
import RankingFilters from "../components/RankingFilters";
import RankingItem from "../components/RankingItem";

const HomePage = () => {
    const [selectedFilter, setSelectedFilter] = useState('전체');
    
    const rankingData = [
      { rank: 1, user: 'jelly.song', score: 89, category: '인터넷.IT', percentage: '0.01', isFavorite: false },
      { rank: 2, user: 'jenna.lee', score: 86, category: '경영.사무', percentage: '0.02', isFavorite: true },
      { rank: 3, user: 'elton.park', score: 80, category: '마케팅.광고', percentage: '0.03', isFavorite: false },
      { rank: 4, user: 'tony.kim', score: 79, category: '인터넷.IT', percentage: '0.04', isFavorite: false },
    ];
    
    return (
        <div className="p-4">
          <ProfileCard />
          {/* <SpecSummary /> */}
          <ServiceIntro />
          
          <h3 className="mt-6 mb-2 text-lg font-bold">상위 랭킹 TOP 4</h3>
          <RankingFilters 
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
          
          <div className="bg-white rounded-lg shadow">
            {rankingData.map((item) => (
              <RankingItem 
                key={item.rank}
                rank={item.rank}
                user={item.user}
                score={item.score}
                category={item.category}
                percentage={item.percentage}
                isFavorite={item.isFavorite}
              />
            ))}
          </div>
        </div>
    );
  };
  
  export default HomePage;