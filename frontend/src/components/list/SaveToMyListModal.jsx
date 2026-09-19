"use client";

import {
  addMovieToList,
  createUserListAction,
  fetchUserListsAction,
} from "@/actions/movieActions";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";

export default function SaveToMyListModal({
  isOpen,
  onClose,
  movieId,
  movieName,
}) {
  const [mounted, setMounted] = useState(false);

  const [userLists, setUserLists] = useState([]);
  const [selectedListIds, setSelectedListIds] = useState([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadLists = async () => {
      try {
        const response = await fetchUserListsAction({ page: 0, size: 10 });

        const listsData = Array.isArray(response)
          ? response
          : response?.content || [];

        setUserLists(listsData);
      } catch (error) {
        console.error("Listeler yüklenemedi:", error);
        setUserLists([]);
      }
    };

    if (isOpen) {
      loadLists();
    } else {
      setSelectedListIds([]);
      setIsCreatingNew(false);
      setNewListName("");
    }
  }, [isOpen]);

  const handleCheckboxChange = (listId) => {
    setSelectedListIds((prev) =>
      prev.includes(listId)
        ? prev.filter((id) => id !== listId)
        : [...prev, listId],
    );
  };

  const handleCreateNewList = async () => {
    if (!newListName.trim()) return;

    try {
      const result = await createUserListAction(newListName);

      if (result && result.success && result.data && result.data.id) {
        toast.success("Liste başarıyla oluşturuldu.");

        setUserLists((prevLists) => [...(prevLists || []), result.data]);

        setSelectedListIds((prevIds) => [...(prevIds || []), result.data.id]);

        setNewListName("");
        setIsCreatingNew(false);
      } else {
        toast.error(
          result?.error ||
            "Liste oluşturulamadı veya sunucudan eksik veri döndü.",
        );
      }
    } catch (error) {
      console.error("Yeni liste ekleme hatası:", error);
      toast.error("Liste oluşturulurken beklenmeyen bir hata meydana geldi.");
    }
  };

  const handleSave = async () => {
    selectedListIds.map(async (listId) => {
      try {
        await addMovieToList(listId, movieId);
        toast.success("Film başarıyla eklendi.");
      } catch (error) {
        toast.error("Film listeye eklenirken bir hata oluştu.");
      }
    });

    onClose();
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Listeye Kaydet</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3 max-h-60 overflow-y-auto">
          {userLists.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              Henüz bir listeniz yok.
            </p>
          ) : (
            userLists.map((list) => (
              <label
                key={list.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedListIds.includes(list.id)}
                  onChange={() => handleCheckboxChange(list.id)}
                  className="w-4 h-4 text-danger border-gray-300 rounded focus:ring-danger cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {list.name}
                </span>
              </label>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          {!isCreatingNew ? (
            <button
              onClick={() => setIsCreatingNew(true)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-danger transition-colors"
            >
              <IoMdAdd size={18} /> Yeni Liste Oluştur
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Liste adı girin..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-danger"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-1">
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  onClick={handleCreateNewList}
                  className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-black font-medium cursor-pointer"
                >
                  Oluştur
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={selectedListIds.length === 0}
            className="w-full cursor-pointer bg-danger text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Seçilenlere Kaydet
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
