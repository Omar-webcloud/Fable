"use client";

import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
          <h2 className="text-2xl font-bold text-dark dark:text-white">Something went wrong.</h2>
          <p className="text-gray-600 dark:text-slate-400">Please reload.</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-primary px-6 py-2 text-white transition hover:bg-secondary"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
