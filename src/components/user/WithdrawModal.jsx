import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../common/Modal';

const WithdrawModal = ({ isOpen, onClose, onWithdraw }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="회원 탈퇴"
      icon={AlertTriangle}
      iconColor="red"
      message="회원 탈퇴 시 모든 개인정보와 활동 내역이 삭제되며, 이 작업은 되돌릴 수 없습니다."
      primaryButtonText="예, 탈퇴합니다"
      secondaryButtonText="아니오"
      onPrimaryButtonClick={onWithdraw}
      onSecondaryButtonClick={onClose}
      primaryButtonColor="red"
    />
  );
};

export default WithdrawModal; 