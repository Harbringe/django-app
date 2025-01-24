import { useEffect } from 'react'
import { logout } from '../../utils/auth'
import { Link } from 'react-router-dom'

const Logout = () => {
    useEffect(() => {
        logout()
    }, [])

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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <h2 className="text-5xl font-extrabold mb-3 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-indigo-200">
                            Logged Out
                        </span>
                    </h2>
                    <p className="text-white/70 text-lg font-medium">You have been successfully logged out</p>
                </div>

                <div className="bg-gradient-to-br from-white/[0.12] to-white/[0.06] p-8 rounded-2xl shadow-2xl 
                    border border-white/20 transform transition-transform duration-300 hover:scale-[1.01] 
                    relative overflow-hidden will-change-transform"
                >
                    <div className="flex flex-col space-y-4">
                        <Link
                            to="/login"
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 
                                text-white font-bold rounded-xl hover:scale-[1.02] focus:outline-none 
                                focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transform transition-all 
                                duration-300 relative overflow-hidden hover-lift text-center
                                shadow-[0_4px_20px_rgba(79,70,229,0.4)] hover:shadow-[0_8px_25px_rgba(79,70,229,0.5)]
                                border-2 border-indigo-500/50 text-lg tracking-wide hover:from-indigo-500 hover:via-blue-500 hover:to-indigo-500"
                        >
                            Sign In Again
                        </Link>
                        
                        <Link
                            to="/register"
                            className="w-full py-4 bg-gradient-to-r from-white/[0.08] to-white/[0.04]
                                text-white font-bold rounded-xl hover:scale-[1.02] focus:outline-none 
                                focus:ring-2 focus:ring-white/30 focus:ring-offset-2 transform transition-all 
                                duration-300 relative overflow-hidden hover-lift text-center
                                border border-white/20 text-lg tracking-wide hover:bg-white/[0.12]"
                        >
                            Create New Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Logout