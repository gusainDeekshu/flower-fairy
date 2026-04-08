// src/components/checkout/AddressDrawer.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { X, MapPin, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addressService, Address, AddressPayload } from '@/services/address.service';

interface AddressDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelect: (address: Address) => void;
}

export function AddressDrawer({ isOpen, onClose, onAddressSelect }: AddressDrawerProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState<AddressPayload>({
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pincode: '',
    city: '',
    state: '',
    addressLine: '',
    label: 'HOME',
    isDefault: false,
  });

  useEffect(() => {
    if (isOpen) {
      loadAddresses();
    }
  }, [isOpen]);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      const data = await addressService.getUserAddresses();
      setAddresses(data);
      setView(data.length > 0 ? 'LIST' : 'FORM');
    } catch (err) {
      console.error('Failed to load addresses', err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!/^\d{10}$/.test(formData.phone)) return "Phone number must be exactly 10 digits.";
    if (!/^\d{6}$/.test(formData.pincode)) return "PIN Code must be exactly 6 digits.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Invalid Email ID.";
    if (formData.addressLine.length > 255) return "Address exceeds 255 characters.";
    if (!formData.firstName || !formData.city || !formData.state || !formData.addressLine) {
      return "Please fill in all required fields.";
    }
    return null;
  };

  const handleSaveAddress = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const newAddress = await addressService.addAddress(formData);
      setAddresses([...addresses, newAddress]);
      onAddressSelect(newAddress);
      onClose();
    } catch (err) {
      setError('Failed to save address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Background Overlay */}
      <div 
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={onClose} 
      />

      {/* Right Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-[420px] bg-white shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-800">
            {view === 'LIST' ? 'Select Delivery Address' : 'Add New Address'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium border border-red-100">
              {error}
            </div>
          )}

          {view === 'LIST' ? (
            <div className="space-y-4">
              {addresses.map(addr => (
                <div 
                  key={addr.id} 
                  onClick={() => onAddressSelect(addr)}
                  className="p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-500 cursor-pointer transition-all group bg-white hover:bg-blue-50/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-md group-hover:bg-blue-100 group-hover:text-blue-700">
                        {addr.label || 'HOME'}
                      </span>
                      {addr.isDefault && (
                        <span className="text-blue-600 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 size={14} /> Default
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{addr.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-sm font-medium text-gray-700">Phone: {addr.phone}</p>
                </div>
              ))}
              <Button 
                onClick={() => setView('FORM')} 
                variant="outline" 
                className="w-full py-6 border-dashed border-2 border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 rounded-2xl font-bold"
              >
                <Plus size={18} className="mr-2" /> Add New Address
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="Enter your first name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="Enter your last name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email ID</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400 font-medium">+91</span>
                  <input 
                    type="tel" 
                    maxLength={10}
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    placeholder="Enter 10 digit number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">PIN Code *</label>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={formData.pincode}
                    onChange={e => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    placeholder="6 digits"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    placeholder="City"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
                <input 
                  type="text" 
                  value={formData.state}
                  onChange={e => setFormData({...formData, state: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="State"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address</label>
                  <span className={`text-xs font-medium ${formData.addressLine.length >= 255 ? 'text-red-500' : 'text-gray-400'}`}>
                    {formData.addressLine.length}/255
                  </span>
                </div>
                <textarea 
                  maxLength={255}
                  rows={3}
                  value={formData.addressLine}
                  onChange={e => setFormData({...formData, addressLine: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                  placeholder="House No, Building, Street Area"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Save Address As</label>
                <div className="flex gap-3">
                  {['HOME', 'WORK', 'OTHER'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFormData({...formData, label: type as any})}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${
                        formData.label === type 
                          ? 'bg-blue-50 border-blue-600 text-blue-700' 
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer pt-2">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData.isDefault}
                    onChange={e => setFormData({...formData, isDefault: e.target.checked})}
                    className="peer w-5 h-5 appearance-none border-2 border-gray-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-colors"
                  />
                  <CheckCircle2 className="absolute text-white opacity-0 peer-checked:opacity-100 w-4 h-4 left-0.5 top-0.5 pointer-events-none" />
                </div>
                <span className="text-sm font-medium text-gray-700">Make this my default address</span>
              </label>

              {addresses.length > 0 && (
                <button 
                  onClick={() => setView('LIST')}
                  className="w-full py-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Cancel & Go Back
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        {view === 'FORM' && (
          <div className="p-5 bg-white border-t border-gray-100 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)]">
            <Button 
              onClick={handleSaveAddress}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-bold rounded-xl shadow-lg shadow-blue-600/20 text-white transition-all disabled:opacity-70"
            >
              {isLoading ? 'Saving...' : 'SAVE ADDRESS'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}