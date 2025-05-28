import React, { useState } from 'react';
import TopBar from "../components/common/TopBar";
import BottomNavBar from "../components/common/BottomNavBar";


const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col">
        {/* Container limited to 390px width */}
        <div className="w-full max-w-[390px] mx-auto flex flex-col flex-1 bg-white relative">
          <TopBar title="회원가입" />
          
          <div className="flex-1 p-5">
            <div className="flex flex-col items-center mb-10">
              <div className="w-32 h-32 bg-gray-100 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm text-gray-700">프로필 이미지 선택 (선택사항)</p>
            </div>
            
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="이메일을 입력하세요"
                    className="flex-1 border border-gray-300 rounded-l-md p-3 text-sm focus:outline-none"
                  />
                  <button 
                    type="button" 
                    className="bg-blue-500 text-white px-6 rounded-r-md text-sm font-medium"
                  >
                    인증
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  닉네임 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="다른 사용자에게 표시될 이름"
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="8자 이상, 영문, 숫자, 특수문자 포함"
                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    placeholder="비밀번호 재입력"
                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="bg-blue-500 text-white w-full py-3 rounded-md flex items-center justify-center mt-6"
              >
                가입하기
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </form>
            
            <div className="text-center mt-4 mb-8">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요? <a href="/login" className="text-blue-500">로그인</a>
              </p>
            </div>
          </div>
          
          <BottomNavBar active="login" />
        </div>
      </div>
    );
  };
  
  export default SignupPage;