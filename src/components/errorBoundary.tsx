import { Component } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

import { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Check if the error message contains "Failed to fetch dynamically imported module: "
    if (
      error?.message?.includes("Failed to fetch dynamically imported module: ")
    ) {
      // Reload the page
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-red-600">
              Something Went Wrong
            </h1>
            <p className="mt-4 text-gray-900">
              An unexpected error has occurred. Please try again later.
            </p>
            <Button asChild className="mt-6">
              <Link to={"/"}>Go Back to Home</Link>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
