import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Star,
  UserRoundPen,
  ScrollText,
  Shield,
  LogOut,
} from 'lucide-react';

const MenuItem = ({
  icon: Icon,
  title,
  description,
  onClick,
  iconColor = 'blue',
  rightElement,
  disabled = false,
}) => (
  <div
    className={`flex items-center justify-between p-4 border-b ${
      disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer hover:bg-gray-50'
    }`}
    onClick={disabled ? undefined : onClick}
  >
    <div className="flex items-center">
      <div
        className={`flex items-center justify-center w-8 h-8 mr-3 bg-${iconColor}-100 rounded-full`}
      >
        <Icon size={18} className={`text-${iconColor}-500`} />
      </div>
      <div>
        <span
          className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-800'}`}
        >
          {title}
        </span>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    {rightElement || <ChevronRight size={20} className="text-gray-400" />}
  </div>
);

const ToggleSwitch = ({ isChecked, onChange, disabled = false }) => (
  <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out">
    <input
      type="checkbox"
      id="toggle"
      className="w-0 h-0 opacity-0"
      checked={isChecked}
      onChange={disabled ? undefined : onChange}
      disabled={disabled}
    />
    <label
      htmlFor="toggle"
      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full ${
        disabled
          ? 'bg-gray-200 cursor-not-allowed'
          : isChecked
            ? 'bg-green-500'
            : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute bottom-1 bg-white w-3 h-3 rounded-full transition-transform duration-200 ease-in-out ${
          isChecked ? 'transform translate-x-6' : 'translate-x-1'
        }`}
      ></span>
    </label>
  </div>
);

const MenuList = ({
  isPublic,
  onTogglePublic,
  onShowWithdrawModal,
  hasSpec = false,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="px-4">
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          <MenuItem
            icon={Shield}
            title="스펙 정보 공개 설정"
            description={
              hasSpec
                ? '소셜 페이지 공개 여부를 결정합니다.'
                : '스펙 정보가 없어 설정할 수 없습니다.'
            }
            rightElement={
              <ToggleSwitch
                isChecked={isPublic}
                onChange={onTogglePublic}
                disabled={!hasSpec}
              />
            }
          />
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          <MenuItem
            icon={UserRoundPen}
            title="회원정보 관리"
            description="닉네임, 이미지 등 개인정보를 관리합니다."
            onClick={() => navigate('/edit-profile')}
          />

          <MenuItem
            icon={ScrollText}
            title="스펙 정보 관리"
            description="나의 스펙 정보를 등록 및 수정합니다."
            onClick={() => navigate('/spec-input')}
          />

          <MenuItem
            icon={Star}
            title="즐겨찾기"
            description="저장한 다른 사용자들의 스펙 정보를 확인합니다."
            onClick={() => navigate('/bookmark')}
          />
        </div>
      </div>

      {/* <div className="px-4 mt-4">
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          <MenuItem
            icon={LogOut}
            title="회원 탈퇴"
            description="계정을 영구적으로 삭제합니다."
            onClick={onShowWithdrawModal}
            iconColor="red"
          />
        </div>
      </div> */}
    </>
  );
};

export default MenuList;
