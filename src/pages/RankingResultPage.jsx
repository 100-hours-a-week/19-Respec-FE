import React, { useState } from 'react';
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";

const RankingSearchResult = () => {
  const [searchTerm] = useState('jel');
  const [searchResults, setSearchResults] = useState([
    { 
      id: 1, 
      username: 'jelly.song', 
      category: '인터넷.IT', 
      score: 89, 
      growthRate: '0.01%', 
      views: 24, 
      likes: 24,
      rank: 1,
      starred: true 
    },
    { 
      id: 2, 
      username: 'jelly.park', 
      category: '인터넷.IT', 
      score: 86, 
      growthRate: '0.02%', 
      views: 24, 
      likes: 24,
      rank: 24,
      starred: false 
    },
    { 
      id: 3, 
      username: 'jelo', 
      category: '경영.사무', 
      score: 80, 
      growthRate: '0.03%', 
      views: 24, 
      likes: 24,
      rank: 56,
      starred: false 
    },
    { 
      id: 4, 
      username: 'songjelly', 
      category: '인터넷.IT', 
      score: 79, 
      growthRate: '0.04%', 
      views: 24, 
      likes: 24,
      rank: 78,
      starred: false 
    },
    { 
      id: 5, 
      username: 'tonyjelly', 
      category: '마케팅.광고', 
      score: 79, 
      growthRate: '0.04%', 
      views: 24, 
      likes: 24,
      rank: 5,
      starred: false 
    },
    { 
      id: 6, 
      username: 'yoonjelly', 
      category: '마케팅.광고', 
      score: 79, 
      growthRate: '0.04%', 
      views: 24, 
      likes: 24,
      rank: 6,
      starred: false 
    }
  ]);

  const toggleStar = (userId) => {
    setSearchResults(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, starred: !user.starred } 
          : user
      )
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full max-w-md mx-auto flex flex-col flex-1 bg-white relative">
        <TopBar title="랭킹 검색 결과" />
        
        {/* 검색어 정보 */}
        <div className="px-4 py-3 bg-gray-100 border-b border-gray-200">
          <p className="text-base text-center">
            '{searchTerm}'로 검색한 결과입니다.
          </p>
        </div>
        
        {/* 검색 결과 목록 */}
        <div className="flex-1 overflow-y-auto">
          {searchResults.map((user) => (
            <div 
              key={user.id} 
              className="px-4 py-3 border-b border-gray-200 flex items-center"
            >
              {/* 왼쪽: 메달 또는 순위 */}
              {user.rank <= 3 ? (
                <div className="w-10 h-10 mr-2 flex items-center justify-center">
                  {user.rank === 1 && (
                    <div className="flex items-center justify-center w-8 h-8">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-yellow-400 text-yellow-800 font-bold">
                        {user.rank}
                      </div>
                    </div>
                  )}
                  {user.rank === 2 && (
                    <div className="flex items-center justify-center w-8 h-8">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-300 text-gray-700 font-bold">
                        {user.rank}
                      </div>
                    </div>
                  )}
                  {user.rank === 3 && (
                    <div className="flex items-center justify-center w-8 h-8">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-yellow-600 text-yellow-100 font-bold">
                        {user.rank}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-10 h-10 mr-2 flex items-center justify-center">
                  <span className="text-lg text-gray-500">{user.rank}</span>
                </div>
              )}
              
              {/* 중앙: 프로필 이미지 */}
              <div className="mr-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              
              {/* 중앙: 사용자 정보 */}
              <div className="flex-1">
                <div className="font-medium text-lg">{user.username}</div>
                <div className="text-sm text-gray-500">{user.category}</div>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  {user.views}
                  <span className="mx-1">•</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  {user.likes}
                </div>
              </div>
              
              {/* 오른쪽: 점수 및 즐겨찾기 */}
              <div className="flex flex-col items-end">
                <div className="font-bold text-lg text-blue-600">{user.score}점</div>
                <div className="text-xs text-green-500 mb-1">상위 {user.growthRate}</div>
                <div className="text-sm text-blue-600 cursor-pointer">상세 보기</div>
              </div>
              
              {/* 즐겨찾기 별표 */}
              <button 
                className="ml-2 focus:outline-none" 
                onClick={() => toggleStar(user.id)}
              >
                {user.starred ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
        
        <BottomNavBar />
      </div>
    </div>
  );
};

export default RankingSearchResult;