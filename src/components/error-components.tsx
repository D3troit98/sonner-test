import assets from '@/assets';
import React from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router';

// NotFoundPage Component
const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mt-4">
          <img
            src={assets.notfoundIllus}
            alt="404 Illustration"
            className="mx-auto w-96 h-full"
          />
        </div>
        <button
          onClick={() => window.history.back()}
          className="mt-8 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

// ErrorPage Component
const ErrorPage = () => {
  const error = useRouteError();
  const isDev = process.env.NODE_ENV === 'development';

  const errorMessage = isRouteErrorResponse(error)
    ? error.statusText || error.data
    : error instanceof Error
    ? error.message
    : 'Unknown error occurred';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-lg px-4">
        <div className="w-24 h-24 mx-auto">
          <svg viewBox="0 0 24 24" className="w-full h-full text-teal-600">
            <circle cx="12" cy="12" r="11" className="fill-current opacity-20" />
            <path
              className="fill-current"
              d="M12 8v5M12 16h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mt-4 text-gray-600">
          {isDev ? errorMessage : 'An unexpected error occurred. Please try again later.'}
        </p>
        {isDev && error instanceof Error && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
            <p className="font-mono text-sm text-gray-800 whitespace-pre-wrap">
              {error.stack}
            </p>
          </div>
        )}
        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

// Loader Component
const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-teal-200 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-teal-600 rounded-full animate-spin-fast border-t-transparent"></div>
        </div>
        <p className="mt-4 text-teal-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

// WithSuspense HOC
interface WithSuspenseProps {
  children?: React.ReactNode;
}

const WithSuspense = (Component: React.ComponentType<any>) => {
  return function WithSuspenseWrapper(props: WithSuspenseProps) {
    return (
      <React.Suspense fallback={<Loader />}>
        <Component {...props} />
      </React.Suspense>
    );
  };
};

export { NotFoundPage, ErrorPage, Loader, WithSuspense };
