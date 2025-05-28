import React from "react";
import { Award } from "lucide-react";

const RankingItem = ({ 
  user,
  profileImageUrl,
  totalRank, 
  totalUsersCount, 
  rankByJobField, 
  usersCountByJobField,
  score, 
  category 
}) => {
  
  // 메달 색상 결정 함수
  const getMedalColor = (totalRank) => {
    switch(totalRank) {
      case 1: return "#EDBA3C"; // 금색
      case 2: return "#C0C0C0"; // 은색
      case 3: return "#CD7F32"; // 동색
      default: return "transparent";
    }
  };

  // 메달 컴포넌트
  const Medal = ({ totalRank }) => {
    if (totalRank > 3) return <div className="w-6 font-semibold text-center">{totalRank}</div>;
    
    return (
      <div className="flex items-center justify-center w-6">
        <Award size={28} color={getMedalColor(totalRank)} />
      </div>
    );
  };

  // 점수 및 백분위 표현 처리
  const formattedScore = score.toFixed(1);
  const percentage = ((totalRank / totalUsersCount) * 100).toFixed(2);
  const formattedPercentage = isNaN(Number(percentage)) ? "-" : Number(percentage).toFixed(2);

  return (
<div className="flex items-center p-4 my-2 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-center mr-3">
        <Medal totalRank={totalRank} />
      </div>
      
      {profileImageUrl ? (
        <img src={profileImageUrl} alt={user} className="object-cover w-12 h-12 mr-3 rounded-full" />
      ) : (
        <div className="flex items-center justify-center w-12 h-12 mr-3 bg-red-100 rounded-full">
          <span className="font-bold text-red-500">{user.charAt(0)}</span>
        </div>
      )}
      
      <div className="flex-1">
        <p className="text-lg font-bold">{user}</p>
        <p className="text-xs text-gray-500">{category}</p>
        <p className="text-xs text-gray-500">직무 내 순위 <span className="font-bold text-blue-500">{rankByJobField}</span>/{usersCountByJobField}명</p>
      </div>
      
      <div className="text-right">
        <p className="text-xl font-bold text-blue-500">{formattedScore}점</p>
        <p className="text-xs text-gray-500">상위 {formattedPercentage}%</p>
      </div>
    </div>
  );
};

export default RankingItem;