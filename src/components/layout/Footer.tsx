import React from 'react';
import { Facebook, Twitter, Youtube, Instagram, Linkedin } from 'lucide-react'; // Optional: using lucide-react for icons

export function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300 py-12 px-10 font-sans">
      {/* Top Section: Links Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
        
        <div>
          <h3 className="text-white font-bold mb-4">About Us</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li className="hover:text-white cursor-pointer">Our Story</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
            <li className="hover:text-white cursor-pointer">Press</li>
            <li className="hover:text-white cursor-pointer">Blog</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">Help</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li className="hover:text-white cursor-pointer">Contact Us</li>
            <li className="hover:text-white cursor-pointer">Track Order</li>
            <li className="hover:text-white cursor-pointer">FAQs</li>
            <li className="hover:text-white cursor-pointer">Shipping Info</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">Categories</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li className="hover:text-white cursor-pointer">Flowers</li>
            <li className="hover:text-white cursor-pointer">Cakes</li>
            <li className="hover:text-white cursor-pointer">Gifts</li>
            <li className="hover:text-white cursor-pointer">Plants</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">Our Policies</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
            <li className="hover:text-white cursor-pointer">Refund Policy</li>
            <li className="hover:text-white cursor-pointer">Delivery Policy</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">Contact</h3>
          <div className="space-y-3 text-sm opacity-80">
            <p className="flex items-center gap-2">📞 +91-12345-67890</p>
            <p className="flex items-center gap-2">✉️ help@flowerfairy.com</p>
            <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mt-4">
               <span className="text-gray-400 text-[10px]">QR Code</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-700 mb-8" />

      {/* Bottom Section: Copyright, Socials, Payments */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        <p className="text-sm opacity-70">© 2026 Flower Fairy. All rights reserved.</p>

        {/* Social Icons */}
        <div className="flex gap-4">
          <div className="p-2 bg-blue-600 rounded-full text-white cursor-pointer"><Facebook size={18} /></div>
          <div className="p-2 bg-sky-400 rounded-full text-white cursor-pointer"><Twitter size={18} /></div>
          <div className="p-2 bg-red-600 rounded-full text-white cursor-pointer"><Youtube size={18} /></div>
          <div className="p-2 bg-pink-600 rounded-full text-white cursor-pointer"><Instagram size={18} /></div>
          <div className="p-2 bg-blue-700 rounded-full text-white cursor-pointer"><Linkedin size={18} /></div>
        </div>

        {/* Payment Methods */}
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-70 mr-2">We Accept:</span>
          <div className="flex gap-2">
            {['Visa', 'MC', 'Paytm', 'UPI'].map((pay) => (
              <span key={pay} className="bg-white text-gray-800 text-[10px] font-bold px-2 py-1 rounded">
                {pay}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}