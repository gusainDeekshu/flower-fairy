// src/services/address.service.ts
import { apiClient } from '@/lib/api-client';

export interface AddressPayload {
  name?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  addressLine: string; // Maps to textarea 'address'
  label: 'HOME' | 'WORK' | 'OTHER';
  isDefault: boolean;
}

export interface Address extends AddressPayload {
  id: string;
  name: string; // Handled for backward compatibility with your Prisma schema
}

export const addressService = {
  getUserAddresses: async (): Promise<Address[]> => {
    // Maps to your ProfileController @Get('addresses')
    const { data } = await apiClient.get('/profile/addresses');
    return data;
  },

  addAddress: async (payload: AddressPayload): Promise<Address> => {
    // Transforming payload to prevent breaking existing Prisma Address model
    const backendPayload = {
      ...payload,
      name: `${payload.firstName} ${payload.lastName}`.trim(),
    };
    
    // Maps to your ProfileController @Post('addresses')
    const { data } = await apiClient.post('/profile/addresses', backendPayload);
    return data;
  }
};