export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="relative flex items-center justify-center w-12 h-12">
        <div className="absolute w-full h-full border-4 border-gray-100 rounded-full"></div>
        <div className="absolute w-full h-full border-4 border-gray-900 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">
        Yükleniyor...
      </p>
    </div>
  );
}
