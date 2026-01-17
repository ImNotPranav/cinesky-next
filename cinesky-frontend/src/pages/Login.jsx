import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

export default function Login() {
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { login, signup, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (isSignup && !name) {
            setError("Please enter your name");
            return;
        }

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        if (isSignup && password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            if (isSignup) {
                await signup(name, email, password);
                setSuccess("Account created! Please sign in.");
                setIsSignup(false);
                setName("");
                setPassword("");
                setConfirmPassword("");
            } else {
                await login(email, password);
                navigate("/");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="bg-[#121212] rounded-2xl p-8 shadow-2xl border border-white/5">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {isSignup ? "Create Account" : "Welcome Back"}
                            </h1>
                            <p className="text-white/50">
                                {isSignup
                                    ? "Sign up to start your journey"
                                    : "Sign in to continue to CineSky"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm">
                                    {success}
                                </div>
                            )}

                            {isSignup && (
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C43A3A] transition-colors"
                                        placeholder="Your name"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-white/70 text-sm mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C43A3A] transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C43A3A] transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            {isSignup && (
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C43A3A] transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#C43A3A] to-[#a82e2e] text-white font-semibold py-3 rounded-lg hover:from-[#d44444] hover:to-[#b83535] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? "Please wait..."
                                    : isSignup
                                        ? "Create Account"
                                        : "Sign In"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => {
                                    setIsSignup(!isSignup);
                                    setError("");
                                    setSuccess("");
                                }}
                                className="text-white/50 hover:text-[#C43A3A] transition-colors text-sm"
                            >
                                {isSignup
                                    ? "Already have an account? Sign in"
                                    : "Don't have an account? Sign up"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
