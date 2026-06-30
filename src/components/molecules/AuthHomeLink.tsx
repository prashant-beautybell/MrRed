import Link from "next/link";
import { MrRedBrand } from "@/components/atoms/MrRedBrand";

export function AuthHomeLink() {
  return (
    <Link
      href="/"
      className="mb-8 inline-flex rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label="Back to Mr. Red homepage"
    >
      <MrRedBrand size="md" />
    </Link>
  );
}
