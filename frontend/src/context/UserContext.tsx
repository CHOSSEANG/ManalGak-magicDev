'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: number
  name: string
  profileImage?: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUserState(JSON.parse(stored))
  }, [])

  // ✅ null도 받을 수 있게 수정
  const setUser = (user: User | null) => {
    if (user === null) {
      localStorage.removeItem('user')
      setUserState(null)
    } else {
      localStorage.setItem('user', JSON.stringify(user))
      setUserState(user)
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
