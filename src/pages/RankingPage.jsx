import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';

// 랭킹 카드 컴포넌트 - 각 사용자의 랭킹 정보를 표시
const RankingCard = ({ ranking, index }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200 hover:border-blue-300 transition-all">
      <div className="flex items-center">
        {/* 랭킹 순위 */}
        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mr-4 font-bold text-lg">
          {ranking.rank}
        </div>
        
        {/* 프로필 이미지 */}
        <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 overflow-hidden">
          {ranking.profileImageUrl ? (
            <img 
              src={ranking.profileImageUrl} 
              alt={`${ranking.nickname}의 프로필`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* 사용자 정보 */}
        <div className="flex-1">
          <h3 className="font-medium text-lg">{ranking.nickname}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">{ranking.jobField}</span>
            <span className="mx-2">•</span>
            <span>평균 점수: <span className="font-semibold text-blue-600">{ranking.averageScore}</span></span>
          </div>
        </div>
        
        {/* 북마크 및 랭킹 정보 */}
        <div className="flex flex-col items-end">
          <div className="flex items-center mb-1">
            <span className="text-sm text-gray-500 mr-1">
              직무 내 {ranking.rankByJobField}위 / {ranking.totalUsersCountByJobField}명
            </span>
          </div>
          <div className="flex items-center">
            <button className={`flex items-center ${ranking.isBookmarked ? 'text-yellow-500' : 'text-gray-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={ranking.isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="ml-1 text-xs">{ranking.bookmarksCount}</span>
            </button>
            <span className="mx-2 text-gray-300">|</span>
            <div className="flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span className="ml-1 text-xs">{ranking.commentsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 로딩 인디케이터 컴포넌트
const LoadingIndicator = () => (
  <div className="flex justify-center items-center py-4">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// 메인 랭킹 페이지 컴포넌트
const RankingPage = () => {
  // 상태 관리
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [selectedJobField, setSelectedJobField] = useState('인터넷.IT');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  
  // 참조용 변수들
  const observer = useRef();
  const navigate = useNavigate();
  
  // 직무 분야 옵션 (필터링용)
  const jobFieldOptions = [
    '인터넷.IT',
    '금융',
    '제조',
    '마케팅.광고.홍보',
    '유통.물류'
  ];
  
  // 마지막 요소 참조 콜백 (Intersection Observer API를 활용한 무한 스크롤 구현)
  const lastRankingElementRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        // 화면에 마지막 요소가 보이고, 더 불러올 데이터가 있으면 추가 데이터 로드
        fetchMoreRankings();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);
  
  // 랭킹 데이터 초기 로드
  const fetchRankings = async (jobField = '인터넷.IT') => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('랭킹 데이터 요청 중...', { jobField, limit: 10 });
      
      const response = await axios.get('http://localhost:8080/api/specs', {
        params: {
          type: 'ranking',
          jobField,
          limit: 10
        }
      });
      
      console.log('API 응답:', response.data);
      console.log('데이터 구조:', JSON.stringify(response.data.data, null, 2));
      
      // isSuccess 대신 success 필드 확인
      if (response.data.success) {
        console.log('성공적으로 랭킹 데이터를 받았습니다');
        
        // API 응답 구조에 맞게 데이터 설정
        if (response.data.data && response.data.data.rankings) {
          console.log('랭킹 데이터 개수:', response.data.data.rankings.length);
          
          // 중복 제거를 위해 Map 사용 (userId를 키로 사용)
          const uniqueRankings = removeDuplicateRankings(response.data.data.rankings);
          console.log('중복 제거 후 랭킹 데이터 개수:', uniqueRankings.length);
          
          setRankings(uniqueRankings);
          setHasMore(response.data.data.hasNext);
          setNextCursor(response.data.data.nextCursor);
        } else {
          console.warn('랭킹 데이터가 예상 구조와 다릅니다:', response.data.data);
          loadTestData(jobField);
        }
      } else {
        console.error('API 에러 응답:', response.data.message);
        setError(response.data.message);
        loadTestData(jobField);
      }
    } catch (err) {
      console.error('랭킹 데이터 로드 중 오류 발생:', err);
      setError('랭킹 데이터를 불러오는 중 오류가 발생했습니다.');
      loadTestData(jobField);
    } finally {
      setLoading(false);
    }
  };
  
  // 중복 랭킹 제거 함수
  const removeDuplicateRankings = (rankings) => {
    const uniqueMap = new Map();
    
    // userId를 키로 사용하여 중복 제거
    rankings.forEach(ranking => {
      // 고유 식별자로 userId와 rank 조합 사용
      const uniqueKey = `${ranking.userId}_${ranking.rank}`;
      uniqueMap.set(uniqueKey, ranking);
    });
    
    return Array.from(uniqueMap.values());
  };
  
  // 테스트 데이터 로드 (API 연결 전까지 임시로 사용)
  const loadTestData = (jobField) => {
    console.log('테스트 데이터를 로드합니다:', jobField);
    
    // 테스트 데이터
    const testData = [
      {
        userId: 1234,
        nickname: "jelly.song",
        profileImageUrl: null,
        specId: 1234,
        jobField: jobField,
        averageScore: 89,
        rankByJobField: 127,
        totalUsersCountByJobField: 1234,
        rank: 1,
        isBookmarked: true,
        commentsCount: 57,
        bookmarksCount: 243
      },
      {
        userId: 1235,
        nickname: "user2",
        profileImageUrl: null,
        specId: 1235,
        jobField: jobField,
        averageScore: 85,
        rankByJobField: 156,
        totalUsersCountByJobField: 1234,
        rank: 2,
        isBookmarked: false,
        commentsCount: 42,
        bookmarksCount: 120
      },
      {
        userId: 1236,
        nickname: "user3",
        profileImageUrl: null,
        specId: 1236,
        jobField: jobField,
        averageScore: 82,
        rankByJobField: 198,
        totalUsersCountByJobField: 1234,
        rank: 3,
        isBookmarked: true,
        commentsCount: 35,
        bookmarksCount: 98
      },
      {
        userId: 1237,
        nickname: "user4",
        profileImageUrl: null,
        specId: 1237,
        jobField: jobField,
        averageScore: 78,
        rankByJobField: 230,
        totalUsersCountByJobField: 1234,
        rank: 4,
        isBookmarked: false,
        commentsCount: 28,
        bookmarksCount: 76
      },
      {
        userId: 1238,
        nickname: "user5",
        profileImageUrl: null,
        specId: 1238,
        jobField: jobField,
        averageScore: 75,
        rankByJobField: 352,
        totalUsersCountByJobField: 1234,
        rank: 5,
        isBookmarked: true,
        commentsCount: 19,
        bookmarksCount: 54
      }
    ];
    
    setRankings(testData);
    setHasMore(false);
  };
  
  // 추가 랭킹 데이터 로드 (무한 스크롤)
  const fetchMoreRankings = async () => {
    if (!hasMore || loading || !nextCursor) return;
    
    setLoading(true);
    
    try {
      const response = await axios.get('http://localhost:8080/api/specs', {
        params: {
          type: 'ranking',
          jobField: selectedJobField,
          cursor: nextCursor,
          limit: 10
        }
      });
      
      console.log('추가 데이터 API 응답:', response.data);
      
      // isSuccess 대신 success 필드 확인
      if (response.data.success) {
        if (response.data.data && response.data.data.rankings) {
          // 새로 받은 데이터
          const newRankings = response.data.data.rankings;
          
          // 기존 데이터와 새 데이터 모두 포함하여 중복 제거
          const combinedRankings = [...rankings, ...newRankings];
          const uniqueRankings = removeDuplicateRankings(combinedRankings);
          
          setRankings(uniqueRankings);
          setHasMore(response.data.data.hasNext);
          setNextCursor(response.data.data.nextCursor);
        } else {
          console.warn('추가 랭킹 데이터가 예상 구조와 다릅니다');
          setHasMore(false);
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('추가 랭킹 데이터 로드 중 오류 발생:', err);
      setError('추가 랭킹 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 직무 분야 변경 시 랭킹 다시 로드
  const handleJobFieldChange = (jobField) => {
    setSelectedJobField(jobField);
    setRankings([]);
    setNextCursor(null);
    setHasMore(true);
    fetchRankings(jobField);
  };
  
  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    fetchRankings(selectedJobField);
  }, []);
  
  // 유저 프로필 페이지로 이동
  const navigateToUserProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };
  
  // 닉네임 검색 처리
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length > 0) {
      // 입력된 검색어로 현재 랭킹 목록에서 필터링
      const filteredResults = rankings.filter(ranking => 
        ranking.nickname.toLowerCase().includes(value.toLowerCase())
      );
      
      setSearchResults(filteredResults);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };
  
  // 검색 결과 선택 처리
  const handleSelectSearchResult = (userId) => {
    setSearchTerm('');
    setShowSearchResults(false);
    navigateToUserProfile(userId);
  };
  
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full max-w-md mx-auto flex flex-col flex-1 bg-white relative pb-16">
        <TopBar title="랭킹" />
        
        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-4">
            <p>{error}</p>
          </div>
        )}
        
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
              placeholder="닉네임으로 검색"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* 검색 결과 드롭다운 */}
          {showSearchResults && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 mx-4">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <div 
                    key={`search-${result.userId}-${result.rank}`} 
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectSearchResult(result.userId)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm">
                        {result.rank}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{result.nickname}</p>
                        <p className="text-xs text-gray-500">{result.jobField} • {result.averageScore}점</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-gray-500">
                  검색 결과가 없습니다
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* 직무 필터 */}
        <div className="px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="text-sm font-medium text-gray-500 mb-2">직무별 랭킹</div>
          <div className="flex overflow-x-auto pb-2 -mx-1">
            {jobFieldOptions.map((jobField) => (
              <button
                key={jobField}
                className={`whitespace-nowrap px-3 py-1.5 mx-1 rounded-full text-sm font-medium transition-colors
                  ${selectedJobField === jobField 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                onClick={() => handleJobFieldChange(jobField)}
              >
                {jobField}
              </button>
            ))}
          </div>
        </div>
        
        {/* 랭킹 목록 */}
        <div className="flex-1 p-4 overflow-y-auto pb-20">
          {rankings.length === 0 && !loading ? (
            <div className="text-center py-10 text-gray-500">
              <p>랭킹 데이터가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rankings.map((ranking, index) => (
                <div 
                  key={`${ranking.userId}_${ranking.rank}_${index}`} 
                  ref={index === rankings.length - 1 ? lastRankingElementRef : null}
                  onClick={() => navigateToUserProfile(ranking.userId)}
                  className="cursor-pointer"
                >
                  <RankingCard ranking={ranking} index={index} />
                </div>
              ))}
              
              {/* 로딩 인디케이터 */}
              {loading && <LoadingIndicator />}
              
              {/* 더 이상 불러올 데이터가 없을 때 */}
              {!hasMore && rankings.length > 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  모든 랭킹을 불러왔습니다.
                </div>
              )}
            </div>
          )}
        </div>
        
        <BottomNavBar />
      </div>
    </div>
  );
};

export default RankingPage;