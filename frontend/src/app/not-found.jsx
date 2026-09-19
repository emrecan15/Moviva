import Link from "next/link";
import { TbError404 } from "react-icons/tb";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <TbError404 className="text-[120px] text-gray-300" />

      <h2 className="mt-4 text-3xl font-bold text-gray-900">
        Sayfa Bulunamadı
      </h2>

      <p className="mt-2 max-w-md text-gray-600">
        Aradığınız filme veya sayfaya ulaşılamıyor. URL'yi yanlış yazmış
        olabilir veya sayfa kaldırılmış olabilir.
      </p>

      <Link
        href="/"
        className="mt-8 rounded-full bg-gray-900 px-8 py-3 font-medium text-white transition-all hover:bg-gray-800"
      >
        Anasayfaya Dön
      </Link>
    </div>
  );
}
