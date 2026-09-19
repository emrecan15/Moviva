"use client";

import { createUserListAction } from "@/actions/movieActions";
import { useState } from "react";
import { FiPlus, FiX, FiLock, FiGlobe } from "react-icons/fi";

export default function CreateListModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    const response = await createUserListAction(name, isPublic);

    if (response.success) {
      setName("");
      setIsPublic(true);
      onSuccess?.();
      onClose();
    } else {
      setError(response.error || "Liste oluşturulamadı.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Profil sayfasıyla uyumlu bg-white, border-gray-100 ve gri metinler */}
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-100 p-6 shadow-xl text-gray-900">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* Profildeki StatCard gibi bg-red-50 ve text-danger */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-danger">
              <FiPlus size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Yeni Liste Oluştur
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded-full p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Liste Adı
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Favori Filmlerim, Aksiyon..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-danger focus:ring-1 focus:ring-danger focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gizlilik Durumu
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isPublic
                    ? "border-danger bg-red-50 text-danger shadow-sm"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-white"
                }`}
              >
                <FiGlobe
                  size={18}
                  className={isPublic ? "text-danger" : "text-gray-400"}
                />
                <div>
                  <div
                    className={`text-sm font-bold ${isPublic ? "text-danger" : "text-gray-700"}`}
                  >
                    Herkese Açık
                  </div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    Herkes görebilir
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  !isPublic
                    ? "border-danger bg-red-50 text-danger shadow-sm"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-white"
                }`}
              >
                <FiLock
                  size={18}
                  className={!isPublic ? "text-danger" : "text-gray-400"}
                />
                <div>
                  <div
                    className={`text-sm font-bold ${!isPublic ? "text-danger" : "text-gray-700"}`}
                  >
                    Gizli
                  </div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    Yalnızca sen
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-5 py-2 text-sm font-semibold rounded-full bg-danger hover:bg-danger/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
            >
              {loading ? "Oluşturuluyor..." : "Liste Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
