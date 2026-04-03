// src/services/address.service.ts
import { apiClient } from '@/lib/api-client';

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export const addressService = {
  getUserAddresses: async (): Promise<Address[]> => {
    const { data } = await apiClient.get('/v1/addresses'); // Assumes you have an address GET endpoint
    return data;
  },
  addAddress: async (payload: Omit<Address, 'id' | 'isDefault'>): Promise<Address> => {
    const { data } = await apiClient.post('/v1/addresses', payload);
    return data;
  }
};