import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            maxWidth: 520,
            margin: "80px auto",
            padding: 24,
            border: "1px solid #f5c2c7",
            borderRadius: 10,
            background: "#fff5f5",
            color: "#842029",
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Something went wrong.</h2>
          <p style={{ marginBottom: 20 }}>
            We hit an unexpected error while rendering this page.
          </p>
          <button
            type="button"
            onClick={this.reset}
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: 6,
              background: "#b02a37",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
