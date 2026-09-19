import { FiSave } from "react-icons/fi";

export default function SaveButton({
  text = "Değişiklikleri Kaydet",
  loading = false,
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-danger px-5 text-sm font-semibold text-white transition hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <FiSave />
      {loading ? "Güncelleniyor..." : text}
    </button>
  );
}
