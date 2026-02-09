
import React, { useEffect, useState } from "react";
import { useRequestOtp, useForgetPasswordVerify } from "./hooks";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
interface Bubble {
  id: number;
  size: number;
  x: number;
  delay: number;
  duration: number;
}

const generateBubbles = (count: number): Bubble[] =>
  Array.from({ length: count }).map((_, i) => ({
    id: i,
    size: 40 + Math.random() * 60,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 8 + Math.random() * 5,
  }));

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  const requestOtpMutation = useRequestOtp();
  const verifyOtpMutation = useForgetPasswordVerify();
const navigate = useNavigate();

  useEffect(() => {
    setBubbles(generateBubbles(15));
  }, []);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return toast.error("Please enter your username");

    setLoading(true);
    requestOtpMutation.mutate(
      {userName: username },
      {
        onSuccess: () => {
          setStep(2);
        },
        onError: (err: any) => console.log(err?.message || "Failed to send OTP"),
        onSettled: () => setLoading(false),
      }
    );
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) return toast.error("Please fill all fields");

    setLoading(true);
    verifyOtpMutation.mutate(
      { username, otp, newPassword },
      {
        onSuccess: () => {
          setStep(1);
          setUsername("");
          setOtp("");
          setNewPassword("");
              navigate("/app/login");

        },
        onError: (err: any) => console.log(err?.message || "OTP verification failed"),
        onSettled: () => setLoading(false),
      }
    );
  };

  return (
      <div className="relative min-h-screen bg-gradient-to-tr from-cyan-900 via-black to-purple-900 flex items-center justify-center overflow-hidden font-sans">
      {/* Animated Bubbles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full bg-gradient-to-r from-cyan-500 to-purple-500/50 shadow-lg"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.x}%`,
              bottom: "-100px",
            }}
            animate={{
              y: ["0%", "-130vh"],
              scale: [1, 1.2, 0.8],
              opacity: [0.1, 0.3, 0],
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      {/* <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" /> */}


      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
        <h2 className="text-4xl font-extrabold text-center text-white drop-shadow mb-2">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        <p className="text-center text-gray-300 mb-8">
          {step === 1
            ? "Enter your username to receive an OTP ✨"
            : "Enter OTP and new password to reset your password ✨"}
        </p>

        <form
          onSubmit={step === 1 ? handleRequestOtp : handleVerifyOtp}
          className="space-y-6"
        >

          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={step === 2}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-white/5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {step === 2 && (
            <>
  <div className="mb-4 flex flex-col items-center">
  <label className="text-gray-300 mb-2 text-center block">OTP</label>
  <InputOTP
    maxLength={6}
    value={otp}
    onChange={setOtp}
    className="flex justify-center gap-2"
  >
    <InputOTPGroup className="flex justify-center gap-2">
      <InputOTPSlot index={0} className="w-12 h-12 text-center rounded-xl border border-gray-600 bg-white/5 text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none" />
      <InputOTPSlot index={1} className="w-12 h-12 text-center rounded-xl border border-gray-600 bg-white/5 text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none" />
      <InputOTPSlot index={2} className="w-12 h-12 text-center rounded-xl border border-gray-600 bg-white/5 text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none" />
      <InputOTPSlot index={3} className="w-12 h-12 text-center rounded-xl border border-gray-600 bg-white/5 text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none" />
      <InputOTPSlot index={4} className="w-12 h-12 text-center rounded-xl border border-gray-600 bg-white/5 text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none" />
      <InputOTPSlot index={5} className="w-12 h-12 text-center rounded-xl border border-gray-600 bg-white/5 text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none" />
    </InputOTPGroup>
  </InputOTP>
</div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-white/5 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 outline-none transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </>
          )}

     <motion.button
               type="submit"
               disabled={loading}
               whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px cyan" }}
               whileTap={{ scale: 0.97 }}
               className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             >
  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
  {loading
    ? step === 1
      ? "Sending OTP..."
      : "Verifying..."
    : step === 1
    ? "Send OTP"
    : "Reset Password"}
</motion.button>
        </form>

        {step === 2 && (
          <p className="mt-4 text-center text-gray-300">
            Didn’t receive OTP?{" "}
            <button
              onClick={() => setStep(1)}
              className="text-blue-400 font-semibold hover:underline"
            >
              Resend
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
