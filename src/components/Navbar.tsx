"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#111] border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              BullScan
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/trending" 
              className={`px-3 py-2 rounded transition-colors ${pathname === '/trending' ? 'bg-blue-900/30 text-blue-300' : 'hover:text-blue-400'}`}
            >
              Trend Coinler
            </Link>
            <Link 
              href="/active-coins" 
              className={`px-3 py-2 rounded transition-colors ${pathname === '/active-coins' ? 'bg-blue-900/30 text-blue-300' : 'hover:text-blue-400'}`}
            >
              Aktif Coinler
            </Link>
            <Link 
              href="/coins" 
              className={`px-3 py-2 rounded transition-colors ${pathname?.startsWith('/coins') ? 'bg-blue-900/30 text-blue-300' : 'hover:text-blue-400'}`}
            >
              Tüm Coinler
            </Link>
            <Link 
              href="/holder-quality" 
              className={`px-3 py-2 rounded transition-colors ${pathname === '/holder-quality' ? 'bg-blue-900/30 text-blue-300' : 'hover:text-blue-400'}`}
            >
              Holder Kalitesi
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 