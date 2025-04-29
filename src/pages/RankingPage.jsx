import React, { useState, useRef } from 'react';
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";

const RankingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const categorySliderRef = useRef(null);
  const [users, setUsers] = useState([
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
      username: 'jenna.lee', 
      category: '인터넷.IT', 
      score: 86, 
      growthRate: '0.02%', 
      views: 24, 
      likes: 24,
      rank: 2,
      starred: false 
    },
    { 
      id: 3, 
      username: 'elton.park', 
      category: '경영.사무', 
      score: 80, 
      growthRate: '0.03%', 
      views: 24, 
      likes: 24,
      rank: 3,
      starred: true 
    },
    { 
      id: 4, 
      username: 'tony.kim', 
      category: '인터넷.IT', 
      score: 79, 
      growthRate: '0.04%', 
      views: 24, 
      likes: 24,
      rank: 4,
      starred: false 
    },
    { 
      id: 5, 
      username: 'tony.kim', 
      category: '마케팅.광고', 
      score: 79, 
      growthRate: '0.04%', 
      views: 24, 
      likes: 24,
      rank: 5,
      starred: true 
    },
    { 
      id: 6, 
      username: 'tony.kim', 
      category: '마케팅.광고', 
      score: 79, 
      growthRate: '0.04%', 
      views: 24, 
      likes: 24,
      rank: 6,
      starred: true 
    }
  ]);

  const [searchResults] = useState([
    { id: 1, username: 'jelly.song' },
    { id: 2, username: 'jelly.park' },
    { id: 3, username: 'jelo' },
    { id: 4, username: 'songjelly' }
  ]);

  // 검색어와 일치하는 사용자 필터링
  const filteredUsers = users.filter(user => 
    (selectedCategory === '전체' || user.category === selectedCategory) 
  );

  // 검색어 입력 핸들러
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSearchResults(value.length > 0);
  };

  // 1~3위 메달 렌더링
  const renderRankBadge = (rank) => {
    if (rank > 3) return <div className="mr-2 w-8 text-center font-medium text-gray-500">{rank}</div>;

    const colors = {
      1: 'bg-yellow-400 text-yellow-800',
      2: 'bg-gray-300 text-gray-700',
      3: 'bg-yellow-600 text-yellow-100'
    };

    return (
      <div className="flex items-center justify-center w-8 h-8 mr-2">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${colors[rank]}`}>
          {rank}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full max-w-md mx-auto flex flex-col flex-1 bg-white relative">
        <TopBar title="랭킹" />
        
        {/* 검색창 */}
        <div className="px-4 py-2 border-b border-gray-200 relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="닉네임 또는 직무로 검색"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* 검색 결과 드롭다운 */}
          {showSearchResults && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 mx-4">
              {searchResults.map((result) => (
                <div 
                  key={result.id} 
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSearchTerm(result.username);
                    setShowSearchResults(false);
                  }}
                >
                  <p className="text-base">
                    {result.username.split(searchTerm.toLowerCase()).map((part, i, parts) => {
                      return i < parts.length - 1 ? (
                        <React.Fragment key={i}>
                          {part}
                          <span className="text-blue-500 font-medium">{searchTerm.toLowerCase()}</span>
                        </React.Fragment>
                      ) : (
                        part
                      );
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 카테고리 필터 - 좌우 스크롤 */}
        <div className="px-4 py-2 border-b border-gray-200 overflow-hidden">
          <div 
            ref={categorySliderRef} 
            className="flex space-x-2 overflow-x-auto"
            style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {['전체', '경영.사무', '마케팅.광고', '연구개발.설계', '인터넷.IT'].map((category) => (
              <button
                key={category}
                className={`px-4 py-1 rounded-full text-sm flex-shrink-0 ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-600 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* 통계 정보 */}
        <div className="flex border-b border-gray-200">
          <div className="flex-1 py-3 text-center bg-blue-50">
            <p className="text-sm text-gray-500">총 사용자</p>
            <p className="text-xl font-bold text-blue-700">100명</p>
          </div>
          <div className="flex-1 py-3 text-center bg-blue-50">
            <p className="text-sm text-gray-500">평균 점수</p>
            <p className="text-xl font-bold text-blue-700">74.3점</p>
          </div>
        </div>
        
        {/* 내 랭킹 */}
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-base font-medium mb-2">내 랭킹</h2>
          <div className="flex items-center p-2 bg-white rounded-lg border border-gray-200">
            <div className="mr-2 text-lg font-medium text-gray-500">4</div>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-medium">tony.kim</div>
              <div className="text-sm text-gray-500">인터넷.IT</div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-bold text-blue-600">79점</span>
              <span className="text-xs text-green-500">상위 0.04%</span>
              <button className="text-xs text-blue-600 mt-1">상세 보기</button>
            </div>
          </div>
        </div>
        
        {/* 전체 랭킹 */}
        <div className="px-4 py-3">
          <h2 className="text-base font-medium">전체 랭킹</h2>
          
          <div className="mt-2 divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center py-3">
                {/* 랭킹 숫자 또는 메달 */}
                {renderRankBadge(user.rank)}
                
                {/* 프로필 이미지 */}
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                {/* 사용자 정보 */}
                <div className="flex-1">
                  <div className="font-medium">{user.username}</div>
                  <div className="text-sm text-gray-500">{user.category}</div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    {user.views}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {user.likes}
                  </div>
                </div>
                
                {/* 점수 및 성장률 */}
                <div className="flex flex-col items-end mr-2">
                  <span className="font-bold text-blue-600">{user.score}점</span>
                  <span className="text-xs text-green-500">상위 {user.growthRate}</span>
                  <button className="text-xs text-blue-600 mt-1">상세 보기</button>
                </div>
                
                {/* 즐겨찾기 별표 */}
                <button 
                  className="ml-2 focus:outline-none" 
                  onClick={() => {
                    const updatedUsers = [...users];
                    updatedUsers[user.rank - 1].starred = !updatedUsers[user.rank - 1].starred;
                    setUsers(updatedUsers);
                  }}
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
        </div>
        
        <BottomNavBar />
      </div>
    </div>
  );
};

export default RankingPage;