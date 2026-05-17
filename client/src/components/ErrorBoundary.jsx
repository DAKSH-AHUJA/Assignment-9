import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error) {
    console.log("Frontend error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="auth-page">
          <div className="auth-box">
            <h1>App loading error</h1>
            <p>{this.state.message || "Please restart the dev server and refresh the page."}</p>
            <a className="small-btn" href="/login">Go to login</a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
