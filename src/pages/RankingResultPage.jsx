import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import RankingItem from '../components/RankingItem';
import axiosInstance from '../utils/axiosInstance';

// 로딩 인디케이터 컴포넌트
const LoadingIndicator = () => (
  <div className="flex items-center justify-center py-4">
    <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
  </div>
);

// 검색 결과 항목 컴포넌트
const SearchResultItem = ({ result }) => {
  return (
    <div className="p-4 mb-4 transition-all bg-white border border-gray-200 rounded-lg shadow-md hover:border-blue-300">
      <div className="flex items-center">
        {/* 랭킹 순위 */}
        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 text-lg font-bold text-white bg-blue-500 rounded-full">
          {result.totalRank}
        </div>
        
        {/* 프로필 이미지 */}
        <div className="w-12 h-12 mr-4 overflow-hidden bg-gray-200 rounded-full">
          {result.profileImageUrl ? (
            <img 
              src={result.profileImageUrl} 
              alt={`${result.nickname}의 프로필`} 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-600 bg-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* 사용자 정보 */}
        <div className="flex-1">
          <h3 className="text-lg font-medium">{result.nickname}</h3>
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
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('keyword') || '';
  
  // 상태 관리
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  
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
      
      const response = await axiosInstance.get('/api/specs', {
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
      
      const response = await axiosInstance.get('/api/specs', {
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
  
  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    if (keyword) {
      fetchSearchResults(keyword);
    }
  }, [keyword]);
  
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <div className="relative flex flex-col flex-1 w-full max-w-md pb-16 mx-auto bg-white">
        <div className="flex-1 p-4 pb-20 overflow-y-auto">
          {/* 검색 키워드 */}
          <div className="mb-4">
            <h2 className="text-lg font-medium">
              <span className="text-blue-600">"{keyword}"</span> 검색 결과
            </h2>
          </div>
          
          {/* 검색 결과 리스트 */}
          {error ? (
            <div className="p-4 text-red-800 bg-red-100 rounded-lg">
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
                  {searchResults.map((result, index) => {
                    // <div 
                    //   key={`${result.userId}_${index}`} 
                    //   ref={index === searchResults.length - 1 ? lastResultElementRef : null}
                    // >
                    //   <SearchResultItem result={result} />
                    // </div>
                    const percentage = ((result.rankByJobField / result.totalUsersCountByJobField) * 100).toFixed(2);
                    return (
                      <div 
                        key={`${result.userId}_${index}`} 
                        ref={index === searchResults.length - 1 ? lastResultElementRef : null}
                      >
                        <RankingItem 
                          rank={result.totalRank}
                          user={result.nickname}
                          score={result.score}
                          category={result.jobField}
                          percentage={percentage}
                          profileImageUrl={result.profileImageUrl}
                        />
                      </div>
                    );
                  })}
                  {loading && <LoadingIndicator />}
                  {!hasMore && searchResults.length > 0 && (
                    <div className="py-4 text-sm text-center text-gray-500">
                      모든 검색 결과를 불러왔습니다.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RankingResultPage; 