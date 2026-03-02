import React from "react";
import ErrorState from "./ErrorState";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("🔥 ErrorBoundary caught:", error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="glass rounded-3xl p-8 border border-red-400/20 max-w-md text-center">
            <div className="text-5xl mb-4">🧩</div>
            <h2 className="text-2xl font-bold text-main mb-2">
              Something went wrong
            </h2>
            <p className="text-muted mb-6">
              The application encountered an unexpected error.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-xl bg-blue-500 text-main font-semibold hover:bg-blue-600 transition-all active:scale-95"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}