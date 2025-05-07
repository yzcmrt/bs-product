import Link from 'next/link';

interface ApiErrorDisplayProps {
  title?: string;
  message?: string;
  backLink?: string;
  backText?: string;
}

export default function ApiErrorDisplay({
  title = 'Veri Yüklenemedi',
  message = 'Veriler getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
  backLink = '/',
  backText = 'Ana Sayfaya Dön'
}: ApiErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] px-4">
      <div className="text-center py-6 sm:py-10 max-w-md">
        <h2 className="text-lg sm:text-xl font-bold mb-2">{title}</h2>
        <p className="text-sm sm:text-base text-gray-400 mb-4">{message}</p>
        <Link 
          href={backLink} 
          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm sm:text-base"
        >
          {backText}
        </Link>
      </div>
    </div>
  );
} 