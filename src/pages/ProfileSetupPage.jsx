import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

const ProfileSetupPage = () => {
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 타입 검증
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setFileError('PNG 또는 JPG 형식의 이미지만 업로드 가능합니다.');
        return;
      }
      
      // 파일 크기 검증 (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setFileError('이미지 크기는 10MB 이하여야 합니다.');
        return;
      }
      
      setFileError('');
      setProfileImage(file);

      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // 닉네임 유효성 검사 함수
  const validateNickname = (value) => {
    // 닉네임이 비어있는 경우
    if (!value) {
      setNicknameError('닉네임을 입력해주세요.');
      return false;
    }
    
    // 닉네임 길이 검사 (2-11자)
    if (value.length < 2) {
      setNicknameError('닉네임은 최소 2자 이상이어야 합니다.');
      return false;
    }
    
    if (value.length > 11) {
      setNicknameError('닉네임은 최대 11자까지 가능합니다.');
      return false;
    }
    
    // 영문, 숫자, 한글만 허용하는 정규식
    const nicknameRegex = /^[a-zA-Z0-9가-힣]+$/;
    if (!nicknameRegex.test(value)) {
      setNicknameError('닉네임은 영문, 숫자, 한글만 입력 가능합니다.');
      return false;
    }
    
    // 모든 검사 통과
    setNicknameError('');
    return true;
  };

  // 닉네임 입력 핸들러
  const handleNicknameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 11) {
      setNickname(value);
      validateNickname(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 제출 전 닉네임 최종 검증
    if (!validateNickname(nickname)) {
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('nickname', nickname);

      // 쿠키에서 loginId 읽기
      const getCookie = (name) =>
        document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];

      let loginId = getCookie("TempLoginId");

      if (loginId) {
        loginId = loginId.replace('_', ' ');
      }

      formData.append('loginId', loginId);

      // 프로필 이미지가 있으면 추가
      if (profileImage) {
        formData.append('userProfileUrl', profileImage);
      }
      
      // 사용자 생성 요청 (이미지 업로드 포함)
      const response = await axiosInstance.post('/api/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // 성공 시 메인 페이지로 이동
      login(response.data);
      navigate('/');
      
    } catch (error) {
      // 서버에서 받은 오류 메시지 처리
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 409) {
          setNicknameError(data.message || '이미 사용 중인 닉네임입니다.');
          setError('');
        } else if (status === 415) {
          setFileError('PNG 또는 JPG 형식만 업로드 가능합니다.');
          setError('');
        } else if (status === 413) {
          setFileError('10MB 이하의 이미지만 업로드 가능합니다.');
          setError('');
        } else {
          setError('회원가입 중 오류가 발생했습니다.');
        }
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
          {fileError &&
            <p className="mt-2 text-xs text-red-500">{fileError}</p>
          }
        </div>
        
        <div>
          <label htmlFor="nickname" className="block mb-1 text-sm font-medium text-gray-700">
            닉네임 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="nickname"
              type="text"
              placeholder="다른 사용자에게 나타낼 이름"
              className={`w-full px-4 py-3 border rounded-md ${
                nicknameError 
                  ? 'focus:outline-none focus:ring-2 focus:ring-red-500' 
                  : 'focus:outline-none focus:ring-2 focus:ring-indigo-500'
              }`}
              maxLength={11}
              value={nickname}
              onChange={handleNicknameChange}
              required
            />
          </div>
          {nicknameError ? (
            <p className="mt-2 text-xs text-red-500">{nicknameError}</p>
          ) : (
            <p className="mt-2 text-xs text-gray-500">
              닉네임은 영문, 숫자, 한글만 입력 가능합니다. (2-11자)
            </p>
          )}
        </div>
        
        {error && (
          <div className="mt-2 text-sm text-red-500">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className={`flex items-center justify-center w-full py-3 text-white transition-colors rounded-md ${
            nickname && !nicknameError 
              ? 'bg-indigo-600 hover:bg-indigo-700' 
              : 'bg-indigo-400 cursor-not-allowed'
          }`}
          disabled={!nickname || nicknameError}
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