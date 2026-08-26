//file path: app/not-found.tsx

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-24">
      <h1 className="text-3xl font-medium">Page not found</h1>
      <p>[placeholder: the page you&apos;re looking for doesn&apos;t exist]</p>
      <Link href="/" data-cursor-hover className="underline underline-offset-4">
        Back home
      </Link>
    </main>
  );
}