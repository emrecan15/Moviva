"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function AuthInput({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  error,
  disabled,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="group">
      <label
        className={`mb-2 block text-sm font-medium ${disabled ? "text-gray-500" : "text-black"}`}
      >
        {label}
      </label>

      <div
        className={`
          flex h-12 items-center
          rounded-xl
          border
          px-4
          transition-all duration-300
          
          ${
            disabled
              ? "bg-gray-50 opacity-70 cursor-not-allowed border-gray-200"
              : "bg-white border-gray-300 focus-within:border-danger focus-within:shadow-[0_0_20px_rgba(220,38,38,0.08)]"
          }

          ${error && !disabled ? "border-danger" : ""}
        `}
      >
        {Icon && (
          <Icon
            className={`
              mr-3
              transition-colors duration-300
              ${disabled ? "text-gray-400" : "text-gray-500 group-focus-within:text-danger"}
            `}
            size={19}
          />
        )}

        <input
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            h-full
            min-w-0
            flex-1
            bg-transparent
            text-sm
            outline-none
            placeholder:text-gray-400
            ${disabled ? "text-gray-500 cursor-not-allowed" : "text-black"}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShowPassword((prev) => !prev)}
            className={`ml-3 transition-colors ${disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-danger"}`}
          >
            {showPassword ? <FiEyeOff size={19} /> : <FiEye size={19} />}
          </button>
        )}
      </div>

      {error && <p className="mt-1 px-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
