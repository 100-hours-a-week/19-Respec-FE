import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Save } from 'lucide-react';
import ProfileImageUpload from '../components/user/ProfileImageUpload';
import NicknameInput from '../components/user/NicknameInput';
import useToast from '../hooks/useToast';
import ToastContainer from '../components/common/ToastContainer';
import Modal from '../components/common/Modal';
import { UserAPI } from '../api';
import { useAuthStore } from '../stores/useAuthStore';

const ProfileEditPage = () => {
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [originalProfileUrl, setOriginalProfileUrl] = useState('');
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '');
      setOriginalProfileUrl(user.profileImageUrl || '');
      setPreviewUrl(user.profileImageUrl || '');
    }
  }, [user]);

  useEffect(() => {
    const nicknameChanged = nickname !== (user?.nickname || '');
    const imageChanged = profileImage !== null;
    setIsChanged(nicknameChanged || imageChanged);
  }, [nickname, profileImage, user]);

  const handleImageChange = (file, error, preview) => {
    setFileError(error);
    if (!error) {
      setProfileImage(file);
      setPreviewUrl(preview || originalProfileUrl);
    }
  };

  const handleNicknameChange = (value, error) => {
    setNickname(value);
    setNicknameError(error);
  };

  const handleBack = () => {
    if (isChanged) {
      setShowCancelModal(true);
    } else {
      navigate(-1);
    }
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    navigate(-1);
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (nicknameError) {
      showToast('입력한 정보를 다시 확인해주세요.', 'error');
      return;
    }

    if (!isChanged) {
      showToast('변경된 정보가 없습니다.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('nickname', nickname);

      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      // const response = await UserAPI.updateProfile(formData);

      // 임시 성공 처리 (실제 구현 시 제거)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedUser = {
        ...user,
        nickname,
        profileImageUrl: previewUrl,
      };
      updateUser(updatedUser);

      showToast('회원정보가 수정되었습니다.', 'success');

      setTimeout(() => {
        navigate(-1);
      }, 2000);
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
          setError('회원정보 수정 중 오류가 발생했습니다.');
          showToast('회원정보 수정에 실패했습니다.', 'error');
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
        <form onSubmit={handleSave} className="space-y-6">
          <ProfileImageUpload
            previewUrl={previewUrl}
            onImageChange={handleImageChange}
            fileError={fileError}
            buttonText="프로필 이미지 변경하기"
            isEdit={true}
          />

          <NicknameInput
            nickname={nickname}
            onChange={handleNicknameChange}
            error={nicknameError}
            placeholder="다른 사용자에게 나타낼 이름"
            required={true}
          />

          <div className="space-y-3">
            <button
              type="submit"
              className={`flex items-center justify-center w-full py-3 text-white transition-colors rounded-md ${
                isChanged && !nicknameError && !isLoading
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!isChanged || nicknameError || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                  저장 중...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  변경사항 저장
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="w-full py-3 text-gray-600 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              취소
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={showCancelModal}
        onClose={handleCancelModalClose}
        title="정말 나가시겠습니까?"
        icon={AlertTriangle}
        iconColor="red"
        message="나갈 시 변경사항은 저장되지 않습니다."
        primaryButtonText="나가기"
        secondaryButtonText="계속 수정"
        onPrimaryButtonClick={handleCancelConfirm}
        onSecondaryButtonClick={handleCancelModalClose}
        primaryButtonColor="red"
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default ProfileEditPage;
