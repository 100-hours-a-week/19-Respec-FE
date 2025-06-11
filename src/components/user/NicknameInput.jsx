import React from 'react';

const NicknameInput = ({ 
  nickname, 
  onChange, 
  error, 
  placeholder = "다른 사용자에게 나타낼 이름",
  required = true 
}) => {
  const validateNickname = (value) => {
    if (!value) {
      return '닉네임을 입력해주세요.';
    }
    
    if (value.length < 2) {
      return '닉네임은 최소 2자 이상이어야 합니다.';
    }
    
    if (value.length > 11) {
      return '닉네임은 최대 11자까지 가능합니다.';
    }
    
    const nicknameRegex = /^[a-zA-Z0-9가-힣]+$/;
    if (!nicknameRegex.test(value)) {
      return '닉네임은 영문, 숫자, 한글만 입력 가능합니다.';
    }
    
    return '';
  };

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 11) {
      const validationError = validateNickname(value);
      onChange(value, validationError);
    }
  };

  return (
    <div>
      <label htmlFor="nickname" className="block mb-1 text-sm font-medium text-gray-700">
        닉네임 {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          id="nickname"
          type="text"
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-md ${
            error 
              ? 'border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500' 
              : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          }`}
          maxLength={11}
          value={nickname}
          onChange={handleNicknameChange}
          required={required}
        />
      </div>
      {error ? (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      ) : (
        <p className="mt-2 text-xs text-gray-500">
          닉네임은 영문, 숫자, 한글만 입력 가능합니다. (2-11자)
        </p>
      )}
    </div>
  );
};

export default NicknameInput;