import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-muted px-4 py-16">
      <Link href="/" className="mb-6 font-extrabold tracking-tight">
        Atlas <span className="text-violet">Intelligent System</span>
      </Link>
      {children}
    </div>
  );
}
