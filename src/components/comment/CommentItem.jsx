import React, { useState } from 'react';
import {
  Pencil,
  Trash2,
  CornerDownRight,
  Reply,
  AlertTriangle,
} from 'lucide-react';
import Modal from '../common/Modal';

const CommentItem = ({ comment, currentUser, onEdit, onDelete, onReply }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [replyText, setReplyText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isMyComment = comment.userId === currentUser?.id;

  const handleEditSubmit = () => {
    if (editText.trim()) {
      onEdit(comment.id, editText);
      setIsEditing(false);
    }
  };

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setIsReplying(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(comment.id);
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleKeyPress = (e, callback) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      callback();
    }
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {comment.profileImageUrl ? (
              <img
                src={comment.profileImageUrl}
                alt={comment.nickname}
                className="w-full h-full object-cover"
              />
            ) : (
              comment.nickname?.charAt(0) || '?'
            )}
          </div>
          <span className="font-bold text-gray-800">{comment.nickname}</span>
          <span className="text-xs text-gray-500">{comment.createdAt}</span>
        </div>

        {/* 수정/삭제/답글 버튼 */}
        <div className="flex items-center space-x-1">
          {isMyComment && (
            <>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-gray-400 hover:text-blue-500 transition-colors p-1"
              >
                <Pencil size={12} />
              </button>
              <button
                onClick={handleDeleteClick}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={12} />
              </button>
            </>
          )}
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <Reply size={12} />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="mb-3">
          <textarea
            value={editText}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                setEditText(e.target.value);
              }
            }}
            onKeyPress={(e) => handleKeyPress(e, handleEditSubmit)}
            className="w-full p-3 border border-blue-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="1"
            placeholder="댓글을 수정하세요."
            maxLength={100}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">{editText.length}/100</span>
          </div>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm border border-gray-400 text-gray-600 rounded hover:border-gray-600 hover:text-gray-800"
            >
              취소
            </button>
            <button
              onClick={handleEditSubmit}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              수정
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 leading-relaxed">{comment.content}</p>
      )}

      {isReplying && (
        <div className="mt-3 ml-6">
          <div className="flex items-start space-x-2">
            <CornerDownRight
              size={16}
              className="text-gray-400 mt-3 flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={replyText}
                onChange={(e) => {
                  if (e.target.value.length <= 100) {
                    setReplyText(e.target.value);
                  }
                }}
                onKeyPress={(e) => handleKeyPress(e, handleReplySubmit)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="1"
                placeholder="답글을 입력하세요."
                maxLength={100}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                  {editText.length}/100
                </span>
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => setIsReplying(false)}
                  className="px-3 py-1 text-sm border border-gray-400 text-gray-600 rounded hover:border-gray-600 hover:text-gray-800"
                >
                  취소
                </button>
                <button
                  onClick={handleReplySubmit}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  답글
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 ml-6 space-y-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex items-start space-x-2">
              <CornerDownRight
                size={16}
                className="text-gray-400 mt-1 flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-700">
                    {reply.nickname}
                  </span>
                  <span className="text-xs text-gray-500">
                    {reply.createdAt}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="정말 삭제하시겠습니까?"
        icon={AlertTriangle}
        iconColor="red"
        primaryButtonText="예, 삭제합니다"
        secondaryButtonText="아니오"
        onPrimaryButtonClick={handleDeleteConfirm}
        onSecondaryButtonClick={handleDeleteCancel}
        primaryButtonColor="red"
      />
    </div>
  );
};

export default CommentItem;
