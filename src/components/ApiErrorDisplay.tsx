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
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center py-10">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-400 mb-4">{message}</p>
        <Link href={backLink} className="text-blue-500 hover:underline">
          {backText}
        </Link>
      </div>
    </div>
  );
} 