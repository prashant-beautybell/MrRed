import Image from "next/image";
import Link from "next/link";

export function AuthHomeLink() {
  return (
    <Link
      href="/"
      className="mb-8 block w-full rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label="Back to Mr. Red homepage"
    >
      <Image
        src="/mrred-wordmark-auth.png"
        alt="Mr. Red"
        width={252}
        height={127}
        className="h-auto w-full"
        priority
      />
    </Link>
  );
}
