import Logo from "@/components/ui/Logo";

export default function SuccessBox({ onClose }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-gray-50 bg-white p-8 shadow-sm shadow-amber-800">
      <Logo />

      <div className="text-center">
        <h2 className="text-xl font-semibold text-logo">Kayıt başarılı</h2>

        <p className="mt-3 text-sm text-gray-600">
          Doğrulama bağlantısı e-posta adresinize gönderildi.
        </p>

        <p className="mt-2 text-xs text-gray-500">
          Lütfen e-posta adresinizi kontrol edin ve hesabınızı doğrulamak için
          gönderilen bağlantıya tıklayın.
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="h-10 rounded-full border border-black px-6 font-semibold transition-all duration-150 hover:border-danger hover:text-danger cursor-pointer"
      >
        Tamam
      </button>
    </div>
  );
}
