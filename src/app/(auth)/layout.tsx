import Link from "next/link";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4">
      <div className="mb-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary transition-opacity hover:opacity-80"
        >
          <Shield className="h-8 w-8" />
          <span className="text-2xl font-bold tracking-tight">
            LandlordShield
          </span>
        </Link>
      </div>

      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
