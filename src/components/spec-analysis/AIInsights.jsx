import React from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';

const AIInsights = () => {
  const insights = [
    {
      id: 1,
      text: '활동 점수(85점)가 우수하니 이를 활용한 네트워킹 확대를 추천합니다.',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Sparkles size={12} className="text-white" />
        </div>
        <h4 className="font-bold text-gray-800">AI 맞춤 개선방안</h4>
      </div>

      {insights.map((insight, index) => {
        const IconComponent = insight.icon;
        return (
          <div
            key={insight.id}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100 opacity-0 animate-fade-in"
            style={{
              animationDelay: `${index * 0.2}s`,
              animationFillMode: 'forwards',
            }}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  insight.priority === 'high'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                <IconComponent size={14} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {insight.text}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AIInsights;
