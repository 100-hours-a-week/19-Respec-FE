import React from 'react';

const ProfileSection = ({ user, specStats }) => {
  return (
    <div className="px-4 pt-2">
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="p-4">
          <div className="flex items-center">
            <div className="w-20 h-20 mr-4 overflow-hidden bg-gray-200">
              {user.profileImageUrl && (
                <img src={user.profileImageUrl} alt="Profile" className="object-cover w-20 h-20" />
              )}
            </div>
          
            <div className="flex-1">
              <div className="flex items-center">
                <h2 className="text-xl font-bold">{user.nickname}</h2>
                {specStats && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                    {user.jobField}
                  </span>
                )}
              </div>
          
              {specStats ? (
                <>
                  <div className="flex items-center mt-1.5 space-x-2 text-sm">
                    <p className="font-medium text-gray-800">
                      상위 {specStats.percentage}%
                    </p>
                    <span className="text-gray-500">•</span>
                    <p className="font-medium text-gray-800">
                      총점 {specStats.score.toFixed(1)}점
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500">아직 스펙 정보가 없습니다</div>
              )}
            </div>
          </div>
        </div>
      
        <div className="h-px bg-gray-200"></div>

        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
          <span className="text-gray-600">가입일</span>
          <span className="text-gray-800">{user.createdAt}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection; 