import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircleQuestion } from 'lucide-react';

const SpecInputPrompt = ({ userData }) => (
  <div className="p-5 mb-4 transition-all bg-white rounded-lg shadow-md hover:shadow-lg">
    <div className="flex items-center space-x-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50">
        <MessageCircleQuestion size={32} className="text-blue-500" />
      </div>
      <div>
        <h2 className="text-lg font-bold">
          안녕하세요,{' '}
          <span className="text-blue-500">{userData?.nickname}</span>님
        </h2>
        <p className="text-sm text-gray-700">
          스펙 정보를 입력하고 순위를 확인해보세요!
        </p>
        <Link
          to="/spec-input"
          className="inline-block px-5 py-2 mt-3 text-sm font-medium text-white transition-all bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          스펙 입력하기
        </Link>
      </div>
    </div>
  </div>
);

export default SpecInputPrompt;
