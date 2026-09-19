import { useEffect } from "react";

export default function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timeoutId);
  }, [onClose, duration]);

  return (
    <div className="fixed top-5 right-5 z-9999 flex items-center gap-3 rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white shadow-lg">
      <span>✓</span>
      <span>{message}</span>
    </div>
  );
}
