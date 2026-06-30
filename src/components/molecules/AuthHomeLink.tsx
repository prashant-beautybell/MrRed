import Link from "next/link";
import { MrRedWordmark } from "@/components/atoms/MrRedWordmark";

export function AuthHomeLink() {
  return (
    <Link
      href="/"
      className="mb-8 block w-full @container rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label="Back to Mr. Red homepage"
    >
      <MrRedWordmark fullWidth showSwoosh={false} />
    </Link>
  );
}
