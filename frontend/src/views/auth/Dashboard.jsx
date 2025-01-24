import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'
import Swal from 'sweetalert2'

const Dashboard = () => {
    const navigate = useNavigate()
    const [isLoggedIn, user] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user,
    ])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            if (!isLoggedIn()) {
                navigate('/login')
                return
            }
            
            if (!user) {
                Swal.fire({
                    icon: 'error',
                    title: 'Session Expired',
                    text: 'Please login again'
                })
                navigate('/login')
                return
            }
            
            setLoading(false)
        }

        checkAuth()
    }, [isLoggedIn, navigate, user])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden gradient-move">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full animate-float opacity-20">
                    <div className="absolute w-[500px] h-[500px] bg-purple-500 rounded-full filter blur-[80px] -top-20 -left-20"></div>
                    <div className="absolute w-[400px] h-[400px] bg-blue-500 rounded-full filter blur-[80px] top-3/4 left-1/4"></div>
                    <div className="absolute w-[600px] h-[600px] bg-indigo-500 rounded-full filter blur-[80px] -top-1/4 left-3/4"></div>
                </div>
            </div>

            <div className="max-w-md w-full mx-4 relative z-10">
                <div className="text-center mb-10 animate-fadeIn">
                    <div className="inline-block p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 mb-6 animate-glow hover-lift border border-white/10">
                        <svg className="w-14 h-14 text-white transform hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <h2 className="text-5xl font-extrabold mb-3 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-indigo-200">
                            Welcome Back
                        </span>
                    </h2>
                    <p className="text-white/70 text-lg font-medium">
                        Welcome back, {user?.full_name}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-white/[0.12] to-white/[0.06] p-8 rounded-2xl shadow-2xl 
                    border border-white/20 transform transition-transform duration-300 hover:scale-[1.01] 
                    relative overflow-hidden will-change-transform"
                >
                    <div className="space-y-6">
                        <div className="text-white/80">
                            <h3 className="text-xl font-semibold mb-4">Account Details</h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-white/[0.07] rounded-lg">
                                    <p className="text-white/60 text-sm">Full Name</p>
                                    <p className="text-white font-medium">{user?.full_name || 'Not available'}</p>
                                </div>
                                <div className="p-3 bg-white/[0.07] rounded-lg">
                                    <p className="text-white/60 text-sm">Email Address</p>
                                    <p className="text-white font-medium">{user?.email || 'Not available'}</p>
                                </div>
                                <div className="p-3 bg-white/[0.07] rounded-lg">
                                    <p className="text-white/60 text-sm">Phone Number</p>
                                    <p className="text-white font-medium">{user?.phone_number || 'Not available'}</p>
                                </div>
                                <div className="p-3 bg-white/[0.07] rounded-lg">
                                    <p className="text-white/60 text-sm">User ID</p>
                                    <p className="text-white font-medium">{user?.user_id || 'Not available'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <Link
                                to="/profile"
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 
                                    text-white font-bold rounded-xl hover:scale-[1.02] focus:outline-none 
                                    focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transform transition-all 
                                    duration-300 relative overflow-hidden hover-lift text-center
                                    shadow-[0_4px_20px_rgba(79,70,229,0.4)] hover:shadow-[0_8px_25px_rgba(79,70,229,0.5)]
                                    border-2 border-indigo-500/50 text-lg tracking-wide hover:from-indigo-500 hover:via-blue-500 hover:to-indigo-500"
                            >
                                Edit Profile
                            </Link>
                            
                            <Link
                                to="/logout"
                                className="w-full py-4 bg-gradient-to-r from-white/[0.08] to-white/[0.04]
                                    text-white font-bold rounded-xl hover:scale-[1.02] focus:outline-none 
                                    focus:ring-2 focus:ring-white/30 focus:ring-offset-2 transform transition-all 
                                    duration-300 relative overflow-hidden hover-lift text-center
                                    border border-white/20 text-lg tracking-wide hover:bg-white/[0.12]"
                            >
                                Sign Out
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
