// src/components/profile/tabs/AddressesTab.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { MapPin, Plus, Trash2, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Address } from '@/types/profile';
import apiClient from '@/lib/api-client';

const INITIAL_FORM = { name: '', phone: '', addressLine: '', city: '', state: '', pincode: '', isDefault: false };

export function AddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<typeof INITIAL_FORM>>({});

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await api.get<Address[]>('/api/v1/addresses');
      setAddresses(res.data);
    } catch (error) {
      toast.error('Failed to load addresses');
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

    if (!formData.name.trim()) { newErrors.name = 'Required'; isValid = false; }
    if (!/^\d{10}$/.test(formData.phone)) { newErrors.phone = 'Invalid phone'; isValid = false; }
    if (!formData.addressLine.trim()) { newErrors.addressLine = 'Required'; isValid = false; }
    if (!formData.city.trim()) { newErrors.city = 'Required'; isValid = false; }
    if (!formData.state.trim()) { newErrors.state = 'Required'; isValid = false; }
    if (!/^\d{6}$/.test(formData.pincode)) { newErrors.pincode = 'Invalid PIN'; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await apiClient.post('/api/v1/addresses', formData);
      toast.success('Address saved successfully!');
      setIsAdding(false);
      setFormData(INITIAL_FORM);
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/api/v1/addresses/${id}`);
      toast.success('Address removed');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to delete address');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Manage Addresses</h3>
          <p className="text-gray-500 mt-1">Add or edit your delivery locations.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => { setFormData(INITIAL_FORM); setErrors({}); setIsAdding(true); }}
            className="flex items-center gap-2 bg-[#009688]/10 text-[#009688] px-4 py-2 rounded-lg font-semibold hover:bg-[#009688]/20 transition-colors"
          >
            <Plus size={18} /> Add New
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 shadow-sm p-6 rounded-xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-gray-800">Add New Address</h4>
            <button type="button" onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <input placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 ${errors.name ? 'border-red-500' : 'focus:ring-[#009688]'}`} />
              {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name}</span>}
            </div>
            <div>
              <input placeholder="10-digit Phone" maxLength={10} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 ${errors.phone ? 'border-red-500' : 'focus:ring-[#009688]'}`} />
              {errors.phone && <span className="text-xs text-red-500 mt-1">{errors.phone}</span>}
            </div>
            <div className="md:col-span-2">
              <input placeholder="Flat, House no., Building, Company, Apartment" value={formData.addressLine} onChange={e => setFormData({...formData, addressLine: e.target.value})} className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 ${errors.addressLine ? 'border-red-500' : 'focus:ring-[#009688]'}`} />
              {errors.addressLine && <span className="text-xs text-red-500 mt-1">{errors.addressLine}</span>}
            </div>
            <div>
              <input placeholder="City / Town" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 ${errors.city ? 'border-red-500' : 'focus:ring-[#009688]'}`} />
              {errors.city && <span className="text-xs text-red-500 mt-1">{errors.city}</span>}
            </div>
            <div>
              <input placeholder="State" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 ${errors.state ? 'border-red-500' : 'focus:ring-[#009688]'}`} />
              {errors.state && <span className="text-xs text-red-500 mt-1">{errors.state}</span>}
            </div>
            <div>
              <input placeholder="6-digit Pincode" maxLength={6} value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})} className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 ${errors.pincode ? 'border-red-500' : 'focus:ring-[#009688]'}`} />
              {errors.pincode && <span className="text-xs text-red-500 mt-1">{errors.pincode}</span>}
            </div>
          </div>
          
          <div className="mt-5 flex items-center gap-2">
            <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="w-4 h-4 text-[#009688] rounded border-gray-300 focus:ring-[#009688]" />
            <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">Make this my default address</label>
          </div>

          <div className="mt-6 flex gap-3">
            <button type="submit" disabled={saving} className="bg-[#009688] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#007A6E] transition-colors disabled:opacity-70 flex items-center">
              {saving ? 'Saving...' : 'Save Address'}
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
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
        {addresses.map((addr) => (
          <div key={addr.id} className={`border rounded-xl p-5 relative transition-all ${addr.isDefault ? 'border-[#009688] bg-[#009688]/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
            {addr.isDefault && (
              <span className="absolute top-4 right-4 bg-[#009688] text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold">
                Default
              </span>
            )}
            <h4 className="font-bold text-gray-900 text-lg mb-2 pr-16">{addr.name}</h4>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <p>{addr.addressLine}</p>
              <p>{addr.city}, {addr.state} - <span className="font-medium text-gray-900">{addr.pincode}</span></p>
              <p className="pt-1 flex items-center gap-2">
                <span className="font-medium">Phone:</span> {addr.phone}
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => deleteAddress(addr.id)} 
                disabled={deletingId === addr.id}
                className="text-red-500 text-sm font-medium flex items-center gap-1.5 hover:text-red-600 disabled:opacity-50"
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