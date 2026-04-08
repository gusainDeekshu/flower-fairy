// src/components/ui/profile/tabs/ProfileTab.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/useAuthStore";
import { Check, X, Edit2, Loader2 } from "lucide-react";

export function ProfileTab() {
  const {
    user: persistedUser,
    isAuthenticated,
    setAuth,
    _hasHydrated,
  } = useAuthStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit State Management (Flipkart-style ensures only one field is edited at a time)
  type EditableField = "name" | "gender" | "email" | "phone" | null;
  const [editingField, setEditingField] = useState<EditableField>(null);
  const [editValue, setEditValue] = useState("");

  // OTP State Management
  type OtpStep = "idle" | "sending" | "sent" | "verifying";
  const [otpStep, setOtpStep] = useState<OtpStep>("idle");
  const [otpValue, setOtpValue] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await apiClient.get("/profile/users/me");

      // 🔥 FIX 1: Merge the response with existing data so missing backend fields don't erase UI state
      setUser((prevUser: any) => ({
        ...prevUser,
        ...res.data,
      }));
    } catch (error) {
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (_hasHydrated) {
      if (persistedUser) setUser(persistedUser);
      fetchProfile();
    }
    // 🔥 FIX 2: Remove `persistedUser` from the dependency array.
    // We ONLY want to fetch when the component mounts/hydrates, not after every save.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated]);

  if (!_hasHydrated || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4 max-w-2xl mt-8">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  // Open inline edit mode
  const handleEditClick = (field: EditableField, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue || "");
    setOtpStep("idle");
    setOtpValue("");
  };

  // Close inline edit mode
  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
    setOtpStep("idle");
    setOtpValue("");
  };

  // Generic Update API Call
  // Generic Update API Call
  // Generic Update API Call
  const updateProfile = async (data: Record<string, string>): Promise<boolean> => {
    try {
      const res = await apiClient.patch("/profile/users/update", data);
      const updatedUser = res.data.user || res.data; 

      setUser(updatedUser); 
      const currentToken = useAuthStore.getState().accessToken;

      setAuth({ ...persistedUser!, ...updatedUser }, currentToken!);

      toast.success("Profile updated successfully!");
      handleCancel();
      return true; 
      
    } catch (error: any) {
      // 🔥 FIX 1: REMOVED console.error(error) SO NEXT.JS STOPS CRASHING THE SCREEN

      // Extract the exact message from the backend safely
      let errorMessage = "Failed to update profile";
      if (error?.response?.data?.message) {
        errorMessage = Array.isArray(error.response.data.message) 
          ? error.response.data.message[0] 
          : error.response.data.message;
      } else if (typeof error?.message === "string") {
        errorMessage = error.message;
      }

      // Show the toast smoothly
      toast.error(errorMessage);
      
      // Leave input open to try a new email/phone
      setOtpStep("idle"); 
      return false; 
    }
  };

  // Handlers for Non-OTP Fields
  const handleSaveNameOrGender = async () => {
    if (editingField === "name" && !editValue.trim()) {
      return toast.error("Name cannot be empty");
    }
    if (editingField === "gender" && !editValue) {
      return toast.error("Please select a gender");
    }

    // 🔥 FIX 2: Check without updating if value hasn't changed!
    if (user && editValue.toLowerCase() === (user[editingField!] || "").toLowerCase()) {
      toast.success("No changes made.");
      handleCancel();
      return;
    }

    setOtpStep("verifying"); 
    await updateProfile({ [editingField!]: editValue });
  };

  // Handlers for OTP Required Fields
  const handleSendOtp = async () => {
    if (editingField === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editValue)) {
      return toast.error("Enter a valid email address");
    }
    if (editingField === "phone" && !/^\d{10}$/.test(editValue)) {
      return toast.error("Enter a valid 10-digit phone number");
    }

    // 🔥 FIX 3: Don't send OTP if the value is exactly the same as current
    if (user && editValue === (user[editingField!] || "")) {
      toast.success(`This is already your current ${editingField}.`);
      handleCancel();
      return;
    }

    setOtpStep("sending");
    try {
      await apiClient.post("/notifications/send-otp", {
        identifier: editValue,
        isEmail: editingField === "email", 
      });
      setOtpStep("sent");
      toast.success("OTP sent successfully!");
    } catch (error: any) {
      setOtpStep("idle");
      // Safely extract string to prevent overlay
      const msg = error.response?.data?.message || "Failed to send OTP";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const handleVerifyOtp = async () => {
   
    if (otpValue.length !== 6) return toast.error("Enter a valid 6-digit OTP");

    setOtpStep("verifying");
    try {
      // 1. Verify OTP first
      await apiClient.post("/notifications/verify-otp", {
        identifier: editValue,
        otp: otpValue,
      });

      // 2. If OTP is good, update the profile.
      await updateProfile({ [editingField!]: editValue });

    } catch (error: any) {
      // Safe error extraction to prevent overlay
      let errorMessage = "Verification failed";
      if (error?.response?.data?.message) {
        errorMessage = Array.isArray(error.response.data.message) 
          ? error.response.data.message[0] 
          : error.response.data.message;
      }
      

      toast.error(errorMessage);

      if (errorMessage.toLowerCase().includes("otp")) {
        setOtpStep("sent"); // Keep the OTP input open
      } else {
        setOtpStep("idle"); // Reset
      }
    }
  };



 

  // --- Inline Row Render Engine ---
  const renderRow = (
    label: string,
    field: EditableField,
    currentValue: string,
    type: "text" | "email" | "tel" = "text",
  ) => {
    const isEditing = editingField === field;

    return (
      <div
        className={`p-6 border-b border-gray-100 transition-colors ${isEditing ? "bg-[#009688]/5" : "hover:bg-gray-50/50"}`}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {label}
          </h4>
          {!isEditing && (
            <button
              onClick={() => handleEditClick(field, currentValue)}
              className="text-[#009688] text-sm font-semibold flex items-center gap-1.5 hover:text-[#007A6E] transition-colors"
            >
              <Edit2 size={14} /> Edit
            </button>
          )}
        </div>

        {!isEditing ? (
          <p className="text-gray-900 font-medium text-base mt-1">
            {/* Formats MALE to Male, etc. */}
            {field === "gender" && currentValue
              ? currentValue.charAt(0) + currentValue.slice(1).toLowerCase()
              : currentValue || (
                  <span className="text-gray-400 italic font-normal">
                    Not added
                  </span>
                )}
          </p>
        ) : (
          <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-300">
            {field === "gender" ? (
              <div className="flex items-center gap-6 mt-2">
                {["Male", "Female", "Other"].map((g) => {
                  const upperG = g.toUpperCase();
                  const safeEditValue = (editValue || "").toUpperCase();

                  return (
                    <label
                      key={g}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={upperG}
                        checked={safeEditValue === upperG}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-4 h-4 text-[#009688] border-gray-300 focus:ring-[#009688]"
                      />
                      <span className="text-gray-700 font-medium group-hover:text-gray-900">
                        {g}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <input
                type={type}
                value={editValue}
                onChange={(e) => {
                  const val =
                    type === "tel"
                      ? e.target.value.replace(/\D/g, "").slice(0, 10)
                      : e.target.value;
                  setEditValue(val);
                }}
                disabled={
                  otpStep === "sent" ||
                  otpStep === "verifying" ||
                  otpStep === "sending"
                }
                className="w-full max-w-md px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009688]/30 focus:border-[#009688] outline-none transition-all disabled:opacity-60 disabled:bg-gray-100 font-medium text-gray-900 shadow-sm"
                placeholder={`Enter new ${label.toLowerCase()}`}
                autoFocus
              />
            )}

            <div className="mt-4 flex items-center gap-3">
              {field === "name" || field === "gender" ? (
                <>
                  <button
                    onClick={handleSaveNameOrGender}
                    disabled={otpStep === "verifying"}
                    className="bg-[#009688] text-white px-5 py-2.5 rounded-md font-semibold text-sm hover:bg-[#007A6E] transition-all flex items-center gap-2 disabled:opacity-70 shadow-sm"
                  >
                    {otpStep === "verifying" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-gray-500 hover:text-gray-800 font-medium text-sm px-3 py-2 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <div className="w-full max-w-md flex flex-col gap-3">
                  {otpStep === "idle" && (
                    <div className="flex gap-3">
                      <button
                        onClick={handleSendOtp}
                        className="bg-[#009688] text-white px-5 py-2.5 rounded-md font-semibold text-sm hover:bg-[#007A6E] transition-all shadow-sm"
                      >
                        Send OTP
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-800 font-medium text-sm px-3 py-2 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {otpStep === "sending" && (
                    <div className="flex items-center gap-2 text-[#009688] font-bold text-sm py-2">
                      <Loader2 size={18} className="animate-spin" /> Sending
                      Verification Code...
                    </div>
                  )}

                  {(otpStep === "sent" || otpStep === "verifying") && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={otpValue}
                        onChange={(e) =>
                          setOtpValue(
                            e.target.value.replace(/\D/g, "").slice(0, 6),
                          )
                        }
                        placeholder="Enter 6-digit OTP"
                        disabled={otpStep === "verifying"}
                        className="w-full sm:flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009688]/30 focus:border-[#009688] outline-none text-center tracking-[0.5em] font-bold text-lg disabled:opacity-60 disabled:bg-gray-100 shadow-sm"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleVerifyOtp}
                          disabled={
                            otpStep === "verifying" || otpValue.length !== 6
                          }
                          className="bg-green-600 text-white px-6 py-2.5 rounded-md font-bold text-sm hover:bg-green-700 transition-all disabled:opacity-60 flex items-center justify-center min-w-[120px] gap-2 shadow-sm"
                        >
                          {otpStep === "verifying" ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                          Verify & Save
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={otpStep === "verifying"}
                          className="text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-md p-2 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  )}

                  {(otpStep === "sent" || otpStep === "verifying") && (
                    <p className="text-xs text-green-600 font-semibold flex items-center gap-1.5 animate-in fade-in">
                      <Check size={14} /> OTP sent to your new{" "}
                      {field?.toLowerCase() || "field"}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-3xl">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Profile Information
        </h3>
        <p className="text-gray-500 mt-1 text-sm">
          Manage your personal details and secure contact information.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* SECTION: Personal Information */}
        <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-800 tracking-wider flex items-center gap-2">
            Personal Information
          </h3>
        </div>

        {/* ✅ CORRECTED: Restored Name and Gender rows here */}
        {renderRow("Full Name", "name", user?.name || "")}
        {renderRow("Gender", "gender", user?.gender || "")}

        {/* SECTION: Contact Information */}
        <div className="bg-gray-50/80 px-6 py-3 border-y border-gray-200 mt-2">
          <h3 className="text-sm font-bold text-gray-800 tracking-wider flex items-center gap-2">
            Contact Information
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2 font-bold">
              Secured via OTP
            </span>
          </h3>
        </div>

        {/* ✅ CORRECTED: Proper mapping for Email and Phone */}
        {renderRow("Email Address", "email", user?.email || "", "email")}
        {renderRow("Mobile Number", "phone", user?.phone || "", "tel")}
      </div>
    </div>
  );
}
