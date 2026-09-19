import { HiMenu } from "react-icons/hi";
import Logo from "../../ui/Logo";

export default function MobileNavbar({ onToggleMenu }) {
  return (
    <div className="flex lg:hidden max-w-7xl w-full mx-auto px-4 justify-between items-center">
      <Logo />
      <HamburgerMenu onToggleMenu={onToggleMenu} />
    </div>
  );
}

function HamburgerMenu({ onToggleMenu }) {
  return (
    <button onClick={onToggleMenu}>
      <HiMenu className="text-danger text-xl" />
    </button>
  );
}
