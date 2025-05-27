import React, { useState, useEffect } from 'react';
import { SpecAPI } from '../api';
import ProfileCard from '../components/ProfileCard';
import ServiceIntro from "../components/ServiceIntro";
import RankingFilters from "../components/RankingFilters";
import RankingItem from "../components/RankingItem";

const HomePage = () => {
    const [selectedFilter, setSelectedFilter] = useState('전체');
    const [rankingData, setRankingData] = useState([]);
    
    useEffect(() => {
      const fetchRankings = async () => {
        try {
          const response = await SpecAPI.getRankings({
            type: 'ranking',
            jobField: selectedFilter,
            limit: 4
          });

          setRankingData(response.data.data.rankings);
        } catch (error) {
          console.error("랭킹 데이터를 불러오는 데 실패했습니다.", error);
        }
      };
  
      fetchRankings();
    }, [selectedFilter]);
    
    return (
        <div className="p-4">
          <ProfileCard />
          <ServiceIntro />
          
          <h3 className="mt-6 mb-2 text-lg font-bold">상위 랭킹 TOP 4</h3>
          <RankingFilters 
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
          
          <div className="bg-white rounded-lg shadow">
            {rankingData.map((item) => {
              return (
                <RankingItem 
                key={item.userId}
                totalRank={item.totalRank}
                totalUsersCount={item.totalUsersCount}
                user={item.nickname}
                score={item.score}
                category={item.jobField}
                profileImageUrl={item.profileImageUrl}
                rankByJobField={item.rankByJobField}
                usersCountByJobField={item.usersCountByJobField}
              />
              );
            })}
          </div>
        </div>
    );
  };
  
  export default HomePage;