"use client";

import { useEffect, useRef, useState } from "react";
import { FiUser, FiLogOut, FiSettings, FiChevronDown } from "react-icons/fi";
import useClickOutside from "@/components/hooks/useClickOutside";
import Link from "next/link";
import { logoutAction } from "@/actions/authActions";
import { usePathname, useRouter } from "next/navigation";

export default function UserMenu({ auth }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useClickOutside(menuRef, () => {
    setIsOpen(false);
  });

  const username = auth?.username ?? "";
  const avatar = username.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setIsOpen(false);
    await logoutAction();

    const isProtected =
      pathname.startsWith("/ayarlar") || pathname.startsWith("/profil");

    if (isProtected) {
      router.push("/");
    } else {
      router.refresh();
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80 cursor-pointer"
        aria-expanded={isOpen}
        aria-label="Kullanıcı menüsü"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-danger font-semibold text-white">
          {avatar}
        </div>

        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold text-gray-800">
            {username}
          </span>

          <span className="text-xs text-gray-400">Hesabım</span>
        </div>

        <FiChevronDown
          className={`hidden text-gray-500 transition-transform sm:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          <Link
            href="/profil"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 cursor-pointer"
          >
            <FiUser />
            Profil
          </Link>

          <Link
            href="/ayarlar"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 cursor-pointer"
          >
            <FiSettings />
            Ayarlar
          </Link>

          <div className="my-1.5 h-px bg-gray-200" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-danger transition-colors hover:bg-red-50 cursor-pointer"
          >
            <FiLogOut />
            Çıkış Yap
          </button>
        </div>
      )}
    </div>
  );
}
