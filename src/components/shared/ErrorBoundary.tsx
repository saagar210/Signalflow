import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex h-full items-center justify-center bg-canvas-bg p-8">
            <div className="max-w-md rounded-lg border border-error/30 bg-panel-bg p-6">
              <h2 className="mb-2 text-lg font-semibold text-error">
                Something went wrong
              </h2>
              <p className="text-sm text-text-secondary">
                {this.state.error?.message ?? "An unexpected error occurred."}
              </p>
              <button
                className="mt-4 rounded bg-accent px-4 py-2 text-sm text-white hover:bg-accent-hover"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Try Again
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
