//file path: app/not-found.tsx

import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>[placeholder: the page you&apos;re looking for doesn&apos;t exist]</p>
      <Link href="/" data-cursor-hover>
        Back home
      </Link>
    </main>
  );
}
