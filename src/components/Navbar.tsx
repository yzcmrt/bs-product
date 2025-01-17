export default function Navbar() {
  return (
    <nav className="bg-[#111] border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold">
              BullScan
            </a>
          </div>
          <div className="flex space-x-4">
            <a href="/coins" className="hover:text-[#4F46E5] transition-colors">
              Coins
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
} 