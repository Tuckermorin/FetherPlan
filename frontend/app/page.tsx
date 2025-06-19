import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome to Fether</h1>
      <Link href="/CreateYourEvent">Create Your Event</Link>
    </main>
  );
}
