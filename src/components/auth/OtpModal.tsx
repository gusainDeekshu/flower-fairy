// src/components/auth/OtpModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
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

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

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

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [phoneOtp, setPhoneOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill(""),
  );

  const [tempToken, setTempToken] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  const [rateLimitMessage, setRateLimitMessage] = useState("");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { syncCart } = useCartStore();
  const setAuth = useAuthStore((s) => s.setAuth);

  // =========================
  // HELPERS
  // =========================

  const otpValue = otp.join("");
  const phoneOtpValue = phoneOtp.join("");

  const startCooldown = () => {
    setResendTimer(RESEND_SECONDS);
    setCanResend(false);
  };

  const resetOtpStates = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setPhoneOtp(Array(OTP_LENGTH).fill(""));
  };

  // =========================
  // TIMER
  // =========================

  useEffect(() => {
    if (!(step === 2 || step === 4)) return;

    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer, step]);

  // =========================
  // AUTO FOCUS
  // =========================

  useEffect(() => {
    if (step === 2) {
      otpRefs.current[0]?.focus();
    }

    if (step === 4) {
      phoneOtpRefs.current[0]?.focus();
    }
  }, [step]);

  // =========================
  // RESET MODAL
  // =========================

  const resetModal = () => {
    setStep(1);

    setIdentifier("");

    setTempToken("");
    setNewPhone("");

    resetOtpStates();

    setResendTimer(RESEND_SECONDS);
    setCanResend(false);

    setRateLimitMessage("");

    onClose();
  };

  // =========================
  // LOGIN SUCCESS
  // =========================

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

  // =========================
  // HANDLE RATE LIMIT
  // =========================

  const handleApiError = (err: any, fallback: string) => {
    const status = err?.response?.status;
    const message =
      err?.response?.data?.message || err?.message || fallback;

    if (status === 429) {
      setRateLimitMessage(message);
    }

    toast.error(message);
  };

  // =========================
  // SEND OTP
  // =========================

  const sendOtpMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.post("/auth/send-otp", {
        identifier: id,
        type: id.includes("@") ? "email" : "phone",
      }),

    onSuccess: () => {
      setStep(2);

      setOtp(Array(OTP_LENGTH).fill(""));

      setRateLimitMessage("");

      startCooldown();

      toast.success("OTP sent successfully!");
    },

    onError: (err: any) =>
      handleApiError(err, "Failed to send OTP"),
  });

  // =========================
  // VERIFY OTP
  // =========================

  const verifyOtpMutation = useMutation({
    mutationFn: () =>
      apiClient.post("/auth/verify-otp", {
        identifier,
        otp: otpValue,
      }),

    onSuccess: async (resOrData: any) => {
      const data = resOrData?.data || resOrData;

      if (data?.requiresPhone) {
        setTempToken(data.tempToken);

        setStep(3);

        return;
      }

      if (data?.access_token) {
        await handleLoginSuccess(data);
      }
    },

    onError: (err: any) =>
      handleApiError(err, "Invalid OTP"),
  });

  // =========================
  // SEND PHONE OTP
  // =========================

  const sendPhoneOtpMutation = useMutation({
    mutationFn: (phone: string) =>
      apiClient.post("/auth/send-otp", {
        identifier: phone,
        type: "phone",
      }),

    onSuccess: () => {
      setStep(4);

      setPhoneOtp(Array(OTP_LENGTH).fill(""));

      setRateLimitMessage("");

      startCooldown();

      toast.success("OTP sent!");
    },

    onError: (err: any) =>
      handleApiError(err, "Failed to send OTP"),
  });

  // =========================
  // VERIFY PHONE OTP
  // =========================

  const verifyPhoneOtpMutation = useMutation({
    mutationFn: () =>
      apiClient.post("/auth/verify-phone-otp", {
        phone: newPhone,
        otp: phoneOtpValue,
        tempToken,
      }),

    onSuccess: async (resOrData: any) => {
      const data = resOrData?.data || resOrData;

      if (data?.access_token) {
        await handleLoginSuccess(data);
      }
    },

    onError: (err: any) =>
      handleApiError(err, "Invalid OTP"),
  });

  // =========================
  // AUTO VERIFY
  // =========================

  useEffect(() => {
    if (step === 2 && otpValue.length === OTP_LENGTH) {
      verifyOtpMutation.mutate();
    }
  }, [otpValue]);

  useEffect(() => {
    if (step === 4 && phoneOtpValue.length === OTP_LENGTH) {
      verifyPhoneOtpMutation.mutate();
    }
  }, [phoneOtpValue]);

  // =========================
  // OTP INPUT HANDLER
  // =========================

  const handleOtpChange = (
    index: number,
    value: string,
    type: "email" | "phone",
  ) => {
    if (!/^\d?$/.test(value)) return;

    const currentOtp =
      type === "email" ? [...otp] : [...phoneOtp];

    currentOtp[index] = value;

    if (type === "email") {
      setOtp(currentOtp);
    } else {
      setPhoneOtp(currentOtp);
    }

    if (value && index < OTP_LENGTH - 1) {
      const refs =
        type === "email" ? otpRefs.current : phoneOtpRefs.current;

      refs[index + 1]?.focus();
    }
  };

  // =========================
  // OTP KEYDOWN
  // =========================

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    type: "email" | "phone",
  ) => {
    const currentOtp = type === "email" ? otp : phoneOtp;

    if (
      e.key === "Backspace" &&
      !currentOtp[index] &&
      index > 0
    ) {
      const refs =
        type === "email" ? otpRefs.current : phoneOtpRefs.current;

      refs[index - 1]?.focus();
    }
  };

  // =========================
  // OTP PASTE
  // =========================

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    type: "email" | "phone",
  ) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const values = pasted.split("");

    while (values.length < OTP_LENGTH) {
      values.push("");
    }

    if (type === "email") {
      setOtp(values);
    } else {
      setPhoneOtp(values);
    }
  };

  // =========================
  // RESEND OTP
  // =========================

  const handleResendOtp = () => {
    if (!canResend) return;

    setRateLimitMessage("");

    if (step === 2) {
      sendOtpMutation.mutate(identifier);
    }

    if (step === 4) {
      sendPhoneOtpMutation.mutate(newPhone);
    }
  };

  // =========================
  // ENTER SUPPORT
  // =========================

  const handleEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
    action: () => void,
  ) => {
    if (e.key === "Enter") {
      action();
    }
  };

  if (!isOpen) return null;

  const getStepTitle = () => {
    if (step === 1) return "Login / Sign Up";
    if (step === 2) return "Verify OTP";
    if (step === 3) return "Secure Account";

    return "Verify Mobile";
  };

  const renderOtpBoxes = (type: "email" | "phone") => {
    const currentOtp = type === "email" ? otp : phoneOtp;

    const refs =
      type === "email" ? otpRefs.current : phoneOtpRefs.current;

    return (
      <div className="flex items-center justify-center gap-2">
        {currentOtp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              refs[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) =>
              handleOtpChange(
                index,
                e.target.value,
                type,
              )
            }
            onKeyDown={(e) =>
              handleOtpKeyDown(e, index, type)
            }
            onPaste={(e) => handlePaste(e, type)}
            className="h-14 w-12 rounded-xl border border-gray-200 text-center text-xl font-black outline-none transition focus:border-[#009688] focus:ring-2 focus:ring-[#009688]/20"
          />
        ))}
      </div>
    );
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
          className="absolute right-5 top-5 z-20 rounded-full bg-white/90 p-2 text-gray-500 transition hover:text-black"
        >
          <X size={18} />
        </button>

        <div className="grid min-h-[620px] md:grid-cols-[1.15fr_0.85fr]">
          {/* LEFT PANEL */}
          <div
            className="relative hidden flex-col justify-center px-14 py-16 text-white md:flex"
            style={{
              background: BRAND.theme.primary,
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,white,transparent_35%)] opacity-20" />

            <div className="relative mb-12 h-[180px] w-[180px]">
              <Image
                src={BRAND.logo}
                alt={BRAND.name}
                fill
                priority
                unoptimized
                className="object-contain"
              />
            </div>

            <h2 className="max-w-md text-4xl font-black leading-tight">
              Login now to unlock exclusive offers
            </h2>

            <p className="mt-5 max-w-md text-base leading-relaxed text-white/80">
              Access your account, track orders, save favourites,
              and enjoy seamless shopping with {BRAND.name}.
            </p>

            <div className="mt-12 space-y-3 text-sm text-white/80">
              <p>{BRAND.phone}</p>
              <p>{BRAND.email}</p>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex items-center justify-center bg-white px-6 py-10 sm:px-10">
            <div className="w-full max-w-sm">
              {/* Mobile Logo */}
              <div className="relative mx-auto mb-8 h-[48px] w-[140px] md:hidden">
                <Image
                  src={BRAND.logo}
                  alt={BRAND.name}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>

              {/* ICON */}
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

                {rateLimitMessage && (
                  <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {rateLimitMessage}
                  </p>
                )}
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
                      onKeyDown={(e) =>
                        handleEnter(e, () =>
                          sendOtpMutation.mutate(identifier),
                        )
                      }
                      placeholder="Email or Phone Number"
                      className="h-14 w-full rounded-xl border border-gray-200 px-5 outline-none transition focus:border-[#009688] focus:ring-2 focus:ring-[#009688]/20"
                    />

                    <Button
                      onClick={() =>
                        sendOtpMutation.mutate(identifier)
                      }
                      disabled={
                        !identifier ||
                        sendOtpMutation.isPending
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
                    {renderOtpBoxes("email")}

                    <Button
                      onClick={() =>
                        verifyOtpMutation.mutate()
                      }
                      disabled={
                        otpValue.length < OTP_LENGTH ||
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

                    {/* RESEND */}
                    <div className="text-center">
                      {canResend ? (
                        <button
                          onClick={handleResendOtp}
                          disabled={
                            sendOtpMutation.isPending
                          }
                          className="text-sm font-bold text-[#009688] hover:underline"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Resend OTP in{" "}
                          <span className="font-bold">
                            {resendTimer}s
                          </span>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setStep(1);
                        setOtp(
                          Array(OTP_LENGTH).fill(""),
                        );
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
                        inputMode="numeric"
                        maxLength={10}
                        value={newPhone}
                        onChange={(e) =>
                          setNewPhone(
                            e.target.value.replace(
                              /\D/g,
                              "",
                            ),
                          )
                        }
                        onKeyDown={(e) =>
                          handleEnter(e, () =>
                            sendPhoneOtpMutation.mutate(
                              newPhone,
                            ),
                          )
                        }
                        placeholder="Mobile Number"
                        className="h-14 w-full rounded-xl border border-gray-200 pl-16 pr-5 outline-none transition focus:border-[#009688] focus:ring-2 focus:ring-[#009688]/20"
                      />
                    </div>

                    <Button
                      onClick={() =>
                        sendPhoneOtpMutation.mutate(
                          newPhone,
                        )
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
                    {renderOtpBoxes("phone")}

                    <Button
                      onClick={() =>
                        verifyPhoneOtpMutation.mutate()
                      }
                      disabled={
                        phoneOtpValue.length <
                          OTP_LENGTH ||
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

                    {/* RESEND */}
                    <div className="text-center">
                      {canResend ? (
                        <button
                          onClick={handleResendOtp}
                          disabled={
                            sendPhoneOtpMutation.isPending
                          }
                          className="text-sm font-bold text-[#009688] hover:underline"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Resend OTP in{" "}
                          <span className="font-bold">
                            {resendTimer}s
                          </span>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setStep(3);

                        setPhoneOtp(
                          Array(OTP_LENGTH).fill(""),
                        );
                      }}
                      className="flex w-full items-center justify-center gap-2 pt-2 text-sm font-semibold text-gray-500"
                    >
                      <ArrowLeft size={16} />
                      Edit Mobile Number
                    </button>
                  </>
                )}
              </div>

              {/* FOOTER */}
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