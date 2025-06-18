import { create } from 'zustand';
import { BookmarkAPI } from '../api';

export const useBookmarkStore = create((set, get) => ({
  // 즐겨찾기된 스펙 ID들의 Set
  bookmarkedSpecIds: new Set(),
  // 즐겨찾기 ID 매핑 (specId -> bookmarkId)
  bookmarkIdMap: new Map(),
  // 로딩 상태
  loading: false,
  // 초기화 완료 여부
  initialized: false,

  // 즐겨찾기 상태 초기화
  initializeBookmarks: async () => {
    const { setLoading, setInitialized } = get();

    try {
      setLoading(true);
      const response = await BookmarkAPI.getBookmarks({
        cursor: null,
        limit: 1000,
      });

      if (response.data.isSuccess) {
        const bookmarks = response.data.data.bookmarks;
        const bookmarkedSpecIds = new Set();
        const bookmarkIdMap = new Map();

        bookmarks.forEach((bookmark) => {
          const specId = bookmark.spec.id;
          bookmarkedSpecIds.add(specId);
          bookmarkIdMap.set(specId, bookmark.id);
        });

        set({
          bookmarkedSpecIds,
          bookmarkIdMap,
          initialized: true,
        });
      }
    } catch (error) {
      console.error('즐겨찾기 초기화 실패:', error);
      set({ initialized: true });
    } finally {
      setLoading(false);
    }
  },

  // 즐겨찾기 등록
  addBookmark: async (specId) => {
    const { bookmarkedSpecIds, bookmarkIdMap, setBookmarkState } = get();

    try {
      const response = await BookmarkAPI.addBookmark(specId);

      if (response.data?.isSuccess) {
        const bookmarkId = response.data.data?.bookmarkId;

        const newBookmarkedSpecIds = new Set(bookmarkedSpecIds);
        newBookmarkedSpecIds.add(specId);

        const newBookmarkIdMap = new Map(bookmarkIdMap);
        newBookmarkIdMap.set(specId, bookmarkId);

        set({
          bookmarkedSpecIds: newBookmarkedSpecIds,
          bookmarkIdMap: newBookmarkIdMap,
        });

        return { success: true, bookmarkId };
      }

      return { success: false, message: response.data?.message };
    } catch (error) {
      console.error('즐겨찾기 등록 실패:', error);
      return { success: false, message: '즐겨찾기 등록에 실패했습니다.' };
    }
  },

  // 즐겨찾기 해제
  removeBookmark: async (specId) => {
    const { bookmarkedSpecIds, bookmarkIdMap } = get();

    try {
      const response = await BookmarkAPI.removeBookmark(specId);

      if (response.status === 204 || response.data?.isSuccess) {
        const newBookmarkedSpecIds = new Set(bookmarkedSpecIds);
        newBookmarkedSpecIds.delete(specId);

        const newBookmarkIdMap = new Map(bookmarkIdMap);
        newBookmarkIdMap.delete(specId);

        set({
          bookmarkedSpecIds: newBookmarkedSpecIds,
          bookmarkIdMap: newBookmarkIdMap,
        });

        return { success: true };
      }

      return { success: false, message: response.data?.message };
    } catch (error) {
      console.error('즐겨찾기 해제 실패:', error);
      return { success: false, message: '즐겨찾기 해제에 실패했습니다.' };
    }
  },

  // 특정 스펙의 즐겨찾기 상태 확인
  isBookmarked: (specId) => {
    const { bookmarkedSpecIds } = get();
    return bookmarkedSpecIds.has(specId);
  },

  // 특정 스펙의 즐겨찾기 ID 가져오기
  getBookmarkId: (specId) => {
    const { bookmarkIdMap } = get();
    return bookmarkIdMap.get(specId);
  },

  // 즐겨찾기된 스펙 개수
  getBookmarkCount: () => {
    const { bookmarkedSpecIds } = get();
    return bookmarkedSpecIds.size;
  },

  // 즐겨찾기 상태 토글
  toggleBookmark: async (specId) => {
    const { isBookmarked, addBookmark, removeBookmark } = get();

    if (isBookmarked(specId)) {
      return await removeBookmark(specId);
    } else {
      return await addBookmark(specId);
    }
  },

  // 스토어 초기화
  reset: () => {
    set({
      bookmarkedSpecIds: new Set(),
      bookmarkIdMap: new Map(),
      loading: false,
      initialized: false,
    });
  },

  // 로딩 상태 설정
  setLoading: (loading) => set({ loading }),

  // 초기화 상태 설정
  setInitialized: (initialized) => set({ initialized }),
}));
