"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItemClass = (path: string) => 
    `block px-3 py-2 rounded transition-colors ${
      (path === pathname || (path.startsWith('/coins') && pathname?.startsWith('/coins'))) 
        ? 'bg-blue-900/30 text-blue-300' 
        : 'hover:text-blue-400'
    }`;

  return (
    <nav className="bg-[#111] border-b border-gray-800 sticky top-0 z-50">
      <div className="w-full px-3 sm:px-4 md:container md:mx-auto">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <Link href="/" className="text-lg sm:text-xl font-bold">
              BullScan
            </Link>
          </div>
          
          {/* Hamburger Menü Butonu (Mobil) */}
          <button 
            className="md:hidden p-2 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          {/* Masaüstü Menüsü */}
          <div className="hidden md:flex md:space-x-2 lg:space-x-4 text-sm lg:text-base overflow-x-auto">
            <Link href="/trending" className={menuItemClass('/trending')}>
              Trend Coinler
            </Link>
            <Link href="/active-coins" className={menuItemClass('/active-coins')}>
              Aktif Coinler
            </Link>
            <Link href="/price-alerts" className={menuItemClass('/price-alerts')}>
              Fiyat Alarmları
            </Link>
            <Link href="/security-risks" className={menuItemClass('/security-risks')}>
              Güvenlik Riskleri
            </Link>
            <Link href="/coins" className={menuItemClass('/coins')}>
              Tüm Coinler
            </Link>
            <Link href="/holder-quality" className={menuItemClass('/holder-quality')}>
              Holder Kalitesi
            </Link>
            <Link href="/pools" className={menuItemClass('/pools')}>
              Likidite Havuzları
            </Link>
          </div>
        </div>
        
        {/* Mobil Menü */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col space-y-2 py-3 border-t border-gray-700">
            <Link 
              href="/trending" 
              className={menuItemClass('/trending')}
              onClick={() => setIsMenuOpen(false)}
            >
              Trend Coinler
            </Link>
            <Link 
              href="/active-coins" 
              className={menuItemClass('/active-coins')}
              onClick={() => setIsMenuOpen(false)}
            >
              Aktif Coinler
            </Link>
            <Link 
              href="/price-alerts" 
              className={menuItemClass('/price-alerts')}
              onClick={() => setIsMenuOpen(false)}
            >
              Fiyat Alarmları
            </Link>
            <Link 
              href="/security-risks" 
              className={menuItemClass('/security-risks')}
              onClick={() => setIsMenuOpen(false)}
            >
              Güvenlik Riskleri
            </Link>
            <Link 
              href="/coins" 
              className={menuItemClass('/coins')}
              onClick={() => setIsMenuOpen(false)}
            >
              Tüm Coinler
            </Link>
            <Link 
              href="/holder-quality" 
              className={menuItemClass('/holder-quality')}
              onClick={() => setIsMenuOpen(false)}
            >
              Holder Kalitesi
            </Link>
            <Link 
              href="/pools" 
              className={menuItemClass('/pools')}
              onClick={() => setIsMenuOpen(false)}
            >
              Likidite Havuzları
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 