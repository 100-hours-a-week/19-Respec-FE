import React, { useState, useEffect } from 'react';
import { CircleArrowUp } from 'lucide-react';
import CommentItem from './CommentItem';
import Pagination from './Pagination';
import { CommentAPI } from '../../api';

const CommentsSection = ({ specId, isMyPage, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
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
        // 삭제할 댓글이 실제 댓글인지 대댓글인지 확인
        const isMainComment = comments.some(
          (comment) => comment.id === commentId
        );
        const isReply = comments.some(
          (comment) =>
            comment.replies &&
            comment.replies.some((reply) => reply.id === commentId)
        );

        // 실제로 삭제되는 댓글인지 확인 (대댓글이 있는 부모 댓글은 삭제되지 않고 "삭제된 댓글입니다"로 표시)
        let willActuallyBeDeleted = false;
        if (isMainComment) {
          const targetComment = comments.find(
            (comment) => comment.id === commentId
          );
          willActuallyBeDeleted =
            !targetComment.replies || targetComment.replies.length === 0;
        } else if (isReply) {
          willActuallyBeDeleted = true;
        }

        // 삭제 후 현재 페이지의 댓글 수가 0이 될 것인지 확인
        const currentPageCommentCount = comments.length;
        const willCurrentPageBeEmpty =
          willActuallyBeDeleted && currentPageCommentCount <= 1;

        if (willCurrentPageBeEmpty && currentPage > 1) {
          // 현재 페이지가 비게 되고 첫 페이지가 아니라면 이전 페이지로 이동
          setCurrentPage(currentPage - 1);
        } else {
          // 현재 페이지를 다시 로드하여 페이지네이션 재배치
          await loadComments(currentPage - 1);
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
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl">
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
            className="w-full p-4 pr-12 border border-gray-300 resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">{newComment.length}/100</span>
          {submitting && (
            <span className="text-xs text-blue-500">작성 중...</span>
          )}
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="px-5 py-1">
        {loading ? (
          <div className="py-8 text-center">
            <div className="text-gray-500">댓글을 불러오는 중...</div>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center">
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
      {!loading && totalPages > 0 && (
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
