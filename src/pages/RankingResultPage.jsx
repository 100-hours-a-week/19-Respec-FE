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
          {result.totalRank}
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
            <span className="mr-2">{result.jobField.replace(/_/g, ' ')}</span>
            <span className="mx-2">•</span>
            <span>점수: <span className="font-semibold text-blue-600">{result.score.toFixed(1)}</span></span>
          </div>
        </div>
        
        {/* 랭킹 정보 */}
        <div className="text-right">
          <div className="text-sm text-gray-500">
            직무 내 {result.rankByJobField}위 / {result.totalUsersCountByJobField}명
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
      console.log('검색 결과 요청 중...', { type: 'search', 'nickname-keyword': keyword, limit: 10 });
      
      const response = await axios.get('http://localhost:8080/api/specs', {
        params: {
          type: 'search',
          'nickname-keyword': keyword,
          limit: 10
        }
      });
      
      console.log('검색 결과 API 응답:', response.data);
      
      if (response.data.isSuccess) {
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
      uniqueMap.set(result.userId, result);
    });
    
    return Array.from(uniqueMap.values());
  };
  
  // 추가 검색 결과 로드 (무한 스크롤)
  const fetchMoreResults = async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    
    try {
      console.log('추가 검색 결과 요청 중...', { 
        type: 'search', 
        'nickname-keyword': keyword, 
        cursor: nextCursor, 
        limit: 10 
      });
      
      const response = await axios.get('http://localhost:8080/api/specs', {
        params: {
          type: 'search',
          'nickname-keyword': keyword,
          cursor: nextCursor,
          limit: 10
        }
      });
      
      console.log('추가 검색 결과 API 응답:', response.data);
      
      if (response.data.isSuccess) {
        if (response.data.data && response.data.data.results) {
          // 새로 받은 데이터
          const newResults = response.data.data.results;
          
          // 기존 데이터와 새 데이터 모두 포함하여 중복 제거
          setSearchResults(prev => {
            const combinedResults = [...prev, ...newResults];
            return removeDuplicateResults(combinedResults);
          });
          
          setHasMore(response.data.data.hasNext);
          setNextCursor(response.data.data.nextCursor);
        } else {
          setHasMore(false);
        }
      } else {
        console.error('추가 검색 결과 로드 실패:', response.data.message);
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
  
  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    if (keyword) {
      fetchSearchResults(keyword);
    }
  }, [keyword]);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <TopBar title="검색 결과" showBackButton={true} />
      
      <div className="w-full max-w-md mx-auto flex-1 bg-white p-4 pb-16">
        {/* 검색창 */}
        <div className="mb-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="사용자 검색..."
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
        
        {/* 검색 키워드 */}
        <div className="mb-4">
          <h2 className="text-lg font-medium">
            <span className="text-blue-600">"{keyword}"</span> 검색 결과
          </h2>
        </div>
        
        {/* 검색 결과 리스트 */}
        {error ? (
          <div className="p-4 bg-red-100 text-red-800 rounded-lg">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {searchResults.length === 0 && !loading ? (
              <div className="p-8 text-center text-gray-500">
                <p>검색 결과가 없습니다.</p>
                <p className="mt-2 text-sm">다른 검색어로 다시 시도해보세요.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <div 
                    key={`${result.userId}_${index}`} 
                    ref={index === searchResults.length - 1 ? lastResultElementRef : null}
                  >
                    <SearchResultItem result={result} />
                  </div>
                ))}
                {loading && <LoadingIndicator />}
                {!hasMore && searchResults.length > 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    모든 검색 결과를 불러왔습니다.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      <BottomNavBar />
    </div>
  );
};

export default RankingResultPage; 