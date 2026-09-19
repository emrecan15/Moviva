import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex shrink-0">
      <Image
        src="/logo.svg"
        alt="Moviva"
        width={140}
        height={40}
        priority
        className="w-auto h-auto"
      />
    </Link>
  );
}
