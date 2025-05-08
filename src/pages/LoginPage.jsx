import React from 'react';

const LoginPage = () => {
    return (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md p-8 my-8 space-y-8 bg-white rounded-lg shadow">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full">
                  <svg className="w-10 h-10 text-indigo-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.5L17 9v6l-5 3-5-3V9l5-3.5z" />
                    <path d="M12 7l-1 5 3 2 3-4-5-3zm0 2l2 1-1 1-1-2z" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-indigo-700">스펙랭킹</h2>
              <p className="mt-2 text-sm text-gray-600">
                취업 준비의 모든 것, 당신의 커리어를 한 단계 더 높이세요
              </p>
            </div>
            
            <div className="mt-10">
              <button
                className="flex items-center justify-center w-full px-4 py-3 text-black transition-colors bg-yellow-400 rounded-md hover:bg-yellow-500"
                onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/kakao'}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.48 3 2 6.48 2 12c0 5.51 4.48 10 10 10s10-4.49 10-10c0-5.52-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <path d="M13 7h-2v6h2V7zm0 8h-2v2h2v-2z"/>
                </svg>
                카카오 계정으로 로그인
              </button>
              
              <p className="mt-8 text-sm text-center text-gray-600">
                아직 회원이 아니신가요? 로그인 시 자동 회원가입됩니다.
              </p>
            </div>
          </div>
        </div>
      );
};

export default LoginPage;