export default function SettingsCard({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>

        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <div className="pt-6">{children}</div>
    </div>
  );
}
