export default function ErrorPage() {
  return (
    <div className="p-4 relative max-w-3xl min-h-full mx-auto pt-52 flex flex-col items-center justify-center text-center space-y-3">
      <p className="text-2xl font-semibold text-indigo-600">404</p>
      <h1 className="text-4xl font-bold font-serif text-red-600 mt-2">Page Not Found</h1>
      <p className="text-gray-200 mt-2">Sorry, we couldn’t find the page you’re looking for.</p>
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        <a href="/" className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md border border-slate-200">
          Go Back Home
        </a>
      </div>
    </div>
  );
}
