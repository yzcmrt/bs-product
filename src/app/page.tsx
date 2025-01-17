import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-4xl font-bold mb-4">Welcome to BullScan</h1>
      <p className="text-gray-400 text-center max-w-2xl">
        Track cryptocurrencies and access detailed analytics
      </p>
      <Link href="/coins/" className="mt-8 px-6 py-3 bg-[#4F46E5] rounded-lg hover:bg-[#4338CA] transition-colors">
        View Coins
      </Link>
    </div>
  );
}
