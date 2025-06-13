import React, { useState, useEffect } from 'react';
import { CircleArrowUp } from 'lucide-react';
import CommentItem from './CommentItem';
import Pagination from './Pagination';
import { CommentAPI } from '../../api';

const CommentsSection = ({ specId, isMyPage, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (specId) {
      loadComments(currentPage - 1);
    }
  }, [currentPage, specId]);

  const loadComments = async (page) => {
    if (!specId) return;

    setLoading(true);

    try {
      const response = await CommentAPI.getComments(specId, { page, size: 5 });

      if (response.data.isSuccess) {
        const { comments: commentData, pageInfo } = response.data.data;

        const transformedComments = commentData.map((comment) => ({
          id: comment.commentId,
          userId: comment.writerId,
          nickname: comment.nickname,
          content: comment.content,
          profileImageUrl: comment.profileImageUrl,
          createdAt: formatDate(comment.createdAt),
          updatedAt: comment.updatedAt ? formatDate(comment.updatedAt) : null,
          replies: comment.replies
            ? comment.replies.map((reply) => ({
                id: reply.replyId,
                userId: reply.writerId,
                nickname: reply.nickname,
                content: reply.content,
                profileImageUrl: reply.profileImageUrl,
                createdAt: formatDate(reply.createdAt),
                updatedAt: reply.updatedAt ? formatDate(reply.updatedAt) : null,
              }))
            : [],
        }));

        setComments(transformedComments);
        setTotalPages(pageInfo.totalPages);
        setTotalElements(pageInfo.totalElements);
      }
    } catch (error) {
      console.error('댓글 로딩 실패: ', error);
    } finally {
      setLoading(false);
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);

    try {
      const response = await CommentAPI.createComment(
        specId,
        newComment.trim()
      );

      if (response.data.isSuccess) {
        setNewComment('');

        if (currentPage != 1) setCurrentPage(1);
        else loadComments(0);
      }
    } catch (error) {
      console.error('댓글 작성 실패: ', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      const response = await CommentAPI.updateComment(
        specId,
        commentId,
        newContent.trim()
      );

      if (response.data.isSuccess) {
        const updatedData = response.data.data;

        setComments(
          comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                content: updatedData.content,
                updatedAt: formatDate(updatedData.updatedAt),
              };
            }

            if (comment.replies) {
              const updatedReplies = comment.replies.map((reply) =>
                reply.id === commentId
                  ? {
                      ...reply,
                      content: updatedData.content,
                      updatedAt: formatDate(updatedData.updatedAt),
                    }
                  : reply
              );
              return { ...comment, replies: updatedReplies };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error('댓글 수정 실패: ', error);
      loadComments(currentPage - 1);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await CommentAPI.deleteComment(specId, commentId);

      if (response.data.isSuccess) {
        setComments(
          comments
            .map((comment) => {
              if (comment.id === commentId) {
                if (comment.replies && comment.replies.length > 0) {
                  return {
                    ...comment,
                    content: '삭제된 댓글입니다.',
                    nickname: '삭제된 사용자',
                    profileImageUrl: null,
                    userId: null,
                    updatedAt: null,
                  };
                } else {
                  return null;
                }
              }

              // 삭제하려는 댓글이 대댓글인 경우
              if (comment.replies) {
                const updatedReplies = comment.replies.filter(
                  (reply) => reply.id !== commentId
                );
                return { ...comment, replies: updatedReplies };
              }

              return comment;
            })
            .filter((comment) => comment !== null)
        );

        // 전체 댓글 수 업데이트 (실제로 제거된 댓글이 있는 경우만)
        const wasCommentRemoved = comments.some(
          (comment) =>
            (comment.id === commentId &&
              (!comment.replies || comment.replies.length === 0)) ||
            (comment.replies &&
              comment.replies.some((reply) => reply.id === commentId))
        );

        if (wasCommentRemoved) {
          setTotalElements((prev) => prev - 1);
        }
      }
    } catch (error) {
      console.error('댓글 삭제 실패: ', error);
      loadComments(currentPage - 1);
    }
  };

  const handleReplyComment = async (commentId, replyContent) => {
    try {
      const response = await CommentAPI.createReply(
        specId,
        commentId,
        replyContent.trim()
      );

      if (response.data.isSuccess) {
        const newReply = response.data.data;

        const transformedReply = {
          id: newReply.commentId,
          userId: currentUser?.id,
          nickname: newReply.nickname,
          content: newReply.content,
          profileImageUrl: newReply.profileImageUrl,
          createdAt: '방금 전',
          depth: newReply.depth,
          parentCommentId: newReply.parentCommentId,
        };

        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), transformedReply],
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('대댓글 작성 실패: ', error);
      loadComments(currentPage - 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* 댓글 헤더 */}
      <div className="px-5 py-3 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">
          댓글 {totalElements}
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
            disabled={submitting}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          />

          <button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || submitting}
            className={`absolute bottom-3 right-3 rounded-full flex items-center justify-center transition-colors ${
              newComment.trim() && !submitting
                ? 'text-blue-500 hover:text-blue-600'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <CircleArrowUp size={20} />
          </button>
        </div>

        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">{newComment.length}/100</span>
          {submitting && (
            <span className="text-xs text-blue-500">작성 중...</span>
          )}
        </div>
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
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
