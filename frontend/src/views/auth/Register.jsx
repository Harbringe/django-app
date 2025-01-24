import { useState, useEffect } from 'react'
import { register } from '../../utils/auth'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

const Register = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const resetForm = () => {
        setFullName("");
        setEmail("");
        setPhoneNumber("");
        setPassword("");
        setPassword2("");
        setError("");
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        
        if (password !== password2) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const { data, error: registrationError } = await register(
                fullName,
                email,
                phoneNumber,
                password,
                password2
            );

            if (registrationError) {
                setError(registrationError);
                return;
            }

            console.log("Registration successful:", data);
            resetForm();
            navigate("/login");
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden gradient-move">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full animate-float opacity-20">
                    <div className="absolute w-[500px] h-[500px] bg-purple-500 rounded-full filter blur-[80px] -top-20 -left-20"></div>
                    <div className="absolute w-[400px] h-[400px] bg-blue-500 rounded-full filter blur-[80px] top-3/4 left-1/4"></div>
                    <div className="absolute w-[600px] h-[600px] bg-indigo-500 rounded-full filter blur-[80px] -top-1/4 left-3/4"></div>
                </div>
            </div>

            <div className="max-w-lg w-full mx-4 relative z-10">
                <div className="text-center mb-10 animate-fadeIn">
                    <div className="inline-block p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 mb-6 animate-glow hover-lift border border-white/10">
                        <svg className="w-14 h-14 text-white transform hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h2 className="text-5xl font-extrabold mb-3 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-indigo-200">
                            Create Account
                        </span>
                    </h2>
                    <p className="text-white/70 text-lg font-medium">Join our learning platform today</p>
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

                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                    <div className="shimmer absolute inset-0"></div>
                    
                    <form className="space-y-6 relative" onSubmit={handleRegister}>
                        <div className="animate-slideIn space-y-2">
                            <label htmlFor="full-name" className="block text-sm font-medium text-white/90">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-5 py-3.5 bg-white/[0.07] border border-white/[0.15] rounded-xl 
                                    text-white placeholder-white/40 input-highlight hover-lift focus:bg-white/[0.09]
                                    transition-all duration-300 focus:border-indigo-400/50"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>

                        <div className="animate-slideIn space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-white/90">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-5 py-3.5 bg-white/[0.07] border border-white/[0.15] rounded-xl 
                                    text-white placeholder-white/40 input-highlight hover-lift focus:bg-white/[0.09]
                                    transition-all duration-300 focus:border-indigo-400/50"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="animate-slideIn space-y-2">
                            <label htmlFor="phone-number" className="block text-sm font-medium text-white/90">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                pattern="[0-9]*"
                                required
                                className="w-full px-5 py-3.5 bg-white/[0.07] border border-white/[0.15] rounded-xl 
                                    text-white placeholder-white/40 input-highlight hover-lift focus:bg-white/[0.09]
                                    transition-all duration-300 focus:border-indigo-400/50"
                                placeholder="Enter your phone number"
                                value={phoneNumber}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '')
                                    setPhoneNumber(value)
                                }}
                            />
                        </div>

                        <div className="animate-slideIn space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-white/90">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-5 py-3.5 bg-white/[0.07] border border-white/[0.15] rounded-xl 
                                    text-white placeholder-white/40 input-highlight hover-lift focus:bg-white/[0.09]
                                    transition-all duration-300 focus:border-indigo-400/50"
                                placeholder="••••••••"
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
                                placeholder="••••••••"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
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
                                        <span>Creating account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>

                        <div className="text-center text-white/70 mt-8 animate-fadeIn">
                            Already have an account?{' '}
                            <Link to="/login" 
                                className="text-indigo-300 hover:text-indigo-200 font-semibold hover-lift 
                                    inline-block transition-all duration-300"
                            >
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
