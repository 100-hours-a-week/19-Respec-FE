import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 기준으로 앞뒤 2개씩 표시
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      // 시작이나 끝에 가까우면 조정
      if (currentPage <= 3) {
        endPage = 5;
      }
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center space-x-1 py-3">
      {/* 맨 첫 페이지로 */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`p-1 rounded-md border text-xs ${
          currentPage === 1
            ? 'text-gray-300 border-gray-200 cursor-not-allowed'
            : 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
        } transition-colors`}
      >
        <ChevronsLeft size={12} />
      </button>

      {/* 이전 페이지 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-1 rounded-md border text-xs ${
          currentPage === 1
            ? 'text-gray-300 border-gray-200 cursor-not-allowed'
            : 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
        } transition-colors`}
      >
        <ChevronLeft size={12} />
      </button>

      {/* 페이지 번호들 */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`min-w-[28px] h-7 px-2 rounded-md border text-sm font-medium transition-colors ${
            currentPage === page
              ? 'bg-blue-500 text-white border-blue-500'
              : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          {page}
        </button>
      ))}

      {/* 다음 페이지 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-1 rounded-md border text-xs ${
          currentPage === totalPages
            ? 'text-gray-300 border-gray-200 cursor-not-allowed'
            : 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
        } transition-colors`}
      >
        <ChevronRight size={12} />
      </button>

      {/* 맨 마지막 페이지로 */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`p-1 rounded-md border text-xs ${
          currentPage === totalPages
            ? 'text-gray-300 border-gray-200 cursor-not-allowed'
            : 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
        } transition-colors`}
      >
        <ChevronsRight size={12} />
      </button>
    </div>
  );
};

export default Pagination;
