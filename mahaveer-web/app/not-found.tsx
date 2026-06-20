import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="chip">404 Not Found</p>
      <h1 className="font-display text-display-lg font-bold text-brand-navy">
        Page not found
      </h1>
      <p className="max-w-md text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
