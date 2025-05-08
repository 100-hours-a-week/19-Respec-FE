import React, {useState} from "react";
import { Award, Star, Trophy } from "lucide-react";

const RankingItem = ({ rank, user, score, category, percentage, isFavorite }) => {
  const [favorite, setFavorite] = useState(isFavorite);
  
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
        <Award size={20} color={getMedalColor(rank)} />
      </div>
    );
  };

  return (
    <div className="flex items-center py-3 border-b">
      <Medal rank={rank} />
      {/* <div className="w-6 font-semibold text-center">
        {rank <= 3 ? (
          <span className="text-yellow-500">
            {rank}
          </span>
        ) : (
          <span>{rank}</span>
        )}
      </div> */}
      <div className="w-10 h-10 mx-2 bg-gray-200"></div>
      <div className="flex-1">
        <p className="font-semibold">{user}</p>
        <p className="text-xs text-gray-500">{category}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-blue-500">{score}점</p>
        <p className="text-xs text-gray-500">상위 {percentage}%</p>
      </div>
      <button 
        className="ml-2 text-gray-400"
        onClick={() => setFavorite(!favorite)}
      >
        <Star 
          size={20} 
          fill={favorite ? "#EDBA3C" : "none"}
          color={favorite ? "#EDBA3C" : "#EDBA3C"}
        />
      </button>
    </div>
  );
};

export default RankingItem;