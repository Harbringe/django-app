import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import apiInstance from '../../utils/axios'
import Swal from 'sweetalert2'

const CreatePassword = () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const otp = searchParams.get('otp')
    const uidb64 = searchParams.get('uidb64')
    const reset_token = searchParams.get('reset_token')

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setIsLoading(true)

        try {
            await apiInstance.post('user/password-change/', {
                password,
                otp,
                uidb64,
                reset_token
            })
            
            Swal.fire({
                icon: 'success',
                title: 'Password Changed Successfully',
                text: 'You can now login with your new password'
            })
            navigate("/login")
        } catch (error) {
            console.error('Password change error:', error.response?.data || error)
            setError(error.response?.data?.detail || "An error occurred. Please try again.")
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.detail || 'Failed to change password. Please try again.'
            })
        } finally {
            setIsLoading(false)
        }
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-5xl font-extrabold mb-3 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-indigo-200">
                            Create New Password
                        </span>
                    </h2>
                    <p className="text-white/70 text-lg font-medium">Enter your new password below</p>
                </div>

                <div className="bg-gradient-to-br from-white/[0.12] to-white/[0.06] p-8 rounded-2xl shadow-2xl 
                    border border-white/20 transform transition-transform duration-300 hover:scale-[1.01] 
                    relative overflow-hidden will-change-transform"
                >
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-white text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="space-y-6 relative">
                        <div className="animate-slideIn space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-white/90">
                                New Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-5 py-3.5 bg-white/[0.07] border border-white/[0.15] rounded-xl 
                                    text-white placeholder-white/40 input-highlight hover-lift focus:bg-white/[0.09]
                                    transition-all duration-300 focus:border-indigo-400/50"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="animate-slideIn space-y-2">
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-white/90">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-5 py-3.5 bg-white/[0.07] border border-white/[0.15] rounded-xl 
                                    text-white placeholder-white/40 input-highlight hover-lift focus:bg-white/[0.09]
                                    transition-all duration-300 focus:border-indigo-400/50"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 
                                text-white font-bold rounded-xl hover:scale-[1.02] focus:outline-none 
                                focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transform transition-all 
                                duration-300 disabled:opacity-50 relative overflow-hidden hover-lift
                                shadow-[0_4px_20px_rgba(79,70,229,0.4)] hover:shadow-[0_8px_25px_rgba(79,70,229,0.5)]
                                border-2 border-indigo-500/50 text-lg tracking-wide hover:from-indigo-500 hover:via-blue-500 hover:to-indigo-500"
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Updating Password...</span>
                                    </>
                                ) : (
                                    "Update Password"
                                )}
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreatePassword