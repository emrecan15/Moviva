"use client";

import { motion } from "framer-motion";

const tagStyles = {
  "Yeni Üye": {
    className: "bg-blue-50 text-blue-600 border-blue-200",
    icon: "✦",
  },

  "Film Kurdu": {
    className: "bg-purple-50 text-purple-600 border-purple-200",
    icon: "◆",
  },

  "Film Gurmesi": {
    className: "bg-amber-50 text-amber-600 border-amber-200",
    icon: "★",
  },

  Yönetici: {
    className: "bg-rose-50 text-rose-600 border-rose-200",
    icon: "✪",
  },

  "Site Admini": {
    className: "bg-emerald-50 text-emerald-600 border-emerald-200",
    icon: "●",
  },
};

export default function UserTag({ tag }) {
  const style = tagStyles[tag] ?? {
    className: "bg-gray-50 text-gray-600 border-gray-200",
    icon: "✦",
  };

  if (!tag) return null;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{
        scale: 1.05,
        y: -1,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1
        rounded-full
        border
        text-xs font-semibold
        whitespace-nowrap
        cursor-default
        ${style.className}
      `}
    >
      <span className="text-[10px]">{style.icon}</span>
      {tag}
    </motion.span>
  );
}
