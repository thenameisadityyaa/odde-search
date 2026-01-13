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
          <ErrorState
            message={
              this.state.error?.message ||
              "Something went wrong. Please refresh."
            }
          />

          <div className="mt-6 flex justify-center">
            <button
              onClick={this.reset}
              className="px-5 py-2 rounded-xl border border-white/15 bg-white/10 text-white hover:bg-white/15 transition active:scale-95"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}