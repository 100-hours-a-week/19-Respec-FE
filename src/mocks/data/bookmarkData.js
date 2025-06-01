const profileImageUrl =
  'https://www.google.com/imgres?q=%EA%B7%80%EC%97%AC%EC%9A%B4%20%EC%A7%A4&imgurl=https%3A%2F%2Fi.pinimg.com%2F236x%2F7e%2Ffd%2F64%2F7efd641894324d61f437022eeda1dbff.jpg&imgrefurl=https%3A%2F%2Fkr.pinterest.com%2Feunju011014%2F%25EA%25B7%2580%25EC%2597%25AC%25EC%259A%25B4-%25EC%25A7%25A4%2F&docid=YVGvQWuwlYsxKM&tbnid=3c6cmjpe86GJqM&vet=12ahUKEwjcx_Cl5sqNAxVggFYBHf-vAfgQM3oECBgQAA..i&w=236&h=236&hcb=2&ved=2ahUKEwjcx_Cl5sqNAxVggFYBHf-vAfgQM3oECBgQAA';

// 즐겨찾기 테스트 데이터
const createBookmarkTestData = (startIndex = 0, count = 10) => {
  const jobFields = [
    '인터넷_IT',
    '마케팅_광고_홍보',
    '금융',
    '디자인',
    '경영_사무',
    '연구개발_설계',
    '영업_고객상담',
    '미디어',
    '건설',
    '전문직_특수직',
  ];

  const nicknames = [
    'jelly.song',
    'coding.master',
    'design.pro',
    'marketing.guru',
    'finance.expert',
    'dev.ninja',
    'ui.artist',
    'data.wizard',
    'tech.leader',
    'creative.mind',
    'business.ace',
    'solution.maker',
    'innovation.hub',
    'growth.hacker',
    'product.owner',
  ];

  return Array.from({ length: count }, (_, index) => {
    const id = startIndex + index + 1;
    const jobField = jobFields[index % jobFields.length];
    const nickname = nicknames[index % nicknames.length] + (id > 15 ? id : '');

    return {
      userId: id,
      specId: 100 + id,
      nickname,
      profileImageUrl: Math.random() > 0.3 ? profileImageUrl : null,
      totalRank: id,
      totalUsersCount: 500,
      rankByJobField: (id % 50) + 1,
      usersCountByJobField: 50,
      score: Math.max(60, 95 - id * 0.5 + Math.random() * 5),
      jobField,
      isBookmarked: true, // 즐겨찾기 페이지에서는 모두 true
      bookmarkId: `bookmark_${String(id).padStart(3, '0')}`,
      commentsCount: Math.floor(Math.random() * 100),
      bookmarksCount: Math.floor(Math.random() * 200),
      createdAt: new Date(Date.now() - id * 86400000).toISOString(),
    };
  });
};

// 페이지네이션을 위한 즐겨찾기 데이터 시뮬레이션
export const getBookmarkPageData = (cursor = 0, limit = 10) => {
  // 전체 즐겨찾기 데이터 개수 (실제로는 API에서 받아올 값)
  const totalBookmarks = 93;

  // 현재 페이지 데이터 생성
  const data = createBookmarkTestData(cursor, limit);

  // 다음 페이지 존재 여부 확인
  const hasNext = cursor + limit < totalBookmarks;
  const nextCursor = hasNext ? cursor + limit : null;

  return {
    data,
    hasNext,
    nextCursor,
    total: totalBookmarks,
  };
};

// 테스트용 즐겨찾기 데이터 (즉시 사용 가능한 소량 데이터)
export const mockBookmarkData = createBookmarkTestData(0, 5);

export default {
  getBookmarkPageData,
  mockBookmarkData,
  createBookmarkTestData,
};
