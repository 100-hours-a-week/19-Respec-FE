import React, { useState } from 'react';
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";

const SpecInputPage = () => {
  const [formData, setFormData] = useState({
    name: '젤리', // 사용자 닉네임(수정 불가)
    currentEducation: {
      level: '고등학교',
      status: '졸업'
    },
    academicBackgrounds: [], // 초기에 빈 배열로 시작 - 학교, 전공, 학위, 학점 정보
    careers: [], // 초기에 빈 배열로 시작
    certifications: [], // 초기에 빈 배열로 시작
    languages: [], // 초기에 빈 배열로 시작
    activities: [], // 초기에 빈 배열로 시작 - 활동/네트워킹
    portfolio: {
      fileName: '',
      file: null
    },
    desiredPosition: '인터넷.IT'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (mainField, subField, value) => {
    setFormData(prev => ({
      ...prev,
      [mainField]: {
        ...prev[mainField],
        [subField]: value
      }
    }));
  };

  const handleArrayInputChange = (field, index, subField, value) => {
    // 필드가 존재하고 배열인지 확인
    if (!Array.isArray(formData[field])) {
      console.error(`Field ${field} is not an array`);
      return;
    }
    
    const newArray = [...formData[field]];
    // 인덱스가 유효한지 확인
    if (index >= 0 && index < newArray.length) {
      newArray[index] = {
        ...newArray[index],
        [subField]: value
      };
      
      setFormData(prev => ({
        ...prev,
        [field]: newArray
      }));
    }
  };

  const addArrayItem = (field, template) => {
    setFormData(prev => {
      // 필드가 존재하고 배열인지 확인
      const currentField = Array.isArray(prev[field]) ? prev[field] : [];
      return {
        ...prev,
        [field]: [...currentField, {...template}]
      };
    });
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => {
      // 필드가 존재하고 배열인지 확인
      const currentField = Array.isArray(prev[field]) ? prev[field] : [];
      // 모든 항목 삭제 허용 (마지막 항목도 삭제 가능)
      return {
        ...prev,
        [field]: currentField.filter((_, i) => i !== index)
      };
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // PDF 파일 타입 확인
      if (file.type === 'application/pdf') {
        // 파일 크기 확인 (10MB 제한)
        if (file.size <= 10 * 1024 * 1024) {
          setFormData(prev => ({
            ...prev,
            portfolio: {
              fileName: file.name,
              file: file
            }
          }));
        } else {
          alert('파일 크기는 10MB 이하여야 합니다.');
        }
      } else {
        alert('PDF 파일만 업로드 가능합니다.');
      }
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // 여기에 제출 로직 추가
  };

  // 추가/삭제 버튼 컴포넌트
  const AddButton = ({ onClick }) => (
    <button 
      type="button"
      className="flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-lg" 
      onClick={onClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  );

  const RemoveButton = ({ onClick }) => (
    <button 
      type="button"
      className="flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-lg" 
      onClick={onClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full max-w-md mx-auto flex flex-col flex-1 bg-white relative pb-16">
        <TopBar title="스펙 입력" />
        
        <div className="flex-1 p-4 overflow-y-auto pb-20">
          <h2 className="text-lg font-medium mb-4 text-center text-blue-600">당신의 스펙을 입력해주세요!</h2>
          <div className="space-y-4">
            {/* 기본 정보 섹션 */}
            <div className="mb-2">
              <label className="block text-lg font-medium">
                닉네임 <span className="text-red-500">*</span><span className="text-xs text-gray-500 ml-1">(필수)</span>
              </label>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <input
                type="text"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.name}
                readOnly
              />
            </div>

            {/* 최종 학력 섹션 */}
            <div className="mb-2">
              <h3 className="text-lg font-medium">
                최종 학력 <span className="text-red-500">*</span><span className="text-xs text-gray-500 ml-1">(필수)</span>
              </h3>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.currentEducation.level}
                  onChange={(e) => handleNestedInputChange('currentEducation', 'level', e.target.value)}
                >
                  <option value="고등학교">고등학교</option>
                  <option value="전문대학교">전문대학교</option>
                  <option value="대학교">대학교</option>
                  <option value="대학원">대학원</option>
                </select>
                <select
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.currentEducation.status}
                  onChange={(e) => handleNestedInputChange('currentEducation', 'status', e.target.value)}
                >
                  <option value="졸업">졸업</option>
                  <option value="재학중">재학중</option>
                  <option value="휴학중">휴학중</option>
                </select>
              </div>
            </div>
            
            {/* 학력 정보 섹션 */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h3 className="text-lg font-medium">학력</h3>
                <span className="text-xs text-gray-500 ml-2">(국내 대학 한정입니다)</span>
              </div>
              <AddButton onClick={() => addArrayItem('academicBackgrounds', { school: '', major: '', degree: '학사', gpa: '', maxGpa: '4.3' })} />
            </div>
            {Array.isArray(formData.academicBackgrounds) && formData.academicBackgrounds.length > 0 ? (
              formData.academicBackgrounds.map((academicBackground, index) => (
                <div key={`academic-${index}`} className="bg-gray-100 p-4 rounded-lg relative mb-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">학교명</label>
                        <p className="text-xs text-gray-500 mb-1">전체 이름을 입력하세요</p>
                        <input
                          type="text"
                          className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={academicBackground.school}
                          onChange={(e) => handleArrayInputChange('academicBackgrounds', index, 'school', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">학위</label>
                        <select
                          className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-6"
                          value={academicBackground.degree}
                          onChange={(e) => handleArrayInputChange('academicBackgrounds', index, 'degree', e.target.value)}
                        >
                          <option value="학사">학사</option>
                          <option value="석사">석사</option>
                          <option value="박사">박사</option>
                          <option value="전문학사">전문학사</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">전공</label>
                        <input
                          type="text"
                          className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={academicBackground.major}
                          onChange={(e) => handleArrayInputChange('academicBackgrounds', index, 'major', e.target.value)}
                        />
                      </div>
                      <div>
                        {/* 빈 공간 */}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">학점</label>
                        <input
                          type="number"
                          step="0.1"
                          className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={academicBackground.gpa}
                          onChange={(e) => handleArrayInputChange('academicBackgrounds', index, 'gpa', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">최대 학점</label>
                        <select
                          className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={academicBackground.maxGpa}
                          onChange={(e) => handleArrayInputChange('academicBackgrounds', index, 'maxGpa', e.target.value)}
                        >
                          <option value="4.3">4.3</option>
                          <option value="4.5">4.5</option>
                          <option value="4.0">4.0</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-2 top-2">
                    <RemoveButton onClick={() => removeArrayItem('academicBackgrounds', index)} />
                  </div>
                </div>
              ))
            ) : null}

            {/* 직무경험 섹션 */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">직무경험</h3>
              <AddButton onClick={() => addArrayItem('careers', { company: '', position: '인턴', duration: '' })} />
            </div>
            {Array.isArray(formData.careers) && formData.careers.length > 0 ? (
              formData.careers.map((career, index) => (
                <div key={`career-${index}`} className="bg-gray-100 p-4 rounded-lg relative mb-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">회사명</label>
                        <input
                          type="text"
                          className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="예: 삼성 SDS"
                          value={career.company}
                          onChange={(e) => handleArrayInputChange('careers', index, 'company', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">직책</label>
                        <select
                          className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={career.position}
                          onChange={(e) => handleArrayInputChange('careers', index, 'position', e.target.value)}
                        >
                          <option value="인턴">인턴</option>
                          <option value="사원">사원</option>
                          <option value="주임">주임</option>
                          <option value="대리">대리</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">근무기간 (개월)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={career.duration}
                          onChange={(e) => handleArrayInputChange('careers', index, 'duration', e.target.value)}
                        />
                        <span className="text-xs text-gray-500">*최대 3자리까지만 입력 가능</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-2 top-2">
                    <RemoveButton onClick={() => removeArrayItem('careers', index)} />
                  </div>
                </div>
              ))
            ) : null}

            {/* 자격증 섹션 */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">자격증</h3>
              <AddButton onClick={() => addArrayItem('certifications', { name: '', type: '' })} />
            </div>
            {Array.isArray(formData.certifications) && formData.certifications.length > 0 ? (
              formData.certifications.map((cert, index) => (
                <div key={`cert-${index}`} className="bg-gray-100 p-4 rounded-lg relative mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">자격증명</label>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={cert.name}
                      onChange={(e) => handleArrayInputChange('certifications', index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="absolute right-2 top-2">
                    <RemoveButton onClick={() => removeArrayItem('certifications', index)} />
                  </div>
                </div>
              ))
            ) : null}

            {/* 어학능력 섹션 */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">어학능력</h3>
              <AddButton onClick={() => addArrayItem('languages', { test: 'TOEIC', score: '' })} />
            </div>
            {Array.isArray(formData.languages) && formData.languages.length > 0 ? (
              formData.languages.map((lang, index) => (
                <div key={`lang-${index}`} className="bg-gray-100 p-4 rounded-lg relative mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={lang.test}
                      onChange={(e) => handleArrayInputChange('languages', index, 'test', e.target.value)}
                    >
                      <option value="TOEIC">TOEIC</option>
                      <option value="OPIC">OPIC</option>
                      <option value="TOEFL">TOEFL</option>
                      <option value="IELTS">IELTS</option>
                    </select>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="점수/등급"
                      value={lang.score}
                      onChange={(e) => handleArrayInputChange('languages', index, 'score', e.target.value)}
                    />
                  </div>
                  <div className="absolute right-2 top-2">
                    <RemoveButton onClick={() => removeArrayItem('languages', index)} />
                  </div>
                </div>
              ))
            ) : null}

            {/* 활동/네트워킹 섹션 */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">활동/네트워킹</h3>
              <AddButton onClick={() => addArrayItem('activities', { name: '', role: '임원', award: '' })} />
            </div>
            {Array.isArray(formData.activities) && formData.activities.length > 0 ? (
              formData.activities.map((activity, index) => (
                <div key={`activity-${index}`} className="bg-gray-100 p-4 rounded-lg relative mb-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">활동명</label>
                        <input
                          type="text"
                          className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="예: 대학생 마케팅 동아리"
                          value={activity.name}
                          onChange={(e) => handleArrayInputChange('activities', index, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">역할</label>
                        <select
                          className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={activity.role}
                          onChange={(e) => handleArrayInputChange('activities', index, 'role', e.target.value)}
                        >
                          <option value="임원">임원</option>
                          <option value="팀장">팀장</option>
                          <option value="팀원">팀원</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">수상내역 <span className="text-xs text-gray-500">(선택)</span></label>
                      <textarea
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="수상 내역이 있으시면 입력하세요"
                        value={activity.award || ''}
                        onChange={(e) => handleArrayInputChange('activities', index, 'award', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="absolute right-2 top-2">
                    <RemoveButton onClick={() => removeArrayItem('activities', index)} />
                  </div>
                </div>
              ))
            ) : null}

            {/* 포트폴리오 업로드 */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">포트폴리오 PDF 업로드</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="text"
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formData.portfolio.fileName}
                    readOnly
                    placeholder="파일을 선택해주세요"
                  />
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  id="portfolio-file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label 
                  htmlFor="portfolio-file"
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer text-center"
                >
                  파일 찾기
                </label>
                <p className="text-xs text-gray-500">
                  *용량 주의: 10MB이하의 파일을 업로드해주세요
                </p>
                <p className="text-xs text-gray-500">
                  *pdf파일이 아닐경우 pdf파일로 업로드해 주시기 바랍니다
                </p>
              </div>
            </div>

            {/* 지원 분야 */}
            <div className="mb-2">
              <h3 className="text-lg font-medium">
                지원 분야 <span className="text-red-500">*</span><span className="text-xs text-gray-500 ml-1">(필수)</span>
              </h3>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <select
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.desiredPosition}
                onChange={(e) => handleInputChange('desiredPosition', e.target.value)}
              >
                <option value="인터넷.IT">인터넷.IT</option>
                <option value="금융">금융</option>
                <option value="제조">제조</option>
                <option value="마케팅.광고.홍보">마케팅.광고.홍보</option>
                <option value="유통.물류">유통.물류</option>
              </select>
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 flex items-center justify-center"
                onClick={handleSubmit}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                저장
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-300 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                취소
              </button>
            </div>
          </div>
        </div>
        
        <BottomNavBar />
      </div>
    </div>
  );
};

export default SpecInputPage;