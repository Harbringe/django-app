import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            isLoggedIn: () => {
                const accessToken = Cookies.get('access_token')
                return !!accessToken
            },
            logout: () => {
                Cookies.remove('access_token')
                Cookies.remove('refresh_token')
                set({ user: null })
            }
        }),
        {
            name: 'auth-storage'
        }
    )
)