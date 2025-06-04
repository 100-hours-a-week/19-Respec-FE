import React from 'react';
import { GraduationCap, Briefcase, Award, BookOpen, Users } from 'lucide-react';

const SpecBars = ({ animatedScores, aiTitle, aiIcon }) => {
  const specData = [
    { category: '학력', icon: GraduationCap, colorHex: '#3b82f6' },
    { category: '경험', icon: Briefcase, colorHex: '#8b5cf6' },
    { category: '자격증', icon: Award, colorHex: '#10b981' },
    { category: '어학', icon: BookOpen, colorHex: '#f59e0b' },
    { category: '활동', icon: Users, colorHex: '#ef4444' },
  ];

  return (
    <div className="space-y-3">
      {/* AI 타이틀/아이콘 줄 */}
      {aiTitle && (
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            {aiIcon}
          </div>
          <h4 className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            {aiTitle}
          </h4>
        </div>
      )}
      {specData.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div
            key={index}
            className="flex items-center space-x-3 opacity-0 animate-slide-up"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'forwards',
            }}
          >
            <IconComponent size={16} style={{ color: item.colorHex }} />
            <div className="w-12 text-xs font-medium text-gray-600">
              {item.category}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${animatedScores[index]}%`,
                  backgroundColor: item.colorHex,
                }}
              />
            </div>
            <div
              className="w-8 text-xs font-bold"
              style={{ color: item.colorHex }}
            >
              {animatedScores[index]}
            </div>
          </div>
        );
      })}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SpecBars;
