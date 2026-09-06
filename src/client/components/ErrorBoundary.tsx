import { Component, type ErrorInfo, type ReactNode } from "react";
import Button from "@/client/components/ui/Button";

interface ErrorBoundaryProps {
  readonly children: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly errorId: string;
}

/**
 * Catches render/lifecycle errors on the public site and shows visitors a
 * generic, reassuring fallback — no stack trace, no technical detail, since
 * this audience isn't expected to make sense of either.
 *
 * This does not catch errors from async code (fetch failures, event
 * handlers) — those already surface via ApiError + the toast system.
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, errorId: "" };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true, errorId: Date.now().toString(36) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Client error boundary:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-text-primary">
          Something went wrong
        </h1>
        <p className="max-w-md text-text-secondary">
          We hit an unexpected error loading this page. Please try again — if
          it keeps happening, let us know.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button onClick={() => window.location.reload()}>
            Reload page
          </Button>
          <Button variant="outline" href="/">
            Go home
          </Button>
        </div>
        <p className="text-xs text-text-muted">
          Error ID: {this.state.errorId}
        </p>
      </div>
    );
  }
}
