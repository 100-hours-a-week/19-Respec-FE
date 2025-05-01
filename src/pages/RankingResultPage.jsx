import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';

// 로딩 인디케이터 컴포넌트
const LoadingIndicator = () => (
  <div className="flex justify-center items-center py-4">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// 검색 결과 항목 컴포넌트
const SearchResultItem = ({ result }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200 hover:border-blue-300 transition-all">
      <div className="flex items-center">
        {/* 랭킹 순위 */}
        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mr-4 font-bold text-lg">
          {result.rank}
        </div>
        
        {/* 프로필 이미지 */}
        <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 overflow-hidden">
          {result.profileImageUrl ? (
            <img 
              src={result.profileImageUrl} 
              alt={`${result.nickname}의 프로필`} 
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
          <h3 className="font-medium text-lg">{result.nickname}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">{result.jobField}</span>
            <span className="mx-2">•</span>
            <span>평균 점수: <span className="font-semibold text-blue-600">{result.averageScore}</span></span>
          </div>
        </div>
        
        {/* 북마크 및 랭킹 정보 */}
        <div className="flex flex-col items-end">
          <div className="flex items-center mb-1">
            <span className="text-sm text-gray-500 mr-1">
              직무 내 {result.rankByJobField}위 / {result.totalUsersCountByJobField}명
            </span>
          </div>
          <div className="flex items-center">
            <button className={`flex items-center ${result.isBookmarked ? 'text-yellow-500' : 'text-gray-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={result.isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="ml-1 text-xs">{result.bookmarksCount}</span>
            </button>
            <span className="mx-2 text-gray-300">|</span>
            <div className="flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span className="ml-1 text-xs">{result.commentsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 검색 결과 페이지 컴포넌트
const RankingResultPage = () => {
  // URL 쿼리 파라미터에서 검색어 추출
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('keyword') || '';
  
  // 상태 관리
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [searchTerm, setSearchTerm] = useState(keyword);
  
  // 참조용 변수들
  const observer = useRef();
  
  // 마지막 요소 참조 콜백 (Intersection Observer API를 활용한 무한 스크롤 구현)
  const lastResultElementRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        // 화면에 마지막 요소가 보이고, 더 불러올 데이터가 있으면 추가 데이터 로드
        fetchMoreResults();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);
  
  // 검색 결과 초기 로드
  const fetchSearchResults = async (keyword) => {
    if (!keyword || keyword.trim() === '') {
      setSearchResults([]);
      setError('검색어를 입력해주세요.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:8080/api/specs', {
        params: {
          type: 'search',
          'nickname-keyword': keyword,
          limit: 10
        }
      });
      
      console.log('검색 결과 API 응답:', response.data);
      
      if (response.data.success) {
        if (response.data.data && response.data.data.results) {
          // 중복 제거를 위해 Map 사용 (userId를 키로 사용)
          const uniqueResults = removeDuplicateResults(response.data.data.results);
          
          setSearchResults(uniqueResults);
          setHasMore(response.data.data.hasNext);
          setNextCursor(response.data.data.nextCursor);
        } else {
          setSearchResults([]);
          setHasMore(false);
        }
      } else {
        setError(response.data.message || '검색 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('검색 결과 로드 중 오류 발생:', err);
      setError('검색 결과를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 중복 결과 제거 함수
  const removeDuplicateResults = (results) => {
    const uniqueMap = new Map();
    
    // userId를 키로 사용하여 중복 제거
    results.forEach(result => {
      const uniqueKey = `${result.userId}_${result.rank}`;
      uniqueMap.set(uniqueKey, result);
    });
    
    return Array.from(uniqueMap.values());
  };
  
  // 추가 검색 결과 로드 (무한 스크롤)
  const fetchMoreResults = async () => {
    if (!hasMore || loading || !nextCursor) return;
    
    setLoading(true);
    
    try {
      const response = await axios.get('http://localhost:8080/api/specs', {
        params: {
          type: 'search',
          'nickname-keyword': keyword,
          cursor: nextCursor,
          limit: 10
        }
      });
      
      console.log('추가 검색 결과 API 응답:', response.data);
      
      if (response.data.success) {
        if (response.data.data && response.data.data.results) {
          // 새로 받은 데이터
          const newResults = response.data.data.results;
          
          // 기존 데이터와 새 데이터 모두 포함하여 중복 제거
          const combinedResults = [...searchResults, ...newResults];
          const uniqueResults = removeDuplicateResults(combinedResults);
          
          setSearchResults(uniqueResults);
          setHasMore(response.data.data.hasNext);
          setNextCursor(response.data.data.nextCursor);
        } else {
          setHasMore(false);
        }
      } else {
        setError(response.data.message || '추가 결과를 불러오는 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('추가 검색 결과 로드 중 오류 발생:', err);
      setError('추가 검색 결과를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 검색 폼 제출 처리
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim() !== '') {
      // URL 업데이트 (페이지 새로고침 없이)
      navigate(`/ranking-results?keyword=${encodeURIComponent(searchTerm)}`);
      // 검색 결과 다시 로드
      fetchSearchResults(searchTerm);
    }
  };
  
  // 유저 프로필 페이지로 이동
  const navigateToUserProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };
  
  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    if (keyword) {
      fetchSearchResults(keyword);
    }
  }, [keyword]);
  
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full max-w-md mx-auto flex flex-col flex-1 bg-white relative pb-16">
        <TopBar title="검색 결과" />
        
        {/* 검색창 */}
        <div className="px-4 py-2 border-b border-gray-200">
          <form onSubmit={handleSearchSubmit}>
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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>
        
        {/* 검색 요약 */}
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">
            "{keyword}" 검색 결과
          </h2>
        </div>
        
        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-4 my-2">
            <p>{error}</p>
          </div>
        )}
        
        {/* 검색 결과 목록 */}
        <div className="flex-1 p-4 overflow-y-auto pb-20">
          {searchResults.length === 0 && !loading ? (
            <div className="text-center py-10 text-gray-500">
              <p>검색 결과가 없습니다.</p>
              <p className="text-sm mt-2">다른 키워드로 검색해보세요.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <div 
                  key={`${result.userId}_${result.rank}_${index}`} 
                  ref={index === searchResults.length - 1 ? lastResultElementRef : null}
                  onClick={() => navigateToUserProfile(result.userId)}
                  className="cursor-pointer"
                >
                  <SearchResultItem result={result} />
                </div>
              ))}
              
              {/* 로딩 인디케이터 */}
              {loading && <LoadingIndicator />}
              
              {/* 더 이상 불러올 데이터가 없을 때 */}
              {!hasMore && searchResults.length > 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  모든 검색 결과를 불러왔습니다.
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

export default RankingResultPage; 