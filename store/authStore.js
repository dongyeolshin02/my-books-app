import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

// 쿠키 스토리지 구현
const cookieStorage = {
  getItem: (name) => {
    const value = Cookies.get(name);
    return value ? value : null;
  },
  setItem: (name, value) => {
    Cookies.set(name, value, { expires: 7 }); // 7일 만료
  },
  removeItem: (name) => {
    Cookies.remove(name);
  },
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      userId: null,
      userName: null,
      userRole: null,
      setAuth: (authData) => {
        const newState = {
          token: authData.token,
          userId: authData.userId,
          userName: authData.userName,
          userRole: authData.userRole
        };
        set(newState);
      },
      logout: () => {
        set({
          token: null,
          userId: null,
          userName: null,
          userRole: null
        });
      },
      isAdmin: () => {
        const state = get();
        return state.userRole === 'admin';
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);
