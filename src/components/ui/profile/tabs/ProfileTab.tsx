'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { UserProfile } from '@/types/profile';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/useAuthStore'; // 🔥 Import the store

export function ProfileTab() {
  // 🔥 1. Extract persisted data from Zustand
  const { user: persistedUser, token } = useAuthStore();

  // 🔥 2. Pre-fill state with persisted data to prevent UI flickering
  const [user, setUser] = useState<UserProfile | null>((persistedUser as UserProfile) || null);
  
  // Only show loading skeleton if we have absolutely no persisted data
  const [loading, setLoading] = useState(!persistedUser); 
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: persistedUser?.name || '', 
    phone: '' // Phone isn't in AuthStore, so it will populate after the API call finishes
  });
  const [errors, setErrors] = useState({ name: '', phone: '' });

  const fetchProfile = useCallback(async () => {
    try {
      // 🔥 3. Pass the persisted data as Headers
      const res = await apiClient.get<UserProfile>('/api/v1/users/me', {
        headers: {
          'X-User-Id': persistedUser?.id || '',
          'X-User-Email': persistedUser?.email || '',
          'X-User-Role': persistedUser?.role || '',
          // (Optional fallback) If your interceptor isn't attaching the token properly:
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      setUser(res.data);
      setFormData({ name: res.data.name || '', phone: res.data.phone || '' });
    } catch (error) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [persistedUser, token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', phone: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      // 🔥 Pass persisted data as Headers on the PATCH request too
      const res = await apiClient.patch<UserProfile>('/api/v1/users/update', formData, {
        headers: {
          'X-User-Id': persistedUser?.id || '',
          'X-User-Email': persistedUser?.email || '',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      setUser(res.data);
      
      // Optional: Update the persisted Zustand store with the new name
      useAuthStore.getState().setAuth(
        { ...persistedUser!, name: res.data.name }, 
        token || ''
      );

      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-4 max-w-md mt-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full mt-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
        <p className="text-gray-500 mt-1">Update your account details and settings.</p>
      </div>

      <form onSubmit={handleUpdate} className="max-w-md space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1.5">Email cannot be changed.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#009688] focus:border-transparent outline-none transition-all ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 font-medium">
              +91
            </span>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData({ ...formData, phone: val });
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#009688] focus:border-transparent outline-none transition-all ${
                errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="9876543210"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone}</p>}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#009688] text-white py-3 rounded-lg font-semibold shadow-md hover:bg-[#007A6E] hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center mt-4"
        >
          {saving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Changes...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  );
}