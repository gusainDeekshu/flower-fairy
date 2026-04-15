// src\components\auth\OtpModal.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { apiClient } from "@/lib/api-client";
import { X, Loader2, Smartphone, Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function OtpModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  
  // Extension states for Phone Flow
  const [tempToken, setTempToken] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const { syncCart } = useCartStore();
  const setAuth = useAuthStore((s) => s.setAuth);

  const resetModal = () => {
    setStep(1);
    setIdentifier("");
    setOtp("");
    setTempToken("");
    setNewPhone("");
    setPhoneOtp("");
    onClose();
  };

  const handleLoginSuccess = async (data: any) => {
    setAuth(data.user, data.access_token);
    toast.success("Welcome back!");
    
    // 🔥 FIX: Force a micro-task delay. 
    // This guarantees useAuthStore has fully propagated the token 
    // to your Axios interceptors before the cart API requests begin.
    await new Promise(resolve => setTimeout(resolve, 50)); 

    try { 
      await syncCart(); 
    } catch (e) { 
      console.error("Cart sync failed:", e); 
    }
    
    resetModal();
    onSuccess();
  };

  // Step 1: Request Email/Phone OTP
  const sendOtpMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.post("/auth/send-otp", {
        identifier: id,
        type: id.includes("@") ? "email" : "phone",
      }),
    onSuccess: () => {
      setStep(2);
      toast.success("OTP sent successfully!");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to send OTP"),
  });

  // Step 2: Verify First OTP
  const verifyOtpMutation = useMutation({
    mutationFn: (otpCode: string) =>
      apiClient.post("/auth/verify-otp", { identifier, otp: otpCode }),
    onSuccess: async (resOrData: any) => {
      // 🔥 FIX: Safely extract data whether apiClient unwraps it or not
      const data = resOrData?.data || resOrData;
      
      if (data?.requiresPhone) {
        setTempToken(data.tempToken);
        setStep(3);
        toast.info("Please link a mobile number to secure your account");
      } else if (data?.access_token) {
        await handleLoginSuccess(data);
      }
    },
    onError: (err: any) => {
      console.error("OTP Error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Invalid or expired OTP");
    },
  });

  // Step 3: Request Phone OTP (Temp Flow)
  const sendPhoneOtpMutation = useMutation({
    mutationFn: (phone: string) =>
      apiClient.post("/auth/send-otp", { identifier: phone, type: "phone" }),
    onSuccess: () => {
      setStep(4);
      toast.success("OTP sent to mobile number!");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to send OTP"),
  });

  // Step 4: Verify Phone & Complete Profile
  const verifyPhoneOtpMutation = useMutation({
    mutationFn: (otpCode: string) =>
      apiClient.post("/auth/verify-phone-otp", {
        phone: newPhone,
        otp: otpCode,
        tempToken,
      }),
    onSuccess: async (resOrData: any) => {
      // 🔥 FIX: Safely extract data whether apiClient unwraps it or not
      const data = resOrData?.data || resOrData;

      if (data?.access_token) {
        await handleLoginSuccess(data);
      }
    },
    onError: (err: any) => {
      console.error("Phone OTP Error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Invalid OTP or Phone already in use");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetModal} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={resetModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#006044]/10 text-[#006044] rounded-full mb-4">
              {step === 1 && <Smartphone size={32} />}
              {step === 2 && <Mail size={32} />}
              {step === 3 && <Smartphone size={32} />}
              {step === 4 && <ShieldCheck size={32} />}
            </div>
            <h2 className="text-2xl font-black text-gray-800">
              {step === 1 && "Login / Sign Up"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Secure Account"}
              {step === 4 && "Verify Mobile"}
            </h2>
            {step === 3 && (
              <p className="text-sm text-gray-500 mt-2">
                Mobile number is mandatory for tracking orders.
              </p>
            )}
          </div>

          <div className="space-y-4">
            {step === 1 && (
              <>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Email or Phone"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#006044] outline-none"
                />
                <Button
                  onClick={() => sendOtpMutation.mutate(identifier)}
                  disabled={!identifier || sendOtpMutation.isPending}
                  className="w-full h-14 bg-[#006044] hover:bg-[#004d3d] rounded-2xl text-lg font-bold"
                >
                  {sendOtpMutation.isPending ? <Loader2 className="animate-spin" /> : "Continue"}
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit Code"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-2xl tracking-[0.3em] font-black focus:ring-2 focus:ring-[#006044] outline-none"
                />
                <Button
                  onClick={() => verifyOtpMutation.mutate(otp)}
                  disabled={otp.length < 6 || verifyOtpMutation.isPending}
                  className="w-full h-14 bg-[#006044] hover:bg-[#004d3d] rounded-2xl text-lg font-bold"
                >
                  {verifyOtpMutation.isPending ? <Loader2 className="animate-spin" /> : "Verify"}
                </Button>
                <button
                  onClick={() => { setStep(1); setOtp(""); }}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-500 mt-2 hover:text-gray-700 transition"
                >
                  <ArrowLeft size={16} /> Edit Details
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter Mobile Number"
                    className="w-full pl-14 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#006044] outline-none"
                  />
                </div>
                <Button
                  onClick={() => sendPhoneOtpMutation.mutate(newPhone)}
                  disabled={newPhone.length !== 10 || sendPhoneOtpMutation.isPending}
                  className="w-full h-14 bg-[#006044] hover:bg-[#004d3d] rounded-2xl text-lg font-bold"
                >
                  {sendPhoneOtpMutation.isPending ? <Loader2 className="animate-spin" /> : "Send OTP"}
                </Button>
              </>
            )}

            {step === 4 && (
              <>
                <input
                  type="text"
                  maxLength={6}
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value)}
                  placeholder="Enter Mobile OTP"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-2xl tracking-[0.3em] font-black focus:ring-2 focus:ring-[#006044] outline-none"
                />
                <Button
                  onClick={() => verifyPhoneOtpMutation.mutate(phoneOtp)}
                  disabled={phoneOtp.length < 6 || verifyPhoneOtpMutation.isPending}
                  className="w-full h-14 bg-[#006044] hover:bg-[#004d3d] rounded-2xl text-lg font-bold"
                >
                  {verifyPhoneOtpMutation.isPending ? <Loader2 className="animate-spin" /> : "Confirm & Login"}
                </Button>
                <button
                  onClick={() => { setStep(3); setPhoneOtp(""); }}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-500 mt-2 hover:text-gray-700 transition"
                >
                  <ArrowLeft size={16} /> Edit Mobile Number
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}