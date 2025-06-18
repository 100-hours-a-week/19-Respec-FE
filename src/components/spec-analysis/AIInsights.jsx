import React from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';

const AIInsights = ({ assessment }) => {
  if (!assessment) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4 space-x-3">
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
          <Sparkles size={15} className="text-white" />
        </div>
        <h4 className="font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
          AI 맞춤 개선방안
        </h4>
      </div>

      <div
        className="p-4 border border-blue-100 rounded-lg opacity-0 bg-gradient-to-r from-blue-50 to-purple-50 animate-fade-in"
        style={{ animationFillMode: 'forwards' }}
      >
        <div className="flex items-start space-x-3">
          <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-600 bg-blue-100 rounded-full">
            <TrendingUp size={14} />
          </div>
          <div className="flex-1">
            <p className="text-sm leading-relaxed text-gray-700">
              {assessment}
            </p>
          </div>
        </div>
      </div>

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
