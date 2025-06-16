import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const PrivacyDetailModal = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    terms: false,
    privacy: false,
    thirdParty: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-[390px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">개인정보 처리방침</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {/* 이용약관 */}
          <div className="mb-4 border rounded-lg">
            <div className="flex items-center justify-between p-3 bg-gray-50">
              <span className="font-medium text-gray-900">
                스펙랭킹 이용약관
              </span>
              <button
                onClick={() => toggleSection('terms')}
                className="p-1 ml-2 rounded hover:bg-gray-200"
              >
                {expandedSections.terms ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>

            {expandedSections.terms && (
              <div className="p-3 overflow-y-auto text-sm text-gray-700 border-t max-h-60">
                <div className="space-y-2">
                  <p>
                    <strong>제1조 (목적)</strong>
                    <br />본 약관은 스펙랭킹(이하 "서비스")의 이용과 관련하여
                    회사와 회원 간의 권리·의무 및 책임사항을 규정함을 목적으로
                    합니다.
                  </p>

                  <p>
                    <strong>제2조 (정의)</strong>
                    <br />
                    • "회원"이란 본 서비스에 카카오 계정을 통해 로그인하여 본
                    약관에 동의하고 개인정보를 제공한 자를 의미합니다.
                    <br />• "스펙"이란 회원이 입력한 학력, 전공, 자격증,
                    대외활동, 인턴 및 경력 정보 등을 의미합니다.
                  </p>

                  <p>
                    <strong>제3조 (이용 계약의 성립)</strong>
                    <br />• 본 서비스는 카카오 로그인 방식으로 가입되며, 회원은
                    가입 시 본 약관과 개인정보 수집 및 이용에 동의해야 합니다.
                  </p>

                  <p>
                    <strong>제4조 (서비스의 내용)</strong>
                    <br />• 본 서비스는 사용자가 제공한 스펙 데이터를 기반으로
                    분석·순위화된 정보를 제공합니다.
                  </p>

                  <p>
                    <strong>제5조 (회원의 의무)</strong>
                    <br />
                    • 회원은 본인이 허위 정보를 입력하거나 타인의 정보를
                    도용해서는 안됩니다.
                    <br />• 회원은 본인의 스펙 정보가 제3자에게 제공될 수 있음에
                    동의해야 하며, 동의하지 않을 경우 서비스 일부 이용이 제한될
                    수 있습니다.
                  </p>

                  <p>
                    <strong>제6조 (서비스의 변경 및 중단)</strong>
                    <br />• 서비스는 내부 사정 또는 기술적 문제에 따라
                    변경되거나 일시 중단될 수 있습니다.
                  </p>

                  <p>
                    <strong>제7조 (책임의 제한)</strong>
                    <br />• 회사는 회원이 제공한 정보의 진위성에 대해 책임지지
                    않으며, 분석 결과의 해석은 회원의 판단에 따릅니다.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 개인정보 수집·이용 동의 */}
          <div className="mb-4 border rounded-lg">
            <div className="flex items-center justify-between p-3 bg-gray-50">
              <span className="font-medium text-gray-900">
                개인정보 수집·이용 동의
              </span>
              <button
                onClick={() => toggleSection('privacy')}
                className="p-1 ml-2 rounded hover:bg-gray-200"
              >
                {expandedSections.privacy ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>

            {expandedSections.privacy && (
              <div className="p-3 overflow-y-auto text-sm text-gray-700 border-t max-h-60">
                <div className="space-y-2">
                  <p>
                    <strong>1. 수집하는 개인정보 항목</strong>
                    <br />
                    • 로그인 시 수집: 카카오 사용자 고유 ID, 닉네임
                    <br />• 사용자 직접 입력 정보: 이름, 학교, 전공, 학점,
                    자격증, 대외활동, 경력 및 경험 등 스펙 정보
                  </p>

                  <p>
                    <strong>2. 수집 목적</strong>
                    <br />
                    • 스펙 분석 및 순위 제공 서비스 제공
                    <br />• 통계 분석, 서비스 개선을 위한 참고 자료
                  </p>

                  <p>
                    <strong>3. 보유 및 이용 기간</strong>
                    <br />
                    • 회원 탈퇴 시까지 또는 수집 동의 철회 시까지
                    <br />• 단, 관련 법령에 따라 일정 기간 보관이 필요한 경우
                    해당 기간 동안 보관
                  </p>

                  <p>
                    <strong>4. 동의 거부권 및 불이익</strong>
                    <br />• 이용자는 개인정보 제공에 대해 동의하지 않을 수
                    있습니다. 단, 동의하지 않을 경우 서비스 이용에 제한이 있을
                    수 있습니다.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 제3자 제공 동의 */}
          <div className="mb-4 border rounded-lg">
            <div className="flex items-center justify-between p-3 bg-gray-50">
              <span className="font-medium text-gray-900">
                개인정보 제3자 제공 동의
              </span>
              <button
                onClick={() => toggleSection('thirdParty')}
                className="p-1 ml-2 rounded hover:bg-gray-200"
              >
                {expandedSections.thirdParty ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>

            {expandedSections.thirdParty && (
              <div className="p-3 overflow-y-auto text-sm text-gray-700 border-t max-h-60">
                <div className="space-y-2">
                  <p>
                    <strong>1. 제공받는 자</strong>
                    <br />• <strong>스펙랭킹 서비스 내 다른 사용자</strong>
                    <br />※ 단, 사용자 간 열람 범위는 서비스 내 정책 및 동의
                    범위에 따라 제한될 수 있습니다.
                  </p>

                  <p>
                    <strong>2. 제공 항목</strong>
                    <br />• 이름, 학교, 전공, 학점, 자격증, 경력, 대외활동 등
                    회원이 직접 입력한 스펙 정보 중 일부 또는 전체
                  </p>

                  <p>
                    <strong>3. 제공 목적</strong>
                    <br />
                    • 사용자 간 스펙 공유를 통한 비교 및 매칭
                    <br />
                    • 취업·인턴 연계 및 스펙 기반 커뮤니티 활성화
                    <br />• 사용자 관심사 기반의 교육 및 채용 정보 추천
                  </p>

                  <p>
                    <strong>4. 보유 및 이용 기간</strong>
                    <br />
                    • 동의일로부터 1년 또는 회원 탈퇴 시까지 보유 및 이용
                    <br />• 단, 관계 법령에 의해 보존이 필요한 경우 해당 기간
                    동안 보관
                  </p>

                  <p>
                    <strong>5. 동의 거부 시 불이익</strong>
                    <br />• 동의를 거부할 수 있으며, 이 경우{' '}
                    <strong>
                      다른 사용자와의 스펙 비교, 채용 추천 등 일부 기능 이용이
                      제한
                    </strong>
                    될 수 있습니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyDetailModal;
