

import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, User, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "./hook";
import { useAuth } from "@/components/context/auth-context";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { login } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    loginMutation.mutate(
      { username: email, password },
      {
        onSuccess: (response) => {
          const authMode = import.meta.env.VITE_AUTH_MODE;
          const user = response?.user;
          if ( !user ) {
            setErrorMessage("Login failed. Please check your credentials.");
            return;
          }
          if (authMode === "header") {
            const token = response?.token;
            if (token) sessionStorage.setItem("token", token);
            if (user) sessionStorage.setItem("user", JSON.stringify(user));
            login(user);
          } else {
            sessionStorage.setItem("user", JSON.stringify(user));
            login(user);
          }
          navigate("/dashboard");
        },

        onError: () => {
          setErrorMessage("Login failed. Please check your credentials.");
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full mix-blend-screen filter blur-xl opacity-30 animate-pulse"
            style={{
              background: `radial-gradient(circle, ${i % 2 === 0 ? "#06b6d4" : "#d946ef"
                }, transparent)`,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Mouse Follower Gradient */}
        <div
          className="absolute w-96 h-96 rounded-full mix-blend-screen filter blur-3xl opacity-20 transition-all duration-300 ease-out"
          style={{
            background: "radial-gradient(circle, #06b6d4, transparent)",
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          {/* Left Section - Branding */}
          <div className="hidden lg:flex flex-col space-y-8 text-gray-900 dark:text-white animate-fadeIn">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-linear-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce-slow">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SecureHub
                </h1>
              </div>
              <p className="text-2xl font-light text-gray-600 dark:text-gray-300">
                Your trusted gateway to secure management
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: "🚀", text: "Fast & Reliable Access" },
                { icon: "🔒", text: "Enterprise-Grade Security" },
                { icon: "⚡", text: "Lightning Fast Performance" },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-4 bg-white/5 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-4 border border-gray/10 dark:border-gray-700 hover:bg-white/10 dark:hover:bg-gray-700/30 transition-all duration-300"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <span className="text-3xl">{feature.icon}</span>
                  <span className="text-lg text-gray-700 dark:text-gray-300">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:flex justify-center">
            <div className="relative h-125 w-px">
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-cyan-400/60 to-transparent" />
              <div className="absolute inset-0 blur-md bg-linear-to-b from-transparent via-purple-400/40 to-transparent" />
              <div className="absolute top-1/4 -left-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <div className="absolute top-1/2 -left-1 w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-200" />
              <div className="absolute top-3/4 -left-1 w-2 h-2 rounded-full bg-pink-400 animate-pulse delay-500" />
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="w-full">
            <div className="relative">
              <div
                className="relative 
              bg-white/90 dark:bg-gray-900/90
              backdrop-blur-2xl 
              border border-gray-200 dark:border-white/15 
              rounded-3xl 
              p-8 md:p-12 
              shadow-lg dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              >
                <div className="text-center item center">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text">
                    Welcome Back
                  </h2>
                  <p className="text-gray-700 dark:text-gray-400 mb-8">
                    Sign in to continue to your dashboard
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm flex items-center space-x-2 animate-slideDown">
                    <span>⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Username Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                      <div className="relative flex items-center">
                        <User className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="text"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:bg-gray-50 dark:focus:bg-gray-900 transition-all"
                          placeholder="Enter your username"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                      <div className="relative flex items-center">
                        <Lock className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-12 pr-12 py-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:bg-gray-50 dark:focus:bg-gray-900 transition-all"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-4 text-gray-400 hover:text-cyan-400 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="relative w-full py-4 bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 text-white font-semibold rounded-xl shadow-lg overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform"
                    >
                      <span className="relative z-10">
                        {loading ? "Signing in..." : "Sign In"}
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <a
                    href="/forgot-password"
                    className="text-cyan-500 dark:text-cyan-400 hover:text-cyan-400 dark:hover:text-cyan-300 text-sm font-medium transition-colors"
                  >
                    Forgot your password?
                  </a>
                </div>

                <div className="mt-8 flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 text-xs">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>
                    Copyright ©{" "}
                    <a
                      href="https://zionit.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-500 hover:text-cyan-400 transition-colors"
                    >
                      Zionit Website
                    </a>{" "}
                    2025.
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
      `}</style>
    </div>
  );
};

export default LoginPage;
