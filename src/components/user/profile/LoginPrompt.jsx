import React from 'react';
import { Link } from 'react-router-dom';

const LoginPrompt = () => (
  <div className="relative p-6 mb-4 overflow-hidden bg-white rounded-lg shadow-md">
    <div className="pointer-events-none blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="#f1f5f9"
                stroke="#e2e8f0"
                strokeWidth="2"
              />
              <path
                d="M50 5 A45 45 0 0 1 95 50"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="20"
                fontWeight="bold"
                fill="#3b82f6"
              >
                --
              </text>
              <text
                x="50"
                y="65"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill="#94a3b8"
              >
                상위 %
              </text>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold">로그인이 필요합니다</h2>
            <div className="w-full h-2 max-w-xs mt-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: '0%' }}
              ></div>
            </div>
            <p className="mt-1 text-sm text-gray-500">---</p>
          </div>
        </div>
      </div>
    </div>

    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
      <Link
        to="/login"
        className="px-6 py-2.5 text-white transition-all duration-200 bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        로그인하여 내 정보 확인하기
      </Link>
    </div>
  </div>
);

export default LoginPrompt;
