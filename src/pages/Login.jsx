import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function Login() {
    const { user, signIn, signUp, signInWithGoogle } = useAuth();
    const [tab, setTab] = useState("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    if (user) return <Navigate to="/" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            if (tab === "signin") {
                const { error } = await signIn(email, password);
                if (error) throw error;
            } else {
                const { error } = await signUp(email, password);
                if (error) throw error;
                setMessage("✅ Account created! Check your email to confirm, then sign in.");
                setTab("signin");
            }
        } catch (err) {
            console.error("Auth error:", err);
            if (err.message === "Invalid login credentials") {
                setError("❌ Invalid email or password. Please try again.");
            } else if (err.message === "Email not confirmed") {
                setError("⚠️ Email not confirmed. Please check your inbox for the confirmation link.");
            } else {
                setError(err.message || "Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        setGoogleLoading(true);
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (err) {
            console.error("Google Auth error:", err);
            if (err.message?.includes("provider is not enabled")) {
                setError("⚠️ Google Sign-In is not yet enabled in the Supabase dashboard. Please follow the setup instructions.");
            } else {
                setError(err.message || "Google Sign-In failed. Please try again.");
            }
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-var(--nav-height)-2.5rem)] flex items-center justify-center px-4 relative overflow-hidden bg-liquid">
            <div className="w-full max-w-md animate-reveal">
                {/* Logo Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-500/20 mb-6 animate-float">
                        <Search size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-main mb-2">
                        ODDE<span className="text-blue-500">SEARCH</span>
                    </h1>
                    <p className="text-muted text-sm font-medium tracking-wide uppercase opacity-70">
                        The Future of Search
                    </p>
                </div>

                {/* Auth Card */}
                <div className="glass-premium rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

                    {/* Tabs */}
                    <div className="flex rounded-2xl bg-white/5 p-1.5 mb-10 border border-white/5">
                        {["signin", "signup"].map((t) => (
                            <button
                                key={t}
                                onClick={() => { setTab(t); setError(""); setMessage(""); }}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-500 ${tab === t
                                    ? "bg-blue-500 text-white shadow-xl shadow-blue-500/25"
                                    : "text-muted hover:text-main hover:bg-white/5"
                                    }`}
                            >
                                {t === "signin" ? "Sign In" : "Sign Up"}
                            </button>
                        ))}
                    </div>

                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white text-slate-900 py-3.5 text-sm font-bold hover:bg-slate-100 active:scale-[0.98] transition-all mb-8 shadow-xl"
                    >
                        {googleLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </button>

                    <div className="relative mb-8 text-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <span className="relative px-4 text-[10px] font-black uppercase tracking-widest text-muted bg-transparent">Or with email</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative group">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-main placeholder:text-muted outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                        </div>

                        <div className="relative group">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type={showPass ? "text" : "password"}
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-sm text-main placeholder:text-muted outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-main transition-colors"
                            >
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {error && (
                            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 px-5 py-4 text-xs font-medium text-red-400 animate-reveal">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4 text-xs font-medium text-emerald-400 animate-reveal">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 py-4 text-white font-bold hover:from-blue-500 hover:to-blue-400 active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20 disabled:opacity-60 mt-4"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    {tab === "signin" ? "Sign In" : "Create Account"}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-muted mt-10">
                        {tab === "signin" ? (
                            <>New to OddeSearch?{" "}
                                <button onClick={() => setTab("signup")} className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                                    Join now
                                </button>
                            </>
                        ) : (
                            <>Already a member?{" "}
                                <button onClick={() => setTab("signin")} className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                                    Sign in
                                </button>
                            </>
                        )}
                    </p>
                </div>

                <p className="text-center text-[10px] text-muted mt-10 uppercase tracking-[0.2em] font-bold opacity-40">
                    Secure • Private • Premium
                </p>
            </div>
        </div>
    );
}
