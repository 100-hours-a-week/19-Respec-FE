import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  console.log('pagination props: ', { currentPage, totalPages });

  if (totalPages <= 0) return null;

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
      const currentGroup = Math.ceil(currentPage / maxVisiblePages);
      let startPage = (currentGroup - 1) * maxVisiblePages + 1;
      let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex items-center justify-center py-3 space-x-1">
      {/* 맨 첫 페이지로 */}
      <button
        onClick={() => onPageChange(1)}
        disabled={isFirstPage}
        className={`p-1 text-xs ${
          isFirstPage
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:text-gray-400'
        } transition-colors`}
      >
        <ChevronsLeft size={12} />
      </button>

      {/* 이전 그룹으로 */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={isFirstPage}
        className={`p-1 text-xs ${
          isFirstPage
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:text-gray-400'
        } transition-colors`}
      >
        <ChevronLeft size={12} />
      </button>

      {/* 페이지 번호들 */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`min-w-[28px] h-7 px-2 text-sm font-medium transition-colors ${
            currentPage === page
              ? 'text-blue-500'
              : 'text-gray-700 hover:text-gray-500'
          }`}
        >
          {page}
        </button>
      ))}

      {/* 다음 그룹으로 */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={isLastPage}
        className={`p-1 text-xs ${
          isLastPage
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:text-gray-400'
        } transition-colors`}
      >
        <ChevronRight size={12} />
      </button>

      {/* 맨 마지막 페이지로 */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={isLastPage}
        className={`p-1 text-xs ${
          isLastPage
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:text-gray-400'
        } transition-colors`}
      >
        <ChevronsRight size={12} />
      </button>
    </div>
  );
};

export default Pagination;
