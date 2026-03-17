"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { apiClient } from "@/lib/api-client"; // Import your provided client
import { X, Loader2, Smartphone, Mail, ArrowLeft } from "lucide-react";
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

  const setAuth = useAuthStore((s) => s.setAuth);
  const cartItems = useCartStore((s) => s.items);

  // Mutation to Send OTP using apiClient
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
    onError: (error: string) => {
      toast.error(error); // Shows "Invalid or expired OTP" or "AccessDenied"
    },
  });

  // Mutation to Verify OTP using apiClient
  // src/components/auth/OtpModal.tsx

const verifyOtpMutation = useMutation({
  mutationFn: (otpCode: string) => 
    apiClient.post('/auth/verify-otp', { 
      identifier, 
      otp: otpCode, 
      cartItems 
    }),
  onSuccess: (data: any) => {
    // LOG: Verify what data looks like here
    console.log("📦 [OtpModal] Received Data:", data);

    if (data?.access_token) {
      // Ensure key matches: backend returns 'access_token', store uses 'accessToken'
      setAuth(data.user, data.access_token); 
      
      toast.success('Welcome back!');
      
      // Delay closing/onSuccess slightly to ensure Zustand state propagates
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 100);
    }
  },
  onError: (error: any) => {
    toast.error(error?.message || "Verification failed");
  }
});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#006044]/10 text-[#006044] rounded-full mb-4">
              {step === 1 ? <Smartphone size={32} /> : <Mail size={32} />}
            </div>
            <h2 className="text-2xl font-black text-gray-800">
              {step === 1 ? "Login / Sign Up" : "Verify OTP"}
            </h2>
          </div>

          <div className="space-y-4">
            {step === 1 ? (
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
                  {sendOtpMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Continue"
                  )}
                </Button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter Code"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-2xl tracking-[0.3em] font-black focus:ring-2 focus:ring-[#006044] outline-none"
                />
                <Button
                  onClick={() => verifyOtpMutation.mutate(otp)}
                  disabled={otp.length < 6 || verifyOtpMutation.isPending}
                  className="w-full h-14 bg-[#006044] hover:bg-[#004d3d] rounded-2xl text-lg font-bold"
                >
                  {verifyOtpMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Verify & Login"
                  )}
                </Button>
                <button
                  onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-500 mt-2"
                >
                  <ArrowLeft size={16} /> Edit Details
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
