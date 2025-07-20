import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { adBannerData } from '../utils/adData';

const AdBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);

  // 자동 슬라이드 시작
  const startAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % adBannerData.length);
    }, 5000);
  };

  // 자동 슬라이드 정지
  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 컴포넌트 마운트 시 자동 슬라이드 시작
  useEffect(() => {
    startAutoSlide();

    // 컴포넌트 언마운트 시 정리
    return () => {
      stopAutoSlide();
    };
  }, []);

  // 슬라이드 변경 시 애니메이션 처리
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  const handleNext = () => {
    stopAutoSlide();
    setCurrentSlide((prev) => (prev + 1) % adBannerData.length);
    startAutoSlide();
  };

  const handlePrev = () => {
    stopAutoSlide();
    setCurrentSlide(
      (prev) => (prev - 1 + adBannerData.length) % adBannerData.length
    );
    startAutoSlide();
  };

  const handleDotClick = (index) => {
    if (index === currentSlide) return;

    stopAutoSlide();
    setCurrentSlide(index);
    startAutoSlide();
  };

  const handleAdClick = (link) => {
    // 새 탭에서 외부 링크 열기
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative mb-4 overflow-hidden bg-white rounded-lg shadow">
      <div className="relative h-24">
        {/* 슬라이드 컨테이너 */}
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            opacity: isTransitioning ? 0.9 : 1,
          }}
        >
          {adBannerData.map((ad) => (
            <div
              key={ad.id}
              className={`w-full h-full flex-shrink-0 ${ad.backgroundColor} ${ad.textColor} cursor-pointer`}
              onClick={() => handleAdClick(ad.link)}
            >
              <div className="flex items-center justify-between h-full px-10">
                <div className="flex-1">
                  <h3 className="mb-1 text-base font-bold">{ad.title}</h3>
                  <p className="text-sm opacity-90">{ad.subtitle}</p>
                </div>
                <div className="ml-4 text-3xl opacity-80">{ad.image}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 이전 버튼 */}
        <button
          onClick={handlePrev}
          className="absolute flex items-center justify-center w-6 h-6 transition-all duration-200 transform -translate-y-1/2 bg-black rounded-full left-2 top-1/2 bg-opacity-20 hover:bg-opacity-40"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          className="absolute flex items-center justify-center w-6 h-6 transition-all duration-200 transform -translate-y-1/2 bg-black rounded-full right-2 top-1/2 bg-opacity-20 hover:bg-opacity-40"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>

        {/* 인디케이터 점들 */}
        <div className="absolute flex space-x-2 transform -translate-x-1/2 bottom-2 left-1/2">
          {adBannerData.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
