"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

export interface User {
  id: number;
  name: string;
  profileImage?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ 앱 시작 시 "진짜 로그인 상태" 확인
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
          { withCredentials: true },
        );

        const userData = {
          id: res.data.data.userId,
          name: res.data.data.nickname,
          profileImage: res.data.data.profileImageUrl,
        };

        setUserState(userData);
      } catch {
        // ❌ 토큰 없거나 만료 → 비로그인
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
