import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-20 px-4">
      {/* Main 404 Content */}
      <div className="max-w-xl w-full text-center space-y-6">
        
        {/* Amazon-style Dog or Empty Box illustration */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <Image 
            src="/placeholder.png" // Replace with a cute "Dog of Amazon" or empty box image
            alt="Page not found"
            fill
            className="object-contain opacity-70"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          SORRY
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          we couldn't find that page
        </p>

        <p className="text-gray-500">
          Try searching or go to Amazon's home page.
        </p>

        {/* Search Bar Alternative */}
        <div className="mt-8 flex items-center justify-center max-w-md mx-auto">
          <div className="relative w-full flex">
            <input 
              type="text" 
              placeholder="Search for products..." 
              className="w-full border-2 border-gray-300 rounded-l-md py-3 px-4 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
            <button className="bg-[#FEBD69] hover:bg-[#F3A847] px-6 rounded-r-md transition-colors flex items-center justify-center border-y-2 border-r-2 border-[#FEBD69] hover:border-[#F3A847]">
              <Search className="text-gray-900" size={24} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/"
            className="w-full sm:w-auto px-8 py-3 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-medium rounded-full shadow-sm transition-colors"
          >
            Go to Home Page
          </Link>
          <Link 
            href="/products"
            className="w-full sm:w-auto px-8 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-full shadow-sm transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>

      {/* Footer minimal links */}
      <div className="mt-24 pb-8 text-sm text-blue-600 space-x-6 flex flex-wrap justify-center">
        <Link href="/conditions" className="hover:underline hover:text-orange-500">Conditions of Use</Link>
        <Link href="/privacy" className="hover:underline hover:text-orange-500">Privacy Notice</Link>
        <Link href="/help" className="hover:underline hover:text-orange-500">Help</Link>
      </div>
    </div>
  );
}