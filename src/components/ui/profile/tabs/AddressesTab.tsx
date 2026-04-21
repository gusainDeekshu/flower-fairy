// src\components\ui\profile\tabs\AddressesTab.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, X, Edit2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Address } from "@/types/profile";
import { apiClient } from "@/lib/api-client";
import {
  isValidIndianPhone,
  isValidPincode,
  cleanPhone,
} from "@/lib/validators";

const INITIAL_FORM = {
  name: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export function AddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // Track which address we are editing
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<typeof INITIAL_FORM>>({});

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await apiClient.get<Address[]>("/profile/addresses");
      // Fix for the .map error: Ensure we always set an array
      const data = Array.isArray(res) ? res : (res as any)?.data || [];
      setAddresses(data);
    } catch (error) {
      toast.error("Failed to load addresses");
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const validate = () => {
    let isValid = true;
    const newErrors: Partial<typeof INITIAL_FORM> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Required";
      isValid = false;
    }

    if (!isValidIndianPhone(formData.phone)) {
      newErrors.phone = "Invalid Indian mobile number";
      isValid = false;
    }

    if (!formData.addressLine.trim()) {
      newErrors.addressLine = "Required";
      isValid = false;
    }

    if (!formData.city.trim()) {
      newErrors.city = "Required";
      isValid = false;
    }

    if (!formData.state.trim()) {
      newErrors.state = "Required";
      isValid = false;
    }

    if (!isValidPincode(formData.pincode)) {
      newErrors.pincode = "Invalid PIN";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleEdit = (addr: Address) => {
    setFormData({
      name: addr.name,
      phone: addr.phone,
      addressLine: addr.addressLine,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setIsAdding(true);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return; // 🚨 FIX: Hard block if already processing
    if (!validate()) return;

    setSaving(true);
    try {
      if (editingId) {
        await apiClient.patch(`/profile/addresses/${editingId}`, formData);
        toast.success("Address updated successfully!");
      } else {
        await apiClient.post("/profile/addresses", formData);
        toast.success("Address saved successfully!");
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData(INITIAL_FORM);
      
      // 🚨 UX Improvement: Refetch silently to ensure local state perfectly matches DB state
      await fetchAddresses(); 
    } catch (error: any) {
      // Handle the P2002 DB constraint error gracefully if it somehow reaches the client
      if (error.response?.status === 409) {
         toast.error("Address conflict. Please refresh and try again.");
      } else {
         toast.error("Failed to save address");
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to remove this address?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/profile/addresses/${id}`);
      toast.success("Address removed");
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Manage Addresses</h3>
          <p className="text-gray-500 mt-1">
            Add or edit your delivery locations.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => {
              setFormData(INITIAL_FORM);
              setErrors({});
              setIsAdding(true);
              setEditingId(null);
            }}
            className="flex items-center gap-2 bg-[#009688]/10 text-[#009688] px-4 py-2 rounded-lg font-semibold hover:bg-[#009688]/20 transition-colors"
          >
            <Plus size={18} /> Add New
          </button>
        )}
      </div>

      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border-2 border-[#009688]/20 shadow-md p-6 rounded-xl mb-8 ring-4 ring-[#009688]/5"
        >
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-gray-800 text-lg">
              {editingId ? "Edit Address" : "Add New Address"}
            </h4>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Recipient Name
              </label>
              <input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-lg outline-none transition-all focus:bg-white focus:ring-2 ${errors.name ? "border-red-500 ring-red-100" : "border-gray-200 focus:ring-[#009688]/20 focus:border-[#009688]"}`}
              />
              {errors.name && (
                <span className="text-xs text-red-500 mt-1 ml-1">
                  {errors.name}
                </span>
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Phone Number
              </label>
              <input
                placeholder="10-digit Phone"
                maxLength={10}
                value={formData.phone}
                onChange={e =>
  setFormData({
    ...formData,
    phone: cleanPhone(e.target.value),
  })
}
                className={`w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-lg outline-none transition-all focus:bg-white focus:ring-2 ${errors.phone ? "border-red-500 ring-red-100" : "border-gray-200 focus:ring-[#009688]/20 focus:border-[#009688]"}`}
              />
              {errors.phone && (
                <span className="text-xs text-red-500 mt-1 ml-1">
                  {errors.phone}
                </span>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Address Details
              </label>
              <input
                placeholder="Flat, House no., Building, Company, Apartment"
                value={formData.addressLine}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine: e.target.value })
                }
                className={`w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-lg outline-none transition-all focus:bg-white focus:ring-2 ${errors.addressLine ? "border-red-500 ring-red-100" : "border-gray-200 focus:ring-[#009688]/20 focus:border-[#009688]"}`}
              />
              {errors.addressLine && (
                <span className="text-xs text-red-500 mt-1 ml-1">
                  {errors.addressLine}
                </span>
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                City
              </label>
              <input
                placeholder="City / Town"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className={`w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-lg outline-none transition-all focus:bg-white focus:ring-2 ${errors.city ? "border-red-500 ring-red-100" : "border-gray-200 focus:ring-[#009688]/20 focus:border-[#009688]"}`}
              />
              {errors.city && (
                <span className="text-xs text-red-500 mt-1 ml-1">
                  {errors.city}
                </span>
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                State
              </label>
              <input
                placeholder="State"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className={`w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-lg outline-none transition-all focus:bg-white focus:ring-2 ${errors.state ? "border-red-500 ring-red-100" : "border-gray-200 focus:ring-[#009688]/20 focus:border-[#009688]"}`}
              />
              {errors.state && (
                <span className="text-xs text-red-500 mt-1 ml-1">
                  {errors.state}
                </span>
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Pincode
              </label>
              <input
                placeholder="6-digit Pincode"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pincode: e.target.value.replace(/\D/g, ""),
                  })
                }
                className={`w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-lg outline-none transition-all focus:bg-white focus:ring-2 ${errors.pincode ? "border-red-500 ring-red-100" : "border-gray-200 focus:ring-[#009688]/20 focus:border-[#009688]"}`}
              />
              {errors.pincode && (
                <span className="text-xs text-red-500 mt-1 ml-1">
                  {errors.pincode}
                </span>
              )}
            </div>
          </div>

          <div
            className="mt-5 flex items-center gap-2 group cursor-pointer"
            onClick={() =>
              setFormData({ ...formData, isDefault: !formData.isDefault })
            }
          >
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              readOnly
              className="w-4 h-4 text-[#009688] rounded border-gray-300 focus:ring-[#009688] cursor-pointer"
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Make this my default address
            </label>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#009688] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#007A6E] transition-all disabled:opacity-70 flex items-center shadow-lg shadow-[#009688]/20"
            >
              {saving
                ? "Processing..."
                : editingId
                  ? "Update Address"
                  : "Save Address"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!isAdding && addresses.length === 0 && (
        <EmptyState
          icon={MapPin}
          title="No addresses found"
          description="You haven't saved any delivery addresses yet."
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Array.isArray(addresses) &&
          addresses.map((addr) => (
            <div
              key={addr.id}
              className={`border-2 rounded-xl p-5 relative transition-all ${addr.isDefault ? "border-[#009688] bg-[#009688]/5 shadow-sm" : "border-gray-200 hover:border-gray-300 bg-white"}`}
            >
              {addr.isDefault && (
                <span className="absolute top-4 right-4 bg-[#009688] text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold shadow-sm">
                  Default
                </span>
              )}
              <h4 className="font-bold text-gray-900 text-lg mb-2 pr-16">
                {addr.name}
              </h4>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p className="line-clamp-1">{addr.addressLine}</p>
                <p>
                  {addr.city}, {addr.state} -{" "}
                  <span className="font-medium text-gray-900">
                    {addr.pincode}
                  </span>
                </p>
                <p className="pt-1 flex items-center gap-2">
                  <span className="font-medium text-gray-400">Phone:</span>{" "}
                  <span className="text-gray-900 font-medium">
                    {addr.phone}
                  </span>
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex gap-6">
                <button
                  onClick={() => handleEdit(addr)}
                  className="text-[#009688] text-sm font-bold flex items-center gap-1.5 hover:text-[#007A6E] transition-colors"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => deleteAddress(addr.id)}
                  disabled={deletingId === addr.id}
                  className="text-red-500 text-sm font-bold flex items-center gap-1.5 hover:text-red-600 disabled:opacity-50 transition-colors"
                >
                  {deletingId === addr.id ? (
                    <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Remove
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
