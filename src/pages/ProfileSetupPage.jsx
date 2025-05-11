import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

const ProfileSetupPage = () => {
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nickname) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    
    try {
      // 프로필 이미지가 있는 경우 먼저 업로드
      let profileUrl = '';
      if (profileImage) {
        const formData = new FormData();
        formData.append('file', profileImage);
        
        // 쿠키는 자동으로 전송되므로 Authorization 헤더를 추가할 필요 없음
        const imageResponse = await axiosInstance.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        profileUrl = imageResponse.data.url;
      }
      
      // 쿠키에서 loginId 읽기
      const getCookie = (name) =>
        document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];

      let loginId = getCookie("TempLoginId");

      if (loginId) {
        loginId = loginId.replace('_', ' ');
      }

      // 사용자 정보 업데이트 - 쿠키는 자동으로 전송됨
      const response = await axiosInstance.post('/api/users', {
        nickname,
        userProfileUrl: profileUrl,
        loginId
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // 성공 시 메인 페이지로 이동
      login(response.data);
      navigate('/');
      
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || '회원가입 중 오류가 발생했습니다.');
      } else {
        setError('서버 연결에 실패했습니다.');
      }
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <div 
            className="flex items-center justify-center w-32 h-32 mb-2 overflow-hidden bg-gray-100 rounded-lg cursor-pointer"
            onClick={() => document.getElementById('profile-image').click()}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="프로필 미리보기" className="object-cover w-full h-full" />
            ) : (
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </div>
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <p className="text-sm text-gray-500">프로필 이미지 선택 (선택사항)</p>
        </div>
        
        <div>
          <label htmlFor="nickname" className="block mb-1 text-sm font-medium text-gray-700">
            닉네임 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="nickname"
              type="text"
              placeholder="다른 사용자에게 보이실 이름"
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>
        </div>
        
        {error && (
          <div className="mt-2 text-sm text-red-500">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="flex items-center justify-center w-full py-3 text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          가입하기
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ProfileSetupPage;