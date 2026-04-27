// src/components/auth/OtpModal.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { apiClient } from "@/lib/api-client";
import {
  X,
  Loader2,
  Smartphone,
  Mail,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BRAND } from "@/config/brand.config";

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

    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      await syncCart();
    } catch (e) {
      console.error("Cart sync failed:", e);
    }

    resetModal();
    onSuccess();
  };

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
    onError: (err: any) =>
      toast.error(
        err?.response?.data?.message || "Failed to send OTP"
      ),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (otpCode: string) =>
      apiClient.post("/auth/verify-otp", {
        identifier,
        otp: otpCode,
      }),
    onSuccess: async (resOrData: any) => {
      const data = resOrData?.data || resOrData;

      if (data?.requiresPhone) {
        setTempToken(data.tempToken);
        setStep(3);
      } else if (data?.access_token) {
        await handleLoginSuccess(data);
      }
    },
    onError: (err: any) =>
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid OTP"
      ),
  });

  const sendPhoneOtpMutation = useMutation({
    mutationFn: (phone: string) =>
      apiClient.post("/auth/send-otp", {
        identifier: phone,
        type: "phone",
      }),
    onSuccess: () => {
      setStep(4);
      toast.success("OTP sent!");
    },
  });

  const verifyPhoneOtpMutation = useMutation({
    mutationFn: (otpCode: string) =>
      apiClient.post("/auth/verify-phone-otp", {
        phone: newPhone,
        otp: otpCode,
        tempToken,
      }),
    onSuccess: async (resOrData: any) => {
      const data = resOrData?.data || resOrData;

      if (data?.access_token) {
        await handleLoginSuccess(data);
      }
    },
    onError: (err: any) =>
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid OTP"
      ),
  });

  if (!isOpen) return null;

  const getStepTitle = () => {
    if (step === 1) return "Login / Sign Up";
    if (step === 2) return "Verify OTP";
    if (step === 3) return "Secure Account";
    return "Verify Mobile";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={resetModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
        {/* Close */}
        <button
          onClick={resetModal}
          className="absolute top-5 right-5 z-20 rounded-full bg-white/90 p-2 text-gray-500 transition hover:text-black"
        >
          <X size={18} />
        </button>

        <div className="grid min-h-[620px] md:grid-cols-[1.15fr_0.85fr]">
          {/* LEFT BRAND PANEL */}
          <div
            className="relative hidden md:flex flex-col justify-center px-14 py-16 text-white"
            style={{
              background: BRAND.theme.primary,
            }}
          >
            {/* Decorative Glow */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_35%)]" />

            {/* Logo */}
            <div className="relative mb-12">
              <Image
                src={BRAND.logo}
                alt={BRAND.name}
                width={180}
                height={60}
                priority
                className="object-contain"
              />
            </div>

            {/* Headline */}
            <h2 className="text-4xl font-black leading-tight max-w-md">
              Login now to unlock exclusive offers
            </h2>

            <p className="mt-5 text-white/80 text-base leading-relaxed max-w-md">
              Access your account, track orders, save favourites,
              and enjoy seamless shopping with {BRAND.name}.
            </p>

            {/* Footer info */}
            <div className="mt-12 space-y-3 text-sm text-white/80">
              <p>{BRAND.phone}</p>
              <p>{BRAND.email}</p>
            </div>
          </div>

          {/* RIGHT FORM PANEL */}
          <div className="flex items-center justify-center bg-white px-6 py-10 sm:px-10">
            <div className="w-full max-w-sm">
              {/* Mobile logo */}
              <div className="mb-8 flex justify-center md:hidden">
                <Image
                  src={BRAND.logo}
                  alt={BRAND.name}
                  width={140}
                  height={48}
                />
              </div>

              {/* Step icon */}
              <div className="mb-8 text-center">
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: `${BRAND.theme.primary}15`,
                    color: BRAND.theme.primary,
                  }}
                >
                  {step === 1 && <Smartphone size={28} />}
                  {step === 2 && <Mail size={28} />}
                  {step === 3 && <Smartphone size={28} />}
                  {step === 4 && <ShieldCheck size={28} />}
                </div>

                <h3 className="text-2xl font-black text-gray-900">
                  {getStepTitle()}
                </h3>
              </div>

              <div className="space-y-4">
                {/* STEP 1 */}
                {step === 1 && (
                  <>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) =>
                        setIdentifier(e.target.value)
                      }
                      placeholder="Email or Phone Number"
                      className="h-14 w-full rounded-xl border border-gray-200 px-5 outline-none transition focus:border-transparent focus:ring-2"
                    />

                    <Button
                      onClick={() =>
                        sendOtpMutation.mutate(identifier)
                      }
                      disabled={
                        !identifier || sendOtpMutation.isPending
                      }
                      className="h-14 w-full rounded-xl text-base font-bold"
                      style={{
                        backgroundColor: BRAND.theme.primary,
                      }}
                    >
                      {sendOtpMutation.isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="h-14 w-full rounded-xl border border-gray-200 px-5 text-center text-2xl font-black tracking-[0.25em] outline-none"
                    />

                    <Button
                      onClick={() =>
                        verifyOtpMutation.mutate(otp)
                      }
                      disabled={
                        otp.length < 6 ||
                        verifyOtpMutation.isPending
                      }
                      className="h-14 w-full rounded-xl text-base font-bold"
                      style={{
                        backgroundColor: BRAND.theme.primary,
                      }}
                    >
                      {verifyOtpMutation.isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Verify OTP"
                      )}
                    </Button>

                    <button
                      onClick={() => {
                        setStep(1);
                        setOtp("");
                      }}
                      className="flex w-full items-center justify-center gap-2 pt-2 text-sm font-semibold text-gray-500"
                    >
                      <ArrowLeft size={16} />
                      Edit Details
                    </button>
                  </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                        +91
                      </span>

                      <input
                        type="tel"
                        maxLength={10}
                        value={newPhone}
                        onChange={(e) =>
                          setNewPhone(
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        placeholder="Mobile Number"
                        className="h-14 w-full rounded-xl border border-gray-200 pl-16 pr-5 outline-none"
                      />
                    </div>

                    <Button
                      onClick={() =>
                        sendPhoneOtpMutation.mutate(newPhone)
                      }
                      disabled={
                        newPhone.length !== 10 ||
                        sendPhoneOtpMutation.isPending
                      }
                      className="h-14 w-full rounded-xl text-base font-bold"
                      style={{
                        backgroundColor: BRAND.theme.primary,
                      }}
                    >
                      {sendPhoneOtpMutation.isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                  <>
                    <input
                      type="text"
                      maxLength={6}
                      value={phoneOtp}
                      onChange={(e) =>
                        setPhoneOtp(e.target.value)
                      }
                      placeholder="Enter Mobile OTP"
                      className="h-14 w-full rounded-xl border border-gray-200 px-5 text-center text-2xl font-black tracking-[0.25em]"
                    />

                    <Button
                      onClick={() =>
                        verifyPhoneOtpMutation.mutate(phoneOtp)
                      }
                      disabled={
                        phoneOtp.length < 6 ||
                        verifyPhoneOtpMutation.isPending
                      }
                      className="h-14 w-full rounded-xl text-base font-bold"
                      style={{
                        backgroundColor: BRAND.theme.primary,
                      }}
                    >
                      {verifyPhoneOtpMutation.isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Confirm & Login"
                      )}
                    </Button>

                    <button
                      onClick={() => {
                        setStep(3);
                        setPhoneOtp("");
                      }}
                      className="flex w-full items-center justify-center gap-2 pt-2 text-sm font-semibold text-gray-500"
                    >
                      <ArrowLeft size={16} />
                      Edit Mobile Number
                    </button>
                  </>
                )}
              </div>

              {/* Footer */}
              <p className="mt-8 text-center text-xs leading-relaxed text-gray-400">
                By continuing, you agree to our Privacy Policy
                and Terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}