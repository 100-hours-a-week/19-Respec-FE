import React, { useState, useEffect } from 'react';
import { GraduationCap, Briefcase, Award, BookOpen, Users } from 'lucide-react';

const RadarChart = ({ categoryScores }) => {
  const [animatedScores, setAnimatedScores] = useState([0, 0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const specData = [
    { category: '학력/성적', icon: GraduationCap, colorHex: '#3B82F6' },
    { category: '직무경험', icon: Briefcase, colorHex: '#1E40AF' },
    { category: '자격증', icon: Award, colorHex: '#2563EB' },
    { category: '어학능력', icon: BookOpen, colorHex: '#1D4ED8' },
    { category: '대외활동', icon: Users, colorHex: '#1E3A8A' },
  ];

  const size = 160;
  const center = size / 2;
  const maxRadius = 60;

  // 5각형의 각 꼭짓점 계산 (12시 방향부터 시계방향)
  const getPoint = (index, radius) => {
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2; // -90도에서 시작
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    return { x, y };
  };

  // 컴포넌트 마운트 시 애니메이션 시작 (한 번만)
  useEffect(() => {
    if (animationCompleted) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [animationCompleted]);

  // 점수 애니메이션 (한 번만 실행)
  useEffect(() => {
    if (!isVisible || animationCompleted) return;

    const duration = 2000; // 2초
    const frameRate = 60;
    const totalFrames = (duration / 1000) * frameRate;
    let currentFrame = 0;

    const animateScores = () => {
      if (currentFrame <= totalFrames) {
        const progress = currentFrame / totalFrames;
        // easeOutQuart 이징
        const easeProgress = 1 - Math.pow(1 - progress, 4);

        const newScores = categoryScores.map((score) =>
          Math.round(score * easeProgress)
        );

        setAnimatedScores(newScores);
        currentFrame++;
        requestAnimationFrame(animateScores);
      } else {
        // 애니메이션 완료 표시
        setAnimationCompleted(true);
        setAnimatedScores(categoryScores); // 최종 값으로 설정
      }
    };

    const startAnimation = setTimeout(() => {
      requestAnimationFrame(animateScores);
    }, 500); // 0.5초 후 시작

    return () => clearTimeout(startAnimation);
  }, [categoryScores, isVisible, animationCompleted]);

  // categoryScores가 변경되면 애니메이션 없이 즉시 업데이트
  useEffect(() => {
    if (animationCompleted) {
      setAnimatedScores(categoryScores);
    }
  }, [categoryScores, animationCompleted]);

  // 배경 5각형들 (격자)
  const backgroundPentagons = [20, 40, 60, 80].map((radius) => {
    const points = Array.from({ length: 5 }, (_, i) => getPoint(i, radius));
    return points.map((p) => `${p.x},${p.y}`).join(' ');
  });

  // 데이터 5각형 (애니메이션 적용)
  const dataPoints = animatedScores.map((score, index) => {
    const radius = (score / 100) * maxRadius;
    return getPoint(index, radius);
  });
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // 축선들
  const axisLines = Array.from({ length: 5 }, (_, i) => {
    const endPoint = getPoint(i, maxRadius);
    return { start: { x: center, y: center }, end: endPoint };
  });

  // 라벨 위치 (더 멀리 배치)
  const labelPositions = specData.map((_, index) => {
    const labelPoint = getPoint(index, maxRadius + 35);
    return labelPoint;
  });

  return (
    <div className="space-y-3">
      {/* 5각형 차트 */}
      <div
        className={`flex justify-center transform transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <svg width={size + 120} height={size + 80} className="overflow-visible">
          <g transform={`translate(60, 40)`}>
            {/* 배경 격자 5각형들 */}
            {backgroundPentagons.map((points, index) => (
              <polygon
                key={index}
                points={points}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
                opacity={isVisible ? 1 : 0}
                style={{
                  transition: `opacity 0.5s ease-in-out ${0.3 + index * 0.1}s`,
                }}
              />
            ))}

            {/* 축선들 */}
            {axisLines.map((line, index) => (
              <line
                key={index}
                x1={line.start.x}
                y1={line.start.y}
                x2={line.end.x}
                y2={line.end.y}
                stroke="#e5e7eb"
                strokeWidth="1"
                opacity={isVisible ? 1 : 0}
                style={{
                  transition: `opacity 0.5s ease-in-out ${0.4 + index * 0.05}s`,
                }}
              />
            ))}

            {/* 데이터 5각형 */}
            <polygon
              points={dataPolygon}
              fill="rgba(59, 130, 246, 0.2)"
              stroke="#3b82f6"
              strokeWidth="2"
              opacity={isVisible ? 1 : 0}
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.2))',
                transition: 'opacity 0.8s ease-in-out 0.7s',
              }}
            />

            {/* 데이터 포인트들 */}
            {dataPoints.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={specData[index].colorHex}
                opacity={isVisible ? 1 : 0}
                style={{
                  filter: `drop-shadow(0 2px 4px ${specData[index].colorHex}40)`,
                  transition: `opacity 0.4s ease-in-out ${1.0 + index * 0.1}s`,
                  transformOrigin: `${point.x}px ${point.y}px`,
                }}
              />
            ))}

            {/* 카테고리 라벨들 (아이콘 포함) */}
            {labelPositions.map((pos, index) => {
              const IconComponent = specData[index].icon;
              // 각 위치별로 아이콘과 텍스트 배치 조정
              let textAnchor = 'middle';
              let iconX = pos.x;
              let textX = pos.x;
              let iconY = pos.y;
              let textY = pos.y;

              if (index === 0) {
                // 상단 (12시)
                iconY = pos.y + 10;
                textY = pos.y - 15;
                textX = pos.x - 25;
                textAnchor = '';
              } else if (index === 1) {
                // 우측 상단 (2시)
                iconX = pos.x - 15;
                textX = pos.x + 50;
                textAnchor = 'end';
              } else if (index === 2) {
                // 우측 하단 (4시)
                iconX = pos.x - 10;
                iconY = pos.y - 5;
                textX = pos.x + 15;
                textY = pos.y + 25;
                textAnchor = 'end';
              } else if (index === 3) {
                // 좌측 하단 (8시)
                iconX = pos.x + 10;
                iconY = pos.y - 5;
                textX = pos.x - 20;
                textY = pos.y + 25;
                textAnchor = 'start';
              } else if (index === 4) {
                // 좌측 상단 (10시)
                iconX = pos.x + 15;
                textX = pos.x - 50;
                textAnchor = 'start';
              }

              return (
                <g key={index}>
                  {/* 아이콘 배경 */}
                  <circle
                    cx={iconX}
                    cy={iconY}
                    r="14"
                    fill={specData[index].colorHex}
                    opacity={isVisible ? 0.15 : 0}
                    style={{
                      transition: `opacity 0.5s ease-in-out ${1.2 + index * 0.1}s`,
                    }}
                  />
                  {/* 아이콘 */}
                  <foreignObject
                    x={iconX - 8}
                    y={iconY - 8}
                    width="16"
                    height="16"
                    opacity={isVisible ? 1 : 0}
                    style={{
                      transition: `opacity 0.5s ease-in-out ${1.2 + index * 0.1}s`,
                    }}
                  >
                    <IconComponent
                      size={16}
                      style={{ color: specData[index].colorHex }}
                    />
                  </foreignObject>
                  {/* 카테고리 텍스트 */}
                  <text
                    x={textX}
                    y={textY}
                    textAnchor={textAnchor}
                    dominantBaseline="middle"
                    className="text-sm font-semibold"
                    fill={specData[index].colorHex}
                    opacity={isVisible ? 1 : 0}
                    style={{
                      transition: `opacity 0.5s ease-in-out ${1.2 + index * 0.1}s`,
                    }}
                  >
                    {specData[index].category}
                  </text>
                </g>
              );
            })}

            {/* 점수 표시 */}
            {dataPoints.map((point, index) => (
              <text
                key={index}
                x={point.x}
                y={point.y - 8}
                textAnchor="middle"
                className="text-xs font-bold"
                fill={specData[index].colorHex}
                opacity={isVisible ? 1 : 0}
                style={{
                  transition: `opacity 0.4s ease-in-out ${1.5 + index * 0.1}s`,
                }}
              >
                {animatedScores[index]}
              </text>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default RadarChart;
