export default function Avatar({ name = "", className = "" }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-danger text-white text-sm font-semibold ${className}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
