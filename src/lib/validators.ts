export const cleanPhone = (phone: string) => {
  return phone.replace(/\D/g, "").slice(0, 10);
};

export const isValidIndianPhone = (phone: string) => {
  return /^[6-9]\d{9}$/.test(phone);
};

export const isValidPincode = (pincode: string) => {
  return /^[1-9][0-9]{5}$/.test(pincode);
};