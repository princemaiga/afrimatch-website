"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-9xl font-bold text-red-600">500</h1>
            <h2 className="text-3xl font-semibold text-gray-800 mt-4">Something went wrong</h2>
            <p className="text-gray-600 mt-2 max-w-md">
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={reset}
              className="mt-8 inline-block bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
