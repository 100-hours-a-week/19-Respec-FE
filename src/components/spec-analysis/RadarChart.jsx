import React from 'react';
import { GraduationCap, Briefcase, Award, BookOpen, Users } from 'lucide-react';

const RadarChart = ({ animatedScores, isAnalyzing }) => {
  if (!animatedScores) {
    return (
      <div className="py-8 text-center text-gray-500">
        스펙 정보를 입력하고
        <br />
        AI 분석 결과를 확인해보세요.
      </div>
    );
  }

  const specData = [
    { category: '학력', score: 0, icon: GraduationCap, colorHex: '#3b82f6' },
    { category: '경험', score: 0, icon: Briefcase, colorHex: '#8b5cf6' },
    { category: '자격증', score: 0, icon: Award, colorHex: '#10b981' },
    { category: '어학', score: 0, icon: BookOpen, colorHex: '#f59e0b' },
    { category: '활동', score: 0, icon: Users, colorHex: '#ef4444' },
  ];

  const size = 180;
  const center = size / 2;
  const maxRadius = 60;

  const points = specData.map((item, index) => {
    const angle = (index * 72 - 90) * (Math.PI / 180);
    const radius = (animatedScores[index] / 100) * maxRadius;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      maxX: center + Math.cos(angle) * maxRadius,
      maxY: center + Math.sin(angle) * maxRadius,
      labelX: center + Math.cos(angle) * (maxRadius + 20),
      labelY: center + Math.sin(angle) * (maxRadius + 20),
      ...item,
      animatedScore: animatedScores[index],
    };
  });

  const pathD =
    points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ') + ' Z';

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg width="180" height="180" className="absolute inset-0">
        <defs>
          <radialGradient id="radarFill">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 배경 그리드 */}
        {[25, 40, 60].map((radius) => {
          const gridPoints = specData.map((_, i) => {
            const angle = (i * 72 - 90) * (Math.PI / 180);
            return {
              x: center + Math.cos(angle) * radius,
              y: center + Math.sin(angle) * radius,
            };
          });
          const gridPath =
            gridPoints
              .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
              .join(' ') + ' Z';

          return (
            <path
              key={radius}
              d={gridPath}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}

        {/* 축선 */}
        {points.map((point, index) => (
          <line
            key={index}
            x1={center}
            y1={center}
            x2={point.maxX}
            y2={point.maxY}
            stroke="#e5e7eb"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}

        {/* 데이터 영역 */}
        <path
          d={pathD}
          fill="url(#radarFill)"
          stroke="#3b82f6"
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* 포인트 */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill={point.colorHex}
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>

      {/* 라벨 */}
      {points.map((point, index) => {
        const IconComponent = point.icon;
        return (
          <div
            key={index}
            className="absolute text-xs font-medium transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: point.labelX, top: point.labelY }}
          >
            <div className="px-2 py-1 text-center bg-white border rounded-lg shadow-sm">
              <div className="flex items-center justify-center mb-1">
                <IconComponent size={10} style={{ color: point.colorHex }} />
              </div>
              <div className="text-xs text-gray-600">{point.category}</div>
              <div
                className="text-xs font-bold"
                style={{ color: point.colorHex }}
              >
                {point.animatedScore}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RadarChart;
