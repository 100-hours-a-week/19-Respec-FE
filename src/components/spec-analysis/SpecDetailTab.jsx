import React from 'react';

const SpecDetailInfo = ({ specData }) => {
  if (!specData) {
    return (
      <div className="py-8 text-center text-gray-500">
        스펙 정보를 입력하고
        <br />
        AI 분석에 기반한 점수를 확인해보세요.
      </div>
    );
  }

  const {
    finalEducation,
    educationDetails,
    workExperiences,
    certifications,
    languageSkills,
    activities,
    rankings,
  } = specData;

  // 점수 매핑 (카테고리명과 점수 매칭)
  const getScoreByCategory = (categoryName) => {
    if (!rankings?.categories) return 0;
    const category = rankings.categories.find(
      (cat) => cat.name === categoryName
    );
    return category ? Math.round(category.score) : 0;
  };

  const formatEducation = () => {
    if (!educationDetails || educationDetails.length === 0) {
      return finalEducation?.institute || '정보 없음';
    }

    const education = educationDetails[0];
    return `${education.schoolName} ${education.major} ${education.degree} ${education.gpa} / ${education.maxGpa}`;
  };

  const formatWorkExperience = () => {
    if (!workExperiences || workExperiences.length === 0) {
      return ['경험 없음'];
    }

    return workExperiences.map(
      (work) => `${work.company} ${work.position} ${work.period}개월`
    );
  };

  const formatCertifications = () => {
    if (!certifications || certifications.length === 0) {
      return ['자격증 없음'];
    }

    return certifications.map((cert) => cert.name);
  };

  const formatLanguageSkills = () => {
    if (!languageSkills || languageSkills.length === 0) {
      return ['어학 점수 없음'];
    }

    return languageSkills.map((lang) => {
      const langName = lang.name
        .replace('_', ' ')
        .replace('TOEIC_ENGLISH', 'TOEIC');
      return `${langName} ${lang.score}`;
    });
  };

  const formatActivities = () => {
    if (!activities || activities.length === 0) {
      return ['활동 없음'];
    }

    return activities.map((activity) => {
      const parts = [activity.name];
      if (activity.role) parts.push(activity.role);
      if (activity.award) parts.push(`${activity.award} 수상`);
      return parts.join(' / ');
    });
  };

  const specItems = [
    {
      category: '학력/성적',
      value: [formatEducation()],
      score: getScoreByCategory('학력_성적'),
    },
    {
      category: '직무 경험',
      value: formatWorkExperience(),
      score: getScoreByCategory('직무_경험'),
    },
    {
      category: '자격증/스킬',
      value: formatCertifications(),
      score: getScoreByCategory('자격증_스킬'),
    },
    {
      category: '어학 능력',
      value: formatLanguageSkills(),
      score: getScoreByCategory('어학_능력'),
    },
    {
      category: '활동/네트워킹',
      value: formatActivities(),
      score: getScoreByCategory('활동_네트워킹'),
    },
  ];

  return (
    <div className="space-y-0">
      {specItems.map((item, index) => (
        <div
          key={index}
          className="py-3 border-b border-gray-200 last:border-b-0"
        >
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-sm font-medium text-gray-800">
              {item.category}
            </h4>
            {item.score !== null && (
              <span className="text-sm font-semibold text-blue-600">
                {item.score}점
              </span>
            )}
          </div>
          <div className="text-xs leading-relaxed text-gray-600">
            {Array.isArray(item.value) ? (
              item.value.map((line, lineIndex) => (
                <div key={lineIndex}>{line}</div>
              ))
            ) : (
              <div>{item.value}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpecDetailInfo;
