import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFD400] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-4xl font-black mb-4">404 - Not Found</h2>
        <p className="text-xl mb-6">Could not find requested resource</p>
        <Link
          href="/"
          className="rounded-xl bg-black text-white px-6 py-3 font-black border-4 border-black shadow-[0_8px_0_#111] active:translate-y-1 inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 