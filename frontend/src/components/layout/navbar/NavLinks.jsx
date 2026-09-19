"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({
  links,
  className = "flex gap-6 items-center",
  onLinkClick,
}) {
  const pathname = usePathname();

  return (
    <ul className={className}>
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onLinkClick}
              className={`group inline-block relative transition-all duration-300 text-[15px] font-medium ${
                isActive
                  ? "text-danger"
                  : "text-logo hover:text-danger hover:-translate-y-0.5"
              }`}
            >
              {link.text}

              <span
                className={`absolute left-0 bottom-0 h-0.5 bg-danger transition-all duration-300 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
