import React from 'react';
import { Upload } from 'lucide-react';

const ProfileImageUpload = ({ 
  previewUrl, 
  onImageChange, 
  fileError, 
  buttonText = "프로필 이미지 선택",
  isEdit = false 
}) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        onImageChange(null, 'PNG 또는 JPG 형식의 이미지만 업로드 가능합니다.');
        return;
      }
      
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        onImageChange(null, '이미지 크기는 10MB 이하여야 합니다.');
        return;
      }
      
      const fileReader = new FileReader();
      fileReader.onload = () => {
        onImageChange(file, '', fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('profile-image').click();
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div 
        className="flex items-center justify-center w-32 h-32 mb-2 overflow-hidden bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={triggerFileInput}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="프로필 미리보기" className="object-cover w-full h-full" />
        ) : (
          <Upload className="w-10 h-10 text-gray-400" />
        )}
      </div>
      
      <input
        id="profile-image"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
      
      <button
        type="button"
        onClick={triggerFileInput}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        {buttonText} {isEdit ? '' : '(선택사항)'}
      </button>
      
      {fileError && (
        <p className="mt-2 text-xs text-red-500">{fileError}</p>
      )}
    </div>
  );
};

export default ProfileImageUpload;