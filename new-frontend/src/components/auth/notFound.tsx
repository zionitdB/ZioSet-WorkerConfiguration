// src/components/NotFound.js

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <h2 className="text-3xl mt-4 font-semibold">Oops! Page Not Found</h2>
        <p className="mt-2 text-lg text-gray-700">
          Sorry, the page you are looking for does not exist. It might have been
          removed or is temporarily unavailable.
        </p>
        <a
          href="/"
          className="mt-4 inline-block bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default NotFound;