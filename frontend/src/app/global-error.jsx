"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="tr">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sistem Hatası
          </h2>
          <p className="text-gray-500 mb-6">
            Uygulamanın ana yapısında kritik bir hata oluştu.
          </p>
          <button
            onClick={() => reset()}
            className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Sistemi Yeniden Yükle
          </button>
        </div>
      </body>
    </html>
  );
}
