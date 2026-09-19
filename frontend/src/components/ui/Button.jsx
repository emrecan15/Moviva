export default function Button({
  text = "Button",
  className = "",
  icon,
  onClick,
}) {
  return (
    <button
      className={`flex items-center gap-2 px-6 h-10 rounded-full border border-danger font-semibold cursor-pointer transition-all duration-300 hover:bg-danger hover:text-white ${className}`}
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </button>
  );
}
