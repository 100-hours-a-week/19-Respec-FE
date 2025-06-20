import React from 'react';

const ServiceIntro = () => {
  return (
    <div className="p-4 mb-4 rounded-lg bg-blue-50 shadow-md">
      <h3 className="mb-2 font-semibold">스펙랭킹 서비스란?</h3>
      <p className="text-sm text-gray-700">
        당신의 스펙을 다른 사용자들의 스펙과 비교하여{' '}
        <span className="font-bold text-blue-700">객관적인 경쟁력</span>을
        확인할 수 있는 서비스입니다.
        <span className="font-bold text-blue-700"> AI 모델</span> 기반으로 경력,
        학력, 자격증, 프로젝트 경험 등을 종합적으로 평가하여 나의 위치를{' '}
        <span className="font-bold text-blue-700">실시간 랭킹</span>으로
        보여줍니다.
      </p>
    </div>
  );
};

export default ServiceIntro;
