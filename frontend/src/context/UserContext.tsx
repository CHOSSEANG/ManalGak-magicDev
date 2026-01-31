"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

// ---------------------------
// 게스트 확인 가능 추가 1/30 율 
// const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

// // "게스트로만" 보고 싶으면 false로 두면 됨
// const DEV_MOCK_LOGIN = process.env.NEXT_PUBLIC_DEV_MOCK_LOGIN === "true";

// const MOCK_USER: User = {
//   id: 999,
//   name: "DEV_USER",
//   profileImage: "",
// };
// 게스트 확인가능 추가 끝 1/30 율 
//---------------------------

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

  // -----------------
  // 게스트 확인 가능 추가 1/30 율
useEffect(() => {
  const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";
  const DEV_MOCK_LOGIN = process.env.NEXT_PUBLIC_DEV_MOCK_LOGIN === "true";

  // ✅ STEP 3 핵심: 개발 모드면 auth/me 자체를 호출하지 않음
  if (DEV_MODE) {
    if (DEV_MOCK_LOGIN) {
      // 🔹 Mock 로그인 상태
      setUserState({
        id: 999,
        name: "DEV_USER",
        profileImage: "",
      });
    } else {
      // 🔹 게스트 상태
      setUserState(null);
    }

    setLoading(false);
    return; // ❗ 여기서 끝 (fetchMe 안 탐)
  }

  // ✅ 운영/정상 환경에서만 실제 로그인 체크
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
      setUserState(null);
    } finally {
      setLoading(false);
    }
  };

  fetchMe();
}, []);
  
   const setUser = (nextUser: User | null) => {
  setUserState(nextUser);
   };
  
  
  // 끝 1/30 율 
  // ----------------

  // // ✅ 앱 시작 시 "진짜 로그인 상태" 확인
  // useEffect(() => {
  //   const fetchMe = async () => {
  //     try {
  //       const res = await axios.get(
  //         `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
  //         { withCredentials: true },
  //       );

  //       const userData = {
  //         id: res.data.data.userId,
  //         name: res.data.data.nickname,
  //         profileImage: res.data.data.profileImageUrl,
  //       };

  //       setUserState(userData);
  //     } catch {
  //       // ❌ 토큰 없거나 만료 → 비로그인
  //       setUserState(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchMe();
  // }, []);

  // const setUser = (user: User | null) => {
  //   setUserState(user);
  // };

 
  
  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
