import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

// 상수 데이터 정의
const JOB_FIELDS = [
  '경영_사무',
  '마케팅_광고_홍보',
  '무역_유통',
  '인터넷_IT',
  '생산_제조',
  '영업_고객상담',
  '건설',
  '금융',
  '연구개발_설계',
  '디자인',
  '미디어',
  '전문직_특수직'
];

const INSTITUTES = [
  '중학교',
  '고등학교',
  '2_3년 대학교',
  '대학교',
  '대학원'
];

const EDUCATION_STATUS = [
  '졸업',
  '수료',
  '중퇴',
  '휴학',
  '재학'
];

const DEGREE_TYPES = [
  '박사',
  '석사',
  '학사',
  '전문학사',
  '수료'
];

const GPA_SCALE = [
  '4.3',
  '4.5',
  '4.0'
];

const POSITIONS = [
  '대표',
  '정규직',
  '인턴'
];

const LANGUAGE_TESTS = [
  { value: 'TOEIC_ENGLISH', label: 'TOEIC(영어)' },
  { value: 'TOEFL_ENGLISH', label: 'TOEFL(영어)' },
  { value: 'TEPS_ENGLISH', label: 'TEPS(영어)' },
  { value: 'G_TELP_ENGLISH', label: 'G-TELP(영어)' },
  { value: 'TOEIC_SPEAKING_ENGLISH', label: 'TOEIC Speaking(영어)' },
  { value: 'TEPS_SPEAKING_ENGLISH', label: 'TEPS Speaking(영어)' },
  { value: 'G_TELP_SPEAKING_ENGLISH', label: 'G-TELP Speaking(영어)' },
  { value: 'IELTS_ENGLISH', label: 'IELTS(영어)' },
  { value: 'SNULT_GERMAN', label: 'SNULT(독일어)' },
  { value: 'SNULT_FRENCH', label: 'SNULT(프랑스어)' },
  { value: 'SNULT_RUSSIAN', label: 'SNULT(러시아어)' },
  { value: 'SNULT_CHINESE', label: 'SNULT(중국어)' },
  { value: 'SNULT_JAPANESE', label: 'SNULT(일본어)' },
  { value: 'SNULT_SPANISH', label: 'SNULT(스페인어)' },
  { value: 'NEW_HSK_CHINESE', label: 'HSK(중국어)' },
  { value: 'JPT_JAPANESE', label: 'JPT(일본어)' },
  { value: 'FLEX_ENGLISH', label: 'FLEX(영어)' },
  { value: 'FLEX_GERMAN', label: 'FLEX(독일어)' },
  { value: 'FLEX_FRENCH', label: 'FLEX(프랑스어)' },
  { value: 'FLEX_SPANISH', label: 'FLEX(스페인어)' },
  { value: 'FLEX_RUSSIAN', label: 'FLEX(러시아어)' },
  { value: 'FLEX_JAPANESE', label: 'FLEX(일본어)' },
  { value: 'FLEX_CHINESE', label: 'FLEX(중국어)' },
  { value: 'OPIC_ENGLISH', label: 'OPIC(영어)' },
  { value: 'OPIC_CHINESE', label: 'OPIC(중국어)' },
  { value: 'OPIC_RUSSIAN', label: 'OPIC(러시아어)' },
  { value: 'OPIC_SPANISH', label: 'OPIC(스페인어)' },
  { value: 'OPIC_JAPANESE', label: 'OPIC(일본어)' },
  { value: 'OPIC_VIETNAMESE', label: 'OPIC(베트남어)' }
];

const SpecInputPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeSpecId, setActiveSpecId] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  // State for cancel confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Handlers for cancel confirmation
  const handleCancelAttempt = () => setShowConfirmModal(true);
  const handleConfirmCancel = () => navigate('/my');
  const handleCloseModal = () => setShowConfirmModal(false);
  
  // 에러 메시지를 닫는 함수 추가
  const clearError = () => {
    setError(null);
  };
  
  const [formData, setFormData] = useState({
    name: '', // 사용자 닉네임(수정 불가)
    finalEducation: {
      institute: '대학교',
      status: '졸업'
    },
    educationDetails: [], // 초기에 빈 배열로 시작 - 학교, 전공, 학위, 학점 정보
    workExperiences: [], // 초기에 빈 배열로 시작
    certifications: [], // 초기에 빈 배열로 시작
    languageSkills: [], // 초기에 빈 배열로 시작
    activities: [], // 초기에 빈 배열로 시작 - 활동/네트워킹
    jobField: '인터넷_IT'
  });

  // 컴포넌트 마운트 시 유저 정보와 스펙 정보 가져오기
  useEffect(() => {
    const fetchUserAndSpecData = async () => {
      try {
        setLoading(true);
        
        // Get token from Authorization cookie header
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('Authorization='))
          ?.split('=')[1];
        
        if (!token) {
          setError('인증 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
          setLoading(false);
          return;
        }

        let userId;
        
        try {
          // JWT 토큰 디코딩 (Base64)
          const payload = token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payload));
          userId = decodedPayload.userId;
          console.log("Decoded userId from token:", userId);
        } catch (e) {
          console.error('Failed to decode token:', e);
        }
        
        if (!userId) {
          setError('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
          setLoading(false);
          return;
        }
        
        // 유저 정보 가져오기
        const userResponse = await axiosInstance.get(`/api/users/${userId}`, {
          headers: {
            'Authorization': token
          }
        });
        
        if (userResponse.data.isSuccess) {
          const userData = userResponse.data.data.user;
          
          // 사용자 이름을 폼 데이터에 설정
          setFormData(prev => ({
            ...prev,
            name: userData.nickname,
            jobField: userData.jobField || '인터넷_IT'
          }));
          
          // 활성화된 스펙이 있는지 확인
          if (userData.spec && userData.spec.hasActiveSpec) {
            setIsEditMode(true);
            setActiveSpecId(userData.spec.activeSpec);
            
            // 활성화된 스펙 정보 가져오기
            const specResponse = await axiosInstance.get(`/api/specs/${userData.spec.activeSpec}`, {
              headers: {
                'Authorization': token
              }
            });
            
            if (specResponse.data.isSuccess) {
              const specData = specResponse.data.specDetailData;
              
              // 가져온 스펙 정보로 폼 데이터 업데이트
              setFormData(prev => ({
                ...prev,
                name: userData.nickname,
                finalEducation: {
                  institute: specData.finalEducation.institute,
                  status: specData.finalEducation.status || specData.finalEducation.finalStatus // status 또는 finalStatus 필드 사용
                },
                educationDetails: specData.educationDetails.map(edu => ({
                  schoolName: edu.schoolName,
                  degree: edu.degree,
                  major: edu.major,
                  gpa: edu.gpa.toString(),
                  maxGpa: edu.maxGpa.toString()
                })),
                workExperiences: specData.workExperiences.map(exp => ({
                  companyName: exp.companyName || exp.company, // companyName 또는 company 필드 사용
                  position: exp.position,
                  period: exp.period.toString()
                })),
                certifications: specData.certifications.map(cert => ({
                  name: cert.name
                })),
                languageSkills: specData.languageSkills.map(lang => ({
                  languageTest: lang.languageTest || lang.name, // languageTest 또는 name 필드 사용
                  score: lang.score
                })),
                activities: specData.activities.map(activity => ({
                  name: activity.name,
                  role: activity.role,
                  award: activity.award || ''
                })),
                jobField: specData.jobField || userData.jobField || '인터넷_IT'
              }));
            }
          }
        }
        setInitialDataLoaded(true);
      } catch (err) {
        console.error('Error fetching user/spec data:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    // 페이지 로드 시 항상 데이터 가져오기
    fetchUserAndSpecData();
    
    // 브라우저 뒤로가기 및 페이지 복원 시 데이터 새로 로드
    const handlePopState = () => {
      window.location.reload(); // 브라우저 뒤로가기 시 페이지 강제 새로고침
    };
    
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload(); // bfcache에서 페이지 복원 시 강제 새로고침
      }
    };
    
    // 이벤트 리스너 등록
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pageshow', handlePageShow);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

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

  // 폼 데이터 유효성 검사
  const validateForm = () => {
    if (!formData.finalEducation.institute || !formData.finalEducation.status) {
      setError('최종 학력 정보를 입력해주세요.');
      return false;
    }

    if (!formData.jobField) {
      setError('지원 분야를 선택해주세요.');
      return false;
    }

    // 학력 정보 검증
    if (formData.educationDetails.length > 0) {
      for (let i = 0; i < formData.educationDetails.length; i++) {
        const edu = formData.educationDetails[i];
        if (!edu.schoolName || !edu.major || !edu.gpa) {
          setError(`${i+1}번째 학력 정보의 모든 필드를 입력해주세요.`);
          return false;
        }
      }
    }

    // 직무경험 검증
    if (formData.workExperiences.length > 0) {
      for (let i = 0; i < formData.workExperiences.length; i++) {
        const exp = formData.workExperiences[i];
        if (!exp.companyName || !exp.period) {
          setError(`${i+1}번째 직무경험의 모든 필드를 입력해주세요.`);
          return false;
        }
      }
    }

    // 자격증 검증
    if (formData.certifications.length > 0) {
      for (let i = 0; i < formData.certifications.length; i++) {
        const cert = formData.certifications[i];
        if (!cert.name) {
          setError(`${i+1}번째 자격증명을 입력해주세요.`);
          return false;
        }
      }
    }

    // 어학능력 검증
    if (formData.languageSkills.length > 0) {
      for (let i = 0; i < formData.languageSkills.length; i++) {
        const lang = formData.languageSkills[i];
        if (!lang.score) {
          setError(`${i+1}번째 어학능력의 점수를 입력해주세요.`);
          return false;
        }
      }
    }

    // 활동/네트워킹 검증 (award는 선택 사항)
    if (formData.activities.length > 0) {
      for (let i = 0; i < formData.activities.length; i++) {
        const activity = formData.activities[i];
        if (!activity.name || !activity.role) {
          setError(`${i+1}번째 활동/네트워킹의 활동명과 역할을 입력해주세요.`);
          return false;
        }
      }
    }

    return true;
  };

  // 백엔드에 전송할 데이터 형식으로 변환
  const formatDataForSubmission = () => {
    // API 명세에 맞게 데이터 변환
    const formattedData = {
      finalEducation: {
        institute: formData.finalEducation.institute,
        status: formData.finalEducation.status  // finalStatus가 아닌 status로 사용
      },
      educationDetails: formData.educationDetails.map(edu => ({
        schoolName: edu.schoolName,
        degree: edu.degree,
        major: edu.major,
        gpa: parseFloat(edu.gpa),
        maxGpa: parseFloat(edu.maxGpa)
      })),
      workExperiences: formData.workExperiences.map(exp => ({
        companyName: exp.companyName,  // company가 아닌 companyName으로 사용
        position: exp.position,
        period: parseInt(exp.period) || 0
      })),
      certifications: formData.certifications.map(cert => ({
        name: cert.name,
      })),
      languageSkills: formData.languageSkills.map(lang => ({
        languageTest: lang.languageTest,  // name이 아닌 languageTest로 사용
        score: lang.score
      })),
      activities: formData.activities.map(activity => ({
        name: activity.name,
        role: activity.role,
        award: activity.award || ''
      })),
      jobField: formData.jobField
    };

    return formattedData;
  };

  // Add a validation function for GPA input
  const validateGpaInput = (value, maxGpa) => {
    // Remove any non-numeric characters except the decimal point
    let input = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = input.split('.');
    if (parts.length > 2) {
      input = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      input = parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    // Ensure it doesn't exceed maxGpa
    const numValue = parseFloat(input);
    if (!isNaN(numValue) && numValue > parseFloat(maxGpa)) {
      input = maxGpa;
    }
    
    // Ensure it's not negative
    if (!isNaN(numValue) && numValue < 0) {
      input = '0';
    }
    
    return input;
  };
  
  // Add a validation function for work period input
  const validatePeriodInput = (value) => {
    // Remove any non-numeric characters
    let input = value.replace(/[^0-9]/g, '');
    
    // Limit to 3 digits
    if (input.length > 3) {
      input = input.slice(0, 3);
    }
    
    // If input is '0', return empty string
    if (input === '0') {
      return '';
    }
    
    return input;
  };

  // Create a specific handler for maxGpa changes
  const handleMaxGpaChange = (field, index, value) => {
    const newArray = [...formData[field]];
    
    if (index >= 0 && index < newArray.length) {
      // Update maxGpa
      newArray[index] = {
        ...newArray[index],
        maxGpa: value
      };
      
      // Also adjust gpa if it exceeds the new maxGpa
      if (parseFloat(newArray[index].gpa) > parseFloat(value)) {
        newArray[index].gpa = value;
      }
      
      setFormData(prev => ({
        ...prev,
        [field]: newArray
      }));
    }
  };

  // 제출 처리
  const handleSubmit = async () => {
    // 폼 검증
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null); // 에러 상태 초기화
      
      const submissionData = formatDataForSubmission();
      console.log('전송할 데이터:', submissionData);
      
      // API 엔드포인트 설정 (수정 모드 여부에 따라)
      const endpoint = isEditMode ? `/api/specs/${activeSpecId}` : '/api/specs';
      
      // 메소드 설정 (수정 모드 여부에 따라)
      const method = isEditMode ? 'PUT' : 'POST';
      
      console.log(`API 요청: ${method} ${endpoint}`);
      
      // JSON 형식으로 직접 전송 (multipart/form-data 대신)
      const response = await axiosInstance({
        method,
        url: endpoint,
        data: submissionData,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API 응답:', response);
      
      // HTTP 상태 코드로 성공 여부 확인
      if (response.status === 200 || response.status === 201) {
        console.log('스펙 정보 저장 성공');
        setSuccess(true);
        // 0.3초 후에 마이페이지로 이동
        setTimeout(() => {
          navigate('/my');
        }, 300);
      } else {
        console.error('예상치 못한 응답:', response);
        setError('스펙 정보 저장에 실패했습니다.');
      }
    } catch (err) {
      console.error('스펙 저장 중 오류 발생:', err);
      console.error('오류 응답:', err.response);
      
      // 자세한 오류 메시지 표시
      if (err.response) {
        // 서버에서 응답이 온 경우
        console.error('응답 상태:', err.response.status);
        console.error('응답 데이터:', err.response.data);
        
        if (err.response.data && err.response.data.message) {
          setError(`오류: ${err.response.data.message}`);
        } else {
          setError(`오류 코드: ${err.response.status}`);
        }
      } else if (err.request) {
        // 요청은 보냈지만 응답이 없는 경우
        setError('서버에 연결할 수 없습니다.');
      } else {
        // 요청 설정 중 오류
        setError('요청 전송 중 오류가 발생했습니다: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 추가/삭제 버튼 컴포넌트
  const AddButton = ({ onClick }) => (
    <button 
      type="button"
      className="flex items-center justify-center w-6 h-6 text-white bg-red-500 rounded-lg" 
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
      className="flex items-center justify-center w-6 h-6 text-white bg-red-500 rounded-lg" 
      onClick={onClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 pb-16">
      <div className="relative flex flex-col flex-1 w-full max-w-md mx-auto bg-white overflow-visible">
        
        {/* 성공 메시지 */}
        {success && (
          <div className="fixed left-0 right-0 z-50 max-w-md px-4 py-2 mx-auto text-white bg-green-500 rounded shadow-lg top-16">
            스펙 정보가 성공적으로 {isEditMode ? '수정' : '저장'}되었습니다. 마이페이지로 이동합니다.
          </div>
        )}
        
        <div className="p-4">
          <h2 className="mb-4 text-lg font-medium text-center text-blue-600">
            {initialDataLoaded ? (isEditMode ? '스펙 정보를 수정해주세요!' : '당신의 스펙을 입력해주세요!') : '데이터를 불러오는 중...'}
          </h2>
          <div className="space-y-4">
            {/* 기본 정보 섹션 */}
            <div className="mb-2">
              <label className="block text-lg font-medium">
                닉네임 <span className="text-red-500">*</span><span className="ml-1 text-xs text-gray-500">(필수)</span>
              </label>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <input
                type="text"
                className="block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.name}
                readOnly
              />
            </div>

            {/* 최종 학력 섹션 */}
            <div className="mb-2">
              <h3 className="text-lg font-medium">
                최종 학력 <span className="text-red-500">*</span><span className="ml-1 text-xs text-gray-500">(필수)</span>
              </h3>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.finalEducation.institute}
                  onChange={(e) => handleNestedInputChange('finalEducation', 'institute', e.target.value)}
                >
                  {INSTITUTES.map((institute, index) => (
                    <option key={index} value={institute}>{institute}</option>
                  ))}
                </select>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.finalEducation.status}
                  onChange={(e) => handleNestedInputChange('finalEducation', 'status', e.target.value)}
                >
                  {EDUCATION_STATUS.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* 학력 정보 섹션 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="text-lg font-medium">학력</h3>
                <span className="ml-2 text-xs text-gray-500">(국내 대학 한정입니다)</span>
              </div>
              <AddButton onClick={() => addArrayItem('educationDetails', { schoolName: '', major: '', degree: '학사', gpa: '', maxGpa: '4.5' })} />
            </div>
            {Array.isArray(formData.educationDetails) && formData.educationDetails.length > 0 ? (
              formData.educationDetails.map((education, index) => (
                <div key={`academic-${index}`} className="relative p-4 mb-4 bg-gray-100 rounded-lg">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">학교명</label>
                        <p className="mb-1 text-xs text-gray-500">전체 이름을 입력하세요</p>
                        <input
                          type="text"
                          maxLength="30"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={education.schoolName}
                          onChange={(e) => handleArrayInputChange('educationDetails', index, 'schoolName', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">학위</label>
                        <select
                          className="block w-full px-3 py-2 mt-6 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={education.degree}
                          onChange={(e) => handleArrayInputChange('educationDetails', index, 'degree', e.target.value)}
                        >
                          {DEGREE_TYPES.map((degree, idx) => (
                            <option key={idx} value={degree}>{degree}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">전공</label>
                        <input
                          type="text"
                          maxLength="20"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={education.major}
                          onChange={(e) => handleArrayInputChange('educationDetails', index, 'major', e.target.value)}
                        />
                      </div>
                      <div>
                        {/* 빈 공간 */}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">학점</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={education.gpa}
                          onChange={(e) => {
                            const validatedValue = validateGpaInput(e.target.value, education.maxGpa);
                            handleArrayInputChange('educationDetails', index, 'gpa', validatedValue);
                          }}
                          placeholder="예: 3.75"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">최대 학점</label>
                        <select
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={education.maxGpa}
                          onChange={(e) => handleMaxGpaChange('educationDetails', index, e.target.value)}
                        >
                          {GPA_SCALE.map((scale, idx) => (
                            <option key={idx} value={scale}>{scale}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-2 top-2">
                    <RemoveButton onClick={() => removeArrayItem('educationDetails', index)} />
                  </div>
                </div>
              ))
            ) : null}

            {/* 직무경험 섹션 */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">직무경험</h3>
              <AddButton onClick={() => addArrayItem('workExperiences', { companyName: '', position: '인턴', period: '' })} />
            </div>
            {Array.isArray(formData.workExperiences) && formData.workExperiences.length > 0 ? (
              formData.workExperiences.map((experience, index) => (
                <div key={`career-${index}`} className="relative p-4 mb-4 bg-gray-100 rounded-lg">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">회사명</label>
                        <input
                          type="text"
                          maxLength="20"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="예: 삼성 SDS"
                          value={experience.companyName}
                          onChange={(e) => handleArrayInputChange('workExperiences', index, 'companyName', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">직책</label>
                        <select
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={experience.position}
                          onChange={(e) => handleArrayInputChange('workExperiences', index, 'position', e.target.value)}
                        >
                          {POSITIONS.map((position, idx) => (
                            <option key={idx} value={position}>{position}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-600">근무기간 (개월)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={experience.period}
                          onChange={(e) => {
                            const validatedValue = validatePeriodInput(e.target.value);
                            handleArrayInputChange('workExperiences', index, 'period', validatedValue);
                          }}
                          placeholder="예: 12"
                        />
                        <span className="text-xs text-gray-500">*최대 3자리까지만 입력 가능</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-2 top-2">
                    <RemoveButton onClick={() => removeArrayItem('workExperiences', index)} />
                  </div>
                </div>
              ))
            ) : null}

            {/* 자격증 섹션 */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">자격증</h3>
              <AddButton onClick={() => addArrayItem('certifications', { name: '' })} />
            </div>
            {Array.isArray(formData.certifications) && formData.certifications.length > 0 ? (
              formData.certifications.map((cert, index) => (
                <div key={`cert-${index}`} className="relative p-4 mb-4 bg-gray-100 rounded-lg">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-600">자격증명</label>
                    <input
                      type="text"
                      maxLength="50"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">어학능력</h3>
              <AddButton onClick={() => addArrayItem('languageSkills', { languageTest: 'TOEIC_ENGLISH', score: '' })} />
            </div>
            {Array.isArray(formData.languageSkills) && formData.languageSkills.length > 0 ? (
              formData.languageSkills.map((lang, index) => (
                <div key={`lang-${index}`} className="relative p-4 mb-4 bg-gray-100 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={lang.languageTest}
                      onChange={(e) => handleArrayInputChange('languageSkills', index, 'languageTest', e.target.value)}
                    >
                      {LANGUAGE_TESTS.map((test, idx) => (
                        <option key={idx} value={test.value}>{test.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      maxLength="10"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="점수/등급"
                      value={lang.score}
                      onChange={(e) => handleArrayInputChange('languageSkills', index, 'score', e.target.value)}
                    />
                  </div>
                  <div className="absolute right-2 top-2">
                    <RemoveButton onClick={() => removeArrayItem('languageSkills', index)} />
                  </div>
                </div>
              ))
            ) : null}

            {/* 활동/네트워킹 섹션 */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">활동/네트워킹</h3>
              <AddButton onClick={() => addArrayItem('activities', { name: '', role: '', award: '' })} />
            </div>
            {Array.isArray(formData.activities) && formData.activities.length > 0 ? (
              formData.activities.map((activity, index) => (
                <div key={`activity-${index}`} className="relative p-4 mb-4 bg-gray-100 rounded-lg">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">활동명</label>
                        <input
                          type="text"
                          maxLength="20"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="예: 대학생 마케팅 동아리"
                          value={activity.name}
                          onChange={(e) => handleArrayInputChange('activities', index, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">역할</label>
                        <input
                          type="text"
                          maxLength="15"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="예: 팀장, 팀원 등"
                          value={activity.role}
                          onChange={(e) => handleArrayInputChange('activities', index, 'role', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-600">수상내역 <span className="text-xs text-gray-500">(선택)</span></label>
                      <textarea
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="수상 내역이 있으시면 입력하세요"
                        maxLength="20"
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

            {/* 지원 분야 */}
            <div className="mb-2">
              <h3 className="text-lg font-medium">
                지원 분야 <span className="text-red-500">*</span><span className="ml-1 text-xs text-gray-500">(필수)</span>
              </h3>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.jobField}
                onChange={(e) => handleInputChange('jobField', e.target.value)}
              >
                {JOB_FIELDS.map((field, index) => (
                  <option key={index} value={field}>{field}</option>
                ))}
              </select>
            </div>

            {/* Error message display */}
            {error && (
              <div className="mt-4">
                <div className="relative flex items-center justify-between px-4 py-3 mb-3 text-gray-900 bg-red-300 border border-red-400 rounded-md">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3 text-red-600">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 8L12 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="12" cy="16" r="1" fill="currentColor" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                  <button type="button" className="text-gray-500 hover:text-gray-700" onClick={clearError}>
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* 제출 버튼 */}
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                className={`flex-1 ${loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-3 rounded-md flex items-center justify-center`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                )}
                {loading ? "처리 중..." : (isEditMode ? "수정" : "저장")}
              </button>
              <button
                type="button"
                className="flex items-center justify-center flex-1 px-4 py-3 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={handleCancelAttempt}
                disabled={loading}
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
        
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="w-11/12 max-w-sm p-6 bg-white rounded-lg shadow-lg">
              <div className="flex justify-end">
                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-4 mb-4 bg-red-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 11-0 20 10 10 0 010-20z" />
                  </svg>
                </div>
                <p className="mb-6 text-lg font-semibold text-gray-800">스펙 입력을 그만하시겠습니까?</p>
                <p className="mb-6 text-sm text-gray-500">입력 중인 내용은 저장되지 않습니다.</p>
                <div className="flex w-full space-x-4">
                  <button
                    onClick={handleConfirmCancel}
                    className="flex-1 py-3 text-center text-white bg-red-500 rounded-lg"
                  >
                    예
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 py-3 text-center text-gray-700 bg-gray-200 rounded-lg"
                  >
                    아니오
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecInputPage;