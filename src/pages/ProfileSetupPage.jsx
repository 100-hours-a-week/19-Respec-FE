import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProfileImageUpload from '../components/user/ProfileImageUpload';
import NicknameInput from '../components/user/NicknameInput';
import useToast from '../hooks/useToast';
import ToastContainer from '../components/common/ToastContainer';
import { UserAPI } from '../api';
import { useAuthStore } from '../stores/useAuthStore';
import { setAccessToken } from '../utils/token';
import { getCookie, deleteCookie } from '../utils/cookie';

const ProfileSetupPage = () => {
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { toasts, showToast, removeToast } = useToast();

  const handleImageChange = (file, error, preview) => {
    setFileError(error);
    if (!error) {
      setProfileImage(file);
      setPreviewUrl(preview || '');
    }
  };

  const handleNicknameChange = (value, error) => {
    setNickname(value);
    setNicknameError(error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nicknameError) {
      showToast('입력한 정보를 다시 확인해주세요.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('nickname', nickname);

      let loginId = getCookie('TempLoginId');
      if (loginId) {
        loginId = loginId.replace('_', ' ');
      }
      formData.append('loginId', loginId);

      if (profileImage) {
        formData.append('userProfileUrl', profileImage);
      }

      const response = await UserAPI.signup(formData);

      const accessToken = getCookie('access');
      if (accessToken && response.data) {
        setAccessToken(accessToken);
        deleteCookie('access');
        console.log(response.data.message, response.data.data);
        login(response.data.data, accessToken);
        showToast('회원가입이 완료되었습니다!', 'success');

        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 409) {
          setNicknameError(data.message || '이미 사용 중인 닉네임입니다.');
          showToast('이미 사용 중인 닉네임입니다.', 'error');
        } else if (status === 415) {
          setFileError('PNG 또는 JPG 형식만 업로드 가능합니다.');
          showToast('지원하지 않는 파일 형식입니다.', 'error');
        } else if (status === 413) {
          setFileError('10MB 이하의 이미지만 업로드 가능합니다.');
          showToast('파일 크기가 너무 큽니다.', 'error');
        } else {
          setError('회원가입 중 오류가 발생했습니다.');
          showToast('회원가입에 실패했습니다.', 'error');
        }
      } else {
        setError('서버 연결에 실패했습니다.');
        showToast('서버 연결에 실패했습니다.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <ProfileImageUpload
            previewUrl={previewUrl}
            onImageChange={handleImageChange}
            fileError={fileError}
            buttonText="프로필 이미지 선택"
            isEdit={false}
          />

          <NicknameInput
            nickname={nickname}
            onChange={handleNicknameChange}
            error={nicknameError}
            placeholder="다른 사용자에게 나타낼 이름"
            required={true}
          />

          <button
            type="submit"
            className={`flex items-center justify-center w-full py-3 text-white transition-colors rounded-md ${
              nickname && !nicknameError && !isLoading
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-indigo-400 cursor-not-allowed'
            }`}
            disabled={!nickname || nicknameError || isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                가입 중...
              </>
            ) : (
              <>
                가입하기
                <ChevronRight size={20} className="ml-1" />
              </>
            )}
          </button>
        </form>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default ProfileSetupPage;
