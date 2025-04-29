import React, { useState } from 'react';
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";

const SpecInputPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    currentEducation: {
      level: '고등학교',
      status: '졸업'
    },
    academicBackground: {
      school: '',
      major: '',
      gpa: '',
      maxGpa: '4.3'
    },
    career: {
      company: '',
      position: '',
      duration: ''
    },
    certifications: [
      { name: '', type: '' }
    ],
    languages: [
      { test: 'TOEIC', score: '' }
    ],
    activities: [
      { name: '', role: '', details: '' }
    ],
    portfolio: {
      fileName: '',
      file: null
    },
    desiredPosition: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full max-w-[390px] mx-auto flex flex-col flex-1 bg-white relative">
        <TopBar title="스펙정보 관리" />
        
        <div className="flex-1 p-5 overflow-y-auto pb-20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 섹션 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium mb-4">당신의 스펙을 입력해주세요!</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">닉네임</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-sm font-medium text-gray-700">나이</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 학력 섹션 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">최종 학력</h3>
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.currentEducation.level}
                  onChange={(e) => handleInputChange('currentEducation', {...formData.currentEducation, level: e.target.value})}
                >
                  <option value="고등학교">고등학교</option>
                  <option value="전문대학교">전문대학교</option>
                  <option value="대학교">대학교</option>
                  <option value="대학원">대학원</option>
                </select>
                <select
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.currentEducation.status}
                  onChange={(e) => handleInputChange('currentEducation', {...formData.currentEducation, status: e.target.value})}
                >
                  <option value="졸업">졸업</option>
                  <option value="재학중">재학중</option>
                  <option value="휴학중">휴학중</option>
                </select>
              </div>
            </div>

            {/* 학교/전공 정보 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">학교명</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.academicBackground.school}
                    onChange={(e) => handleInputChange('academicBackground', {...formData.academicBackground, school: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">전공</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.academicBackground.major}
                    onChange={(e) => handleInputChange('academicBackground', {...formData.academicBackground, major: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">학점</label>
                    <input
                      type="number"
                      step="0.1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.academicBackground.gpa}
                      onChange={(e) => handleInputChange('academicBackground', {...formData.academicBackground, gpa: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">최대 학점</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.academicBackground.maxGpa}
                      onChange={(e) => handleInputChange('academicBackground', {...formData.academicBackground, maxGpa: e.target.value})}
                    >
                      <option value="4.3">4.3</option>
                      <option value="4.5">4.5</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 직무경험 섹션 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">직무경험</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">회사명</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="예: 삼성 SDS"
                    value={formData.career.company}
                    onChange={(e) => handleInputChange('career', {...formData.career, company: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">직책</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.career.position}
                    onChange={(e) => handleInputChange('career', {...formData.career, position: e.target.value})}
                  >
                    <option value="인턴">인턴</option>
                    <option value="사원">사원</option>
                    <option value="주임">주임</option>
                    <option value="대리">대리</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">근무기간 (개월)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.career.duration}
                    onChange={(e) => handleInputChange('career', {...formData.career, duration: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* 어학능력 섹션 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">어학능력</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <select
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.languages[0].test}
                    onChange={(e) => handleInputChange('languages', [{...formData.languages[0], test: e.target.value}])}
                  >
                    <option value="TOEIC">TOEIC</option>
                    <option value="OPIC">OPIC</option>
                    <option value="TOEFL">TOEFL</option>
                  </select>
                  <input
                    type="text"
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="점수/등급"
                    value={formData.languages[0].score}
                    onChange={(e) => handleInputChange('languages', [{...formData.languages[0], score: e.target.value}])}
                  />
                </div>
              </div>
            </div>

            {/* 활동/경험 섹션 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">활동/경험</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">활동명</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="예: 대학생 마케팅 동아리"
                    value={formData.activities[0].name}
                    onChange={(e) => handleInputChange('activities', [{...formData.activities[0], name: e.target.value}])}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">역할</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.activities[0].role}
                    onChange={(e) => handleInputChange('activities', [{...formData.activities[0], role: e.target.value}])}
                  >
                    <option value="임원">임원</option>
                    <option value="팀장">팀장</option>
                    <option value="팀원">팀원</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 포트폴리오 업로드 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">포트폴리오 PDF 업로드</h3>
              <input
                type="file"
                accept=".pdf"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => {
                  const file = e.target.files[0];
                  handleInputChange('portfolio', {
                    fileName: file.name,
                    file: file
                  });
                }}
              />
            </div>

            {/* 지원 분야 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">지원 분야</h3>
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.desiredPosition}
                onChange={(e) => handleInputChange('desiredPosition', e.target.value)}
              >
                <option value="">선택해주세요</option>
                <option value="인터넷.IT">인터넷.IT</option>
                <option value="금융">금융</option>
                <option value="제조">제조</option>
              </select>
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                저장
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                취소
              </button>
            </div>
          </form>
        </div>
        
        <BottomNavBar />
      </div>
    </div>
  );
};

export default SpecInputPage;