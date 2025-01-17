import Link from 'next/link';

export default function Navbar() {
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
            <Link href="/coins/" className="hover:text-[#4F46E5] transition-colors">
              Coins
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 