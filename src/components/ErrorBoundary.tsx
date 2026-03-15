import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("PharmRef ErrorBoundary caught:", error, info.componentStack);
  }

  handleReload = () => {
    window.location.hash = "#/";
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#e5eef8",
          fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            textAlign: "center",
            background: "rgba(15, 23, 42, 0.86)",
            border: "1px solid #263449",
            borderRadius: "22px",
            padding: "32px 28px",
            boxShadow: "0 14px 34px rgba(2, 8, 23, 0.30)",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "16px" }}>⚠</div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: "0 0 10px",
              color: "#f8fbff",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.65,
              color: "#8ea1bb",
              margin: "0 0 24px",
            }}
          >
            An unexpected error occurred. Reloading will return you to the home page.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              background: "#7dd3fc",
              color: "#082f49",
              border: "none",
              borderRadius: "14px",
              padding: "13px 28px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Reload PharmRef
          </button>
        </div>
      </div>
    );
  }
}
