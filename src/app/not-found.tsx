import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Sayfa Bulunamadı</h1>
      <p className="text-xl mb-8">Aradığınız sayfa mevcut değil.</p>
      <Link 
        href="/" 
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
} 