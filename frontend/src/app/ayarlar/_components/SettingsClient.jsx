"use client";

import { FiUser, FiLock, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import AccountSettings from "./AccountSettings";
import SecuritySettings from "./SecuritySettings";

const settings = [
  {
    id: "account",
    label: "Hesap",
    icon: FiUser,
  },
  {
    id: "security",
    label: "Güvenlik",
    icon: FiLock,
  },
];

export default function SettingsClient({ user }) {
  const [activeSetting, setActiveSetting] = useState("account");

  if (!user) return null;

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Ayarlar
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Hesabını ve tercihlerini yönet.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
            {settings.map((setting) => {
              const Icon = setting.icon;
              const isActive = activeSetting === setting.id;

              return (
                <button
                  key={setting.id}
                  type="button"
                  onClick={() => setActiveSetting(setting.id)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-danger text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="text-base" />
                  {setting.label}
                </button>
              );
            })}

            <div className="my-2 h-px bg-gray-100" />

            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-danger transition-colors hover:bg-red-50"
            >
              <FiTrash2 />
              Hesabı Sil
            </button>
          </aside>

          <section className="lg:col-span-3">
            {activeSetting === "account" && <AccountSettings user={user} />}

            {activeSetting === "security" && <SecuritySettings />}
          </section>
        </div>
      </div>
    </main>
  );
}
