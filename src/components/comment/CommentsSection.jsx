import React, { useState, useEffect } from 'react';
import { CircleArrowUp } from 'lucide-react';
import CommentItem from './CommentItem';
import Pagination from './Pagination';

const CommentsSection = ({ specId, isMyPage, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [loading, setLoading] = useState(false);

  // 임시 댓글 데이터
  useEffect(() => {
    loadComments(currentPage);
  }, [currentPage, specId]);

  const loadComments = async (page) => {
    setLoading(true);

    // 임시 데이터 (실제로는 API 호출)
    const mockComments = [
      {
        id: 1,
        userId: 1,
        nickname: '카리나',
        content: '스펙이 너무 좋아요ㅠㅠ',
        createdAt: '2분 전',
        replies: [],
      },
      {
        id: 2,
        userId: 2,
        nickname: '원터',
        content: '공모전 수상 끝립 있으신가요???',
        createdAt: '5분 전',
        replies: [],
      },
      {
        id: 3,
        userId: 3,
        nickname: '닝닝',
        content: '저랑 순위가 비슷하시네요! 응원합니다!',
        createdAt: '10분 전',
        replies: [],
      },
      {
        id: 4,
        userId: 4,
        nickname: '지젤',
        content: '오픽은 어떻게 공부하셨나요?',
        createdAt: '15분 전',
        replies: [
          {
            id: 41,
            userId: 1,
            nickname: '임솔',
            content: '해커스 2주 단기완성반 들어봤서 공부했습니다!',
            createdAt: '12분 전',
          },
        ],
      },
    ];

    setTimeout(() => {
      setComments(mockComments);
      setLoading(false);
    }, 500);
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      userId: currentUser?.id || 999,
      nickname: currentUser?.nickname || '익명',
      content: newComment,
      createdAt: '방금 전',
      replies: [],
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  const handleEditComment = (commentId, newContent) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, content: newContent } : comment
      )
    );
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      setComments(comments.filter((comment) => comment.id !== commentId));
    }
  };

  const handleReplyComment = (commentId, replyContent) => {
    const reply = {
      id: Date.now(),
      userId: currentUser?.id || 999,
      nickname: currentUser?.nickname || '익명',
      content: replyContent,
      createdAt: '방금 전',
    };

    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...(comment.replies || []), reply] }
          : comment
      )
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* 댓글 헤더 */}
      <div className="px-5 py-3 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">
          댓글 {comments.length}
        </h3>
      </div>

      {/* 댓글 입력 */}
      <div className="p-5 border-b border-gray-100">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                setNewComment(e.target.value);
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="댓글을 입력하세요."
            className="w-full p-4 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="2"
            maxLength={100}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          />

          <button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className={`absolute bottom-3 right-3 rounded-full flex items-center justify-center transition-colors ${
              newComment.trim()
                ? 'text-blue-500 hover:text-blue-600'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <CircleArrowUp size={20} />
          </button>
        </div>

        <div className="text-xs text-gray-500">{newComment.length}/100</div>
      </div>

      {/* 댓글 목록 */}
      <div className="px-5 py-1">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">댓글을 불러오는 중...</div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">첫 번째 댓글을 작성해보세요!</div>
          </div>
        ) : (
          <div className="space-y-0">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                onReply={handleReplyComment}
              />
            ))}
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="border-t border-gray-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
