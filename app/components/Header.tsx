import { Link } from "@remix-run/react";
import Logo from "./Logo";

export default function Header() {
  return (
    <div className="flex justify-center py-3 sm:py-4 border-b">
      <Link to={"/"}>
        <Logo />
      </Link>
    </div>
  );
}
