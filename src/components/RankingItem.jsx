import React from "react";
import { Award } from "lucide-react";

const RankingItem = ({ rank, user, score, category, percentage, profileImageUrl }) => {
  
  // 메달 색상 결정 함수
  const getMedalColor = (rank) => {
    switch(rank) {
      case 1: return "#EDBA3C"; // 금색
      case 2: return "#C0C0C0"; // 은색
      case 3: return "#CD7F32"; // 동색
      default: return "transparent";
    }
  };

  // 메달 컴포넌트
  const Medal = ({ rank }) => {
    if (rank > 3) return <div className="w-6 font-semibold text-center">{rank}</div>;
    
    return (
      <div className="flex justify-center w-6">
        <Award size={28} color={getMedalColor(rank)} />
      </div>
    );
  };

  return (
    <div className="flex items-center px-2 py-3 border-b">
      <Medal rank={rank} />
      <img src={profileImageUrl} alt="user" className="w-10 h-10 mx-2 rounded-full" />
      <div className="flex-1">
        <p className="font-semibold">{user}</p>
        <p className="text-xs text-gray-500">{category}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-blue-500">{score}점</p>
        <p className="text-xs text-gray-500">상위 {percentage}%</p>
      </div>
    </div>
  );
};

export default RankingItem;